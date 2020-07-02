const express = require('express');
const bodyParser = require('body-parser');
const Bus = require('../Models/bus');
const Trip = require('../Models/trip');
const Ticket = require('../Models/ticket');
const Customer = require('../Models/customer');
const {mail} = require('../utils/email');


exports.getBusDetails = (req,res,next) => {
    const user = req.user;
    Bus.findAll({where : {
        adminuserId : user.id
    }}).then(buses =>{
        console.log(buses)
        if(buses.length > 0){
            console.log(buses);
            res.status(200).json(buses);
        }else{
            res.status(401).json({message : "Error in Fetching Bus for the Users"});
        }
    })
    
}

exports.getAllBus = (req,res,next) =>{
    const user = req.user;
    Bus.findAll({
        where : {
            adminuserid:user.id
        }
    }).then(buses => {
        res.status(200).json({busList : buses});
    }).catch(error =>{
        res.status(401).json({error:error});
    })
}

exports.createBus = (req,res,next) => {
    const user = req.user;
    console.log(req.body.businfo);
    user.createBus({
       ...req.body.businfo
    }).then(bus =>{
        return Bus.findAll({where :{
            adminuserId : user.id
        }}) 
    }).then(buses =>{
        res.json({Message: "DataSaved Successfully" , busList : buses});
    })
    .catch(error => {
        if(error.name.includes('Unique')){
            res.status(400).json({Message : "Bus Already Exists" });
        }else{
            res.status(400).json({Message : error.name });
        }
        
    })
}


exports.getAllTripsByBusno = async(req,res,next) => {
    try{
        const busno = req.body.busno;
        const Today = new Date(new Date().toDateString());
        const FetchedTrips = await getTripsByBusno(busno);
        console.log(FetchedTrips);
        if(FetchedTrips.length > 0){
            const PresentTrips = FetchedTrips.filter(trip =>{
                return new Date(trip.date).getTime() >= Today.getTime();
            });
            res.status(200).json({Trips : PresentTrips , Message : 'Success'});    
        }else{
            res.status(200).json({Trips : [] , Message : 'Success'});    
        }
        
        
    }catch(err){
        res.status(500).json({error:err});
    }
}

const getTripsByBusno = (busno) => {
    return Trip.findAll({
        where : {
            busno :busno      
        }
    });
}

exports.sendAlerts = async (req,res,next) => {
    try{
        const user = req.user;
        const tripId = req.body.tripId;
        const trip = await Trip.findByPk(tripId);
        trip.chat = true;
        await trip.save();
        const Tickets = await getCustomersOfTrip(tripId);
        console.log(Tickets);
        const Customers = await getCustomersEmailIds(Tickets);
        console.log(Customers);
        sendAlerts(Customers,(err,info) => {
            if (err) {
                throw new Error('error');
            }
            console.log('Message sent: %s', info.messageId);
            res.status(200).json({Message : "Sent"});
        });
        
        //;

    }catch(err){
        res.status(400).json({Message : err});
        console.log(err);
    }
    
}

const getCustomersOfTrip = async (tripId) =>{
    try{
        const Customers = await Ticket.findAll({
            where : {
                tripId : tripId
            }
        });
        return Customers;
    }catch(err){
        throw new Error("No Error")
    }   
}
const getCustomersEmailIds = (Tickets) =>{
    return Promise.all(Tickets.map(ticket => {
        return Customer.findByPk(ticket.customerId);
    }));    
}

/*const sendAlerts = (customers) => {
    return new Propmise((resolve,reject) => {
        const EmailAddresses = customers.map(cus => cus.email);
        const emails = EmailAddresses.join(',');
        const messag_config = {
            from : 'ajaysmart26@gmail.com',
            to : emails,
            subject : 'Alert For your Trip',
            text: 'You Have Been Alerted '
        };
        email.sendMail(messag_config,()=>{
            resolve({
                message : "Alerted!"
            });
        },(error)=>{
            reject(error);
        })
    });
}*/

const sendAlerts = (customers,cb) => {
    const EmailAddresses = customers.map(cus => cus.email);
    const emails = EmailAddresses.join(',');
    const messag_config = {
        from : 'ajaysmart26@gmail.com',
        to : emails,
        subject : 'Alert For your Trip',
        text: 'You Have Been Alerted '
    };
    console.log(messag_config);
    mail.sendMail(messag_config,cb);
}

exports.enableChat = async (req,res,next) => {
    try{
        const {tripId} = req.body;
        const trip = await Trip.findByPk(tripId);
        trip.chat = true;
        await trip.save();
        res.status(200).json({message :"Success"});
    }
    catch(err){
        res.status(400).json({message :"Fail"});
    }
    
}