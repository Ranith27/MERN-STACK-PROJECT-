const express = require('express')
const router = express.Router();
const Booking = require("../models/booking")
const moment = require('moment');
const Room = require('../models/room');

const { v4: uuidv4 } = require('uuid');
const stripe = require('stripe')('sk_test_51Os8RDSGGwaGizA32i2ad1UZNobYRzNjboKtghxnN1CP1zTiM1q7wHGUzRIxA6af34vE7MiJhkqApivihM5qiDaz00RFdgmdbe')
router.post("/bookroom", async (req, res) => {
  try {
        const { room, userid, fromDate, toDate, totalAmount, totalDays } = req.body;
      

            
        
          const newBooking = new Booking({
              room: room.name,
              roomid: room._id,
              userid,
              fromDate,
              toDate,
              totalAmount,
              totalDays,
              transactionId: '1234'
          });
  
          const booking = await newBooking.save();
  
          const roomtemp = await Room.findOne({ _id: room._id });
            roomtemp.currentBookings.push({
              bookingid: booking._id,
              fromDate : fromDate,
              toDate : toDate,
              userid: userid,
              status: booking.status
            });
  
            await roomtemp.save()
  
  
  
  
          res.send('Room booked successfully');
      } catch (error) {
          return res.status(400).json({ error });
      }

            
    });


    router.post('/getbookingsbyuserid', async (req, res) => {


      const userid= req.body.userid


      try{
        const bookings = await Booking.find({userid : userid})

        res.send(bookings)
      }catch(error){
        return res.status(400).json({ error });
      }
    });


    router.post("/cancelbooking", async (req, res) => {
      const { BookingId, roomid } = req.body;
  
      try {
          const bookingitem = await Booking.findOne({ _id: BookingId });
          if (!bookingitem) {
              return res.status(404).json({ error: "Booking not found" });
          }
  
          bookingitem.status = 'cancelled';
          await bookingitem.save();
  
          const room = await Room.findOne({ _id: roomid });
          if (!room) {
              return res.status(404).json({ error: "Room not found" });
          }
  
          // Filter out the booking to be cancelled from currentBookings
          room.currentBookings = room.currentBookings.filter(booking => booking.bookingid.toString() !== BookingId);
          await room.save();
  
          res.send('Your booking cancelled successfully');
      } catch (error) {
          console.error("Error cancelling booking:", error);
          return res.status(400).json({ error: "An error occurred while cancelling booking" });
      }
  });
  
  router.get("/getallbookings", async (req, res) => {
    try {
      const bookings = await Booking.find();
      const bookingsLength = bookings.length;
      res.json({ bookingsLength, bookings });
    } catch (error) {
      console.error("Error fetching bookings:", error);
      return res.status(500).json({ error: "Failed to fetch bookings", details: error.message });
    }
  });
  
module.exports = router;