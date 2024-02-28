// Answer Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const answerSchema = new Schema({
  text: {type: String, required: true, unique: true, minlength:1},
  ans_by:{type:String, required:true, unique: false, minlength:1},
  ans_date_time:{type:Date, required:true,default: Date.now},
  comments:[{type: Schema.Types.ObjectId, ref:'Comment', defalut:[]}],
  votes: {type: Number, required: false, default: 0}
});

const Answer = mongoose.model('Answer', answerSchema);
answerSchema.virtual('url').get(function () {
    return '/posts/answer/' + this._id;
  });
module.exports = Answer;