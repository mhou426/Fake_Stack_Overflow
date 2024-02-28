import React from 'react';
import Fakeso from './fakestackoverflow.js'
import axios from 'axios'
const api = axios.create({
  baseURL: 'http://localhost:3000'
})

class Signup extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            password: '',
            password_2: '',
            login:false
        };
    }

    async checksignup(email,username,password){
        try {
            console.log(username);
            console.log(password);
            const res = await api.post('http://localhost:8000/signup',{email,username,password},{withCredentials:true,cors: true});
            const data = res.data; 
            if(data === 1){
                console.log('Sign up success');
                alert(`welcome ${this.state.username}`);
                this.setState({login:true});
            }
            else{
                alert(`Unable to find your account, please double check your username and password`);
                this.setState({login:false});
            }
          } catch (error) {
            console.error('Something wrong', error);
          }
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    handleClick = async(event) => {
        event.preventDefault();
        console.log('button click');
        console.log('Email:', this.state.email);
        console.log('Username:', this.state.username);
        console.log('Password:', this.state.password);
        console.log('Password Again:', this.state.password_2);
    
        const email = this.state.email.split('@')
        if (this.state.username.length === 0) {
            alert('Username cannot be empty');
        }
        else if (this.state.email.length === 0) {
            alert('Email cannot be empty');
        }
        else if(this.state.password !== this.state.password_2){
            alert('The passwords must be match');
        }
        else if(this.state.password.includes(this.state.username) || this.state.password.includes(email[0])){
            alert('Your password cannot contain your username or email')
        }
        else {
            await this.checksignup(this.state.email,this.state.username,this.state.password);
        }
    };

    render() {
        if(this.state.login === false){
            return (
                <>
                    <div className="header">
                     <h1 id="header">Fake Stack Overflow</h1>
                    </div>
                    <form className='form'>
                        <label>Email:</label>
                        <br />
                        <input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                        <br />
                        <label>Username:</label>
                        <br />
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
                        <br />
                        <label>Password:</label>
                        <br />
                        {/* Change the type attribute to "password" */}
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                        <br />
                        <label>Enter your Password again:</label>
                        <br />
                        {/* Change the type attribute to "password" */}
                        <input type="password" name="password_2" value={this.state.password_2} onChange={this.handleChange} />
                        <br />
                        <button className='login_button' onClick={this.handleClick}>
                            Sign up
                        </button>
                    </form>
                </>
            );
        }
        else{
            return(<Fakeso login ={this.state.login}setDefault = {this.props.setDefault}/>);
        }
    }
}

export default Signup;
