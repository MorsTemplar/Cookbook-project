const Recipe = require('../models/Recipe');
const mongoose = require('mongoose');

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = async (req, res) => {
  const { title, ingredients, steps, tags, imageUrl } = req.body;

  if (!title || !ingredients || !steps) {
    res.status(400);
    throw new Error('Title, ingredients, and steps are required');
  }

  const recipe = new Recipe({
    title,
    ingredients,
    steps,
    tags,
    imageUrl,
    author: req.user._id,
  });

  const savedRecipe = await recipe.save();
  res.status(201).json(savedRecipe);
};

// @desc    Get all recipes or filter by tags
// @route   GET /api/recipes
// @access  Public
const getAllRecipes = async (req, res) => {
  const { tag } = req.query;
  const filter = tag ? { tags: tag } : {};

  const recipes = await Recipe.find(filter).populate('author', 'username');
  res.json(recipes);
};

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  res.json(recipe);
};

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private (only author)
const updateRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  if (recipe.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this recipe');
  }

  const { title, ingredients, steps, tags, imageUrl } = req.body;
  recipe.title = title || recipe.title;
  recipe.ingredients = ingredients || recipe.ingredients;
  recipe.steps = steps || recipe.steps;
  recipe.tags = tags || recipe.tags;
  recipe.imageUrl = imageUrl || recipe.imageUrl;

  const updated = await recipe.save();
  res.json(updated);
};

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private (only author)
const deleteRecipe = async (req, res) => {
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  if (recipe.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this recipe');
  }

  await recipe.remove();
  res.json({ message: 'Recipe removed' });
};

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
};
