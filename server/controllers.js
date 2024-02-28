const mongoose = require('mongoose');
const db = mongoose.connection;
const ObjectId = require('mongodb').ObjectId;
const bcrypt = require('bcrypt');
const saltRounds = 10;
const session = require("express-session");
const Question = require('./models/questions');
const Answer = require('./models/answers');
const Tag = require('./models/tags');
const User = require('./models/users');
const Comment = require('./models/comments');

getQuestions = async (req, res) => {
try {
    console.log("get here");
    const questions =  db.collection('questions').find();
    const questionsArray = await questions.toArray();
    console.log(questionsArray);
    res.json(questionsArray);
} catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ error: 'Error fetching questions' });
}};

getTags = async (req, res) => {
const update = { $set: { count: 0 } };

try {
    const tags =  db.collection('tags').find();
    const tagsArray = await tags.toArray();
    const result = await db.collection('tags').updateMany({}, update);

    res.json(tagsArray);
} catch (error) {
    console.error('Error fetching tags:', error);
    res.status(500).json({ error: 'Error fetching tags' });
}};

getAnswers = async (req, res) => {
try {
    const answers =  db.collection('answers').find();
    const answersArray = await answers.toArray();
    
    res.json(answersArray);
} catch (error) {
    console.error('Error fetching answers:', error);
    res.status(500).json({ error: 'Error fetching answers' });
}};

getComments = async (req, res) => {
    try {
        const comments =  db.collection('comments').find();
        const commentsArray = await comments.toArray();
    
        res.json(commentsArray);
    } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ error: 'Error fetching comments' });
    }
};

putTags = async (req, res) => {
    const tagId = req.params.id;
    const {count} = req.body;
    //console.log(tagId,count)
    try {
    const result = await db.collection('tags').updateOne(
        { _id: new ObjectId(tagId) },
        { $set: {count: count } },
    );
    //console.log(result);
    if (result.modifiedCount > 0) {
        res.json({ success: true, message: 'Tag count increased successfully' });
    } else {
        res.status(404).json({ success: false, message: 'Tag not found' });
    }
    } catch (error) {
    console.error('Error increasing tag count:', error);
    res.status(500).json({ error: 'Error increasing tag count' });
    }};

postTags = async (req, res) => {
    const {name} = req.body;
    try {
    const result = await db.collection('tags').insertOne({
        name: name,
        count:0
    }
        
    );
    
    const insertedId = result.insertedId.toString();
    //console.log(insertedId)
    res.json(insertedId);
    
    } catch (error) {
    console.error('Error creating tag:', error);
    res.status(500).json({ error: 'Error creating tag' });
    }
};

//get question using question id and update answerid array
async function appendAnswerToQuestion(questionId, answerId) {
    try {
    const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        { $push: { answers: answerId } },
        { new: true }
    ).exec();

    // 'updatedQuestion' will contain the updated document with the new answer appended to the 'answers' array
    console.log(updatedQuestion.answers);

    return;
    } catch (err) {
    console.error(err);
    return null; // Or handle the error as needed
    }
}

postAnswers = async (req, res) => {
    const {question, text, ans_by} = req.body;
    try {
        const result = await db.collection('answers').insertOne({
            text: text,
            ans_by: req.session.userData.user,
            ans_date_time: Date.now(),
            comments:[],
            votes: 0
            });
        
        const qid = question._id;
        //find the question database and get answers array and insert insertedId, save
        await appendAnswerToQuestion(qid, result.insertedId);

        res.json({ success: true, message: 'Answer created successfully' });
        } catch (error) {
        console.error('Error creating Answer:', error);
        res.status(500).json({ error: 'Error creating Answer' });
        }
};

