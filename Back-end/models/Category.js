const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide name'],
            maxlength: 50,
            unique: true, 
        },
        recipes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }],
        createBy:{
            type: mongoose.Types.ObjectId, 
            ref: 'User', 
            required: [true, 'Please provide user'], 
        }

    }, 
    {timestamps: true}
)

module.exports = mongoose.model('Category', CategorySchema)