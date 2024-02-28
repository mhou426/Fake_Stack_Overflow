// User Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  user: { type: String, required: true, minlength: 1, maxlength: 99},
  email: {type: String, required: true, unique: true, minlength:1},
  password:{type: String, required:true, minlength:1},
  credit:{type:Number,required:true, default:50},
  regi_time:{type:Date, default: Date.now},
  questions:[{type: Schema.Types.ObjectId, ref:'questions', default:[]}],
});

const User = mongoose.model('User', userSchema);
userSchema.virtual('url').get(function () {
  return '/posts/user/' + this._id;
});

module.exports = User;