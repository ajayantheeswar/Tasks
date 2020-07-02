import React from 'react';
import classes from './BusItem.module.css';
import svg from '../../Assests/images/dAr.svg';

const Busitem = props =>(
    <div onClick={props.onClick} className={classes['bus-item']}>
        <div className={classes['bus-phy-details']}>
            <span className={classes['bus-id']}>{props.Bus.busno}</span>
            <span className={classes['bus-seat']}>{props.Bus.capacity} Seats</span>
        </div>
        <div className={classes['bus-endpoints-details']}>
            <span className={classes['endpoint']}>{props.Bus.endpointA}</span>
            <img src={svg} style={{width:'3rem'}} alt="Arrow" />
            <span className={classes['endpoint']}>{props.Bus.endpointB}</span>
        </div>
        <div className={classes['meta-details']}>
            <span className={classes['bus-timing']}>{props.Bus.timingA}</span>
            <span className={classes['bus-timing']}>{props.Bus.timingB}</span>
            <span className={classes['bus-fare']}>Rs. {props.Bus.fare}</span>
        </div>
        
    </div>
);

export default Busitem; 