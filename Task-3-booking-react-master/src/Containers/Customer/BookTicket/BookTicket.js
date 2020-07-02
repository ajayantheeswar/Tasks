import React, { Component } from 'react';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import classes from './BookTicket.module.css'
import SeatSelector from '../../../Components/SeatSelector/SeatSelector';
import * as actionTypes from '../../../store/actions/ActionTypes';
import * as actions from '../../../store/actions/index';
import _ from 'lodash';
import BookingDetails from '../../../Components/BookingDetails/BookingDetails';


class BookTicket extends Component {
    constructor(props){
        super(props);
        this.state = {
           date : new Date()
        }
    }

    setDate = (date) =>{
        this.setState(prevState => {
            return {
                ...prevState,
                date : date
            }
        })
    }

    componentDidUpdate(){
        if(this.props.booked){
            this.props.history.replace('/customer/ticketconfirm');
        }
    }
    componentDidMount(){
        this.props.clearSearches()
    }
    
    onBookSelected = (seat) =>{
        const PrevSeats = [...this.props.selectedSeats];
        const updatedSeats = _.xor(PrevSeats,[seat]);
        console.log(updatedSeats);
        this.props.onSeatSelected(updatedSeats);
    }

    onDateSelected = () => {
        const date = (new Date(this.state.date)).toDateString()
        this.props.fetchTripFrodate(date);
    }
    render(){

        const TripArrangement = (
            <div className={classes['booking-cpm']}>
                <hr />
                <h3>Select Seats</h3>
                <div className={classes['booking-helper']}>
                    <SeatSelector 
                                booked = {this.props.bookedSeats}
                                selected ={this.props.selectedSeats}
                                onSeatClicked = {this.onBookSelected}
                            />
                    <BookingDetails
                    trip={this.props.trip}
                    seats={this.props.selectedSeats} />
                </div>
                <div className={classes['booking-button']}>
                    <button disabled={this.props.selectedSeats.length <=0} onClick={this.props.BookTicket}>Book Ticket</button>
                </div>
            </div>
            
        );

        

        return (
            <div className={classes['bookTicket-container']}>
                <div className={classes['datepicker-container']}>
                    <DatePicker 
                    dateFormat={'dd/MM/yyyy'}
                    selected={this.state.date} 
                    minDate={new Date()}
                    className ={classes['date-picker']} 
                    onChange={date => this.setDate(date)} />
                    <button onClick={this.onDateSelected}>Select</button>
                </div>
                {this.props.loaded ? TripArrangement : null }

            </div>
        );
    }
}

const mapPropsToStates = state =>{
    return{
        bookedSeats : state.bookticket.seatsBooked,
        selectedSeats : state.bookticket.seatsSelected,
        loaded : state.bookticket.loaded,
        booked : state.bookticket.booked,
        trip : state.bookticket.trip,
    }
}

const mapPropsToDispatch = dispatch =>{
    return {
        onSeatSelected : (seats) => dispatch({type: actionTypes.UPDATE_SEAT_SELECTED , UpdatedSeats : seats}),
        fetchTripFrodate : (date) => dispatch(actions.FetchTripAsync(date)),
        BookTicket : () => dispatch(actions.BookTicketAsync()),
        clearSearches : () => dispatch({type:actionTypes.CLEAR_SEARCH_RESULTS})
    }
}

export default connect(mapPropsToStates,mapPropsToDispatch)(BookTicket);