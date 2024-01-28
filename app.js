const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");

const app = express();

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://buroz:AoD6k1oGJriF85Gr@examensarbete.31nc45z.mongodb.net/mydatabase?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.engine(
  "hbs",
  exphbs({
    extname: "hbs",
    defaultLayout: "layout",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials/",
  })
);
app.set("view engine", "hbs");
app.set("views", __dirname + "/views");

app.get("/", (req, res) => {
  res.render("index", { title: "Home", year: new Date().getFullYear() });
});

app.get("/portfolio", (req, res) => {
  res.render("portfolio", {
    title: "Portfolio",
    year: new Date().getFullYear(),
  });
});

app.get("/about", (req, res) => {
  res.render("about", { title: "About", year: new Date().getFullYear() });
});

app.get("/booking", (req, res) => {
  res.render("booking", { title: "Book Now", year: new Date().getFullYear() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
