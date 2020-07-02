import React from 'react';
import classes from './Trip.module.css';

const Trip = props => {
    return(
        <div className={classes['trip-item']}>
            <p className={classes['trip__date']}>{props.trip.date}</p>
            <hr />
            <div className={classes['trip-info']}>
                <p className={classes['trip-points']}>{`${props.trip.origin} To ${props.trip.destination}`}</p>    
                <p className={classes['trip-timing']}>{props.trip.timing}</p>
            </div>
            <div className={classes['action-container']}>
                <button onClick={props.sendAlert}>Send Alert</button>
                <button onClick={props.gotoSetLocation}>Set Current Location</button>
            </div>
        </div>
    )
}

export default Trip;