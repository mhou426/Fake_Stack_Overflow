import React from 'react';
import axios from 'axios'
import Fakeso from './fakestackoverflow.js'
const api = axios.create({
  baseURL: 'http://localhost:3000'
})

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            login:false
        };
    }

    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    async checklogin(username,password){
        try {
            console.log(username);
            console.log(password);
            const res = await api.post('http://localhost:8000/login',{username,password},{withCredentials:true,cors: true});
            const data = res.data; 
            if(data === 1){
                console.log('login success');
                alert(`welcome back ${this.state.username}`);
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
    handleClick = async (event) => {
        event.preventDefault();
        console.log('button click');
        await this.checklogin(this.state.username,this.state.password);
        console.log(this.state.login);
    };

    render() {
        if(this.state.login === false){
            return (
                <>
                    <div className="header">
                     <h1 id="header">Fake Stack Overflow</h1>
                    </div>
                    <form className='form'>
                        <label>Username:</label>
                        <br />
                        <input type="text" name="username" value={this.state.username} onChange={this.handleChange} />
                        <br />
                        <label>Password:</label>
                        <br />
                        
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                        <br />
                        
                        
                        <button className='login_button' onClick={this.handleClick}>
                            Login
                        </button>
                    </form>
                </>
            );
        }
        else{
            return(<Fakeso login ={this.state.login}setDefault = {this.props.setDefault} user={this.state.username}/>);
        }
        
    }
}

export default Login;