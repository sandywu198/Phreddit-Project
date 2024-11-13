// Community Document Schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const CommunitySchema = new Schema({
    name: {type: String, required: true, maxLength: 100},
    description: {type: String, required: true, maxLength: 500},
    postIDs: [{type: Schema.Types.ObjectId, ref: "Post" }],
    startDate: {type: Date, required:true, default: Date.now},
    members: [{type: String, required:true}],
    /* virtual property
    memberCount: {type: Number}
    url: {type: String}, 
    */ 
})

CommunitySchema.virtual('url').get(function() {
    return `/communities/${this._id}`;
});
// CommunitySchema.virtual('communityID').get(function() {
//     return `${this._id}`;
// });

CommunitySchema.virtual('memberCount').get(function() {
    return this.members.length;
});

CommunitySchema.set('toJSON', { virtuals: true });
CommunitySchema.set('toObject', { virtuals: true });

const Community = mongoose.model('Community', CommunitySchema);
module.exports = Community;
