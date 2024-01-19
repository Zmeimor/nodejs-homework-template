const express = require("express");
const service = require("../../models/contacts");
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const contacts = await service.listContacts();
    res.json(contacts);
  } catch (error) {
    next(error);
  }
});

router.get("/:contactId", service.getContactById);

router.post(
  "/",
  // isEmptyBody,
  service.addContact
);

router.delete("/:contactId", service.removeContact);

router.put("/:contactId", service.updateContact);

module.exports = router;
