const express = require("express")
const ejs = require("ejs")
const { search, filterAuthor } = require("./search")
const app = express()
const PORT = process.env.PORT || 8080

app.set("view engine", "ejs")

const winston = require('winston');
const expressWinston = require('express-winston');

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'combined.log', level: 'info' })
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true,
  msg: "HTTP {{req.method}} {{req.url}}",
  expressFormat: true,
  colorize: false,
  ignoreRoute: function (req, res) { return false; }
}));

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
