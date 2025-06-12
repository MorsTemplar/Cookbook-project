const express = require('express');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();
const {
  createRecipe,
  getAllRecipes,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} = require('../controllers/recipeController');
const { protect } = require('../middleware/authMiddleware');

// Upload image to Cloudinary
router.post('/upload', protect, upload.single('image'), (req, res) => {
  res.json({ imageUrl: req.file.path });
});

// Public routes
router.get('/', getAllRecipes);
router.get('/:id', getRecipeById);

// Protected routes
router.post('/', protect, createRecipe);
router.put('/:id', protect, updateRecipe);
router.delete('/:id', protect, deleteRecipe);

module.exports = router;
