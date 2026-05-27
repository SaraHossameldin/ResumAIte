const mongoose = require("mongoose");

// Each time a coach edits a field, we store what they changed + a notification
const coachEditSchema = new mongoose.Schema({
  coachId:    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  coachName:  { type: String, required: true },
  field:      { type: String, required: true },   // e.g. "summary", "skills", "experience"
  label:      { type: String, required: true },   // Human-readable field name
  oldValue:   { type: String, default: "" },
  newValue:   { type: String, default: "" },
  note:       { type: String, default: "" },      // Optional coach comment
  editedAt:   { type: Date, default: Date.now },
  seenByApplicant: { type: Boolean, default: false }
}, { _id: true });

const resumeSchema = new mongoose.Schema(
  {
    // ── Owner ──────────────────────────────────────
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // ── Basic info ─────────────────────────────────
    title:    { type: String, required: [true, "Resume title is required"], trim: true },
    fullName: { type: String, required: [true, "Full name is required"], trim: true },
    email:    { type: String, default: "" },
    phone:    { type: String, default: "" },
    location: { type: String, default: "" },
    jobTitle: { type: String, default: "" },

    // ── Resume sections ───────────────────────────
    summary:    { type: String, default: "" },
    experience: { type: String, default: "" },
    education:  { type: String, default: "" },
    skills:     { type: String, default: "" },

    status:     { type: String, enum: ["draft", "complete"], default: "draft" },

    // ── Coach access ──────────────────────────────
    // Applicant explicitly shares with a coach by email
    sharedWithCoaches: [{
      coachId:   { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      coachName: { type: String },
      sharedAt:  { type: Date, default: Date.now }
    }],

    // ── Coach edits & notifications ───────────────
    coachEdits: [coachEditSchema],

    // Quick flag: does the applicant have unread coach edits?
    hasUnreadCoachEdits: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Resume", resumeSchema);