postQuestions = async (req, res) => {
    const { title, text, tags} = req.body;
    try {
      const result = await db.collection('questions').insertOne({
        title: title,
        text: text,
        tags: tags,
        answers:[],
        comments: [],
        asked_by: req.session.userData.user,
        ask_date_time: Date.now(),
        votes:0,
        views:0
      }
       
      );
      const insertedQuestionId = result.insertedId; 
      console.log(insertedQuestionId);
      const userEmail = req.session.userData.email;

      const result2 = await db.collection('users').updateOne(
        {email:userEmail},
        {$push:{ questions: new ObjectId(insertedQuestionId)} }
      );
      res.json({ success: true, message: 'Question created successfully' });
    } catch (error) {
      console.error('Error creating Question:', error);
      res.status(500).json({ error: 'Error creating Question' });
    }
};

//get question using question id and update commentid array for question
async function appendCommentToQuestion(questionId, commentId) {
    try {
    const updatedQuestion = await Question.findByIdAndUpdate(
        questionId,
        { $push: { comments: commentId } },
        { new: true }
    ).exec();

    // 'updatedQuestion' will contain the updated document with the new answer appended to the 'answers' array
    console.log(updatedQuestion.comments);

    return;
    } catch (err) {
    console.error(err);
    return null; // Or handle the error as needed
    }
}

//posting comments for QUESTION
postQComments = async (req, res) => {
    const {question, text, c_by} = req.body;
    console.log("Session object:", req.session);
    console.log("comments:" , req.session.user);
    try {
        const result = await db.collection('comments').insertOne({
            text: text,
            comment_by: c_by,
            comment_date_time: Date.now(),
            votes:0
            });
        const qid = question._id;
        //find the question database and get answers array and insert insertedId, save
        await appendCommentToQuestion(qid, result.insertedId);

        res.json({ success: true, message: 'Comment created successfully' });
    } catch (error) {
        console.error('Error creating Comment:', error);
        res.status(500).json({ error: 'Error creating Comment', details: error.message});
    }
};

//get answer using answer id and update commentid array for answer
async function appendCommentToAnswer(answerId, commentId) {
    try {
    const updatedAnswer = await Answer.findByIdAndUpdate(
        answerId,
        { $push: { comments: commentId } },
        { new: true }
    ).exec();

    // 'updatedAnswer' will contain the updated document with the new comment appended to the 'comments' array
    console.log(updatedAnswer.comments);

    return;
    } catch (err) {
    console.error(err);
    return null; // Or handle the error as needed
    }
}

//posting comments for ANSWER
postAComments = async (req, res) => {
    const {answer, text, c_by} = req.body;//change c_by to get current username function in server
    try {
        const result = await db.collection('comments').insertOne({
            text: text,
            comment_by: c_by,
            comment_date_time: Date.now(),
            votes:0
            });
        
        const aid = answer._id;
        //find the question database and get answers array and insert insertedId, save
        await appendCommentToAnswer(aid, result.insertedId);

        res.json({ success: true, message: 'Comment created successfully' });
        } catch (error) {
        console.error('Error creating Comment:', error);
        res.status(500).json({ error: 'Error creating Comment' });
        }
};

upvoteQ = async (req, res) => {
    const qId = req.params.id;
    try{
        const result = await db.collection('questions').findOneAndUpdate(
            {_id: new ObjectId(qId)},//find this specific question using the object id
            {$inc: {votes: 1}},
            {returnDocument: 'after'}//return updated
        );
        if (result) {
            res.json({ success: true, message: 'Question vote increased successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Question not found' });
        }
    } catch (error) {
        console.error('Error increasing vote for question:', error);
        res.status(500).json({ error: 'Error increasing vote for question' });
    }
};

downvoteQ = async (req, res) => {
    const qId = req.params.id;
    try{
        const result = await db.collection('questions').findOneAndUpdate(
            {_id: new ObjectId(qId)},
            {$inc: {votes: -1}},
            {returnDocument: 'after'}//return updated
        );
        if (result) {
            res.json({ success: true, message: 'Question vote decreased successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Question not found' });
        }
    } catch (error) {
        console.error('Error decreasing vote for question:', error);
        res.status(500).json({ error: 'Error decreasing vote for question' });
    }
};

