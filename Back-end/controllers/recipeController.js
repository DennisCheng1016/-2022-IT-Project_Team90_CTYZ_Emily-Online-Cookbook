const Recipe = require('../models/Recipe')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors')
const Category = require('../models/Category')
const Tag = require('../models/Tag')

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
    let result = Recipe.find(queryObject)
    if(sort){
        result = result.sort(sort)
    } else {
        result = result.sort('createdAt')
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
    const recipe = await Recipe.create(req.body)
    if(tags){
        for (const tag of tags){
            let findTag = await Tag.findOne({name:tag})
            if(!findTag){
                findTag = await Tag.create({name:tag, createBy:req.user.userId})
                findTag.recipes.push(recipe._id);
                recipe.tags.push(findTag._id)
            } else {
                findTag.recipes.push(recipe._id)
                recipe.tags.push(findTag._id)
            }
            await recipe.save()
            await findTag.save()
        }
    }
    const result = await Category.updateOne({_id:recipe.category}, {$push: {recipes:recipe._id}})
    res.status(StatusCodes.CREATED).json({recipe})
}

const updateRecipe = async (req, res) => {
    const {
        body: { title, tags }, 
        params: { id: recipeId }, 
    } = req
    if(title === '') throw new BadRequestError('Title cannot be empty')
    req.body.tags = undefined
    const recipe = await Recipe.findOneAndUpdate(
        {_id:recipeId}, 
        req.body, 
        {new: true, runValidators: true}
    ).populate('tags', '-_id name')
    if(!recipe) throw new NotFoundError(`No recipe with id ${recipeId}`)
    // Tag operation
    const {tags:pTags} = recipe
    const previousTags = pTags.map(x => x.name)
    if(tags && previousTags){
        const addTags = tags.filter(x => !previousTags.includes(x))
        const deleteTags = previousTags.filter(x => !tags.includes(x))
        if(addTags){
            for (const tag of addTags){
                let findTag = await Tag.findOne({name:tag})
                if(!findTag){
                    findTag = await Tag.create({name:tag, createBy:req.user.userId})
                    findTag.recipes.push(recipe._id);
                    recipe.tags.push(findTag._id)
                } else {
                    findTag.recipes.push(recipe._id)
                    recipe.tags.push(findTag._id)
                }
                await recipe.save()
                await findTag.save() 
            }
        }
        if(deleteTags){
            for (const tag of deleteTags){
                const deleteTag = await Tag.findOneAndUpdate(
                    {name: tag}, 
                    {$pull: {recipes:recipe._id}}, 
                    {new: true, runValidators: true}
                )
                await recipe.tags.pull(deleteTag._id)
                await recipe.save()
            }
            const result = await Tag.deleteMany({recipes: {$size: 0}})
        }
    }
    else if(!tags && previousTags){
        for (const tag of previousTags){
            const deleteTag = await Tag.findOneAndUpdate(
                {name: tag}, 
                {$pull: {recipes:recipe._id}}, 
                {new: true, runValidators: true}
            )
            await recipe.tags.pull(deleteTag._id)
            await recipe.save()
        }
        const result = await Tag.deleteMany({recipes: {$size: 0}})
    }
    else if (tags && !previousTags){
        for (const tag of tags){
            let findTag = await Tag.findOne({name:tag})
            if(!findTag){
                findTag = await Tag.create({name:tag, createBy:req.user.userId})
                findTag.recipes.push(recipe._id);
                recipe.tags.push(findTag._id)
            } else {
                findTag.recipes.push(recipe._id)
                recipe.tags.push(findTag._id)
            }
            await recipe.save()
            await findTag.save() 
        } 
    }
    const finalRecipe = await Recipe.findById({_id: recipeId})
    res.status(StatusCodes.OK).json({recipe:finalRecipe})
}

const deleteRecipe = async (req, res) => {
    const {
        user: { userId },
        params: { id: recipeId },
    } = req

    const recipe = await Recipe.findByIdAndRemove({
        _id: recipeId,
        createdBy: userId,
    }).populate('tags', '-_id name')
    if (!recipe) {
        throw new NotFoundError(`No recipe with id ${recipeId}`)
    }
    const tags = recipe.tags
    if(tags){
        const deleteTags = tags.map(x => x.name)
        for (const tag of deleteTags){
            const deleteTag = await Tag.findOneAndUpdate(
                {name: tag}, 
                {$pull: {recipes:recipe._id}}, 
                {new: true, runValidators: true}
            )
        }
        const result = await Tag.deleteMany({recipes: {$size: 0}})
    }
    const result = await Category.updateOne({_id:recipe.category}, {$pull: {recipes:recipe._id}})
    res.status(StatusCodes.OK).send()
}

const completeRecipe = async (req, res) => {
    const {
        user: { userId },
        params: { id: recipeId },
    } = req
    const recipe = await Recipe.findOneAndUpdate(
        {_id: recipeId, createBy: userId}, 
        {completed: Date.now()}, 
        {new: true, runValidators: true} 
    )
    if(!recipe) throw new NotFoundError(`No recipe with id ${recipeId}`)
    res.status(StatusCodes.OK).json({recipe})
}
module.exports = {
    getRecipes, 
    createRecipe, 
    updateRecipe, 
    deleteRecipe, 
    completeRecipe
}
