const mongoose = require("mongoose");

// bookingModel.js
const bookingSchema = mongoose.Schema({
    room: { type: String, required: true },
    roomid: { type: String, required: true },
    userid: { type: String, required: true },
    fromDate: { type: String, required: true },
    toDate: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    totalDays: { type: Number, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, required: true, default: "booked" },
  }, { timestamps: true });
  
  const bookingModel = mongoose.model("Bookings", bookingSchema);
  
  module.exports = bookingModel;
  
  
