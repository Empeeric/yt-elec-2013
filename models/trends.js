var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    ObjectId = Schema.Types.ObjectId;

var trendsSchema = new Schema({
    title: { type: String, required: true },
    picture: { type: Schema.Types.Picture },
    order: { type: Number, editable: false },
    show: { type: Boolean, 'default': true }
});

var trends = module.exports = mongoose.model('trends', trendsSchema);