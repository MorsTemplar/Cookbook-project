const express = require('express');
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
  saveRecipe,
  unsaveRecipe,
  addComment,
} = require('../controllers/recipeController');

const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

// Protected routes
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

// Save / Unsave
router.post('/:id/save', protect, saveRecipe);
router.delete('/:id/save', protect, unsaveRecipe);

// Comments
router.post('/:id/comments', protect, addComment);

module.exports = router;
