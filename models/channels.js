var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var channelsSchema = new Schema({
    navigation: { type: ObjectId, ref: 'navigation', unique: true, required: true },
    author: { type: String },
    q: { type: String },
    'max-results': { type: Number, default: 12, min: 1, max: 50 }
});

var channels = module.exports = mongoose.model('channels', channelsSchema);