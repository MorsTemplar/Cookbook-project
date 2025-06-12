const Recipe = require('../models/Recipe');
const User = require('../models/User');
const asyncHandler = require('express-async-handler');

// @desc    Create new recipe
// @route   POST /api/recipes
// @access  Private
const createRecipe = asyncHandler(async (req, res) => {
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
});

// @desc    Get all recipes or filter by tags
// @route   GET /api/recipes
// @access  Public
const getAllRecipes = asyncHandler(async (req, res) => {
  const { tag } = req.query;
  const filter = tag ? { tags: tag } : {};

  const recipes = await Recipe.find(filter).populate('author', 'username');
  res.json(recipes);
});

// @desc    Get single recipe
// @route   GET /api/recipes/:id
// @access  Public
const getRecipeById = asyncHandler(async (req, res) => {
  const recipe = await Recipe.findById(req.params.id).populate('author', 'username');
  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }
  res.json(recipe);
});

// @desc    Update recipe
// @route   PUT /api/recipes/:id
// @access  Private (only author)
const updateRecipe = asyncHandler(async (req, res) => {
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
});

// @desc    Delete recipe
// @route   DELETE /api/recipes/:id
// @access  Private (only author)
const deleteRecipe = asyncHandler(async (req, res) => {
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
});

// @desc    Save a recipe
// @route   POST /api/recipes/:id/save
// @access  Private
const saveRecipe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const recipeId = req.params.id;

  if (user.savedRecipes.includes(recipeId)) {
    return res.status(400).json({ message: 'Recipe already saved' });
  }

  user.savedRecipes.push(recipeId);
  await user.save();
  res.json({ message: 'Recipe saved' });
});

// @desc    Unsave a recipe
// @route   DELETE /api/recipes/:id/save
// @access  Private
const unsaveRecipe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const recipeId = req.params.id;

  user.savedRecipes = user.savedRecipes.filter(
    (id) => id.toString() !== recipeId
  );
  await user.save();
  res.json({ message: 'Recipe unsaved' });
});

// @desc    Comment on a recipe
// @route   POST /api/recipes/:id/comments
// @access  Private
const addComment = asyncHandler(async (req, res) => {
  const { text } = req.body;
  const recipe = await Recipe.findById(req.params.id);

  if (!recipe) {
    res.status(404);
    throw new Error('Recipe not found');
  }

  recipe.comments.push({ user: req.user._id, text });
  await recipe.save();
  res.json({ message: 'Comment added' });
});

module.exports = {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  unsaveRecipe,
  addComment,
};
