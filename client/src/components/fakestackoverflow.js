//import Model from '../models/model.js';
import LeftMenu from './leftMenu.js'
import Homepage from './homepage.js'
import WelcomePage from './welcome.js'
import React from 'react';
import Search from './searching.js'
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})


class FakeStackOverflow extends React.Component {
  constructor(props){

    super(props);
    this.state ={
      page:1,
      questions:[],
      answers:[],
      tags:[],
      comment:[],
      active:null,
      unanswer:[],
      searching: [],
      login: this.props.login,
      logout_but:0
    }
    
    this.tagCount = this.tagCount.bind(this);
    this.updateTagCount = this.updateTagCount.bind(this);
    this.updateState = this.updateState.bind(this);
    this.updateQuestions = this.updateQuestions.bind(this);
    this.updateAnswers = this.updateAnswers.bind(this);
    this.updateTags = this.updateTags.bind(this);
    this.updateSearching = this.updateSearching.bind(this);
    this.searchByTags = this.searchByTags.bind(this);
    this.checkHyperLink = this.checkHyperLink.bind(this);
    this.updateComments = this.updateComments.bind(this);
    this.logout = this.logout.bind(this);
    this.initializeData = this.initializeData.bind(this);
    this.update = this.update.bind(this);
    this.getQuestions = this.getQuestions.bind(this);
    this.updateCount = this.update.bind(this)
  }
  async componentDidMount() {
    await this.initializeData();
  }

  async waitForDelay(milliseconds) {
    await new Promise(resolve => setTimeout(resolve, milliseconds));
    // Code to run after the delay
  }
  
  async initializeData(){
    await this.updateQuestions();
    await this.updateAnswers();
    await this.updateTags();
    //await this.updateComment();
    await this.tagCount();
    await this.updateTags();
    //await this.update();
  }
  async getComments() {
    try {
      const res = await api.get('http://localhost:8000/comments');
      const data = res.data; 
      return data;
    } catch (error) {
      console.error('Error fetching Comments:', error);
    }
  }
  async updateComments(){
    const comments = await this.getComments();
    this.setState({comments:comments});
  }
  async getQuestions() {
    try {
      const res = await api.get('http://localhost:8000/questions');
      const data = res.data; 
      //console.log(data)
      return data;
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  }

  async getTags() {
    try {
      const res = await api.get('http://localhost:8000/tags');
      const data = res.data; 
      return data;
    } catch (error) {
      console.error('Error fetching Tags:', error);
    }
  }

  async getAnswers() {
    try {
      const res = await api.get('http://localhost:8000/answers');
      const data = res.data; 
      return data;
    } catch (error) {
      console.error('Error fetching Answers:', error);
    }
  }
  async tagCount(){
    const questions = this.state.questions;
    //console.log(questions[0].tags)
    const tags = this.state.tags;
    for(let i = 0; i < tags.length; i++){
      let count = 0;
      let tag = tags[i];
      //console.log(tag)
      for(let j = 0; j < questions.length; j++){
        let curQuestion = questions[j];
        
        for(let k = 0; k < curQuestion.tags.length; k++){
          //console.log(curQuestion.tags[0])
          if(curQuestion.tags[k] === tag._id){
            count++;
          }
        }
        
      }
      console.log(count)
      if(count !==0){
        await this.updateTagCount(tag._id,count);
      }
      
    }
  }
  async updateTagCount(tagId,count) {
    try {
      const res = await api.put(`http://localhost:8000/tags/${tagId}`,{count},{withCredentials:true,cors: true});
      const data = res.data;
      console.log(data); 
    } catch (error) {
      console.error('Error updating tag count:', error);
    }
  }

  async update() {
    await this.updateQuestions();
    await this.updateAnswers();
    await this.updateTags();
    await this.tagCount(); 
    await this.updateTags();
  };

  async updateState(newState){
    this.setState({page:newState});
    if(newState === 1 || newState ===3){
      await this.initializeData();
    }
    
  }
  /*
  updateQuestions(updatedQuestions){
    this.setState({ questions: updatedQuestions });
  }*/
  async updateQuestions(){
    const questions = await this.getQuestions();
    this.setState({questions:questions});
  }
  async updateAnswers(){
    const answers = await this.getAnswers();
    this.setState({answers:answers});
    console.log('ANSWER')
    console.log(this.state.answers)
  }

  async updateTags(){
    const tags = await this.getTags();
    this.setState({tags:tags});
  }

  updateSearching(updateSearch){
    this.setState({searching:updateSearch});
  }

  searchByTags(tag){
    console.log(tag)
    var search_arr = [];
    var tag_arr = [tag];
    this.state.questions.forEach(question => {
      if(this.check_exist_byTag(question,tag_arr) === true){
        search_arr.push(question);
      }
    });
    this.setState({page:7, searching: search_arr});
  }

  check_exist_byTag(question,tag_search){
    //const tags = this.state.tags;
    const tag_arr = question.tags;
    //var tag_in_ids = [];

    for(let i = 0; i<tag_search.length;i++){
      
      for(let j = 0;j<tag_arr.length;j++){
        
        if(tag_search[i]._id === tag_arr[j]){
          return true;
        }
      }
    }
    return false;
  }

  
  checkHyperLink(){
    const questions = this.state.questions;
    for (const question of questions) {
      question.hyper = 0; // 0 stand for error, 1 stand for true, 2 stand for incorrect format
      question.hyperText = [];
      question.hyperLinks = [];
    }
    const regex = /\[([^\]]+)\]\(([^\s]+)\)/g;
    
    for (const question of questions) {
      const matches = question.text.match(regex);
      if(matches){
        for (const match of matches) {
          
          const [,linkText, url] = match.match(/\[([^\]]+)\]\(([^]+)\)/);
          
          if (url.startsWith('http://') === false && url.startsWith('https://') === false) {
            alert('Hyperlink URL must start with "http://" or "https://"');
            return;
        }
        question.hyper = 1;
        question.hyperLinks.push(url);
        question.hyperText.push(linkText);
        }
      }
    }
    
  }
  
  async logout() {
    try {
      const res = await api.post(`http://localhost:8000/logout`,{},{
        withCredentials: true,
        credentials: "include",
      });
      const data = res.data;
      console.log(data);
      this.props.setDefault();
      window.location.href = '/';
      
    } catch (error) {
      console.error('Error on log out', error);
    }
  }
  
 

  

  render(){
    this.checkHyperLink();
    if(this.state.logout_but === 1){
      
    }
    //console.log(this.questions)
    else{
      return (
        <>
          <div className="header">
              <h1 id="header">Fake Stack Overflow</h1>
              
              <Search searching = {this.state.searching} questions = {this.state.questions} tags = {this.state.tags} 
              updateState = {this.updateState} updateSearching = {this.updateSearching}/>
              
          </div>
          <div id="main" className="main">
              <LeftMenu  login = {this.state.login}logout = {this.logout} updateState = {this.updateState}/>
              <Homepage newpage ={this.state.page} questions = {this.state.questions} answers = {this.state.answers} tags = {this.state.tags}
              updateState = {this.updateState} updateQuestions = {this.updateQuestions} updateAnswers = {this.updateAnswers}
              updateTags = {this.updateTags} searchByTag = {this.searchByTags} searching = {this.state.searching} user={this.props.user}
              updateComments = {this.updateComments} checkHyperLink = {this.checkHyperLink} api = {this.api} update = {this.update} login = {this.state.login} updateCount = {this.updateCount}/>
          </div>
          
        </>
      );
    }
    
  }
  
}

export default FakeStackOverflow;
