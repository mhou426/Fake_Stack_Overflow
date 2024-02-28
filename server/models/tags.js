// Tag Document Schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const tagSchema = new Schema({
  name: { type: String, required: true, unique: true },
});

const Tag = mongoose.model('Tag', tagSchema);

tagSchema.virtual('url').get(function () {
  return '/posts/tags/' + this._id;
});
module.exports = Tag;