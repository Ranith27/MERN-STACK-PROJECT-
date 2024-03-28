import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Room from '../components/Room';
import Loader from '../components/Loader';
import Error from '../components/Error';
import moment from 'moment';
import { DatePicker, Select } from 'antd';

const { RangePicker } = DatePicker;
const { Option } = Select;

function Homescreen() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [fromDate, setFromDate] = useState();
  const [toDate, setToDate] = useState();
  const [duplicateRooms, setDuplicateRooms] = useState([]);
  const [roomTypeFilter, setRoomTypeFilter] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = (await axios.get('/api/rooms/getallrooms')).data;
        setRooms(data);
        setDuplicateRooms(data);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    filterRoomsByType(roomTypeFilter);
  }, [roomTypeFilter]);

  function filterByDate(dates) {
    setFromDate(dates[0]);
    setToDate(dates[1]);
  }

  function handleRoomTypeChange(value) {
    setRoomTypeFilter(value);
  }

  function filterRoomsByType(type) {
    let filteredRooms = duplicateRooms;

    if (type && type !== 'All') {
      filteredRooms = duplicateRooms.filter(room => room.type === type);
    }

    if (fromDate && toDate) {
      filteredRooms = filteredRooms.filter(room => {
        const isRoomAvailable = room.currentBookings.every(booking => {
          const bookingStart = moment(booking.fromDate, 'DD-MM-YYYY');
          const bookingEnd = moment(booking.toDate, 'DD-MM-YYYY');
          const selectedStart = moment(fromDate);
          const selectedEnd = moment(toDate);

          return (
            selectedStart.isBefore(bookingStart) ||
            selectedEnd.isAfter(bookingEnd)
          ) || (
            selectedStart.isSameOrAfter(bookingEnd) ||
            selectedEnd.isSameOrBefore(bookingStart)
          );
        });
        return isRoomAvailable;
      });
    }

    setRooms(filteredRooms);
  }

  return (
    <div className='container'>
      <div className='row mt-5 justify-content-end'> {/* Use justify-content-end to move both boxes to the right */}
        <div className='col-md-4'>
          <RangePicker format='DD-MM-YYYY' onChange={filterByDate} />
        </div>
        <div className='col-md-3'>
          <Select defaultValue="Select Room Type" style={{ width: 200 }} onChange={handleRoomTypeChange}>
            <Option value="All">All</Option>
            <Option value="Delux">Delux</Option>
            <Option value="Non-Delux">Non-Delux</Option>
          </Select>
        </div>
      </div>

      <div className="row justify-content-center mt-5">
        {loading ? (
          <Loader />
        ) : rooms.length > 0 ? (
          rooms.map((room) => (
            <div className='col-md-9 mt-3' key={room._id}>
              <Room room={room} fromDate={fromDate} toDate={toDate} />
            </div>
          ))
        ) : (
          <Error />
        )}
      </div>
    </div>
  )
}

export default Homescreen;
