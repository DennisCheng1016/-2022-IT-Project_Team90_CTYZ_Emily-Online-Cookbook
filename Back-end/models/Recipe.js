const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide title'],
            maxlength: 50,
            unique: true, 
        },
        ingredients: [{
            type: String, 
        }], 
        methods: [{
            type: String, 
        }], 
        picture: {
            type: String, 
        }, 
        imageId: {
            type: String, 
        }, 
        tags: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag'
        }],
        category:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Category', 
            required: [true, 'Please provide category'], 
        }, 
        createBy:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User', 
            required: [true, 'Please provide user'], 
        }, 
    }, 
    {timestamps: true}
)

module.exports = mongoose.model('Recipe', RecipeSchema)
