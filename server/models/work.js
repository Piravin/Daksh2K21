const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const updateSchema = Schema({
    _id: Schema.Types.ObjectId,
    message:String,
    image:String
});
const workModel = Schema({
    _id : Schema.Types.ObjectId,
    work : {
        type:Schema.Types.ObjectId,
        ref:'WorkTemplate',
        required:true},
    user : {
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    staff:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    updates:[updateSchema],
    expectedDuration : Date,
    status : Boolean,
    expense : String
},{
    timestamps:true,
    collection:'works'
});

module.exports = mongoose.model('Work', workModel);