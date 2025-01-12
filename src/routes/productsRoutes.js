const express = require("express")
const db = require("../db.js")

const router = express.Router()

router.get("/all", (req, res) => {
    res.json(db.products)
})

module.exports = router