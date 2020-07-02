import React from 'react';
import classes from './Backdrop.module.css';
import { findAllByDisplayValue } from '@testing-library/react';

const Backdrop = props =>(
    props.visible ?
    <React.Fragment>
        {props.children}
        <div className={classes['Backdrop']} onClick={props.onClick}>
        
        </div>
    </React.Fragment>
    :null
);

export default Backdrop;