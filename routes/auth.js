const router = require("express").Router()
const User = require("../model/user")
const bcrypt = require("bcrypt")

// regsiter
router.post("/register", async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPass,
    })

    const user = await newUser.save()
    res.status(200).json(user)
  } catch (error) {
    res.status(500).json(error)
  }
})

// login

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username })
    //User not found
    !user && res.status(400).json("Wrong Credntials")

    //User password check
    const validate = await bcrypt.compare(req.body.password, user.password)
    //Password Incorrect
    !validate && res.status(400).json("Wrong Credentials")

    const { password, ...other } = user._doc
    res.status(200).json(other)
  } catch (error) {
    res.status(500).json(error)
  }
})
module.exports = router