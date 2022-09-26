const Receipe = require('../models/Recipe')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const Category = require('../models/Category')
const Tag = require('../models/Tag')
const Recipe = require('../models/Recipe')

const getRecipes = async (req, res) => {
    const {title, category, sort} = req.query
    const queryObject = {}
    queryObject.createBy = req.user.userId
    if(title){
        queryObject.title = { $regex: title, $options: 'i' }
    }
    if(category){
        queryObject.category = category
    }
    const result = Receipe.find(queryObject)
    if(sort){
        result = result.sort(sort)
    } else {
        result = result.sort('createAt')
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    result = result.skip(skip).limit(limit);

    const recipes = await result

    res.status(200).json({ recipes })
}

const createRecipe = async (req, res) => {
    const { tags } = req.body
    req.body.tags = undefined
    req.body.createBy = req.user.userId
    const recipe = await Receipe.create(req.body)
    if(tags){
        for (const tag of tags){
            const findTag = await Tag.findOne({name:tag})
            if(!findTag){
                const createTag = await Tag.create({name:tag, createBy:req.user.userId})
                createTag.recipes.push(recipe._id);
                recipe.tags.push(createTag._id)
            } else {
                findTag.recipes.push(recipe._id)
                recipe.tags.push(findTag._id)
            }
        }
    }
    const result = await Category.updateOne({_id:recipe.category}, {$push: {recipes:recipe._id}})
    res.status(StatusCodes.CREATED).json({recipe})
}

const updateRecipe = async (req, res) => {
    const {
        body: { title }, 
        params: { id: recipeId }, 
        tags
    } = req
    if(title === '') throw new BadRequestError('Title cannot be empty')
    req.body.tags = undefined
    const recipe = await Receipe.findOneAndUpdate(
        {_id:recipeId}, 
        req.body, 
        {new: true, runValidators: true}
    )
    // const {tags:previousTags} = recipe
    // if(tags){

    // }
    if(!recipe) throw new NotFoundError(`No recipe with id ${recipeId}`)
    res.status(StatusCodes.OK).json({recipe})
}

const deleteRecipe = async (req, res) => {
    const {
        user: { _id: userId },
        params: { id: recipeId },
    } = req

    const recipe = await Receipe.findByIdAndRemove({
        _id: recipeId,
        createdBy: userId,
    })
    if (!recipe) {
        throw new NotFoundError(`No recipe with id ${recipeId}`)
    }
    const result = await Category.updateOne({_id:recipe.category}, {$pull: {recipes:recipe._id}})
    res.status(StatusCodes.OK).send()
}

module.exports = {
    getRecipes, 
    createRecipe, 
    updateRecipe, 
    deleteRecipe, 
}
