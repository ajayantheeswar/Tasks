import React , {Component} from 'react';
import Chat from '../../../Components/Chat/Chat';
import chatRoom from '../../../Models/ChatRoom';
import Axios from 'axios';

class ChatRoom extends Component {

    constructor(props){
        super(props);
        this.state = {
            tripId : null,
            messages : [],
            Allowed : false,
            socket : null,
            message : ''
        }
    }

    componentDidMount(){
        const token = sessionStorage.getItem('token');
        const TripId = this.props.match.params.tripid;
        Axios.post('http://localhost:3001/customer/getmessages',{
            token : token,
            tripId : TripId
        }).then(response => {
            const {prevMessages} = response.data;
            const socket = chatRoom.getSocket(TripId,this.onNewMessageRecieved)
            this.setState((prevState)=>{
            return {
                ...prevState,
                tripId : TripId,
                socket : socket,
                messages : prevMessages
            }
        });
            
        }).catch(error=>{
            console.error(error);
        })
        
        
    }

    onMessageChange = (event) => {
        const value = event.target.value;
        this.setState( (prevState) => {
            return{
                ...prevState,
                message : value
            }
        } )
    }

    onSendClicked = () => {
        const message = this.state.message;
        const socket = this.state.socket;
        if(message && socket){
            const sendMessage = {
                message : message,
                tripId : this.state.tripId,
            }
            socket.emit('chatroomMessage',sendMessage);
            console.log(message,'sent');
            this.setState((prevState)=>{
                return{
                    ...prevState,
                    message : ''
                }
            })
        }
    }
    
    onNewMessageRecieved = ({message,name,userId}) => {
        const messageobj = {message,name,userId};
        console.log(message,'recieved');
        this.setState((prevState) => {
            return{
                ...prevState,
                messages : [...prevState.messages,messageobj]
            }
        })
    }

   

    render(){
        return (
            <Chat 
             message={this.state.message}
             messages={this.state.messages}
             onMessageChange = {this.onMessageChange}
             onSendClicked={this.onSendClicked}/>
        );
    }
}



export default ChatRoom;