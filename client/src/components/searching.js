import React from 'react';
import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:3000'
})

class Searching extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            searching:this.props.searching,
            input: null,
            search_results: '',
            alltheTags: []
        };
        const initialize = async () => {
            try {
                const allTags = await this.getTags();
                this.setState({
                    alltheTags : allTags
                  });
              } catch (error) {
                console.error('Error initializing data:', error);
              }
            }
      
            initialize();
        this.combineAndfilter = this.combineAndfilter.bind(this);
        this.enterPressed = this.enterPressed.bind(this);
        this.getTags = this.getTags.bind(this);
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

    handleInputChange = (e) => {
        this.setState({ input: e.target.value });
    }

    handleEnterKey = (e) => {
        if (e.key === 'Enter') {
          this.enterPressed();
        }
    }

    combineAndfilter(array1, array2){
        const common = array1.filter(element => array2.includes(element));
        const uniqueArray1 = array1.filter(element => !array2.includes(element));
        const uniqueArray2 = array2.filter(element => !array1.includes(element));
        
        return [...common, ...uniqueArray1, ...uniqueArray2];
    }

    enterPressed(){
        const inputString = this.state.input.toLowerCase();
        let matchedTags = [];
        let matchedQfromTags = [];
        if(inputString.includes("[") || inputString.includes("]")){
            const regex = /\[(.*?)\]/g;

            const matches = [...inputString.matchAll(regex)];

            const insideBrackets = [];
            let outsideBrackets = [];

            let lastIndex = 0;

            matches.forEach((match) => {
                const [fullMatch, content] = match;
                const startIndex = inputString.indexOf(fullMatch, lastIndex);
                const outsideContent = inputString.substring(lastIndex, startIndex);

                insideBrackets.push(content);
                outsideBrackets.push(outsideContent);

                lastIndex = startIndex + fullMatch.length;
            });

            // Get the content after the last match
            const remainingText = inputString.substring(lastIndex);

            outsideBrackets.push(remainingText);

            // Filter the array to remove empty strings
            outsideBrackets = outsideBrackets.filter((content) => content !== '');

            matchedTags = this.state.alltheTags.filter((tag) => insideBrackets.some((string) => tag.name === string));
            if(matchedTags !== null){
                matchedQfromTags = this.props.questions.filter((question) => matchedTags.some((tag) => question.tags.includes(tag._id)));
            }
            var new_result = this.props.questions.filter((question) => outsideBrackets.some((string) => question.title.toLowerCase().includes(string)) 
            || outsideBrackets.some((string) => question.text.toLowerCase().includes(string)));
            this.setState({search_results:new_result});

            var new_result2 = this.combineAndfilter(matchedQfromTags, this.state.search_results);
            this.setState({search_results:new_result2});
        }
        else{
            this.state.search_results = this.props.questions.filter((question) => question.title.toLowerCase().includes(inputString) || question.text.toLowerCase().includes(inputString));
        }
        this.props.updateState(7);
        this.props.updateSearching(this.state.search_results);
    }


    render(){
        return(
            <input type="text" placeholder="Search ..." id="search" 
            value = {this.props.input} onChange={this.handleInputChange} onKeyPress={this.handleEnterKey} /> 
        );
    }
}
export default Searching;