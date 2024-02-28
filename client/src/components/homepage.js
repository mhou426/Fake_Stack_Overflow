import QuestionPage from './askQuestion.js'
import Questions from './questionsContainer.js'
import AnswersPage from './answersContainer.js'
import PostAnswer from './postNewAnswer.js'
import TagPage from './tagPage.js'
import React from 'react';
import Userprofile from './userProfile.js'

class Homepage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            page:this.props.newpage,
            questions:this.props.questions,
            tags:this.props.tags,
            newQuestion:null,//placeholder to use to store current question clicked
            active:null,
            unanswer:[],
            searching: this.props.searching,
            login:this.props.login
        }
        this.handleQuestionPage = this.handleQuestionPage.bind(this);
        this.handleAnswerPage = this.handleAnswerPage.bind(this);
        this.handleHomepage = this.handleHomepage.bind(this);
        this.handlePostAnswer = this.handlePostAnswer.bind(this);
        this.handleTagpage = this.handleTagpage.bind(this);
        this.setCurQuestion = this.setCurQuestion.bind(this);

        this.newest_order = this.newest_order.bind(this);
        this.active_order = this.active_order.bind(this);
        this.unanswer_order = this.unanswer_order.bind(this);
        this.newest_order = this.newest_order.bind(this);
        this.active_order = this.active_order.bind(this);
        this.unanswer_order = this.unanswer_order.bind(this);
    }

    
    componentDidUpdate(prevProps) {
        if (this.props.newpage !== prevProps.newpage) {
          this.setState({ page: this.props.newpage });
        }
        if (this.props.questions !== prevProps.questions) {
            this.setState({ questions: this.props.questions });
          }
          if (this.props.tags !== prevProps.tags) {
            this.setState({ tags: this.props.tags });
          }
      }
      
    newest_order(){
        this.setState({ questions: this.state.questions.sort((a, b) => b.askDate - a.askDate)});
        this.props.updateState(1);
      }

    active_order(){
        this.setState({active: []});
        var ans_num = [];
        const questions = this.state.questions;
        questions.forEach(question =>{
            if(question.answers.length === 0){
            let last_ans = {num: 0,
                ques:question};
            ans_num.push(last_ans);
            }
            else{
            let last_ans = {num: Number(question.answers[question.answers.length-1].substring(1)),
                        ques:question};
            ans_num.push(last_ans);
            }
        });
  
        ans_num.sort(function(a, b) {
            return b.num - a.num;
        });
        var act_ques = [];

        for(let i = 0; i < ans_num.length;i++){
            act_ques.push(ans_num[i].ques);
        }
        this.setState({active: act_ques});
        this.props.updateState(9);
    }

    unanswer_order(){
        const questions = this.state.questions;
        this.setState({unanswer:[]});
        var unanw_arr = [];
        questions.forEach(question => {
            if(question.answers.length === 0){
              unanw_arr.push(question);
            }
          });
        this.setState({unanswer:unanw_arr});
        this.props.updateState(8);
      }

    setCurQuestion = (question) =>{
        this.setState({newQuestion: question})//set the current question
    }

    handleHomepage(e){
        this.props.update();
        this.props.updateState(1);
    }

    handleQuestionPage(e) {
        this.props.update();
        this.props.updateState(2);
    }

    handleAnswerPage(e){
        this.props.update();
        this.props.updateState(4);
    }

    handlePostAnswer(e){
        this.props.update();
        this.props.updateState(5);
    }

    handleTagpage(e){
        this.props.update();
        this.props.updateState(3);
    }

    //no questions found page? 

    render(){
        const state = this.state.page;
        
        if (state === 1){ // QUESTIONS PAGE
            return (
                <>
                <div className="right" id="right">
                    
                        <div id="post_question"></div>
                        <div className="right_homepage" id="right_homepage">
                            <h1 className="line" id="homepage_header">
                                <span id="question_header">All Questions</span>
                                {this.state.login && 
                                <button id="ask_question" onClick={this.handleQuestionPage}>Ask Question</button>
                                }
                            </h1>
                            <div className="line">
                                <p>
                                    <span id="num_question">{this.state.questions.length}</span>
                                    <span> questions</span>
                                </p>
                                    <table border="1" className = "buttons">
                                        <tbody>
                                        <tr>
                                            <td><button className="select_button" id="newest" onClick ={this.newest_order}>Newest</button></td>
                                            <td><button className="select_button" id="active" onClick ={this.active_order}>Active</button></td>
                                            <td><button className="select_button" id="unanswered"onClick ={this.unanswer_order}>Unanswered</button></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                
                            </div>
        
                            <div style={{ borderBottom: "1px dotted black" }}></div>
                            <div id="questions-container"></div>
                            <div id="search_result"></div>
                        </div>
                        <Questions handle = {this.handleAnswer} questions={this.state.questions}  tags = {this.state.tags}
                        setCurQuestion = {this.setCurQuestion} goAnswer = {this.handleAnswerPage} question_num = {5} edit={false}
                        updateState = {this.props.updateState}/>
                </div>
                
                </>
                
            );
        }
        //QUESTIONS -> GO to Answer Page through title
        //          -> GO to Post New Question through button
        //- send placeholder to store the current question clicked
        
        else if(state === 2){ // POST NEW QUESTION
            return(
                <>
                <div className="right" id="right">
                    <QuestionPage updateCount = {this.props.updateCount}questions={this.state.questions}  tags = {this.state.tags} setPage = {this.handleHomepage} updateTags={this.props.updateTags}updateQuestions={this.props.updateQuestions}/>
                </div>
                </>
            );
        }
        //POST QUESTION PAGE -> GO to Questions through button

        else if(state === 4){ // STORE ALL ANSWERS WITH ITS QUESTION
            return(
                <>
                <div className="right" id="right">
                    <AnswersPage  updateComments = {this.props.updateComments}
                    login = {this.state.login} answers = {this.props.answers}  user={this.props.user}
                    setPage = {this.handleQuestionPage} newQuestion = {this.state.newQuestion} goPost = {this.handlePostAnswer}/>
                </div>
                </>
            )
        }
        //ANSWERS -> GO to Post Answer through button

        else if(state === 5){ // POST NEW ANSWER FOR A QUESTION
            return(
                <>
                <div className="right" id="right">
                    <PostAnswer goAnswer = {this.handleAnswerPage} answers = {this.props.answers} newQuestion = {this.state.newQuestion}/>
                </div>
                </>
            )
        }
        //POST ANSWER -> Go to Answers through button

        else if(state === 3){ // GO TO TAG PAGE
            return(
                <>
                <div className="right" id="right">
                    <TagPage setPage = {this.handleQuestionPage} searchByTag = {this.props.searchByTag}
                    questions={this.state.questions}  tags = {this.state.tags} api = {this.props.api} login = {this.login}/>
                </div>
                </>
            );
        }
        //TAG PAGE -> Go to Questions 2 (certain questions with that tag) through tag
        else if(state === 7){
            return (
                <>
                <div className="right" id="right">
                    
                        <div id="post_question"></div>
                        <div className="right_homepage" id="right_homepage">
                            <h1 className="line" id="homepage_header">
                                <span id="question_header">All Questions</span>
                                {this.state.login && 
                                <button id="ask_question" onClick={this.handleQuestionPage}>Ask Question</button>
                                }
                            </h1>
                            <div className="line">
                                <p>
                                    <span id="num_question">{this.props.searching.length}</span>
                                    <span> questions</span>
                                </p>
                                    <table border="1" className = "buttons">
                                        <tbody>
                                        <tr>
                                            <td><button className="select_button" id="newest" onClick ={this.newest_order}>Newest</button></td>
                                            <td><button className="select_button" id="active" onClick ={this.active_order}>Active</button></td>
                                            <td><button className="select_button" id="unanswered"onClick ={this.unanswer_order}>Unanswered</button></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                
                            </div>
        
                            <div style={{ borderBottom: "1px dotted black" }}></div>
                            <div id="questions-container"></div>
                            <div id="search_result"></div>
                        </div>
                        <Questions questions={this.props.searching}  setCurQuestion = {this.setCurQuestion} goAnswer = {this.handleAnswerPage}
                        tags = {this.state.tags}/>
                </div>
                
                </>
                
            );
        }
        else if(state === 8){
            return (
                <>
                <div className="right" id="right">
                    
                        <div id="post_question"></div>
                        <div className="right_homepage" id="right_homepage">
                            <h1 className="line" id="homepage_header">
                                <span id="question_header">All Questions</span>
                                {this.state.login && 
                                <button id="ask_question" onClick={this.handleQuestionPage}>Ask Question</button>
                                }
                            </h1>
                            <div className="line">
                                <p>
                                    <span id="num_question">{this.state.unanswer.length}</span>
                                    <span> questions</span>
                                </p>
                                    <table border="1" className = "buttons">
                                        <tbody>
                                        <tr>
                                            <td><button className="select_button" id="newest" onClick ={this.newest_order}>Newest</button></td>
                                            <td><button className="select_button" id="active" onClick ={this.active_order}>Active</button></td>
                                            <td><button className="select_button" id="unanswered"onClick ={this.unanswer_order}>Unanswered</button></td>
                                        </tr>
                                        </tbody>
                                    </table>
                                
                            </div>
        
                            <div style={{ borderBottom: "1px dotted black" }}></div>
                            <div id="questions-container"></div>
                            <div id="search_result"></div>
                        </div>
                        <Questions questions={this.state.unanswer} setCurQuestion = {this.setCurQuestion} goAnswer = {this.handleAnswerPage} tags = {this.state.tags}/>
                </div>
                
                </>
                
            );
        }
        else if(state === 9){
            return (
                <>
                <div className="right" id="right">
                    
                        <div id="post_question"></div>
                        <div className="right_homepage" id="right_homepage">
                            <h1 className="line" id="homepage_header">
                                <span id="question_header">All Questions</span>
                                {this.state.login && 
                                <button id="ask_question" onClick={this.handleQuestionPage}>Ask Question</button>
                                }
                            </h1>
                            <div className="line">
                                <p>
                                    <span id="num_question">{this.state.active.length}</span>
                                    <span> questions</span>
                                </p>
                                    <table border="1" className = "buttons">
                                        <tbody>
                                        <tr>
                                            <td><button className="select_button" id="newest" onClick ={this.newest_order}>Newest</button></td>
                                            <td><button className="select_button" id="active" onClick ={this.active_order}>Active</button></td>
                                            <td><button className="select_button" id="unanswered"onClick ={this.unanswer_order}>Unanswered</button></td>
                                        </tr>
                                        </tbody>
                                    </table>
                            </div>
        
                            <div style={{ borderBottom: "1px dotted black" }}></div>
                            <div id="questions-container"></div>
                            <div id="search_result"></div>
                        </div>
                        <Questions questions={this.state.active}  tags = {this.state.tags}
                        setCurQuestion = {this.setCurQuestion} goAnswer = {this.handleAnswerPage}/>
                </div>
                
                </>
                
            );
        }
        else if(state === 10){
            return(<>
                <div className="right" id="right">
                    <Userprofile handle = {this.handleAnswer} questions={this.state.questions}  tags = {this.state.tags}
                        setCurQuestion = {this.setCurQuestion} goAnswer = {this.handleAnswerPage} question_num = {3}
                        updateState = {this.props.updateState}/>
                </div>
            </>)
        }
    }   
}

export default Homepage;