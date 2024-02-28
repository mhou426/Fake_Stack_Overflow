// Question Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const questionSchema = new Schema({//title, text, tags, answers, asked_by, ask_date_time, views
  title: { type: String, required: true, minlength: 1, maxlength: 99},
  text: {type: String, required: true, minlength:1},
  tags:[{type: Schema.Types.ObjectId, ref:'Tag', required:true, minlength:1, maxlength:10}],
  answers:[{type: Schema.Types.ObjectId, ref:'Answer', default:[]}],
  comments:[{type: Schema.Types.ObjectId, ref:'Comment', defalut:[]}],
  asked_by:{type:String, default: 'Anonymous', unique: false, minlength:1},
  ask_date_time:{type:Date, default: Date.now},
  votes: {type: Number, required: false, default: 0},
  views:{type:Number, required:false, default:0}
});

const Question = mongoose.model('Question', questionSchema);
questionSchema.virtual('url').get(function () {
  return '/posts/question/' + this._id;
});

module.exports = Question;