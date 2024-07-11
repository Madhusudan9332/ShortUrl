const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
dotenv.config();

const nanoid = (length) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};
const urlSchema = mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
});

const urlModel = mongoose.model("ShortUrls", urlSchema);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Database connected successfully"))
  .catch((err) => console.log("Error connecting to database", err));

app.get("/", (_, res) => {
  res.render("index");
});

app.post("/shorten", async (req, res) => {
  const originalUrl = req.body.url;
  const shortUrl = nanoid(5);
  await urlModel.create({ originalUrl, shortUrl });
  const prefix = "http://localhost:1080/shortURL/";
  res.render("shortened", { originalUrl, shortUrl: prefix + shortUrl });
});

app.get("/shortURL/:shortUrl", async (req, res) => {
  const shortUrl = req.params.shortUrl;
  const responce = await urlModel.findOne({ shortUrl });
  console.log(responce);
  res.redirect(responce.originalUrl);
});

app.listen(process.env.PORT || 3300, () =>
  console.log(`server is running at ${process.env.PORT || 3300}`)
);
