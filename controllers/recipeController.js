// controllers/recipeController.js
import Recipe from '../models/recipe.js';

// GET /api/recipes
export const getAll = async (req, res) => {
  try {
    const recipes = await Recipe.findAll({
      where: { userId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(recipes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération des recettes.' });
  }
};

// GET /api/recipes/:id
export const getOne = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || String(recipe.userId) !== String(req.user.id)) {
      return res.status(404).json({ message: 'Recette introuvable.' });
    }
    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la récupération de la recette.' });
  }
};

// POST /api/recipes
export const createOne = async (req, res) => {
  try {
    const { name, ingredients, instructions, category, imageUrl } = req.body || {};
    if (!name || !ingredients || !instructions || !category) {
      return res.status(400).json({ message: 'name, ingredients, instructions et category sont requis.' });
    }

    const recipe = await Recipe.create({
      name,
      ingredients,
      instructions,
      category,
      imageUrl: imageUrl || null,
      userId: req.user.id
    });

    res.status(201).json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la création de la recette.' });
  }
};

// PUT /api/recipes/:id
export const updateOne = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || String(recipe.userId) !== String(req.user.id)) {
      return res.status(404).json({ message: 'Recette introuvable.' });
    }

    const updatable = ['name', 'ingredients', 'instructions', 'category', 'imageUrl'];
    for (const k of updatable) {
      if (k in req.body) recipe[k] = req.body[k];
    }
    await recipe.save();

    res.json(recipe);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour de la recette.' });
  }
};

// DELETE /api/recipes/:id
export const removeOne = async (req, res) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);
    if (!recipe || String(recipe.userId) !== String(req.user.id)) {
      return res.status(404).json({ message: 'Recette introuvable.' });
    }

    await recipe.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la suppression de la recette.' });
  }
};