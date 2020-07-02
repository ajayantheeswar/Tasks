import React from 'react';
import classes from './AuthForm.module.css';

const AuthForm = props => (
    <div className={classes['Auth-form']}>
        <h2>{props.signUp ? 'Sign Up' : 'Sign In'}</h2>
        <input type="email" onChange={(event) => props.onChange(event,'email')} placeholder="Email" />
        {props.signUp ? <input type="text" onChange={(event) => props.onChange(event,'name')} placeholder="Name" /> : null}
        <input type="Password" onChange={(event) => props.onChange(event,'password')} placeholder="Password" />
        <span className={classes['admin-checkbox']}>
            <input type="checkbox" name="As Admin" defaultChecked={props.checked} onChange={props.onChecked} />
            <p>As Admin</p>
        </span>
        
        <button onClick={props.onActionClick}>{props.signUp ? 'Sign Up' : 'Sign In'}</button>
        {props.error ? <p className={classes['error']}>{props.error}</p> : null}
        <p onClick={props.toggle}>{props.signUp ? 'Already Have An Account ?' : 'New Here , Click me To Signup'}</p>
    </div>
);

export default AuthForm;