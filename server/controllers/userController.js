const asyncHandler = require("express-async-handler");
const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    return res.json({ error: "All field are mandatory!" });
  }
  const availableUserName = await Users.findOne({ email });
  if (availableUserName) {
    console.log("User already");
    res.status(400);
    return res.json({ error: "Email Address already exists!" });
  }
  const encrypt = await bcrypt.hash(password, 10);
  const user = await Users.create({
    username,
    email,
    password: encrypt,
  });
  if (user) {
    res
      .status(200)
      .json({ _id: user.id, email: user.email, username: user.username });
  } else {
    res.status(400);
    return res.json({ error: "User Data is not valid" });
  }
});

//// LOGIN DESC

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    return { error: "Enter registerd email address and password" };
  }
  const user = await Users.findOne({ email }); // from stored collections
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: "30m",
      }
    );
    res.json({ accessToken });
  } else {
    res.status(400);
    return res.json({ error: "Incorrect User ID and Password" });
  }
});

/// CURRENT USER DESC

const currentUser = async (req, res) => {
  const _user = req.user;
  if (!_user) {
    res.status(400);
    return { error: "Token has been expired!" };
  }
  const { id } = _user;
  const user = await Users.findById(id);
  if (!user) {
    res.status(400);
    return { error: "user not found" };
  }
  res.status(200).json(user);
};

module.exports = { registerUser, loginUser, currentUser };