upvoteA = async (req, res) => {
    const aId = req.params.id;
    try{
        const result = await db.collection('answers').findOneAndUpdate(
            {_id: new ObjectId(aId)},
            {$inc: {votes: 1}},
            {returnDocument: 'after'}//return updated
        );
        if (result) {
            res.json({ success: true, message: 'Answer vote increased successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Answer not found' });
        }
    } catch (error) {
    console.error('Error increasing vote for answer:', error);
    res.status(500).json({ error: 'Error increasing vote for answer' });
    }
};

downvoteA = async (req, res) => {
    const aId = req.params.id;
    try{
        const result = await db.collection('answers').findOneAndUpdate(
            {_id: new ObjectId(aId)},
            {$inc: {votes: -1}},
            {returnDocument: 'after'}//return updated
        );
        if (result) {
            res.json({ success: true, message: 'Answer vote decreased successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Answer not found' });
        }
    } catch (error) {
    console.error('Error decreasing vote for answer:', error);
    res.status(500).json({ error: 'Error decreasing vote for answer' });
    }
};

upvoteC = async (req, res) => {
    const cId = req.params.id;
    try{
        const result = await db.collection('comments').findOneAndUpdate(
            {_id: new ObjectId(cId)},
            {$inc: {votes: 1}},
            {returnDocument: 'after'}//return updated
        );
        if (result) {
            res.json({ success: true, message: 'Comment vote increased successfully' });
        } else {
            res.status(404).json({ success: false, message: 'Comment not found' });
        }
    } catch (error) {
    console.error('Error increasing vote for comment:', error);
    res.status(500).json({ error: 'Error increasing vote for comment' });
    }
};

//store session user name
login = async (req, res) => {
    const { username, password } = req.body;
    try {
      const find_user = await db.collection('users').findOne({ user: username});
      console.log(find_user)
      const verdict = await bcrypt.compare(password, find_user.password);
      if (verdict) {
        // Password matches, login successful
        req.session.user = username.trim();
        
        req.session.userData = find_user;
        console.log(req.session.user);
        console.log("session: ", req.session);
        res.json(1);
      } else {
        // No user found or password doesn't match
        res.json(0);
      }
      
    } catch (error) {
      res.json(0);
    }
};

//get current session name

register = async (req, res) => {
  const { email, username, password } = req.body;
  console.log(username);
  try {
      const findUser = await User.findOne({ email: email });
      console.log((findUser === null));
      const salt = await bcrypt.genSalt(saltRounds);
      if (findUser === null) {
          // Password matches, login successful
          await User.create({
              email: email,
              user: username,
              password: await bcrypt.hash(password, salt),
          });
          req.session.user = username.trim();
          res.json(1);
      } else {
          // User already exists
          res.json(0);
      }

  } catch (error) {
      console.log(error);
      res.json(0);
  }
};

logout = async (req, res) => {
    console.log(req.session);
    if (req.session) {
        // Destroy the session
        req.session.destroy((err) => {
            if (err) {
                // Handle the error case
                res.status(500).send("Error occurred while logging out.");
            } else {
                // Clear the session cookie
                
                res.clearCookie('connect.sid');
                // Redirect or send a success response
                console.log('logout success');
                //res.redirect("/"); // Redirect to login page
                // Or send a JSON response
                res.json({ message: "Logged out successfully" });
            }
        });
        console.log(req.session)
    } else {
        // If there's no session, respond accordingly
        res.status(400).send("No active session to log out from.");
    }
};


checkSession = async (req, res) => {
    console.log('check session:')
    console.log(req.session)
    if (!req.session) {
      // No session is initialized
      res.json(null);
  } else if (req.session.user && req.session.userData.user) {
      // User is logged in
      res.json(1);
  } else {
      // Session is initialized, but no user is logged in
      res.json(0);
  }
};

