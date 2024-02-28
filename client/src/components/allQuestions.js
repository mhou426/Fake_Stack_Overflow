//import Model from '../models/model.js';
import React from 'react';
import axios from 'axios'
import EditPage from './editPage';

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

//const model = new Model();


class Questions extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      qid:'',
      title:'',
      text:'',
      tagIds:'',
      askedBy:'',
      askDate:'',
      ansIds:'',
      views:'',
      tags: this.props.tags,
      question: this.props.question,
      edit:false
      
    };
    //this.model = model;
    this.makeTitleClickable = this.makeTitleClickable.bind(this);
    this.handledelete = this.handledelete.bind(this);
    this.delete = this.delete.bind(this)
    this.handleedit = this.handleedit.bind(this);
  }



makeTitleClickable(question){
  this.props.setCurQuestion(question);
  question.views += 1;
  this.props.goAnswer();
}

 handleedit(){
  this.setState({edit:true});
}

async handledelete(){
  await this.delete(this.state.question);
}

async delete(question) {
  
  try {
    const res = await api.post('http://localhost:8000/delete', {question}, { withCredentials: true, cors: true });
    const data = res.data;
    console.log(data);
    this.props.updateState(1)
    this.props.updateState(10)
    return data;
  } catch (error) {
    console.error('Error deleting question:', error);
  }
}
render(){
  
  const tags = this.props.tags;
  if(this.state.edit){
    return(
      <EditPage question = {this.state.question} tags = {this.props.tags}/>
    );
  }
  return(
    
    <div>
      
      
        <div className="question">
      <div className = "p1">
      <h4 className="number_answers" >{this.props.question.answers ? this.props.question.answers.length : 0} answers</h4>
        <h4 className = "views"> {this.props.question.views} views</h4>
      </div>
  
      <div className="p2">
        <h1 className = "title" onClick = {() => this.makeTitleClickable(this.props.question)}>
          {this.props.question.title}
        </h1>
        <br/>
        <div className="tags">
          {TagsComponent(this.props.question,tags)}
        </div>
      </div>
      <div className="p3">
      {this.props.edit && 
        <div><button id='edit' onClick={this.handleedit}>edit</button>
        <button id='delete'onClick={this.handledelete}>delete</button></div>}
        
        <p className="ask">{this.props.question.asked_by} asked </p>
        <p className="date"> at {formatQuestionTime(this.props.question.ask_date_time)}</p>
      
      </div>

      <div></div>
    </div>
    
  </div>
  );
}
  
}
export default Questions;


function TagsComponent( question, tags ) {
  const arr = [];

  const question_tags = question.tags;
 //console.log(question_tags.length)
  for(let i = 0; i < question_tags.length;i++){
    for(let j = 0; j < tags.length;j++){

      if (question_tags[i] === tags[j]._id){
        arr.push(tags[j].name);

      }
    }
  }

  const tagButtons = arr.map((tagName, index) => (
    <button key={index}>{tagName}</button>
  ));
  return(
    <div>
      {tagButtons}
    </div>
  )
}

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