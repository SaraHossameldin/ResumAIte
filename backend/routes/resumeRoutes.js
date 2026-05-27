const express = require("express");
const {
  createResume, getResumes, getResumeById, updateResume, deleteResume,
  shareWithCoach, coachSaveEdits, markEditsSeen, getNotifications
} = require("../controllers/resumeController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", protect, createResume);
router.get("/", protect, getResumes);
router.get("/notifications", protect, getNotifications);
router.get("/:id", protect, getResumeById);
router.put("/:id", protect, updateResume);
router.delete("/:id", protect, deleteResume);
router.post("/:id/share", protect, shareWithCoach);
router.post("/:id/coach-edits", protect, coachSaveEdits);
router.post("/:id/mark-seen", protect, markEditsSeen);

module.exports = router;
