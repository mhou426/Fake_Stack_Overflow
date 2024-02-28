import React from 'react';
import SignupPage from './signupPage.js';
import LoginPage from './loginPage.js'
import Fakeso from './fakestackoverflow.js'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

class WelcomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: false,
            showSignupPage: false,
            showLoginPage:false,
            guest:false
        };
        this.guest = this.guest.bind(this);
        this.gotoSignupPage = this.gotoSignupPage.bind(this);
        this.gotoLoginPage = this.gotoLoginPage.bind(this);
        this.setDefault = this.setDefault.bind(this);
        this.checkSession = this.checkSession.bind(this);
        //this.getSession();
        
    }
    componentDidMount() {
        this.checkSession(); 
    }
    async checkSession(){
        try {
            const res = await api.get('http://localhost:8000/check-session', {withCredentials:true,cors: true});
            const data = res.data; 
            if(data === 1){
                console.log('there is current session')
              this.setState({guest:true,login: true});
            }
            else{
              console.log('there is NO current session')
              this.setState({login: false});
            }
            
          } catch (error) {
            console.error('Something wrong', error);
          }
    }
    async getSession() {
        try {
          const res = await api.get('http://localhost:8000/', {withCredentials:true,cors: true});
          const data = res.data; 
          if(data === 1){
            this.setState({login: true});
          }
          else{
            this.setState({login: false});
          }
          
        } catch (error) {
          console.error('Something wrong', error);
        }
      }
    gotoSignupPage = () => {
        this.setState({ showSignupPage: true });
    };

    gotoLoginPage = () =>{
        this.setState({ showLoginPage: true });
    };
    setDefault(){
        console.log('set to default')
        this.setState =
         ({
            login: false,
            showSignupPage: false,
            showLoginPage:false,
            guest:false
        });
    }
    guest(){
        this.setState({ showSignupPage: false,showLoginPage: false,guest: true });
    }
    render() {
        
        if (this.state.guest) {
            return <Fakeso login = {this.state.login} setDefault = {this.setDefault}/>;
        }
        else if (this.state.showSignupPage) {
            return <SignupPage sign ={this.gotoSignupPage} setDefault = {this.setDefault} guest = {this.guest}/>;
        }

        else if (this.state.showLoginPage) {
            return <LoginPage guest = {this.guest}setDefault = {this.setDefault} />;
        }
        else{
            return (
                <>
                <div className="header">
                    <h1 id="header">Fake Stack Overflow</h1>
                </div>
                    <div className="welcome_button">
                        <button className='signup_b'  onClick={this.gotoSignupPage }>Sign up</button>
                        <button className='login_b' onClick={this.gotoLoginPage}>Login</button>
                        <button className='guest_b'onClick={this.guest}>Login as Guest</button>
                    </div>
                </>
            );
        }
        
    }
}

export default WelcomePage;


/*

<LeftMenu  updateState = {this.updateState}/>
            <Homepage newpage ={this.state.page} questions = {this.state.questions} answers = {this.state.answers} tags = {this.state.tags}
            updateState = {this.updateState} updateQuestions = {this.updateQuestions} updateAnswers = {this.updateAnswers}
            updateTags = {this.updateTags} searchByTag = {this.searchByTags} searching = {this.state.searching}
            checkHyperLink = {this.checkHyperLink} api = {this.api} update = {this.update}/>
*/