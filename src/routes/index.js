const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
    res.send("Vamo lo pi");
});

module.exports = router;