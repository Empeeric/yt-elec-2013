var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var users_contentSchema = new Schema({
    title: { type: String, required: true },
    uploader: { type: String, required: true },
    uploader_link: { type: String },
    picture: { type: Schema.Types.Picture },
    youtube_video_id: { type: String },
    order: { type: Number, editable: false },
    show: { type: Boolean, 'default': true }
});

var users_content = module.exports = mongoose.model('users_content', users_contentSchema);