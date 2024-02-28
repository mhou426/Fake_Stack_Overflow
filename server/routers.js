const express = require('express');
const router = express.Router();
const Controller = require('./controllers');

router.post('/login', Controller.login);
router.post('/signup', Controller.register);
router.post('/logout', Controller.logout);
router.get('/check-session', Controller.checkSession);

router.get('/questions', Controller.getQuestions);
router.get('/tags', Controller.getTags);
router.get('/answers', Controller.getAnswers);
router.get('/comments', Controller.getComments);
router.put('/tags/:id', Controller.putTags);
router.post('/tags', Controller.postTags);
router.post('/insertAnswer', Controller.postAnswers);
router.post('/questions', Controller.postQuestions);
router.post('/comments/question', Controller.postQComments)
router.post('/comments/answer', Controller.postAComments)
router.put('/questions/upvote/:id', Controller.upvoteQ);
router.put('/questions/downvote/:id', Controller.downvoteQ);
router.put('/answers/upvote/:id', Controller.upvoteA);
router.put('/answers/downvote/:id', Controller.downvoteA);
router.put('/comments/upvote/:id', Controller.upvoteC);

router.get('/getuser', Controller.getUser);
router.get('/getusertime', Controller.getUserTime);
router.get('/getusercredit', Controller.getUserCredit);
router.get('/getquestions', Controller.getUserQuestions);
router.post('/delete', Controller.deleteQuestion);
router.put('/questions/:id', Controller.updateQuestion);

module.exports = router;