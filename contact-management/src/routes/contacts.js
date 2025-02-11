const express = require("express");
const { body, validationResult } = require("express-validator");
const db = require("../database/database");

const router = express.Router();

// GET all contacts
router.get("/", (req, res) => {
  db.all("SELECT * FROM contacts", [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// GET a single contact by ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.get("SELECT * FROM contacts WHERE id = ?", [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ message: "Contact not found" });
      return;
    }
    res.json(row);
  });
});

// POST - Create a new contact
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, phone, address } = req.body;
    db.run(
      "INSERT INTO contacts (name, email, phone, address) VALUES (?, ?, ?, ?)",
      [name, email, phone, address || ""],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.json({ id: this.lastID, name, email, phone, address });
      }
    );
  }
);

// PUT - Update a contact
router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("phone").notEmpty().withMessage("Phone number is required"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, email, phone, address } = req.body;

    db.run(
      "UPDATE contacts SET name = ?, email = ?, phone = ?, address = ? WHERE id = ?",
      [name, email, phone, address || "", id],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
          return res.status(404).json({ message: "Contact not found" });
        }
        res.json({ id, name, email, phone, address });
      }
    );
  }
);

// DELETE - Remove a contact
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  db.run("DELETE FROM contacts WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: "Contact not found" });
    }
    res.json({ message: "Contact deleted successfully" });
  });
});

module.exports = router;
