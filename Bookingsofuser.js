import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import Error from '../components/Error';

function Bookingsofuser() {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const [showPopup, setShowPopup] = useState(false); // State variable for managing pop-up visibility

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                setLoading(true);
                const response = await axios.post('/api/bookings/getbookingsbyuserid', { userid: user._id });
                const data = response.data;
                console.log(data);
                setBookings(data);
                setLoading(false);
            } catch (error) {
                console.log("Error fetching bookings:", error);
                setLoading(false);
                setError(error);
            }
        };

        fetchBookings();
    }, [user._id]); // Add user._id to the dependency array

    async function cancelBooking(bookingId, roomId) {
        try {
            setLoading(true);
            const result = (await axios.post("/api/bookings/cancelbooking", { BookingId: bookingId, roomid: roomId })).data;
            console.log(result);
            setLoading(false);
            setShowPopup(true); // Show pop-up when booking is successfully canceled

            // Automatically hide pop-up after 3 seconds
            setTimeout(() => {
                setShowPopup(false);
            }, 3000);
        } catch (error) {
            console.error("Error cancelling booking:", error);
            setLoading(false);
        }
    }

    return (
        <div>
            <div className='row'>
                <div className='col-md-6'>
                    {loading && <Loader />}
                    {error && <Error />}
                    {bookings && bookings.map(booking => (
                        <div key={booking._id} className="booking-container">
                            <h1>{booking.room}</h1>
                            <p><b>BookingId</b>: {booking._id}</p>
                            <p><b>CheckIn</b>: {booking.fromDate}</p>
                            <p><b>CheckOut</b>: {booking.toDate}</p>
                            <p><b>Amount</b>: {booking.totalAmount}</p>
                            <p><b>Status</b>: {booking.status && booking.status.toUpperCase()}</p>
                            <div className="button-container">
                                {booking.status && booking.status.toUpperCase() !== 'CANCELLED' && (
                                    <button className='btn btn-primary' onClick={()=>{cancelBooking(booking._id , booking.roomid)}}>CANCEL BOOKING</button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Pop-up message */}
            {showPopup && (
                <div className="popup">
                    <div className="popup-inner">
                        <h2>Congratulations!</h2>
                        <p>Your booking is successfully canceled.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Bookingsofuser;
