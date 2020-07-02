import React from 'react';
import classes from './BookingDetails.module.css';
import SeatSelector from '../SeatSelector/SeatSelector';

const BookingDetails = props =>{
    return (
        <div className={classes['Booking-details']}>
            <div className={classes['Booking-details__item']}>
                <h4>Origin :</h4>
                <p>{props.trip.origin}</p>
            </div>
            <div className={classes['Booking-details__item']}>
                <h4>Destination :</h4>
                <p>{props.trip.destination}</p>
            </div>
            <div className={classes['Booking-details__item']}>
                <h4>Date :</h4>
                <p>{props.trip.date}</p>
            </div>
            <div className={classes['Booking-details__item']}>
                <h4>Timing :</h4>
                <p>{'Rs. '+props.trip.timing}</p>
            </div>
            <div className={classes['Booking-details__item']}>
                <h4>Per Ticket :</h4>
                <p>{props.trip.fare}</p>
            </div>
            <div className={classes['Booking-details__item']}>
                <h4>No of Seats :</h4>
                <p>{props.seats.length}</p>
            </div>
            <div className={classes['Booking-details__item']}>
                <h4>Seat No :</h4>
                <p>{props.seats.join(',')}</p>
            </div>
            <div className={classes['Booking-details__item']}>
                <h4>Total Amount :</h4>
                <p>{'Rs. ' + (props.seats.length ? props.seats.length*+props.trip.fare : 0.00)}</p>
            </div>
        </div>
    
    );
}

export default BookingDetails;