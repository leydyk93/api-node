const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categorySchema = new Schema({

    name: {
        type: String, 
        unique: true, 
        required: [true, 'El nombre es necesario']
    }, 
    description: {
        type: String
    },
    user: { type: Schema.Types.ObjectId, ref:'Usuario' }
        
})


module.exports = mongoose.model('Category', categorySchema)