getUser = async (req, res) => {
  console.log('check session:')
  console.log(req.session)
  if (req.session.user) {
    const find_user = await db.collection('users').findOne({ email:req.session.userData.email});
    req.session.userData = find_user;
    console.log(req.session.user);
    res.json(req.session.user);
      //res.json({ status: "success", user: req.session.user });
  } else {
    console.log('no user exist right now');
    res.json(0);
      //res.json({ status: "error", message: "No active session" });
  }
};

getUserTime =async (req, res) => {
  console.log('check time session:')
  console.log(req.session)
  
  if (req.session.user) {
    const find_user = await db.collection('users').findOne({ email:req.session.userData.email});
    req.session.userData = find_user;
    console.log(req.session.userData.regi_time);
    res.json(req.session.userData.regi_time);
      //res.json({ status: "success", user: req.session.user });
  } else {
    console.log('no user exist right now');
    res.json(0);
      //res.json({ status: "error", message: "No active session" });
  }
};

getUserCredit = async (req, res) => {
  console.log('check credit session:')
  
  if (req.session.user) {
    const find_user = await db.collection('users').findOne({ email:req.session.userData.email});
    req.session.userData = find_user;
    console.log(req.session.userData.credit);
    res.json(req.session.userData.credit);
      //res.json({ status: "success", user: req.session.user });
  } else {
    console.log('no user exist right now');
    res.json(0);
      //res.json({ status: "error", message: "No active session" });
  }
};

getUserQuestions = async (req, res) => {
  console.log('check questions session:')
  
  if (req.session.user) {
    const find_user = await db.collection('users').findOne({ email:req.session.userData.email});
    req.session.userData = find_user;
    const questionsArray = req.session.userData.questions;
    
    var questions = [];

    try {
      for (let i = 0; i < questionsArray.length; i++) {
        const questionId = questionsArray[i];
        const question = await db.collection('questions').findOne(
          {_id: new ObjectId(questionId)}
          );

        if (question) {
          questions.push(question);
        }
      }
      //const questionsArrays = await questions.toArray();
      console.log(questions);
      res.json(questions);
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    console.log('no user exists right now');
    res.json(0);
  }
};

deleteQuestion =  async (req, res) => {
  const { question } = req.body; // Ensure you are accessing question property
  console.log(question);
  try {
    const qid = question._id;
    console.log(qid);
    
    await db.collection('questions').deleteOne(
      { _id: new ObjectId(question._id) }
    );
    const userEmail = req.session.userData.email;

    await db.collection('users').updateOne(
      { email: userEmail },
      { $pull: { questions: new ObjectId(qid) } }
    );
    
    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error('Error', error);
    res.status(500).json({ error: 'Error' });
  }
};

updateQuestion = async (req, res) => {
    const questionId = req.params.id;
    const { title, text, tags, asked_by} = req.body;
    try {
      const result = await db.collection('questions').updateOne(
        {_id: new ObjectId(questionId)},
        {$set:
          {title: title,
          text: text,
          tags: tags,
          asked_by: asked_by,}
        },
       
      );
      console.log('changing')
      console.log(title, text,tags,asked_by)
      res.json({ success: true, message: 'Question edited successfully' });
    } catch (error) {
      console.error('Error creating Question:', error);
      res.status(500).json({ error: 'Error creating Question' });
    }
  };


module.exports = {
    getQuestions,
    getTags,
    getAnswers,
    getComments,
    putTags,
    postTags,
    postAnswers,
    postQuestions,
    postQComments,
    postAComments,
    upvoteQ,
    downvoteQ,
    upvoteA,
    downvoteA,
    upvoteC,
    login,
    register,  
    logout,
    checkSession,
    getUser,
    getUserTime,
    getUserCredit,
    getUserQuestions,
    deleteQuestion,
    updateQuestion
}