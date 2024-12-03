// User Document Schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    displayName: {type: String, required: true},
    email: {type: String, required:true},
    password: {type: String, required:true},
    startTime: {type: Date, required:true, default: Date.now},
    reputation: {type: Number, required:true, default: 100},
})

UserSchema.virtual('url').get(function() {
    return `/users/${this._id}`;
});
// CommentSchema.virtual('commentID').get(function() {
//     return `${this._id}`;
// });

UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true });

const User = mongoose.model("User", UserSchema);
module.exports = User;