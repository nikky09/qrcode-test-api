const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const router = require("express").Router();

// REGISTER
router.post("/register", async (req, res) => {
  try {
    // Generate new password
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Create new user
    const newUser = new User({
      fullname: req.body.fullname,
      email: req.body.email,
      password: hashedPassword,
      phone: req.body.phone,
    });

    // Save user and respond
    const user = await newUser.save();
    res.status(201).json({
      data: user,
    });
    // Handle response here
  } catch (error) {
    if (error.keyValue?.email != null && error.code === 11000) {
      res.status(500).send({ message: "user with this email already exist" });
    } else if (error.keyValue?.username != null && error.code === 11000) {
      res.status(500).send({ message: "user with the username already exist" });
    } else {
      res.status(500).send({ message: error });
    }
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({
      // $or: [{ email: req.body.email }, { username: req.body.username }],
      phone: req.body.phone,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const validPassword = await bcrypt.compareSync(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    res.status(200).json({ data: user, status: 200 });

    // const token = createToken(user.id);
    // console.log(token);
    // res.cookie("access_token", token);
  } catch (err) {
    res.status(500).json({ message: err });
  }
});

// LOGOUT
router.get("/logout", (req, res) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.status(202).json({ message: "User logged out" });
  } catch (error) {
    res.status(401).json({ message: "Authorization failed" });
  }
});

// Get a user
router.get("/account/", async (req, res) => {
  const userId = req.query.userId;
  const username = req.query.username;
  try {
    const user = userId
      ? await User.findById(userId)
      : await User.findOne({ username: username });
    const { password, updatedAt, ...other } = user._doc;
    res.status(200).json(other);
  } catch (err) {
    res.status(500).json(err);
  }
});


// store string on database 
router.get("/database/" , async (req, res) => {

  try {
    // Extract data from request body
    const { data } = req.body;

    // Create new data object
    const newData = new data({
      data });

    // Save data to database
    await newData.save();

    res.status(201).json({ message: 'Data stored successfully' });
  } catch (error) {
    console.error('Error storing data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


module.exports = router;
