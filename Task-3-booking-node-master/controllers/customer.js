const Bus = require('../Models/bus');
const Customer = require('../Models/customer');
const { Op } = require('sequelize');
const Trip = require('../Models/trip');
const Ticket = require('../Models/ticket');
const Seat = require('../Models/seat');
const sequelize = require('../utils/database');
const {getDb} = require('../utils/mongo');

const getBusById = (busid,success,fail) => {
    Bus.findByPk(busid)
        .then(bus => {
            if(bus){
                success(bus);
            }else{
                fail(error);
            }
        }).catch(error =>{
            fail(error);
        })
}

exports.getBusBySrcAndDes = (req,res,next) => {
    const user = req.user;
    const origin = req.body.origin;
    const destination = req.body.destination;
    Bus.findAll({where : 
        {
        [Op.or] :[
            {
                endpointA : origin,
                endpointB : destination
            },
            {
                endpointA : destination,
                endpointB : origin
            }
            ]
        }}
        ).then(Buses=>{
            console.log(Buses);
            res.status(200).json({Buses : Buses,count : Buses.length});
        }).catch(error => {
            res.status(400).json({Message:"Error" , error:error});
            console.log('Error While fetching Bus for destination');
        })
 
    }

exports.getTrip = (req,res,next) => {
    const customer = req.user;
    const busid = req.body.busid;
    const date = req.body.date;
    const origin = req.body.origin;
    let Result = {};
    console.log(busid,date,origin);
    Trip.findAll({
        where:{
            busid : busid,
            date : date,
            origin :origin
        }
    }).then(trips=>{
        console.log(trips);
        if(trips && trips.length > 0){
            return trips[0];
        }else{
            return Bus.findByPk(busid)
                        .then(respo =>{
                            const bus = respo.dataValues;
                            console.log(bus);
                            Result.bus = bus;
                            const tripOrigin = origin;
                            const tripDestination = bus.endpointA === origin ? bus.endpointB : bus.endpointA;
                            const tripTiming = bus.endpointA === origin ? bus.timingA : bus.timingB;
                            console.log(tripOrigin,tripDestination,tripTiming,"klhj")
                            return Trip.create({
                                busId: bus.id, // Trip.Create ***
                                busno: bus.busno,
                                origin : tripOrigin,
                                destination: tripDestination,
                                date : date,
                                SeatAvailable : bus.capacity,
                                timing:tripTiming,
                                fare: bus.fare
                            })
                        })
        }
    })
    .then(trip => {
        Result.trip = trip;
        return Seat.findAll({where : {
            tripId : trip.id
        }})
    }).then(seats => {
        Result.seats = seats;
        res.status(200).json({payload : Result , Message : "Success"})
    }).catch(error => {
        res.status(400).json({Message : error , val : Result});
    })

}

exports.bookBus = (req,res,next) => {
    const customer = req.user;
    const tripId = req.body.tripId;
    const busId = req.body.busId;
    const seats = req.body.seats;
    let result = {}
    //console.log(seats);
    Ticket.create({
        customerId:customer.id,
        tripId : tripId,
        busId : busId,
        Seats : seats.length
    }).then(ticket=>{
        ticket = ticket.dataValues;
        result = {
            ...result,
            ticket : ticket
        }
        console.dir(ticket);
        let lob = seats.map(seat => {
            return {
                customerId:ticket.customerId,
                ticketId : ticket.id,
                tripId : tripId,
                busId : busId,
                seatno : seat
            };
        });
        return Trip.findByPk(tripId)
                .then(trip=>{
                    trip.SeatAvailable = trip.dataValues.SeatAvailable - lob.length;
                    return trip.save();
                }).then(trip =>{
                    result = {
                        ...result,
                        trip : trip.dataValues
                    }
                    //console.log(lob);
                    return Seat.bulkCreate(lob);
                })
    
    }).then(Seats =>{
        console.log(Seats);
        result = {
            ...result,
            seats : Seats
        }
        res.status(200).json({result : result,Message : "Success"});
    })
    .catch(error => {
        res.status(200).json({error:error});
    })
    
}


exports.getTickets = (req,res,next) => {
    const customer = req.user;
    let results ={} ;
    customer.getTickets({
        include : [Seat]
    }).then(tickets => {
      results.tickets = tickets;
      return getTrips(tickets);
    }).then(trips =>{
        res.status(200).json({result : trips, message : 'Sucess'});
    })
}

const getTrips = (Tickets) =>{
    const TicketsWithTrips  = Tickets.map(ticket => new Promise((resolve,reject) =>{
            Trip.findByPk(ticket.dataValues.tripId)
                .then(trip =>{
                    console.log(trip.dataValues);
                    //resolve(trip.dataValues);
                    const newTicket = {...ticket.dataValues,trip : {...trip.dataValues}}; 
                    resolve(newTicket)
                })
                .catch(error =>{
                    reject(new Error('PICK'));
                })
        }));
    
    return Promise.all(TicketsWithTrips);
}

exports.deleteTicket = async (req,res,next) => {
    const t = await sequelize.transaction();
    const user = req.user;
    const ticketid = req.body.ticketId;
    let seats ;
    let tripId ;
    user.getTickets({
        where : {
            id : ticketid
         }
        },
    { transaction: t })
        .then(tickets =>{
            console.log(tickets);
            const ticket = tickets[0];
            
            seats = ticket.Seats || 0;
            tripId = ticket.tripId;
            return ticket.destroy({transaction : t})
    }).then(() => {
        return Trip.findByPk(tripId,{
            transaction : t
        })
        .then(trip => {
          console.error(trip);
          trip.SeatAvailable = trip.SeatAvailable + seats;
          return trip.save({transaction :t});
        })
    }).then(()=> {
        t.commit();
        res.status(200).json({Message : "Success"});
    })
    .catch(error => {
        console.log(error);
        t.rollback();
        res.status(400).json({Message : "FAil"});
    })
}

exports.getTripChats = async (req,res,next) => {
    try{
        const {tripId} = req.body;
        const db = getDb();
        const prevMessages = await db.collection('chatroom').find({tripId:tripId}).toArray();
        res.status(200).json({prevMessages : prevMessages || []});
    }
    catch(err){
        res.status(200).json({error : err});
    }
}

