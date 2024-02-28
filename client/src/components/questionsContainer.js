import React, { Component } from 'react';
import Questions from './allQuestions.js';

class questionsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      questionsPerPage: this.props.question_num
    };
  }

  paginate = (pageNumber) => {
    this.setState({ currentPage: pageNumber });
  }

  render() {
    const { questionsPerPage, currentPage } = this.state;
    const indexOfLastQuestion = currentPage * questionsPerPage;
    const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
    const currentQuestions = Array.isArray(this.props.questions)
    ? this.props.questions.slice(indexOfFirstQuestion, indexOfLastQuestion)
    : [];
    const totalPages = Math.ceil(this.props.questions.length / questionsPerPage);

    return (
      <div>
        {currentQuestions.map((question, index) => (
          <Questions updateState = {this.props.updateState} handle = {this.props.handleAnswer} question={question}  tags = {this.props.tags}
          setCurQuestion = {this.props.setCurQuestion} goAnswer = {this.props.goAnswer} key={index}  edit = {this.props.edit}/>
        ))}
        <div className="pagination">
          <button onClick={() => this.paginate(1)} disabled={currentPage === 1}>
            First
          </button>
          <button onClick={() => this.paginate(currentPage - 1)} disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => this.paginate(currentPage + 1)} disabled={currentPage === totalPages}>
            Next
          </button>
          <button onClick={() => this.paginate(totalPages)} disabled={currentPage === totalPages}>
            Last
          </button>
        </div>
      </div>
    );
  }
}

export default questionsContainer;
