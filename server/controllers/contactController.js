const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactsModel");
const createContact = asyncHandler(async (req, res) => {
  const { name, phone, email } = req.body;
  if (!name || !phone || !email) {
    res.status(400);
    throw new Error("All field are mandatory!");
  }
  const availableUserName = await Contact.findOne({ email });
  if (availableUserName) {
    res.status(400);
    throw new Error("Email Address already exists!");
  }
  const contact = await Contact.create({
    user_id: req.user.id,
    name,
    email,
    phone,
  });
  res.status(200).json(contact);
});

const getContacts = asyncHandler(async (req, res) => {
  const contact = await Contact.find({ user_id: req.user.id });
  res.status(200).json(contact);
});

const getContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.user.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found");
  }
  res.status(200).json(contact);
});

const updateContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.user.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found");
  }
  if (req.user.id !== contact.user_id.toString()) {
    res.status(403);
    throw new Error("Dushre ka mt dekh bhai Jaldi waha se hato");
  }
  const updatedContact = await Contact.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  res.status(200).json(updatedContact);
});

const deleteContact = asyncHandler(async (req, res) => {
  const contact = await Contact.findById(req.user.id);
  if (!contact) {
    res.status(404);
    throw new Error("Contact Not Found");
  }
  if (req.user.id !== contact.user_id.toString()) {
    res.status(403);
    throw new Error("Dushre ka mt dekh bhai Jaldi waha se hato");
  }
  await contact.deleteOne();
  res.status(200).json(contact);
});
module.exports = {
  createContact,
  getContacts,
  getContact,
  deleteContact,
  updateContact,
};
