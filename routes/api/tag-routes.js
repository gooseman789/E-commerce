const router = require('express').Router();
const { Tag, Product, ProductTag, Category } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: [{model: Product, through: ProductTag}]
    })
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err)
  }
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{model: Product, through: ProductTag}]
    })
    if (!tagData) {
      res.status(404).json({message: 'No tag found with that id, sorry!'})
    }
    res.status(200).json(tagData)
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err)
  }
});

router.put('/:id', async (req, res) => {
  try {
    const [numAffectedRows, updatedTags] = await Tag.update(
      {
        tag_name: req.body.name
      },
      {
        where: {
          id: req.params.id
        },
        returning: true 
      }
    );
    if (numAffectedRows === 0) {
      return res.status(404).json({ message: 'No tag found with that id' });
    }
    res.json(updatedTags);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const tagData = await Tag.findByPk(req.params.id);
    if (!tagData) {
      return res.status(404).json({ message: 'No tag found with that id' })
    }
    await Tag.destroy({
      where: { id: req.params.id }
    });
    res.json(tagData)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Internal Server Error' })
  }
});

module.exports = router;
