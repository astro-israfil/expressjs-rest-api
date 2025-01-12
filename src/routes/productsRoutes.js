const express = require("express")
const db = require("../db.js")

const router = express.Router()

router.get("/all", (req, res) => {
    res.json(db.products)
})

router.post("/add", (req, res) => {
    const product = req.body;
    if (!product) {
        return res.status(400).json({
            message: "There is no product to add",
        })
    } else {
        const id = Date.now() + product.title
        product.id = id
        
        db.products.push(product)
    }
})

module.exports = router