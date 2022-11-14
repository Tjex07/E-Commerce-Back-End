const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  try {
    const categoryData = await Category.findAll({ include: [Product] });
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error);
  }
})
// finds all categories and includes its associated Products

router.get('/:id', async (req, res) => {
  try {
    const categoryData = await Category.findByPk(req.params.id,
      {
        include: [Product],
      });

    if ((!categoryData)) {
      res.status(404).json({
        message: "Category does not exist."
      });
      return;
    }
    res.status(200).json(categoryData);
  } catch (error) {
    res.status(500).json(error)
  }

});

// find one category by its `id` value and includs its associated Products
// if category does not a exist a response will be sent with that information


router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});
// Allows the creation of a new category

router.put('/:id', async (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id,
    }
  })
    .then((categoryData) => res.status(200).json(categoryData))
    .catch((error) => res.status(500).json(error));

});

// updates a category by appending its `id` value

router.delete('/:id', async (req, res) => {
  const categoryData = await Category.destroy({
    where: {
      id: req.params.id,
    }
  })
    .then((categoryData) => {
      console.log(categoryData);
      res.json(categoryData);
    })

    .catch((error) => res.status(500).json(error));
});

//Allows the deletion of a category using its 'id' value

module.exports = router;
