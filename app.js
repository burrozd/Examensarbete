const express = require("express");
const exphbs = require("express-handlebars");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const session = require("express-session");

const Booking = require("./models/booking");

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));

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

// Simulated user data (replace with actual user authentication logic)
const adminUser = { username: "admin", password: "admin" };

// Express session middleware
app.use(
  session({
    secret: "your-secret-key",
    resave: true,
    saveUninitialized: true,
  })
);

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

// Middleware to pass session data to the views
app.use((req, res, next) => {
  res.locals.user = req.session.user;
  next();
});

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

app.get("/admin-login", (req, res) => {
  res.render("admin-login", {
    title: "Admin Login",
    year: new Date().getFullYear(),
  });
});

app.get("/admin-dashboard", async (req, res) => {
  try {
    // Fetch bookings from MongoDB
    const bookings = await Booking.find(
      {},
      "bookingId bookingDate serviceOption specialRequests phoneNumber"
    );

    // Convert MongoDB documents to plain JavaScript objects
    const bookingsData = bookings.map((booking) => {
      const formattedDate = new Date(booking.bookingDate).toDateString();
      return {
        bookingId: booking.bookingId,
        bookingDate: formattedDate,
        serviceOption: booking.serviceOption,
        specialRequests: booking.specialRequests,
        phoneNumber: booking.phoneNumber,
      };
    });

    console.log("Fetched bookings:", bookingsData);

    res.render("admin-dashboard", {
      title: "Admin Dashboard",
      year: new Date().getFullYear(),
      bookings: bookingsData,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).render("error", {
      message: "Internal Server Error",
      error: error,
    });
  }
});

app.post("/submit-booking", async (req, res) => {
  try {
    const {
      bookingDate,
      serviceOption,
      specialRequests,
      phoneNumber,
      email,
    } = req.body;

    // Save the booking to MongoDB
    await Booking.create({
      bookingDate,
      serviceOption,
      specialRequests,
      phoneNumber,
      email,
    });

    res.redirect("/"); // Redirect to home page or wherever you'd like
  } catch (error) {
    console.error("Error submitting booking:", error);
    res.status(500).render("error", {
      message: "Internal Server Error",
      error: error,
    });
  }
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === adminUser.username && password === adminUser.password) {
    // Simulated login for demonstration purposes
    req.session.user = { username: adminUser.username };
    res.redirect("/admin-dashboard");
  } else {
    res.redirect("/"); // Redirect to home page or handle failed login
  }
});

app.delete("/delete-booking/:bookingId", async (req, res) => {
  const { bookingId } = req.params;
  try {
    // Find and delete the booking by bookingId
    const result = await Booking.findOneAndDelete({ bookingId });

    if (result) {
      console.log(`Booking deleted successfully: ${result}`);
      res.status(204).send(); // Sending a 204 (No Content) response for successful deletion
    } else {
      console.log(`Booking not found with ID: ${bookingId}`);
      res.status(404).send("Booking not found");
    }
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).send("Error deleting booking");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
