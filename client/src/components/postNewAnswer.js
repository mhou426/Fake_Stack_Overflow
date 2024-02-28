//import { mongo } from 'mongoose';
//import Model from '../models/model.js';
import React from 'react';
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000'
})
//const model = new Model();

class PostAnswer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            text: '',
            username: '',
            ansDate: ''
        };
        //this.model = model;
        this.handleInputChange = this.handleInputChange.bind(this);
        this.displayNewAnswer = this.displayNewAnswer.bind(this);
        this.createNewAnswer = this.createNewAnswer.bind(this);
    }

    handleInputChange (e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
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

    async createNewAnswer(question, text, ans_by){
        try{
            console.log(text);
            const response = await api.post('http://127.0.0.1:8000/insertAnswer', {question, text, ans_by});
        
        //console.log(response.data.message); // Success message from the server
        }
        catch (error) {
        console.error('Error in posing new answer:', error);
        }
    }

    // async getBackNewAnswer(text) {
    //     try {
    //       const res = await api.get('`http://localhost:8000/one_answer?answer_text=${text}`', {text:text});
    //       const data = res.data; 
    //       return data;
    //     } catch (error) {
    //       console.error('Error fetching Answers:', error);
    //     }
    // }

    async displayNewAnswer () {
        const text = this.state.text;
        console.log(text);
        //const username = this.state.username;
        //document.getElementById('user_error').textContent = '';
        document.getElementById('question_error').textContent = '';
        var empty_input = 0;
        if (text.length === 0) {
            document.getElementById('question_error').textContent = 'Please enter the text';
            empty_input = 1;
        }
        // if (username.length === 0) {
        //     document.getElementById('user_error').textContent = 'Please enter the username';
        //     empty_input = 1;
        // }
        if(empty_input === 0){
            // const new_answer = {
            //     //aid:'a'+(this.props.answers.length+1),
            //     text:text,
            //     ansBy:username,
            //     ansDate: new Date(),
            // };       
            
            const new_answer = {
                text: text,
                ans_by: '',
                ans_date_time: new Date(),
            };
            this.props.answers.push(new_answer);
            //this.props.updateAnswers(answers);

            //create new data that populate and add on to the answer section of the database//
            // axios.post('http://localhost:3000/api/insertAnswer', new_answer)
            // .then(response => {
            // console.log(response.data.message); // Data inserted successfully
            // })
            // .catch(error => {
            //     console.error('Error:', error);
            // });
            // try {
            //     const response = await axios.post('http://localhost:3000/api/insertAnswer', new_answer);
            //     console.log(response.data.message); // Success message from the server
            //   } catch (error) {
            //     console.error('Error:', error);
            //   }
            console.log('Sending request to:', 'insertAnswer');

            await this.createNewAnswer(this.props.newQuestion, text);
            //find the generated object id of the last the new answer object that just got inserted 
            // const newAnswer_object = this.getBackNewAnswer(text);
            // console.log(newAnswer_object);
            // this.props.newQuestion.answers.push(newAnswer_object._id);
            //already added objectid to answer arrays and when answerspage request, it will get all updated answers 
            //console.log(this.props.newQuestion.answers);
            this.props.goAnswer();
        }
    }

    render(){
        return(
            <div>
                <h1 id = "answer_text">Answer Text*</h1>
                <textarea id="text_input" name = "text" value = {this.state.text} onChange={this.handleInputChange} required></textarea>
                <div id = 'question_error' className = 'error_msg'></div>

                <div className="submit_button">
                    <button id = "sumbit" onClick={() => this.displayNewAnswer()}> Post Answer</button>
                    <span id="remind_sumbit"> *indicates mandatory field</span>
                </div>
            </div>
        );
    }
          
}export default PostAnswer;