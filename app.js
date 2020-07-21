const express = require("express")
const ejs = require("ejs")
const search = require("./search")
const app = express()
const PORT = process.env.PORT || 8080

app.set("view engine", "ejs")

app.get("/", (req, res) => {
  res.render("homepage")
})

app.get("/search", async (req, res) => {
  const books = await search(req.query.query)
  res.render("results", { books })
})

app.listen(PORT)
console.log(`app running on ${PORT}`)
