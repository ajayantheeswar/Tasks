import React from 'react';
import classes from './SearchResult.module.css';

const result = props => (
    <div className={classes['search-result']}>
        <div className={classes['trip-info']}>
            <span className={classes['travels-name']}>{props.Bus.busno}</span>
            <div className={classes['trip-info__points']}>
                <span className={classes['endpoint']} >{props.origin}</span>
                <span>TO</span>
                <span className={classes['endpoint']} >{props.destination}</span>
            </div>
            <div className={classes['trip-info__timing']}>
                <span className={classes['time']}>{props.time}</span>
            </div>
        </div>
        <div className={classes['book-info']}>
            <span>RS. {props.Bus.fare}</span>
            <button onClick={()=>props.onBookClicked(props.Bus.id)}>Book Now</button>
        </div>
    </div>
);

export default result;