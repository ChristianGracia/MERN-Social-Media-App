const express = require("express");
const router = express.Router();

//@access: public
router.get("/test", (req, res) => res.json({ msg: "Profile.js working" }));

module.exports = router;
