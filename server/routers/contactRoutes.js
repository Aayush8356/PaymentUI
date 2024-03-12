const express = require("express");
const {
  getContact,
  createContact,
  getContacts,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");
const validateToken = require("../middleware/validateTokenHandler");
const router = express.Router();

// router.use(validateToken);

// router.route("/").get(getContacts).post(createContact);

// router.route("/:id").get(getContact).put(updateContact).delete(deleteContact);

router.route("/new").post(validateToken, createContact);
router.route("/").get(validateToken, getContacts);
router.route("/person").get(validateToken, getContact);
router.route("/update").put(validateToken, updateContact);
router.route("/remove").delete(validateToken, deleteContact);

module.exports = router;
