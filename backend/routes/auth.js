const express = require("express");
const User = require("../models/User");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const fetchUser = require("../middleware/fetchUser");

const JWT_SECRET = "Harryisagoodb$oy";

//ROUTE 1: Create a User using: Post "and api end point": /api/auth/createuser Doesn't requires login
router.post(
  "/createuser",
  [
    body("name", "Enter a validate name").isLength({ min: 3 }),
    body("email", "Enter a validate Email").isEmail(),
    body("password", "Pass must be at least 5letter").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // check wether the user whit same email exist already

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ error: "This email already exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      //Create new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      // .then((user) => res.json(user))
      // .catch((err) => {
      //   console.log(err);
      //   res.json({
      //     error: "please enter a unique credentials",
      //     message: err.message,
      //   });
      // });

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      // console.log(authToken);

      res.json({ authToken });

      // res.json({ user, Ok: "User created" });
    } catch (error) {
      console.error(error.message);
      res.status(500).send(error, "Internal server error");
      // return  res.status(500).json(err);
    }
  }
);

//ROUTE 2: Authenticate a User using: Post "and api end point": /api/auth/login .Doesn't requires login
router.post(
  "/login",
  [
    body("email", "Enter a validate Email").isEmail(),
    body("password", "password cannot be blank").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body; //destructing
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: "Sorry Invalid credentials" });
      }

      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({ error: "Sorry Invalid credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };

      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      console.error(error.message);
      res.status(500).send("Internal server error");
    }
  }
);

//ROUTE 3: Get loggedin User details: Pos api end point : /api/auth/getuser login required
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    res.send(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal server error");
  }
});
module.exports = router;
