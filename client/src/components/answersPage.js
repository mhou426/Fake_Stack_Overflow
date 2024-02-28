//import Model from '../models/model.js';
import React from 'react';
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

//const model = new Model();

class AnswersPage extends React.Component{
  constructor(props){
      super(props);
      this.state = {
          // currentQuestion: this.props.newQuestion,
          // title: this.props.newQuestion.title,
          // text: this.props.newQuestion.text, 
          // askedBy: this.props.newQuestion.asked_by,
          // askDate: this.props.newQuestion.ask_date_time,
          // ansIds: this.props.newQuestion.answers, // answer object ids
          // tagsIds: this.props.newQuestion.tags,
          // commentsIds: this.props.newQuestion.comments,
          // votes: this.props.newQuestion.votes,
          // views: this.props.newQuestion.views,
          // num_ans: this.props.newQuestion.answers.length,
          link_index: 0,
          index: 0,
          alltheanswers: [],
          alltheComments: [],
          alltheTags: [],
          comment_text_q: '',
          comment_text_a: {},
          each_a_vote: this.props.answer.votes,
          username: this.props.username
      };
      //this.model = model;
      this.initialize = this.initialize.bind(this);
      this.goPostAnswer = this.goPostAnswer.bind(this);
      this.applyWebSide = this.applyWebSide.bind(this);
      this.brainPower = this.brainPower.bind(this);
      this.handleInputChangeQ = this.handleInputChangeQ.bind(this);
      this.handleInputChangeA = this.handleInputChangeA.bind(this);
      this.getfCommentsforA = this.getfCommentsforA.bind(this);
      //this.handleEnterKeyQ = this.handleEnterKeyQ.bind(this);
      //this.enterPressedQ = this.enterPressedQ.bind(this);
      this.getAnswers = this.getAnswers.bind(this);
      this.getQuestions = this.getQuestions.bind(this);
      this.getTags = this.getTags.bind(this);
      this.getComments = this.getComments.bind(this);
      //this.handleClick = this.handleClick.bind(this);
      this.handleUpvoteQClick = this.handleUpvoteQClick.bind(this);
    }

    async componentDidMount() {
      await this.initialize();
    }

    async initialize(){
      try {
        const allQuestions = await this.getQuestions();
        const allAnswers = await this.getAnswers();
        const allComments = await this.getComments();
        const allTags = await this.getTags();
    
        // Get the updated question
        const updatedQuestion = allQuestions.find((question) => question._id === this.props.newQuestion._id);
        
        
        //  Update the state with new answers and comments
          this.setState({
            currentQuestion : updatedQuestion,
            alltheanswers: allAnswers, // get all answers including the new ones
            ansIds: updatedQuestion.answers,
            alltheComments: allComments,
            commentsIds: updatedQuestion.comments,
            alltheTags : allTags,
            votes : updatedQuestion.votes,
            username: this.props.username
          });
      } catch (error) {
        console.error('Error initializing data:', error);
      }
    }

