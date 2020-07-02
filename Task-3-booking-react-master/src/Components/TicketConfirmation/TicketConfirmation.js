import React, { Component } from 'react';
import Ticket from '../TicketItem/TicketItem';
import classes from './TicketConformation.module.css';
import {connect} from 'react-redux';
import * as actions from '../../store/actions/ActionTypes';


class TicketConfirmation extends Component{
    constructor(props){
        super(props);
        this.state ={
            time : 10
        }
    }

    componentDidMount(){
       const T =  setInterval(()=>{
            if(this.state.time > 0){
                this.setState((prevState) => {
                    return {
                        time : prevState.time-1
                    }
                });
            }else{
                clearInterval(T);
                this.props.history.replace('/');
                this.props.clear();
            }
        },1000)
    }

    render(){
        return (
            <div className={classes['confirmation']}>
                <h2>Ticket Confirmed !!</h2>
                <Ticket trip={this.props.trip} ticket={this.props.ticket} islist/>
                {<p>{'Rediecting you in ' + this.state.time + 'seconds'}</p>}
            </div>
        );
    }
    
}

const mapStateToProps =  state => {
    return{
        trip : state.bookticket.trip,
        ticket : state.bookticket.ticket    
    }
}


const mapDispatchToProps = dispatch => {
    return {
        clear : () => dispatch({type: actions.CLEAR_BOOK_TICKET})
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(TicketConfirmation);