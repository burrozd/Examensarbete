const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  bookingId: String,
  bookingDate: Date,
  serviceOption: String,
  specialRequests: String,
  phoneNumber: String,
  email: String, // Add this line for the email field
});

bookingSchema.pre("save", function(next) {
  // Modify Booking ID generation
  if (!this.bookingId) {
    this.bookingId = Date.now().toString();
  }
  next();
});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;
