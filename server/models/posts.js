// Post Document Schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const PostSchema = new Schema({
    title: {type: String, required: true, maxLength:100},
    content: {type: String, required: true},
    linkFlairID: { type: Schema.Types.ObjectId, ref: "LinkFlair" },
    postedBy: {type: String, required:true},
    postedDate:{type: Date, required:true, default: Date.now},
    commentIDs: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    views: {type: Number, required:true, default: 0}
})

PostSchema.virtual('url').get(function() {
    return `/posts/${this._id}`;
});
// PostSchema.virtual('postID').get(function() {
//     return `${this._id}`;

PostSchema.set('toJSON', { virtuals: true });
PostSchema.set('toObject', { virtuals: true });

const Post = mongoose.model("Post", PostSchema);
module.exports = Post;