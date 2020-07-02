import React from 'react';
import classes from './TicketItem.module.css'

const Ticket = props => {
    console.log(props.ticket.Seats)
    return (
        <div className={classes['Ticket']}>
            <div className={classes['Details-container']}>
                <div className={classes['Ticket__item__head']}>
                    <h4>Ticket Id :</h4>
                    <h4>Origin :</h4>
                    <h4>Destination :</h4>
                    <h4>Date :</h4>
                    <h4>Time :</h4>
                    <h4>Bus No :</h4>
                    <h4>Seats :</h4>
                </div>
                <div className={classes['Ticket__item__value']}>
                    <p>{props.ticket.id}</p>
                    <p>{props.trip.origin}</p>
                    <p>{props.trip.destination}</p>
                    <p>{props.trip.date}</p>
                    <p>{props.trip.timing}</p>
                    <p>{props.trip.busno}</p>
                    <p>{props.ticket.Seats}</p>
                </div>
            </div>
            {props.cancel ? <button onClick={props.onCancel}>Cancel</button> : null}
            {props.trip.chat && !props.islist ? <button onClick={props.onChat}>Open Chat Room</button> : null }
            {props.trip.chat && !props.islist ? <button onClick={props.onLocation}>See Current location</button> : null}
        </div>
    )
}

export default Ticket;