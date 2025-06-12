import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './RecipeFeed.css';
import Select from 'react-select';

const RecipeFeed = () => {
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [selectedTags, setSelectedTags] = useState([]);
  const [tagOptions, setTagOptions] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes`);
        setRecipes(res.data);
        setFilteredRecipes(res.data);

        // Extract all unique tags
        const tagSet = new Set();
        res.data.forEach((recipe) => {
          recipe.tags.forEach((tag) => tagSet.add(tag));
        });
        const options = Array.from(tagSet).map(tag => ({ value: tag, label: tag }));
        setTagOptions(options);
      } catch (err) {
        console.error(err);
        alert('Failed to load recipes');
      }
    };

    fetchRecipes();
  }, []);

  // Filter recipes when tags change
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredRecipes(recipes);
    } else {
      const filtered = recipes.filter(recipe =>
        selectedTags.every(tag => recipe.tags.includes(tag.value))
      );
      setFilteredRecipes(filtered);
    }
  }, [selectedTags, recipes]);

  const handleFavorite = async (recipeId) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/users/save/${recipeId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Saved to favorites!');
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving recipe');
    }
  };

  const handleCommentSubmit = async (recipeId) => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/recipes/${recipeId}/comments`,
        { comment: commentText[recipeId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Comment added!');
      setCommentText(prev => ({ ...prev, [recipeId]: '' }));

      // Refresh all recipes
      const updated = await axios.get(`${process.env.REACT_APP_API_URL}/api/recipes`);
      setRecipes(updated.data);
    } catch (err) {
      alert(err.response?.data?.message || 'Comment failed');
    }
  };

  return (
    <div className="feed-container">
      <h2>Recipe Feed</h2>

      {/* Tag Filter UI */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ color: '#fff', marginBottom: '5px', display: 'block' }}>Filter by Tags:</label>
        <Select
          options={tagOptions}
          isMulti
          value={selectedTags}
          onChange={setSelectedTags}
          className="basic-multi-select"
          classNamePrefix="select"
          placeholder="Select tags"
        />
      </div>

      {filteredRecipes.length === 0 && <p>No recipes match the selected tags.</p>}

      {filteredRecipes.map((recipe) => (
        <div className="recipe-card" key={recipe._id}>
          <img src={recipe.imageUrl} alt={recipe.title} />
          <h3>{recipe.title}</h3>
          <p><strong>Tags:</strong> {recipe.tags.join(', ')}</p>
          <ul>
            {recipe.ingredients.map((ing, idx) => (
              <li key={idx}>{ing}</li>
            ))}
          </ul>
          <p><strong>Steps:</strong> {recipe.steps}</p>

          <button onClick={() => handleFavorite(recipe._id)}>❤️ Save to Favorites</button>

          {/* Comments Section */}
          <div className="comment-section">
            <h4>Comments</h4>
            {recipe.comments?.length > 0 ? (
              recipe.comments.map((c, i) => (
                <div key={i} className="comment">
                  <strong>{c.username}:</strong> {c.comment}
                </div>
              ))
            ) : (
              <p>No comments yet.</p>
            )}

            <textarea
              value={commentText[recipe._id] || ''}
              onChange={(e) => setCommentText(prev => ({ ...prev, [recipe._id]: e.target.value }))}
              placeholder="Write a comment..."
            />
            <button onClick={() => handleCommentSubmit(recipe._id)}>💬 Comment</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecipeFeed;
