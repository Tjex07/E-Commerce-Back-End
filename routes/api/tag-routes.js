const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {

  try {
    const tagyData = await Tag.findAll({ include: [Product] });
    res.status(200).json(tagyData);
  } catch (error) {
    res.status(500).json(error);
  }
}
);

// find all tags and includes its associated Product data

router.get('/:id', async (req, res) => {

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

// find one tag by its `id` value and includs its associated Products
// if tag does not a exist a response will be sent with that information

router.post('/', async (req, res) => {
  try {
    const tagyData = await Tag.create(req.body);
    res.status(200).json(tagyData);
  } catch (err) {
    res.status(400).json(err);
  }
});
// Allows the creation of a new tag

router.put('/:id', async (req, res) => {
  Tag.update(req.body, {
    where: {
      id: req.params.id,
    }
  })
    .then((tagyData) => res.status(200).json(tagyData))
    .catch((error) => res.status(500).json(error))
});

// updates a tag by appending its `id` value

router.delete('/:id', async (req, res) => {
const tagData = await Tag.delete({
    where: {
      id: req.params.id,
    }
  })
    .then((tagData) => {
      console.log(tagData);
      res.json(tagData);
  })

    .catch((error) => res.status(500).json(error))
});

//Allows the deletion of a tag using its 'id' value
module.exports = router;
