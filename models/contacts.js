const path = require("path");
const { v4 } = require("uuid");
const fs = require("fs").promises;
const contactsPath = path.resolve("models/db/contacts.json");
const {
  contactAddSchema,
  updateContactAddSchema,
} = require("../models/schems/validate");

const { httpError, ctrlWrapper } = require("../helpers/index");

const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  return contacts;
};
// отримує контакт по ід;
const getContactById = async (req, res) => {
  const id = req.params;
  const contacts = await listContacts();
  const result = contacts.find((item) => item.id === id.contactId);
  if (!result) {
    throw httpError(404, "Not found");
  }
  res.status(200).json(result);
};

const removeContact = async (req, res) => {
  const id = req.params;
  const contacts = await listContacts();
  const idx = contacts.findIndex((item) => item.id === id.contactId);
  if (idx === -1) {
    return null;
  }
  const removedContact = contacts.splice(idx, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  console.log(removedContact);
  res.status(201).json(removedContact);
};

const addContact = async (req, res) => {
  const contactsArr = await listContacts();

  const { error } = contactAddSchema.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }
  const newContact = {
    id: v4(),
    ...req.body,
  };
  contactsArr.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contactsArr, null, 2));

  res.status(201).json(newContact);
};

const updateContact = async (req, res) => {
  const id = req.params;
  const contacts = await listContacts();
  const { error } = updateContactAddSchema.validate(req.body);
  if (error) {
    throw httpError(400, error.message);
  }
  const idx = contacts.findIndex((item) => item.id === id.contactId);
  if (idx === -1) {
    return null;
  }

  const elUpdate = { ...contacts[idx], ...req.body };
  console.log({ idx, elUpdate });

  contacts.splice(idx, 1, { ...elUpdate, ...req.body });
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  res.status(200).json({ elUpdate, message: "update success" });
};

module.exports = {
  listContacts,
  getAll: ctrlWrapper(listContacts),
  getContactById: ctrlWrapper(getContactById),
  addContact: ctrlWrapper(addContact),
  removeContact: ctrlWrapper(removeContact),
  updateContact: ctrlWrapper(updateContact),
};
