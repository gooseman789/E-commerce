const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findAll({
      include: [{model: Product}]
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product}]
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No product found with that id!'})
    };
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new category
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData)
  } catch (err) {
    res.status(400).json(err);
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [numAffectedRows, updatedCategories] = await Category.update(
      {
        category_name: req.body.name
      },
      {
        where: {
          id: req.params.id
        },
        returning: true 
      }
    );
    if (numAffectedRows === 0) {
      return res.status(404).json({ message: 'No category found with that id' });
    }
    res.json(updatedCategories); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.delete('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id);
    if (!categoryData) {
      return res.status(404).json({ message: 'No category found with that id' });
    }
    await Category.destroy({
      where: { id: req.params.id }
    });
    res.json(categoryData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


module.exports = router;
