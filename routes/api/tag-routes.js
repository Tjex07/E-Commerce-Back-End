const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagyData = await Tag.findAll({ include: [Product] });
    res.status(200).json(tagyData);
  } catch (error) {
    res.status(500).json(error);
  }
}
);

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagyData = await Tag.findByPk(req.params.id,
      {
        include: [Product],
      });

    if ((!tagyData)) {
      res.status(404).json({
        message: "Tag does not exist."
      });
      return;
    }
    res.status(200).json(tagyData);
  } catch (error) {
    res.status(500).json(error)
  }

});


  // create a new tag
  router.post('/', async (req, res) => {
    try {
      const tagyData = await Tag.create(req.body);
      res.status(200).json(tagyData);
    } catch (err) {
      res.status(400).json(err);
    }
  });
  


router.put('/:id', async (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    }
  })
  .then ((tagyData) => res.status(200).json(tagyData))
  .catch((error) => res.status(500).json(error))
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  const tagData = await Tag.delete({ where: {
    id: req.params.id,
   }
   .then ((tagData) => res.status(200).json(tagData))
   })
   
   .catch((error) => res.status(500).json(error));
 });


module.exports = router;
