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
  const { hits, total } = await search(req.query.query)
  res.render("results", {
    hits,
    total,
    query: req.query.query,
  })
})

app.listen(PORT)
console.log(`app running on ${PORT}`)
