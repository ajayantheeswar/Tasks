import React from 'react';
import classes from './Busform.module.css';

const BusForm = props => (
    <form onSubmit={props.onformSubmit}className={classes['bus-form']}>
        <input type="text" placeholder="Bus Number" onChange={(event) => props.OnFormChange(event,'busno')} value={props.inputFormData.busno} />
        <input type="text" placeholder="Capacity" onChange={(event) => props.OnFormChange(event,'capacity')} value={props.inputFormData.capacity} />
        <input type="text" placeholder="End Point A" onChange={(event) => props.OnFormChange(event,'endpointA')} value={props.inputFormData.endpointA} />
        <input type="text" placeholder="End Point B" onChange={(event) => props.OnFormChange(event,'endpointB')} value={props.inputFormData.endpointB} />
        <input type="text" placeholder="Fare" onChange={(event) => props.OnFormChange(event,'fare')} value={props.inputFormData.fare} />
        <input type="text" placeholder="TimeA" onChange={(event) => props.OnFormChange(event,'timingA')} value={props.inputFormData.timingA} />
        <input type="text" placeholder="TimeB" onChange={(event) => props.OnFormChange(event,'timingB')} value={props.inputFormData.timingB} />
        <div>
            <button type="button" onClick={props.onAddClicked}>Add</button>
            <button type="button" className={classes['negative']}onClick={props.onCancelClicked}>Cancel</button>
        </div>
        
    </form>
);

export default BusForm