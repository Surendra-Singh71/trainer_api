const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

// MySQL connection setup
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "trainers_db",
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.stack);
    throw err;
  }
  console.log("MySQL connected...");
});

// POST API to add a new trainer
app.post("/trainers/add", (req, res) => {
  const {
    trainer_name,
    trainer_image,
    trainer_description,
    trainer_linkedin_url,
    trainer_instagram_url,
    trainer_email,
    trainer_phone_number,
    trainer_expertise,
    trainer_experience,
  } = req.body;

  // Basic validation
  if (!trainer_name || !trainer_email) {
    return res
      .status(400)
      .json({ error: "Trainer name and email are required" });
  }

  const sql = `INSERT INTO trainers (trainer_name, trainer_image, trainer_description, trainer_linkedin_url, trainer_instagram_url, trainer_email, trainer_phone_number, trainer_expertise, trainer_experience)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const values = [
    trainer_name,
    trainer_image,
    trainer_description,
    trainer_linkedin_url,
    trainer_instagram_url,
    trainer_email,
    trainer_phone_number,
    trainer_expertise,
    trainer_experience,
  ];

  // Execute SQL query
  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting trainer:", err);
      return res.status(500).json({ error: "Failed to add trainer" });
    }
    res.status(201).json({
      message: "Trainer added successfully",
      trainerId: result.insertId,
    });
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
