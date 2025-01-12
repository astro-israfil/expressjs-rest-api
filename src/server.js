const express = require("express")
const path = require("path")

const productsRoutes = require("./routes/productsRoutes.js")

const app = express()
const PORT = 5000

app.use(express.json())
app.use(express.static(path.join(__dirname, "../public")))

// website endpoints
app.get("/", (req, res) => {
    res.status(200).sendFile(__dirname, "/", "public/index.html")
})

// api endpoints
app.use("/api/products", productsRoutes)

app.listen(PORT, () => console.log(`Server is running on port: ${PORT}`))