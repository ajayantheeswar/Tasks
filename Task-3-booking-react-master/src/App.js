import React from 'react';
import logo from './logo.svg';
import Layout from './Layouts/Layout';
import Navbar from './Containers/Navigation/Navbar/Navbar';
import Dashboard from './Containers/Dashboard/Dashboard';
import SearchBus from './Containers/Customer/SearchBus/SearchBus';
import Auth from './Containers/Auth/Auth';
import { Switch,Route, Redirect, Router } from 'react-router';
import {connect} from 'react-redux';
import * as actions from './store/actions/index'
import Result from './Components/Search/SearchResult/SearchResult';
import BookTicket from './Containers/Customer/BookTicket/BookTicket';
import SeatSelector from './Components/SeatSelector/SeatSelector';
import BookingItem from './Components/BookingDetails/BookingDetails';
import TicketConfirmation from './Components/TicketConfirmation/TicketConfirmation'
import Ticket from './Components/TicketItem/TicketItem';
import YourTickets from './Containers/YourTickets/YourTickets';
import BusTrips from './Containers/Dashboard/BusTrips/BusTrips';
import Chat from './Components/Chat/Chat';
import ChatRoom from './Containers/Customer/ChatRoom/ChatRoom';
import MapContainer from './Containers/Maps/Container/Container';
import CustomerMap from './Containers/Customer/CustomerMapTrace/CustomerMap';

const App = props => {

  let Routes;

  if(props.isAuth){
    if(props.isAdmin){
      Routes = (
        <Switch>
          <Route path='/admin/dashboard' component={Dashboard} />
          <Route path='/admin/trips/:busno' component={BusTrips} />
          <Route path='/admin/location/:tripid' component={MapContainer} />
          <Redirect to='/admin/dashboard' />
        </Switch>
      );
    }else{
      Routes = (
        <Switch>
          <Route exact path='/customer/search' component={SearchBus} />
          <Route path='/customer/bookticket' component={BookTicket} />
          <Route path='/customer/ticketconfirm' component={TicketConfirmation} />
          <Route path='/customer/yourtickets' component={YourTickets} />
          <Route path='/customer/chatroom/:tripid' component={ChatRoom} />
          <Route path='/customer/location/:tripid' component={CustomerMap} />
          <Redirect to='/customer/search' />
        </Switch>
      )
    }    
  }else{
    Routes = (
      <Switch>
        <Route path='/auth' component={Auth} />
        <Redirect to ='/auth' />
      </Switch>
    )
  }


  return (
    <Layout>
      <Navbar logout={props.logout} isAdmin={props.isAdmin} isAuth={props.isAuth} />
      {Routes}
    </Layout>
  );
}

const mapStatetoProps = state => {
  return {
    isAuth : state.auth.isAuth,
    isAdmin : state.auth.isAdmin,
    
  };
}

const mapDispatchToProps = dispatch =>{
  return{
    logout : () => dispatch(actions.logout())
  }
}

export default connect(mapStatetoProps,mapDispatchToProps)(App);
