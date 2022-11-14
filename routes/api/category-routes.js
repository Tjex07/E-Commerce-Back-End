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
}
  // find all categories
  // be sure to include its associated Products
);

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


router.post('/', async (req, res) => {
  try {
    const categoryData = await Category.create(req.body);
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(400).json(err);
  }
});


// find one category by its `id` value
// be sure to include its associated Products


router.put('/:id', async (req, res) => {
  Category.update(req.body, {
    where: {
      id: req.params.id,
    }
  })
  .then ((categoryData) => res.status(200).json(categoryData))
  .catch((error) => res.status(500).json(error));
  // update a category by its `id` value
});

router.delete('/:id', async(req, res) => {
  const categoryData = await Category.destroy({ where: {
   id: req.params.id,
  }

})
  .then((categoryData) => {
    console.log(categoryData);
    res.json(categoryData);
  })
  
  .catch((error) => res.status(500).json(error));
});

module.exports = router;
