const express = require('express');
const bodyParser = require('body-parser'); 
const jwt = require('jsonwebtoken');
const tokenHash = require('./utils/webtoken');

const cors = require('cors');

const sequelize = require('./utils/database');
const AdminUser = require('./Models/adminUser');
const Bus = require('./Models/bus');
const Trip = require('./Models/trip');
const Customer = require('./Models/customer');
const Ticket = require('./Models/ticket');
const Seat = require('./Models/seat');

const AuthRoutes = require('./routes/auth');
const AdminRoutes = require('./routes/admin');
const CustomerRoutes = require('./routes/customer');


const {mongoConnect, getDb} = require('./utils/mongo');
let mDb;

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/auth',AuthRoutes);
app.use((req, res, next) => {
    const authToken = req.body.token;
    const isAdmin = req.body.isAdmin;
    console.log(req.body);

    jwt.verify(authToken, tokenHash.token, (err, decoded)=> {
        if(decoded){
            if(isAdmin){
              AdminUser.findByPk(decoded)
                .then(user=>{
                    if(user){
                        req.user = user
                        next();
                    }else{
                        res.status(400).json({message : 'Auth Fail'});
                    }
                })
            }else{
              Customer.findByPk(+decoded)
              .then(user=>{
                  if(user){
                      req.user = user
                      next();
                  }else{
                      res.status(400).json({message : 'Auth Fail'});
                  }
              })
            }
            
        }else{
            res.status(400).json({message : 'Auth Fail'});
        }
        
    });

});


app.use('/admin',AdminRoutes.router);
app.use('/customer',CustomerRoutes.router)

AdminUser.hasMany(Bus);
Bus.belongsTo(AdminUser);
Bus.hasMany(Trip);
Customer.hasMany(Ticket);
Trip.hasMany(Ticket);
Ticket.hasMany(Seat,{
  onDelete: 'CASCADE'
});
Trip.hasMany(Seat);
Customer.hasMany(Seat);





/*sequelize
  .sync({force : true})
  .then(response => {
    return AdminUser.create({
      name : 'Ajayantheeswar',
      email:"ajaysiva2000@gmail.com",
      password : "qwerty26"
    });
  })
  .then(user => {
    user.createBus({
      busno : "A",
      capacity : 20,
      endpointA : "Chennai",
      endpointB : "Coimbatore",
      timingA : "8.00 - 13.00",
      timingB : "17.00 - 22.00",
      fare : 200.00
    })
    user.createBus({
      busno : "B",
      capacity : 20,
      endpointA : "Salem",
      endpointB : "Madurai",
      timingA : "16.00 - 20.00",
      timingB : "17.00 - 22.00",
      fare : 200.00
    })
    user.createBus({
      busno : "C",
      capacity : 20,
      endpointA : "Madurai",
      endpointB : "Chennai",
      timingA : "4.00 - 10.00",
      timingB : "17.00 - 22.00",
      fare : 200.00
    })
    
  })
  .then(response =>{
    app.listen(3001);
  })
  .catch(err => {
    console.log(err);
  });
*/

mongoConnect(() => {
    mDb = getDb();
    console.log('MongoDb Coonected !');
});



sequelize.sync()
  .then(res=>{
    //app.listen(3001);
    server.listen(3001);
  });

const chat = io.of('/chat');
const location = io.of('/location');
const chats = require('./utils/chat');
chat.use(chats.auth);
location.use(chats.auth);
  

chat.on("connection", (socket) => {
  console.log("Connected: " + socket.user.id);

  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.user.id);
  });

  socket.on("joinRoom", ({ tripId }) => {
    socket.join(tripId);
    console.log("A user joined chatroom: " + tripId);
  });

  socket.on("leaveRoom", ({ tripId }) => {
    socket.leave(tripId);
    console.log("A user left chatroom: " + tripId);
  });

  socket.on("chatroomMessage", async ({ tripId, message }) => {
    
    if (message.trim().length > 0) {
      const user = socket.user
      const newMessage = {
        tripId: tripId,
        message,
        name: user.name,
        userId: user.id,
      }
      chat.to(tripId).emit("newMessage", {
        message,
        name: user.name,
        userId: user.id,
      });
      await mDb.collection('chatroom').insertOne(newMessage);
    }
  });
});

// location 

location.on('connection',(socket)=>{
  socket.on("disconnect", () => {
    console.log("Disconnected: " + socket.user.id);
  });

  socket.on("joinRoom", ({ tripId }) => {
    socket.join(tripId);
    console.log("A user joined chatroom: " + tripId);
    console.log('location');
  });

  socket.on("leaveRoom", ({ tripId }) => {
    socket.leave(tripId);
    console.log("A user left chatroom: " + tripId);
  });

  socket.on('newLocation', async({location , tripId}) => {
    const loc = {
      tripId : tripId,
      location : location
    }
    socket.to(tripId).emit('locationUpdated',loc);
    await mDb.collection('locations').insertOne(loc); 
  })
})