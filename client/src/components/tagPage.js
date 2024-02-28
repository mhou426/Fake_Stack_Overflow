import React, { Component } from 'react';



class Tag_page extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  
  
  render() {
    const tags = this.props.tags;
    
    /*
    for (const tag of this.props.tags) {
      tag.count = 0; 
    }
    */
    console.log(tags)
    return (
      <>
        <h1 className="tag_title">
          <span id="num_tag">{this.props.tags.length} Tags</span>
          <span id="all_tag">All Tags</span>
          {this.props.login &&<button
            id="ask_question"
            onClick={this.props.setPage}
            style={{ marginLeft: '20%' }}>
            Ask Question
          </button>}
          
        </h1>
        <div id="tag_container" style={{marginTop:'5%'}}>
          {tags.map((tag,index) => (
            <div key={index} className= "tag_box">
              <div className="tag_name" onClick = {()=> this.props.searchByTag(tag)}>{tag.name}</div>
              <div>{tag.count} question(s)</div>
            </div>
          ))}
        </div>
      </>
    );
  }
}

export default Tag_page;