import React from 'react';
import classes from './Chat.module.css';
const chat = props => {

    const id = sessionStorage.getItem('userId');
    const Chatitems = props.messages.map(message => {
        const isme = id == message.userId
        return (<li style={{alignSelf: isme  ? 'flex-end' : 'flex-start'}}>
            {!isme ? <strong>{message.name}</strong> : null}
            {message.message}</li>)
    })



    return (
        <div className={classes['chat-box']}>
            <ul className={classes['chat-box__messages']}>
                {Chatitems}
            </ul>
            <div className={classes['chat-box__actions']}>
                <input type="text" onChange={props.onMessageChange} value={props.message} placeholder='Type Your Message Here' />
                <button onClick={props.onSendClicked}>Send</button>
            </div>
        </div>
    )
}

export default chat;

// 