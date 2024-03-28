const express = require("express");


const app = express();

const dbConfig = require('./db')
const roomsRoute = require('./routes/roomsRoutes')
const usersRoute = require('./routes/usersRoute')

const bookingsRoute = require('./routes/bookingsRoute')
app.use(express.json())
app.use('/api/rooms' , roomsRoute)
app.use('/api/users' , usersRoute)
app.use('/api/bookings', bookingsRoute)

const port = process.env.PORT || 5000;
app.listen(port, () => console.log('Node server started using nodemon'));