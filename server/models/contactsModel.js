const mongoose = require("mongoose");
const contactSchema = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: [true, "Please provide name to the contact"],
    },
    email: {
      type: String,
      required: [true, "Please provide email to the contact"],
    },
    phone: {
      type: String,
      required: [true, "Please provide phone number to the contact"],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Contact", contactSchema);
