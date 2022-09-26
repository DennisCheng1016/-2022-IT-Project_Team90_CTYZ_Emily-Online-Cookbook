const mongoose = require('mongoose')

const TagSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide name'],
            maxlength: 50,
            unique: true, 
            trim: true, 
        },
        recipes: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Recipe'
        }],
        createBy:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: [true, 'Please provide user'], 
        }

    }, 
    {timestamps: true}
)

module.exports = mongoose.model('Tag', TagSchema)
