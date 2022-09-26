const mongoose = require('mongoose')

const RecipeSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide title'],
            maxlength: 50,
            unique: true, 
            trim: true, 
        },
        ingredients: [{
            type: String, 
            trim: true, 
        }], 
        methods: [{
            type: String, 
            trim: true, 
        }], 
        picture: {
            type: String, 
        }, 
        imageId: {
            type: String, 
        }, 
        completed: {
            type: Date, 
        }, 
        favorite: {
            type: Boolean, 
            default: false, 
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
