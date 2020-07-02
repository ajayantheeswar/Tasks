import React, { Component } from 'react'
import { connect } from 'react-redux'
import AuthForm from './AuthForm/AuthForm';
import * as actions from '../../store/actions/index';

class Auth extends Component{
    state = {
        signUp : false,
        name :'',
        email : '',
        password : '',
        isAdmin : false
    }

    onToggle = ()=>{
        this.setState((prevState)=>{
            return {
                signUp : !prevState.signUp
            };
        });
    }

    onFormDataChange = (event,identifier) =>{
        event.persist();
        console.log(event);
        this.setState( (prevState) => {
            const UpdatedState = {...prevState};
            UpdatedState[identifier] = event.target.value;
            return UpdatedState;
        });
    }

    onCheckBoxChange = () => {
        this.setState((prevState)=>{
            const UpdatedState = {...prevState};
            UpdatedState['isAdmin'] = ! prevState.isAdmin;
            return UpdatedState;
        });
    }

    onAction = ()=>{
        this.props.onAction(this.state.signUp,this.state.isAdmin,{name:this.state.name,email:this.state.email,password:this.state.password});
    }

    render(){
        return  (
            <AuthForm 
                onChange={this.onFormDataChange}
                checked={this.state.isAdmin}
                onChecked ={this.onCheckBoxChange}
                onActionClick={this.onAction}
                signUp={this.state.signUp}
                error={this.props.error}
                toggle={this.onToggle}  />
        )
    }
}

const mapStateToProps = state => {
    return {
        authState : false,
        loading : state.auth.loading,
        error : state.auth.error
    }
}

const mapDispatchToProps = dispatch =>{
    return {
        onAction : (isSignUp,isAdmin,authDetails) => dispatch(actions.StartAuthAsync(isSignUp,isAdmin,authDetails))
    }
}

export default connect(mapStateToProps,mapDispatchToProps)(Auth);