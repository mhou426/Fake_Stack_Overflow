import React, { Component } from 'react'
//import Model from '../models/model.js'
import axios from 'axios'
//let model = new Model();

const api = axios.create({
    baseURL: 'http://localhost:3000'
  })
class EditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: this.props.question.title,
            detail: this.props.question.text,
            tags: '',
            username:this.props.question.asked_by
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.submit = this.submit.bind(this);
        this.checkHyperLinkPost = this.checkHyperLinkPost.bind(this);
        this.find_tags = this.find_tags.bind(this)
        this.editQuestions = this.editQuestions.bind(this)
        
        
        
    }

    componentDidMount() {
        this.find_tags(this.props.question.tags);
    }
    async newTag(name) {
        try {
          const res = await api.post('http://localhost:8000/tags',{name},{withCredentials:true,cors: true});
          const data = res.data; 
          console.log(data);
          return data;
        } catch (error) {
          console.error('Error posting new tag:', error);
        }
      }

    async editQuestions(title,text,tags,asked_by){
        try {
            console.log(`TITLE ${title}`);
            console.log(`TITLE ${text}`);
            console.log(`TITLE ${tags}`);
            const response = await api.put(`http://localhost:8000/questions/${this.props.question._id}`, {
                title,
                text,
                tags,
                asked_by,
              },{withCredentials:true,cors: true});
          
              console.log(response.data.message); 
          } catch (error) {
            console.error('Error posting new question:', error);
          }
    }

    
    handleInputChange (e) {
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    checkHyperLinkPost(question){
        const regex = /\[([^\]]+)\]\(([^\s]+)\)/g;
          const matches = question.text.match(regex);
          if(matches){
            for (const match of matches) {
              const [,, url] = match.match(/\[([^\]]+)\]\(([^]+)\)/);
              
              if (url.startsWith('http://') === false && url.startsWith('https://') === false) {
                
                return false;
            }
        }
          
        }
        return true;
        
      }
    async submit() {

        const questions = this.props.questions;
        const tags = this.props.tags;
        const title = this.state.title;
        const text = this.state.detail;
        const tags_element = this.state.tags;
        const username = this.state.username;
        var empty_input = 0;
        document.getElementById('title_error').textContent = '';
        document.getElementById('question_error').textContent = '';
        document.getElementById('tag_error').textContent = '';
        
        var tags_array = tags_element.split(' ');
        if (title.length > 100) {
            document.getElementById('title_error').textContent = 'Your title is too long';
            empty_input = 1;
        } 
        if (title.length === 0) {
            document.getElementById('title_error').textContent = 'Please enter the title';
            empty_input = 1;
        }
        if (text.length === 0) {
            document.getElementById('question_error').textContent = 'Please enter the text';
            empty_input = 1;
        }
        if (tags_element.length === 0) {
            document.getElementById('tag_error').textContent = 'Please enter the tags';
            empty_input = 1;
        }
        
        if(tags_array.length > 5){
            document.getElementById('tag_error').textContent = 'Too many tags';
            empty_input = 1;
        }
        tags_array.forEach(function(tag){
            if(tag.length >10){
              document.getElementById('tag_error').textContent = 'Tags should be less than 10 characters';
              empty_input = 1;
            }
          });
       if(empty_input === 0){
           
            var tids = [];
            for(let i = 0; i<tags_array.length;i++){
                for(let j = 0; j <tags.length;j++){
                
                    if(tags_array[i].toLowerCase() === tags[j].name.toLowerCase()){
                        //console.log(tags[j]._id)
                        tids.push(tags[j]._id);
                        break;
                    }
                    if(j===tags.length-1){
                      if(tags_array[i].length <= 10){
                        const new_tag = tags_array[i].toLowerCase();
                        tids.push(await this.newTag(new_tag));
                        
                        break;
                      }
                    }
                }
            }
            console.log(`tid${tids}`)
            const new_question = {
                
                title:title,
                text:text,
                tagIds: tids ,
                askedBy:username,
                askDate: Date.now(),
                ansIds: [],
                views:0,
            };
            
            if(this.checkHyperLinkPost(new_question)=== true){
                
                
                await this.editQuestions(title,text,tids,username);
                //window.location.href = '/';
                alert('edit success');
                
            }
            else{
                alert('Hyperlink URL must start with "http://" or "https://"');
            }
           
        }
    }

    async find_tags(tags){
        var tag_in_text = [];
        var output = '';
        for(let i = 0; i < tags.length;i++){
            for(let j = 0; j < this.props.tags.length;j++){
                if(tags[i] === this.props.tags[j]._id){
                    tag_in_text.push(this.props.tags[j].name);
                }
            }
        }
        for(let i = 0; i < tag_in_text.length;i++){
            output+= tag_in_text[i];
        }
        console.log(`OUTPUT ${output}`)
        this.setState({tags:output})
    }
    
    render() {
        
        
        return (
            <div>
                <h1 id="question_title">Question Title*</h1>
                <div id="title_limit">limit title to 100 characters or less</div>
                <textarea
                    id="title_input"
                    name="title"
                    value={this.state.title }
                    onChange={this.handleInputChange}
                ></textarea>
                <div id = 'title_error' className = 'error_msg'></div>

                <h1 id="question_title">Question Text*</h1>
                <div id="title_limit">add detail</div>
                <textarea
                    id="text_input"
                    name="detail"
                    value={this.state.detail}
                    onChange={this.handleInputChange}
                ></textarea>
                <div id = 'question_error' className = 'error_msg'></div>

                <h1 id="question_title">Tags*</h1>
                <div id="title_limit">add keywords separated by space</div>
                <textarea
                    id="tags_input"
                    name="tags"
                    value={this.state.tags}
                    onChange={this.handleInputChange}
                ></textarea>
                <div id = 'tag_error' className = 'error_msg'></div>

                

                

                <button id="sumbit" onClick={this.submit}>
                    Post question
                </button>
                <span id="remind_sumbit"> *indicates a mandatory field</span>
            </div>
        );
    }
}

export default EditPage;