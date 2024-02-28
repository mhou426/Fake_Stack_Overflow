//import Model from '../models/model.js';
import React from 'react';
import Questions from './questionsContainer.js'
import axios from 'axios'
const api = axios.create({
  baseURL: 'http://localhost:3000'
})



class Userprofile extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      user: '',
      time: null,
      credit:0,
      questions:[],
    };
    this.makeTitleClickable = this.makeTitleClickable.bind(this);
    this.getuser = this.getuser.bind(this);
    this.getRegTime = this.getRegTime.bind(this);
    this.getCredit = this.getCredit.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
  }

async componentDidMount() {
    await this.fetchUserData();
    this.timerID = setInterval(
        () => this.fetchUserData(),
        1000 // fetch new data every 60 seconds
    );
}

componentWillUnmount() {
    clearInterval(this.timerID);
}

fetchUserData = async () => {
    // Call your data fetching methods here
    await this.getuser(); 
    await this.getRegTime();
    await this.getCredit();
    await this.getQuestions();
    // etc.
};
async getuser(){
    const res = await api.get('http://localhost:8000/getuser',{withCredentials:true,cors: true});
    const data = res.data; 
    console.log(data)
    this.setState({user: data});
    return data;
}

async getRegTime(){
    const res = await api.get('http://localhost:8000/getusertime',{withCredentials:true,cors: true});
    const data = res.data; 
    console.log(data)
    this.setState({time: data});
    return data;
}
async getCredit(){
    const res = await api.get('http://localhost:8000/getusercredit',{withCredentials:true,cors: true});
    const data = res.data; 
    console.log(data)
    this.setState({credit: data});
    return data;
}
async getQuestions(){
    const res = await api.get('http://localhost:8000/getquestions',{withCredentials:true,cors: true});
    const data = res.data; 
    console.log(data)
    this.setState({questions: data});
    return data;
}

makeTitleClickable(question){
  this.props.setCurQuestion(question);
  question.views += 1;
  this.props.goAnswer();
}
render(){

  return(
    <>
    <div>
      <div id = 'user_name'>
        Hi, {this.state.user}
      </div>
      <div id = 'reg_time'>
        Registered {formatQuestionTime(this.state.time)}
        <div>Reputation: {this.state.credit}</div>
      </div>
      <h1 style={{ marginLeft: '10%', marginBottom: '0%'}}>
        Posted Questions:
      </h1>
        <div id = 'question_box' >
            <Questions handle = {this.props.handle} questions={this.state.questions}  tags = {this.props.tags}
                    setCurQuestion = {this.props.setCurQuestion} goAnswer = {this.props.goAnswer} question_num = {3} edit = {true}
                    updateState = {this.props.updateState}/>
        </div>
    
    </div>
    </>
    
  );
}
  
}
export default Userprofile;




function formatQuestionTime(questionDate) {
    const currentDate = new Date();
    const postDate = new Date(questionDate);
  
    const timeDifference = currentDate - postDate;
  
    // Convert milliseconds to seconds, minutes, or hours
    const secondsDifference = Math.floor(timeDifference / 1000);
    const minutesDifference = Math.floor(secondsDifference / 60);
    const hoursDifference = Math.floor(minutesDifference / 60);
  
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames[postDate.getMonth()];
    const date = postDate.getDate();
    const hour = postDate.getHours();
    const min = postDate.getMinutes();
    const str = `${month} ${date} at ${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
    const str2 = `${month} ${date}, ${postDate.getFullYear()} at ${hour.toString().padStart(2, '0')}:${min.toString().padStart(2, '0')}`;
  
    if (secondsDifference < 60) {
      return `${secondsDifference} second${secondsDifference !== 1 ? 's' : ''} ago`;
    } else if (minutesDifference < 60) {
      return `${minutesDifference} minute${minutesDifference !== 1 ? 's' : ''} ago`;
    } else if (hoursDifference < 24) {
      return `${hoursDifference} hour${hoursDifference !== 1 ? 's' : ''} ago`;
    } else if (currentDate.getFullYear() === postDate.getFullYear()) {
      return str;
    }else {
      // If more than 24 hours ago, you can display the full date or another format
      return str2;
    }
  }