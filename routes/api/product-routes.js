const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

router.get('/', async (req, res) => {
  try {
    const ProductData = await Product.findAll({ include: [Category, Tag] });
    res.status(200).json(ProductData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get all products and includes its associated Category and Tag data

router.get('/:id', async (req, res) => {
  try {
    const ProductData = await Product.findByPk(req.params.id,
      {
        include: [Category, Tag],
      });

    if ((!ProductData)) {
      res.status(404).json({
        message: "Product does not exist."
      });
      return;
    }
    res.status(200).json(ProductData);
  } catch (error) {
    res.status(500).json(error)
  }
});

// find one Product by its `id` value and includs its associated categories and tags
// if Product does not a exist a response will be sent with that information

router.post('/', async (req, res) => {
  Product.create(req.body)
    .then((newProduct) => {
      if (req.body.tagIds && req.body.tagIds.length) {
        const prodTagId = req.body.tagIds.map((tag_id) => {
          return {
            newProduct_id: newProduct.id, tag_id,
          };
        });
        return ProductTag.bulkCreate(prodTagId);
      }
    })
    .then((prodTagId) => res.status(200).json(prodTagId))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// Creates a new product that includes an associated product tag

router.put('/:id', (req, res) => {
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id, tag_id,
          };
        });
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      res.status(400).json(err);
    });
});

// updates product data and removes the old product data

router.delete('/:id', async (req, res) => {

  const productData = await Product.destroy({
    where: {
      id: req.params.id,
    }
  })
    .then((productData) => {
      console.log(productData);
      res.json(productData);
    })
    .catch((error) => res.status(500).json(error));
});

// deletes a product based upon its ID

module.exports = router;
