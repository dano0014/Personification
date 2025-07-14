const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");

const app = express();
const USERS_FILE = path.join(__dirname, "public/data/users.json");

// Increase the limit to handle base64 selfies (10 MB)
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

app.use(express.static("public"));

function loadUsers() {
  if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
  return JSON.parse(fs.readFileSync(USERS_FILE, "utf-8"));
}

function saveUsers(users) {
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
}

// Register
app.post("/api/register", (req, res) => {
  const users = loadUsers();
  const { email, password, name } = req.body;

  if (!email || !password || !name) {
    return res.status(400).json({ error: "Missing fields" });
  }

  if (users.find(u => u.email === email)) {
    return res.status(400).json({ error: "User already exists" });
  }

  users.push({ email, password, name });
  saveUsers(users);
  res.json({ success: true });
});

// Sign in
app.post("/api/signin", (req, res) => {
  const users = loadUsers();
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ success: true, user });
  } else {
    res.status(401).json({ error: "Invalid email or password" });
  }
});

// Selfie
app.post("/save-selfie", (req, res) => {
  const { email, selfie } = req.body;
  const base64Data = selfie.replace(/^data:image\/png;base64,/, "");

  const selfieDir = path.join(__dirname, "public", "selfies");
  if (!fs.existsSync(selfieDir)) fs.mkdirSync(selfieDir);

  const filePath = path.join(selfieDir, `${email}.png`);

  fs.writeFile(filePath, base64Data, "base64", (err) => {
    if (err) return res.status(500).send("Failed to save selfie.");

    const users = loadUsers();
    const user = users.find((u) => u.email === email);

    if (user) {
      user.selfiePath = `selfies/${email}.png`;
      saveUsers(users);
      res.sendStatus(200);
    } else {
      res.status(404).send("User not found");
    }
  });
});

app.listen(3000, () => {
  console.log("Prototype running at http://localhost:3000");
});
