// LinkFlair Document Schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const LinkFlairSchema = new Schema({
    content: {type: String, required: true, maxLength:30},
})

LinkFlairSchema.virtual('url').get(function() {
    return `/linkFlairs/${this._id}`;
});
// LinkFlairSchema.virtual('linkFlairID').get(function() {
//     return `${this._id}`;
// });

LinkFlairSchema.set('toJSON', { virtuals: true });
LinkFlairSchema.set('toObject', { virtuals: true });

const LinkFlair = mongoose.model('LinkFlair', LinkFlairSchema);
module.exports = LinkFlair;