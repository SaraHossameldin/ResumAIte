const Resume = require("../models/Resume");
const User = require("../models/User");

// Add a collaborator to a resume (owner only)
// POST /api/resumes/:id/collaborators
// Body: { email, role }   role = "editor" | "viewer"
const addCollaborator = async (req, res) => {
  try {
    const { email, role = "editor" } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'editor' or 'viewer'" });
    }

    // Only the owner can invite
    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or you are not the owner"
      });
    }

    // Find the user to invite by email
    const invitee = await User.findOne({ email: email.toLowerCase().trim() });

    if (!invitee) {
      return res.status(404).json({
        message: "No user found with that email address"
      });
    }

    // Cannot invite yourself
    if (invitee._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "You cannot invite yourself" });
    }

    // Check if already a collaborator
    const alreadyAdded = resume.collaborators.some(
      (c) => c.user.toString() === invitee._id.toString()
    );

    if (alreadyAdded) {
      return res.status(400).json({
        message: "This user is already a collaborator"
      });
    }

    resume.collaborators.push({ user: invitee._id, role });
    await resume.save();

    const updated = await Resume.findById(resume._id)
      .populate("user", "name email role")
      .populate("collaborators.user", "name email role");

    res.status(200).json({
      message: `${invitee.name} added as ${role}`,
      resume: updated
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Add collaborator error:", error.message);
    }
    res.status(500).json({ message: "Failed to add collaborator" });
  }
};

// Get all collaborators for a resume (owner or collaborator)
// GET /api/resumes/:id/collaborators
const getCollaborators = async (req, res) => {
  try {
    const resume = await Resume.findOne({
      _id: req.params.id,
      $or: [
        { user: req.user._id },
        { "collaborators.user": req.user._id }
      ]
    })
      .populate("user", "name email role")
      .populate("collaborators.user", "name email role");

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    res.status(200).json({
      owner: resume.user,
      collaborators: resume.collaborators
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Get collaborators error:", error.message);
    }
    res.status(500).json({ message: "Failed to fetch collaborators" });
  }
};

// Update a collaborator's role (owner only)
// PUT /api/resumes/:id/collaborators/:userId
// Body: { role }
const updateCollaboratorRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["editor", "viewer"].includes(role)) {
      return res.status(400).json({ message: "Role must be 'editor' or 'viewer'" });
    }

    const resume = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!resume) {
      return res.status(404).json({
        message: "Resume not found or you are not the owner"
      });
    }

    const collaborator = resume.collaborators.find(
      (c) => c.user.toString() === req.params.userId
    );

    if (!collaborator) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    collaborator.role = role;
    await resume.save();

    const updated = await Resume.findById(resume._id)
      .populate("user", "name email role")
      .populate("collaborators.user", "name email role");

    res.status(200).json({
      message: "Collaborator role updated",
      resume: updated
    });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Update collaborator role error:", error.message);
    }
    res.status(500).json({ message: "Failed to update collaborator role" });
  }
};

// Remove a collaborator (owner only, or collaborator removing themselves)
// DELETE /api/resumes/:id/collaborators/:userId
const removeCollaborator = async (req, res) => {
  try {
    const isOwner = await Resume.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    const isSelf = req.params.userId === req.user._id.toString();

    if (!isOwner && !isSelf) {
      return res.status(403).json({
        message: "Only the owner can remove collaborators"
      });
    }

    const resume = await Resume.findById(req.params.id);

    if (!resume) {
      return res.status(404).json({ message: "Resume not found" });
    }

    const beforeCount = resume.collaborators.length;
    resume.collaborators = resume.collaborators.filter(
      (c) => c.user.toString() !== req.params.userId
    );

    if (resume.collaborators.length === beforeCount) {
      return res.status(404).json({ message: "Collaborator not found" });
    }

    await resume.save();

    res.status(200).json({ message: "Collaborator removed successfully" });
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Remove collaborator error:", error.message);
    }
    res.status(500).json({ message: "Failed to remove collaborator" });
  }
};

module.exports = {
  addCollaborator,
  getCollaborators,
  updateCollaboratorRole,
  removeCollaborator
};
