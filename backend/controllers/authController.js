const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sanityClient = require('../sanityClient');

exports.register = async (req, res) => {
  const { email, password, username } = req.body;

  try {
    const existingUser = await sanityClient.fetch(
      `*[_type == "user" && email == $email][0]{_id}`,
      { email }
    );

    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await sanityClient.create({
      _type: 'user',
      email,
      password: hashedPassword,
      username,
      points: 0,
      badges: [],
      streak: 0,
    });

    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.json({ token, userId: newUser._id, email, username });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await sanityClient.fetch(
      `*[_type == "user" && email == $email][0]`,
      { email }
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const today = new Date().toISOString().split("T")[0]; 
    const newStreak = (user.streak || 0) + 1;

    console.log(
      `Streak updated for testing: Previous streak was ${
        user.streak || 0
      }, new streak is ${newStreak}.`
    );

    
    await sanityClient
      .patch(user._id)
      .set({
        streak: newStreak,
        lastLoginDate: today, 
      })
      .commit();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      token,
      userId: user._id,
      email: user.email,
      username: user.username,
      streak: newStreak,
    });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Server error" });
  }
};