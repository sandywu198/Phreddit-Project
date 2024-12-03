// Comment Document Schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    content: {type: String, required: true, maxLength:500},
    commentIDs: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    commentedBy: {type: String, required:true},
    commentedDate:{type: Date, required:true, default: Date.now},
    upvotes: {type: Number, required:true},
    userVoted: {type: Number, required:true, default: 0}, 
    // for remembering the vote (-1 means down, 0 means no vote, 1 means up)
})

CommentSchema.virtual('url').get(function() {
    return `/comments/${this._id}`;
});
// CommentSchema.virtual('commentID').get(function() {
//     return `${this._id}`;
// });

CommentSchema.set('toJSON', { virtuals: true });
CommentSchema.set('toObject', { virtuals: true });

const Comment = mongoose.model("Comment", CommentSchema);
module.exports = Comment;