const Resume = require("../models/Resume");
const User = require("../models/User");

// ── CREATE ────────────────────────────────────────────────────────────────────
const createResume = async (req, res) => {
  try {
    if (req.user.role !== "applicant") {
      return res.status(403).json({ message: "Only applicants can create resumes." });
    }
    const { title, fullName, email, phone, location, jobTitle, summary, experience, education, skills, status } = req.body;
    if (!title || !fullName) {
      return res.status(400).json({ message: "Title and full name are required." });
    }
    const resume = await Resume.create({
      owner: req.user._id,
      title, fullName, email, phone, location, jobTitle,
      summary, experience, education, skills, status
    });
    res.status(201).json({ message: "Resume created!", resume });
  } catch (err) {
    console.error("Create resume error:", err.message);
    res.status(500).json({ message: "Failed to create resume." });
  }
};

// ── GET ALL ───────────────────────────────────────────────────────────────────
// Applicants see only their own. Coaches see only what was shared with them.
const getResumes = async (req, res) => {
  try {
    const { _id, role } = req.user;
    let query;
    if (role === "applicant") {
      query = { owner: _id };
    } else {
      query = { "sharedWithCoaches.coachId": _id };
    }
    const resumes = await Resume.find(query)
      .populate("owner", "name email role")
      .sort({ updatedAt: -1 });
    res.status(200).json(resumes);
  } catch (err) {
    console.error("Get resumes error:", err.message);
    res.status(500).json({ message: "Failed to fetch resumes." });
  }
};

// ── GET ONE ───────────────────────────────────────────────────────────────────
const getResumeById = async (req, res) => {
  try {
    const { _id, role } = req.user;
    const filter = role === "applicant"
      ? { _id: req.params.id, owner: _id }
      : { _id: req.params.id, "sharedWithCoaches.coachId": _id };

    const resume = await Resume.findOne(filter).populate("owner", "name email role");
    if (!resume) return res.status(404).json({ message: "Resume not found or access denied." });
    res.status(200).json(resume);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch resume." });
  }
};

// ── UPDATE (applicant only) ───────────────────────────────────────────────────
const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, owner: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found or access denied." });

    // Strip protected fields
    const { owner, sharedWithCoaches, coachEdits, hasUnreadCoachEdits, ...safe } = req.body;
    const updated = await Resume.findByIdAndUpdate(req.params.id, safe, { new: true, runValidators: true });
    res.status(200).json({ message: "Resume updated!", resume: updated });
  } catch (err) {
    console.error("Update error:", err.message);
    res.status(500).json({ message: "Failed to update resume." });
  }
};

// ── DELETE ────────────────────────────────────────────────────────────────────
const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, owner: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found." });
    res.status(200).json({ message: "Resume deleted." });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete resume." });
  }
};

// ── SHARE WITH COACH ──────────────────────────────────────────────────────────
const shareWithCoach = async (req, res) => {
  try {
    if (req.user.role !== "applicant") {
      return res.status(403).json({ message: "Only applicants can share resumes." });
    }
    const { coachEmail } = req.body;
    if (!coachEmail) return res.status(400).json({ message: "Coach email is required." });

    const coach = await User.findOne({ email: coachEmail.toLowerCase().trim(), role: "coach" });
    if (!coach) return res.status(404).json({ message: "No coach found with that email address." });

    const resume = await Resume.findOne({ _id: req.params.id, owner: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found." });

    const alreadyShared = resume.sharedWithCoaches.some(s => s.coachId.toString() === coach._id.toString());
    if (alreadyShared) return res.status(400).json({ message: "Already shared with this coach." });

    resume.sharedWithCoaches.push({ coachId: coach._id, coachName: coach.name });
    await resume.save();

    res.status(200).json({ message: `Resume shared with ${coach.name} successfully!`, resume });
  } catch (err) {
    console.error("Share error:", err.message);
    res.status(500).json({ message: "Failed to share resume." });
  }
};

// ── COACH SAVES EDITS ─────────────────────────────────────────────────────────
// Coach can edit: summary, experience, education, skills, jobTitle
// Every save is logged as a coachEdit entry + notification flag set
const coachSaveEdits = async (req, res) => {
  try {
    if (req.user.role !== "coach") {
      return res.status(403).json({ message: "Only coaches can use this endpoint." });
    }
    const resume = await Resume.findOne({
      _id: req.params.id,
      "sharedWithCoaches.coachId": req.user._id
    });
    if (!resume) return res.status(404).json({ message: "Resume not found or not shared with you." });

    const { edits, note } = req.body;
    // edits: [{ field, label, oldValue, newValue }]
    if (!Array.isArray(edits) || edits.length === 0) {
      return res.status(400).json({ message: "No edits provided." });
    }

    const fieldMap = { summary: 1, experience: 1, education: 1, skills: 1, jobTitle: 1 };
    for (const edit of edits) {
      if (!fieldMap[edit.field]) continue;
      // Apply the change to the resume
      resume[edit.field] = edit.newValue;
      // Log the edit
      resume.coachEdits.push({
        coachId: req.user._id,
        coachName: req.user.name,
        field: edit.field,
        label: edit.label || edit.field,
        oldValue: edit.oldValue || "",
        newValue: edit.newValue || "",
        note: note || ""
      });
    }
    resume.hasUnreadCoachEdits = true;
    await resume.save();

    const populated = await Resume.findById(resume._id).populate("owner", "name email role");
    res.status(200).json({ message: "Changes saved and applicant notified!", resume: populated });
  } catch (err) {
    console.error("Coach save error:", err.message);
    res.status(500).json({ message: "Failed to save coach edits." });
  }
};

// ── APPLICANT MARKS EDITS AS SEEN ─────────────────────────────────────────────
const markEditsSeen = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, owner: req.user._id });
    if (!resume) return res.status(404).json({ message: "Resume not found." });

    resume.coachEdits.forEach(e => { e.seenByApplicant = true; });
    resume.hasUnreadCoachEdits = false;
    await resume.save();

    res.status(200).json({ message: "All edits marked as seen.", resume });
  } catch (err) {
    res.status(500).json({ message: "Failed to mark edits as seen." });
  }
};

// ── GET NOTIFICATIONS (unread coach edits across all resumes) ─────────────────
const getNotifications = async (req, res) => {
  try {
    if (req.user.role !== "applicant") {
      return res.status(403).json({ message: "Applicants only." });
    }
    const resumes = await Resume.find({
      owner: req.user._id,
      hasUnreadCoachEdits: true
    }).populate("owner", "name email");

    const notifications = [];
    for (const r of resumes) {
      const unread = r.coachEdits.filter(e => !e.seenByApplicant);
      for (const edit of unread) {
        notifications.push({
          resumeId: r._id,
          resumeTitle: r.title,
          coachName: edit.coachName,
          field: edit.field,
          fieldLabel: edit.label,
          note: edit.note,
          editedAt: edit.editedAt,
          editId: edit._id
        });
      }
    }
    // Sort newest first
    notifications.sort((a, b) => new Date(b.editedAt) - new Date(a.editedAt));
    res.status(200).json({ notifications, count: notifications.length });
  } catch (err) {
    console.error("Notifications error:", err.message);
    res.status(500).json({ message: "Failed to fetch notifications." });
  }
};

module.exports = {
  createResume, getResumes, getResumeById, updateResume, deleteResume,
  shareWithCoach, coachSaveEdits, markEditsSeen, getNotifications
};
