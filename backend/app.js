const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');
const cors = require('cors');

// Initialize Express App
const app = express();

// Enable CORS before other middleware
app.use(cors({
  origin: 'http://localhost:5174', // Frontend URL
  methods: 'GET,POST',
  allowedHeaders: 'Content-Type,Authorization',
}));

app.use(express.json()); // Parse JSON bodies

const PORT = 5000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/studentAuth').then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Define User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model('User', userSchema);

// Define Student Schema for registration form
const studentSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  dob: { type: String, required: true },
  placeOfBirth: { type: String, required: true },
  photo: { type: String, required: true },
});

const Student = mongoose.model('Student', studentSchema);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

// Route for user signup
app.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Create JWT token after signup
    const token = jwt.sign({ id: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(201).json({ message: 'Account Created Successfully!', token });
  } catch (error) {
    res.status(500).json({ message: 'Error creating account', error });
  }
});

// Route for user login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create JWT token after login
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

// Route for student registration form submission
app.post('/form', upload.single('photo'), async (req, res) => {
  const { firstname, lastname, email, address, phone, dob, placeOfBirth } = req.body;
  const photo = req.file ? req.file.path : '';

  try {
    const newStudent = new Student({
      firstname,
      lastname,
      email,
      address,
      phone,
      dob,
      placeOfBirth,
      photo,
    });
    await newStudent.save();
    res.status(201).json({ message: 'Student added successfully!' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding student', error });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
