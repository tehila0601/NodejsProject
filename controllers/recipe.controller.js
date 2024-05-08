const mongoose = require('mongoose');
const { Recipe } = require("../models/recipe.model");

exports.getAllRecipes = async (req, res, next) => {
    let { search, page, perPage } = req.query;
    search ??= '';
    page ??= '';
    perPage ??= '';

    try {
        const recipes = await Recipe.find({ name: new RegExp(search) })
            .skip((page - 1) * perPage)
            .limit(perPage)
            .select('-__v');
        return res.json(recipes);
    } catch (error) {
        next(error);
    }
}

exports.getRecipeById = (req, res, next) => {
    const id = req.params.id;
    if(!mongoose.Types.ObjectId.isValid(id))
        next({message:'id is not valid'})
    else
        Recipe.findById(id,{ __v: false})
    .then(r=>{
        res.json(r);
    })
    .catch(err=>{
        next({ message: 'recipe not found', status: 404 })
    })
}