import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import StripeCheckout from 'react-stripe-checkout';

function Bookingscreen() {
  const { roomid, fromDate, toDate } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [room, setRoom] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = (await axios.post('/api/rooms/getroombyid', { roomid })).data;
        setRoom(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setError(true);
      }
    }
    fetchData();
  }, [roomid]);

  useEffect(() => {
    if (fromDate && toDate && room) {
      const start = moment(fromDate, 'DD-MM-YYYY');
      const end = moment(toDate, 'DD-MM-YYYY');
      const days = end.diff(start, 'days') + 1;
      setTotalDays(days);
      const amount = days * room.rentPerDay;
      setTotalAmount(amount);
    }
  }, [fromDate, toDate, room]);

  async function onToken(token) {
    console.log(token);
    const bookingDetails = {
      room,
      userid: JSON.parse(localStorage.getItem('currentUser'))._id,
      fromDate,
      toDate,
      totalAmount,
      totalDays,
      token
    };
    try {
      const result = await axios.post('/api/bookings/bookroom', bookingDetails , token);
      setBookingSuccess(true);

      // Hide the success message after 3 seconds
      setTimeout(() => {
        setBookingSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Error during booking:", error);
    }
  }

  return (
    <div>
      {loading ? (
        <Loader />
      ) : room ? (
        <div className='row justify-content-center mt-3'>
          <div className='col-md-5'>
            <div className='image-container'>
              <b>
                <h2>{room.name}</h2>
              </b>
              <img src={room.imageurls[0]} className='bookimg' alt='Room' />
            </div>
          </div>
  
          <div className='col-md-5'>
            <div className='booking-details'>
              <div>
                <h1>Booking Details</h1>
                <hr />
                <b>
                  <p>Name: {JSON.parse(localStorage.getItem('currentUser')).name}</p>
                  <p>From Date: {fromDate}</p>
                  <p>To Date: {toDate}</p>
                  <p>Max Count: {room.maxCount}</p>
                </b>
              </div>
  
              <div>
                <h1>Amount</h1>
                <hr />
                <b>
                  <p>Total days: {totalDays}</p>
                  <p>Rent per day: {room.rentPerDay}</p>
                  <p>Total Amount: {totalAmount}</p>
                </b>
              </div>
  
              <div>
                <StripeCheckout
                  amount={totalAmount * 100}
                  token={onToken}
                  currency='INR'
                  stripeKey="pk_test_51Os8RDSGGwaGizA3y1BNpbKZxsInQK0Lf4ICTL2YwZVZWMvOnphYRhC4g0Nkpwb4fIkZsF89cz2xtsAuA05kh99u00IaVcwXxx"
                >
                  <button className='btn btn-primary'>Pay Now</button>
                </StripeCheckout>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Error />
      )}
      {/* Booking success message */}
      {bookingSuccess && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Congratulations!</h2>
            <p>Your booking is successful.</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookingscreen;
