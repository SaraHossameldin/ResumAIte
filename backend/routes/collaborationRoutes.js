const express = require("express");
const {
  addCollaborator,
  getCollaborators,
  updateCollaboratorRole,
  removeCollaborator
} = require("../controllers/collaborationController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router({ mergeParams: true });

// All collaboration routes are protected
router.post("/", protect, addCollaborator);
router.get("/", protect, getCollaborators);
router.put("/:userId", protect, updateCollaboratorRole);
router.delete("/:userId", protect, removeCollaborator);

module.exports = router;