    async getQuestions() {
      try {
        const res = await api.get('http://localhost:8000/questions');
        const data = res.data; 
        console.log(data);
        return data;
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    }

    async getAnswers(){
      try {
        const res = await api.get('http://localhost:8000/answers');
        const data = res.data; 
        return data;
      } catch (error) {
        console.error('Error fetching Answers:', error);
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

    async getComments() {
      try {
        const res = await api.get('http://localhost:8000/comments');
        const data = res.data; 
        return data;
      } catch (error) {
        console.error('Error fetching Comments:', error);
      }
    }

    goPostAnswer(){
      this.props.goPost();
    }

    handleInputChangeQ (e) {
      console.log('Handling input change:', e.target.value);
      this.setState({ comment_text_q: e.target.value });
      // const { name, value } = e.target;
      // this.setState({ [name]: value });
    }

    handleInputChangeA (e, aid) {
      console.log('Handling input change:', e.target.value);
      const { name, value } = e.target;
      this.setState((prevState) => ({
        comment_text_a: {
          ...prevState.comment_text_a,
          [aid]: value,
        },
      }));
    }

    applyWebSide(question){
        const regex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/;
        var output = [];
        if(question.hyper === 1){
          for(let i = 0;i<question.hyperLinks.length;i++){
            const parts = question.text.split(regex);
            for(let j = 0; j < parts.length;j++){
              if(parts[j] === question.hyperText[i]){
                output.push('hyperlink**');
                i++;
                j++;
              }
              else{
                output.push(parts[j]);
              }
            }
          }
          return output;
        }else{
            const parts = question.text.split(regex);
          return parts;
        }
      }
    
    returnText(output,index){
        if(output!=='hyperlink**'){
          return(
            <span key = {index}>
              {output}
            </span>
          );
        }
        else{
          
          var link_index = this.state.link_index++;
          return(
            <a key={`a-${link_index}`} href = {this.state.currentQuestion.hyperLinks[link_index]}>
              {this.state.currentQuestion.hyperText[link_index]}
            </a>
          );
        }
    }
    
    brainPower(answer_text) {
      const regex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g; // Note the 'g' flag for global matching
      const matches = [...answer_text.matchAll(regex)];
    
      if (matches.length > 0) {
        let lastIndex = 0;
        const elements = [];
    
        matches.forEach((match) => {
          const [fullMatch, hypertext, url] = match;
          const front_text = answer_text.slice(lastIndex, match.index);
          lastIndex = match.index + fullMatch.length;
    
          // Push the non-hyperlink text
          if (front_text) {
            elements.push(<span key={lastIndex}>{front_text}</span>);
          }
    
          // Push the hyperlink
          elements.push(
            <a href={url} key={lastIndex + 1}>
              {hypertext}
            </a>
          );
        });
    
        // Add any remaining text after the last hyperlink
        if (lastIndex < answer_text.length) {
          elements.push(
            <span key={lastIndex + 2}>
              {answer_text.slice(lastIndex)}
            </span>
          );
    
          return <>{elements}</>;
        }
      } else {
        return (
          <span>
            {answer_text}
          </span>
        );
      }
    }

    // componentDidUpdate is called after the component updates
    // componentDidUpdate(prevProps, prevState) {
    //   // You can compare previous state and props with current state and props
    //   if (prevState.count !== this.state.count) {
    //     console.log('Count has changed:', this.state.count);
    //   }
    // }

    // handleClick = () => {
    //   // This will trigger a re-render and componentDidUpdate
    //   this.setState((prevState) => ({ count: prevState.count + 1 }));
    // };
      
    // resetallAnswers = async () => {
    //   try {
    //     const allAnswers = await this.getAnswers();
        
    //     //  Update the state with new answers
    //       this.setState({
    //         alltheanswers: allAnswers,
    //       });
    //   } catch (error) {
    //     console.error('Error initializing data:', error);
    //   }
    // }

    //QUESTION VOTE UPDATE FUNCTIONS
    async incrementVoteforQ(qid){
      try {
        const res = await api.put(`http://localhost:8000/questions/upvote/${qid}`);
        const data = res.data; 
        console.log(data);
        return data;
      } catch (error) {
        console.error('Error increasing question vote:', error);
      }
    }

    async handleUpvoteQClick() {
      await this.incrementVoteforQ(this.state.currentQuestion._id);
      await this.initialize();
    }

    async decrementVoteforQ(qid){
      try {
        const res = await api.put(`http://localhost:8000/questions/downvote/${qid}`);
        const data = res.data; 
        console.log(data);
        return data;
      } catch (error) {
        console.error('Error decreasing question vote:', error);
      }
    }

    async handleDownvoteQClick() {
      if(this.state.votes !== 0){
        await this.decrementVoteforQ(this.state.currentQuestion._id);
      }
      await this.initialize();
    }

    //COMMENT VOTE UPDATE FUNCTIONS
    async increVoteforC(cid){
      try {
        const res = await api.put(`http://localhost:8000/comments/upvote/${cid}`);
        const data = res.data; 
        console.log(data);
        return data;
      } catch (error) {
        console.error('Error increasing comment vote:', error);
      }
    }

    async handleUpvoteCClick(cid){
      await this.increVoteforC(cid);
      await this.initialize();
    }

    //ANSWER VOTE UPDATE FUNCTIONS
    async incrementVoteforA(aid){
      try {
        const res = await api.put(`http://localhost:8000/answers/upvote/${aid}`);
        await this.initialize();
        const data = res.data; 
        console.log(data);
        return data;
      } catch (error) {
        console.error('Error increasing answer vote:', error);
      }
    }

    async handleUpvoteAClick(aid) {
      await this.incrementVoteforA(aid);
      this.setState({each_a_vote: this.state.each_a_vote + 1});
      await this.initialize();
    }

    async decrementVoteforA(aid){
      try {
        const res = await api.put(`http://localhost:8000/answers/downvote/${aid}`);
        await this.initialize();
        const data = res.data; 
        console.log(data);
        return data;
      } catch (error) {
        console.error('Error decreasing answer vote:', error);
      }
    }

    async handleDownvoteAClick(answer) {
      if(answer.votes !== 0){
        await this.decrementVoteforA(answer._id);
        this.setState({each_a_vote: this.state.each_a_vote - 1});
      }
      await this.initialize();
    }

    getfCommentsforA(answer){
      const cIds_for_a = answer.comments;
      console.log(cIds_for_a);
      const comments = this.state.alltheComments.sort((a, b) => b.comment_date_time - a.comment_date_time);
      let filteredAComments = [];
      if(cIds_for_a && cIds_for_a.length > 0){
        filteredAComments = comments.filter((comment) => cIds_for_a.includes(comment._id));
      }
      console.log('facomments:', filteredAComments);
      return filteredAComments;
    }

    handleEnterKeyQ = async (e) => {
      console.log('Key pressed Q:', e.key);
      if (e.key === 'Enter') {
        await this.ePressedQ();
      }
    }

    async postNewQComment(question, text){
      try{
          console.log(text);
          const response = await api.post('http://127.0.0.1:8000/comments/question', {question, text});
      }
      catch (error) {
      console.error('Error in posing new comment for question:', error);
      }
    }

    async ePressedQ(){
      console.log('ePressedQ called');
      const cQuestion = this.state.currentQuestion;
      const cText = this.state.comment_text_q;
      await this.postNewQComment(cQuestion, cText);

      this.props.updateComments();
      this.setState({ comment_text_q: '' });
      await this.initialize();
    }

    handleEnterKeyA = async (e, answer) => {
      console.log('Key pressed A:', e.key);
      if (e.key === 'Enter') {
        await this.ePressedA(answer);
      }
    }

    async postNewAComment(answer, text, c_by){
      try{
          console.log("postingNEWAcomment!",text);
          const response = await api.post('http://127.0.0.1:8000/comments/answer', 
          {answer, text, c_by},{withCredentials:true, cors: true, credentials: 'include'});
      }
      catch (error) {
      console.error('Error in posing new comment for answer:', error);
      }
    }

    async ePressedA(answer){
      console.log('ePressedA called', this.state.username);
      const cAnswer = answer;
      const cText = this.state.comment_text_a[answer._id] || '';
      const c_by = this.state.username;
      await this.postNewAComment(cAnswer, cText, c_by);

      this.setState((prevState) => ({
        comment_text_a:{...prevState.comment_text_a, 
        [answer._id]: '',
        },
      }));
      this.props.updateComments();
      await this.initialize();
    }

    render(){
      const answersIds = this.state.ansIds;
      const answers = this.state.alltheanswers.sort((a, b) => b.ans_date_time - a.ans_date_time);
      let filteredAnswers = null;
      if(answersIds && answersIds.length > 0){
        filteredAnswers = answers.filter((answer) => answersIds.includes(answer._id));
      }
      if (filteredAnswers) {
        filteredAnswers = filteredAnswers.sort((a, b) => b.ans_date_time - a.ans_date_time);
      }
      console.log('fA:',filteredAnswers);
      const tIds = this.state.tagsIds;
      const tags = this.state.alltheTags;
      let filteredTags = null;
      if(tIds && tIds.length > 0){
        filteredTags = tags.filter((tag) => tIds.includes(tag._id));
      }
      console.log('fTags:', filteredTags);
      const cIds_for_q = this.state.commentsIds;
      const comments = this.state.alltheComments.sort((a, b) => b.comment_date_time - a.comment_date_time);
      let filteredQComments = null;
      if(cIds_for_q && cIds_for_q.length > 0){
        filteredQComments = comments.filter((comment) => cIds_for_q.includes(comment._id));
        filteredQComments = filteredQComments.sort((a, b) => b.comment_date_time - a.comment_date_time);
      }
      console.log('fqcomments:',filteredQComments);
      console.log(this.props.answer.votes)
      //const text_arr = this.applyWebSide(this.state.currentQuestion);
      //const display = text_arr.map((text,index)=>(this.returnText(text,index)))
        
      return (
          <>

          <div>
                <div className = "wholeOneAnswer">
                  <div className='oneAnswer'>
                    <div className='vote'>
                      <button id = "upvote" onClick={() => this.handleUpvoteAClick(this.props.answer._id)}></button>
                      <button id = "downvote" onClick={() => this.handleDownvoteAClick(this.props.answer)}></button>
                      <h2 id = "numOfVotes"> {this.state.each_a_vote} votes</h2>
                    </div>
                    <div className = "answerBody">
                        <p>{this.brainPower(this.props.answer.text)}</p>
                    </div>
      
                    <div className="userInfo">
                    <p id="answer">{this.props.answer.ans_by} answered </p>
                    <p id="date"> {formatQuestionTime(this.props.answer.ans_date_time)}</p>
                    </div>
                  </div>
                  <div></div>

                  <div className='oneAnswer_part2'>
                    <div className='comments'>
                      <div className='comment_input'>
                        <h3 id = "Comment">Comment:</h3>
                        <textarea id="comment_input" name="comment_text_a" value={this.state.comment_text_a[this.props.answer._id] || ''}
                        onChange={(e) => this.handleInputChangeA(e, this.props.answer._id)} onKeyPress={(e) => this.handleEnterKeyA(e, this.props.answer)}></textarea>
                        <div id = 'comment_error' className = 'error_msg_c'></div>
                      </div>

                      <div className='comments_display'>
                        {this.getfCommentsforA(this.props.answer).map((comment, index)=>(
                          <div className = "oneComment" key={index}>
                              <div className = "C_vote_text">
                                <button id = "upvote" onClick={() => this.handleUpvoteCClick(comment._id)}></button>
                                <h2 id = "numOfVotes"> {comment.votes} votes</h2>
                                <p>{comment.text}</p>
                              </div>
                
                              <div className="userInfo">
                                <p id="answer">{comment.comment_by} commented </p>
                                <p id="date"> {formatQuestionTime(comment.comment_date_time)}</p>
                              </div>
                              <div></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
          </div>
          
          </>
      );
    }
  
}export default AnswersPage;

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