const express = require("express")
const ejs = require("ejs")
const { search, filterAuthor } = require("./search")
const app = express()
const PORT = process.env.PORT || 8080

app.set("view engine", "ejs")

app.get("/", async (req, res) => {
  const aggs = await filterAuthor();
  res.render("homepage", { aggs })
})

app.get("/search", async (req, res) => {
  if (!req.query.query || req.query.query.length < 3)
    res.redirect("/")
  let authors
  if (!req.query.authors)
    authors = []
  else if (!Array.isArray(req.query.authors))
    authors = [req.query.authors]
  else
    authors = req.query.authors
  const { hits, total } = await search(req.query.query, req.query.sortValue, authors)
  res.render("results", {
    hits,
    total,
    query: req.query.query,
  })
})

app.listen(PORT)
console.log(`app running on ${PORT}`)
