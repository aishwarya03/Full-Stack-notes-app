const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Signup
router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body; // ← include name here

  try {
    const existingUser = await db('users').where({ email }).first();
    if (existingUser) return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const [user] = await db('users')
      .insert({ email, password: hashedPassword, name }) // ← insert name
      .returning(['id', 'email', 'name']); // ← return name

    res.status(201).json({ message: 'User created', user });
  } catch (err) {
    res.status(500).json({ error: 'Signup failed' });
  }
});


// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await db('users').where({ email }).first();
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Get All users
router.get('/allusers', async(req, res)=>{
  try{
    const users = await db('users').select('id','email','name','created_at');
    res.json(users);
  } catch{
    res.status(500).json({ error: "Failed to fetch all users."})
  }
})

router.post('/logout', (req, res) => {
  // Frontend should just delete the token
  res.json({ message: 'Logged out successfully. Please clear token on client.' });
});

module.exports = router;
