const mongoose = require('mongoose');
const Schema = mongoose.Schema;
  
const commentSchema = new Schema({
    text:{type: String, required: true, unique: true, minlength: 1, maxlength: 140},
    comment_by:{type:String, required:true, unique: false, minlength:1},
    comment_date_time:{type:Date, required:true,default: Date.now},
    votes: {type: Number, required: false, default: 0}
});

const Comment = mongoose.model('Comment', commentSchema);
commentSchema.virtual('url').get(function () {
    return '/posts/comment/' + this._id;
});
module.exports = Comment;