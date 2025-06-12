import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';
import './RecipeForm.css';

const tagOptions = [
  { value: 'vegan', label: 'Vegan' },
  { value: 'keto', label: 'Keto' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'quick', label: 'Quick' },
  { value: 'dessert', label: 'Dessert' },
];

const RecipeForm = () => {
  const [title, setTitle] = useState('');
  const [ingredients, setIngredients] = useState(['']);
  const [steps, setSteps] = useState('');
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleIngredientChange = (index, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index] = value;
    setIngredients(newIngredients);
  };

  const addIngredientField = () => setIngredients([...ingredients, '']);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      setUploading(true);
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/recipes/upload`, formData);
      setImage(res.data.url);
      setUploading(false);
    } catch (err) {
      alert('Image upload failed');
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const recipeData = {
        title,
        ingredients,
        steps,
        tags: tags.map(t => t.value),
        imageUrl: image,
      };

      const token = localStorage.getItem('token');
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/recipes`,
        recipeData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert('Recipe posted!');
      console.log(res.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to post recipe');
    }
  };

  return (
    <div className="recipe-form-container">
      <h2>Post a Recipe</h2>
      <form onSubmit={handleSubmit} className="recipe-form">
        <input
          type="text"
          placeholder="Recipe Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <h4>Ingredients</h4>
        {ingredients.map((ing, i) => (
          <input
            key={i}
            type="text"
            value={ing}
            onChange={(e) => handleIngredientChange(i, e.target.value)}
            placeholder={`Ingredient ${i + 1}`}
            required
          />
        ))}
        <button type="button" onClick={addIngredientField}>+ Add Ingredient</button>

        <textarea
          placeholder="Steps"
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          rows="5"
          required
        ></textarea>

        <Select
          options={tagOptions}
          isMulti
          onChange={setTags}
          placeholder="Select tags..."
        />

        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {uploading && <p>Uploading...</p>}
        {image && <img src={image} alt="Recipe" style={{ width: '200px', marginTop: '10px' }} />}

        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default RecipeForm;
