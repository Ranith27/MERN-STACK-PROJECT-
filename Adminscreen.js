import React, { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import axios from 'axios';
import Loader from '../components/Loader';
import { notification } from 'antd';



const { TabPane } = Tabs;

function Adminscreen() {



  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser && !currentUser.isAdmin) {
      // Redirect to home screen if user is not admin
      window.location.href = '/home';
    }
  }, []);




  return (
    <div>
      <h3 style={{ textAlign: 'center', marginBottom: '20px' }}>Admin Panel</h3>
      <Tabs defaultActiveKey="1" centered>
        <TabPane tab="Bookings" key="1">
          <Bookings />
        </TabPane>
        <TabPane tab="Rooms" key="2">
          <Rooms />
        </TabPane>
        <TabPane tab="Add Rooms" key="3">
          <Addroom />
        </TabPane>
        <TabPane tab="Users" key="4">
          <Users />
        </TabPane>
      </Tabs>
    </div>
  );
}

export default Adminscreen;

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get("/api/bookings/getallbookings");
        // Assuming response.data is an object with a 'bookings' property
        setBookings(response.data.bookings || []); // Ensure bookings array is set even if undefined
        setLoading(false);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Bookings</h1>
      {loading ? <Loader /> : (
        <div style={{ textAlign: 'center' }}>

          <table className='table table-bordered table-dark'>
            <thead>
              <tr>
                <th>Booking Id</th>
                <th>User Id</th>
                <th>Room</th>
                <th>From</th>
                <th>To</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bookings.length > 0 ? (
                bookings.map(booking => {
                  return <tr>
                    <td>{booking._id}</td>
                    <td>{booking.userid}</td>
                    <td>{booking.room}</td>
                    <td>{booking.fromDate}</td>
                    <td>{booking.toDate}</td>
                    <td>{booking.status}</td>
                  </tr>
                })
              ) : (
                <p>No bookings available</p>
              )}

            </tbody>
          </table>

        </div>
      )}
    </div>
  );
}


function Rooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get("/api/rooms/getallroomss");
        console.log("Rooms response:", response.data); // Log the response data for debugging
        setRooms(response.data.rooms || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching rooms:", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Rooms</h1>
      {loading ? <Loader /> : (
        <div style={{ textAlign: 'center' }}>
          {rooms.length > 0 ? (
            <table className='table table-bordered table-dark'>
              <thead>
                <tr>
                  <th>Room Id</th>
                  <th>Name</th>
                  <th>Type</th>
                  <th>Rent Per Day</th>
                  <th>Max Count</th>
                  <th>Phone Number</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map(room => (
                  <tr key={room._id}>
                    <td>{room._id}</td>
                    <td>{room.name}</td>
                    <td>{room.type}</td>
                    <td>{room.rentPerDay}</td>
                    <td>{room.maxCount}</td>
                    <td>{room.phoneNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No rooms available</p>
          )}
        </div>
      )}
    </div>
  );
}


function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("/api/users/getallusers");
        console.log("Users response:", response.data); // Log the response data for debugging
        setUsers(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1 style={{ textAlign: 'center' }}>Users</h1>
      {loading ? <Loader /> : (
        <div style={{ textAlign: 'center' }}>
          {users.length > 0 ? (
            <table className='table table-bordered table-dark'>
              <thead>
                <tr>
                  <th>User Id</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Is Admin</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user._id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.isAdmin ? 'YES' : 'NO'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No users available</p>
          )}
        </div>
      )}
    </div>
  );
}

function Addroom(){



  const [name, setname] = useState('')
  const [rentPerDay , setrentPerDay] = useState()
  const [maxCount , setmaxCount] = useState()
  const [description, setdescription] = useState()
  const [phoneNumber, setphoneNumber] = useState()
  const [type , settype]=useState()
  const [imageurl1 , setimageurl1]=useState()
  const [imageurl2, setimageurl2]=useState()
  const [imageurl3 , setimageurl3]=useState()

  async function addRoom(){

    const newroom={
      name,
      rentPerDay,
      maxCount,
      description,
      phoneNumber,
      type,
      imageurls:[imageurl1 , imageurl2 , imageurl3]
    }
    try{
      const result  = await (await axios.post('/api/rooms/addroom' , newroom)).data
      notification.success({
        message: 'New Room Added',
        description: 'The new room has been added successfully.',
        duration: 4, // Display duration in seconds
      });
      // Reset input fields after successful addition
      setname('');
      setrentPerDay('');
      setmaxCount('');
      setdescription('');
      setphoneNumber('');
      settype('');
      setimageurl1('');
      setimageurl2('');
      setimageurl3('');
      window.location.href = '/home';
    }catch (error) {
      console.log(error)
      notification.error({
        message: 'Error',
        description: 'Failed to add new room. Please try again later.',
        duration: 4, // Display duration in seconds
      });
    }
  }


  return (
    <div className='row'>
      <div className='col-md-5'>
        <input type='text' className='form-control' placeholder='room name' 
        value={name} onChange={(e)=>{setname(e.target.value)}}
        />
        <input type='text' className='form-control' placeholder='rent per day' 
        value={rentPerDay} onChange={(e)=>{setrentPerDay(e.target.value)}} 
        />
        <input type='text' className='form-control' placeholder='max count' 
        value={maxCount} onChange={(e)=>{setmaxCount(e.target.value)}}/>
        <input type='text' className='form-control' placeholder='description' 
        value={description} onChange={(e)=>{setdescription(e.target.value)}}/>
        <input type='text' className='form-control' placeholder='phone number'
        value={phoneNumber} onChange={(e)=>{setphoneNumber(e.target.value)}} />
       

      </div>

      <div className='col-md-5'> 
      <input type='text' className='form-control' placeholder='type' 
      value={type} onChange={(e)=>{settype(e.target.value)}}/>
        <input type='text' className='form-control' placeholder='image url 1' 
        value={imageurl1} onChange={(e)=>{setimageurl1(e.target.value)}}/>
        <input type='text' className='form-control' placeholder='image url 2' 
        value={imageurl2} onChange={(e)=>{setimageurl2(e.target.value)}}/>
        <input type='text' className='form-control' placeholder='image url 3' 
        value={imageurl3} onChange={(e)=>{setimageurl3(e.target.value)}}/> 
        <div className='text-right'>

          <button className='btn btn-primary mt-2' onClick={addRoom}>Add Room</button>
        </div>
      
      </div>



    </div>
  )
}
