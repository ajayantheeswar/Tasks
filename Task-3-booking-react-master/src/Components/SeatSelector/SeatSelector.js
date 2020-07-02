import React ,{useState} from 'react';
import classes from './SeatSelector.module.css';
import _ from 'lodash'

const SeatSelector = props => {
    let Selector = []
    let counter = 1;
    for(let i=0;i<7;i++){
        const row = []
        for(let j=0;j<5;j++){
            const classList = [classes['Seat-column']];
            if(j == 1){
                classList.push(classes['second']);
            }
            if(props.booked.includes(counter)){
                classList.push(classes['booked']);
                row.push(<div key={j} className={classList.join(' ')} id={counter}></div>)
            }else{
                if(props.selected.includes(counter)){
                    classList.push(classes['selected']);
                }
                const valu = counter
                row.push(<div key={j} className={classList.join(' ')} id={counter} onClick={()=> props.onSeatClicked(valu)}></div>);
            }
            counter++;
        }
        Selector.push(<div key={i} className={classes['Seat-row']}>{row}</div>)
    }
    


    return (
        <div className={classes['Seat-Selector']}>
            {Selector}
        </div>
    );

}

export default SeatSelector;