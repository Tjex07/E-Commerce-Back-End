const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const ProductData = await Product.findAll({ include: [Category, Tag] });
    res.status(200).json(ProductData);
  } catch (error) {
    res.status(500).json(error);
  }
});

// get one product
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

// create new product

router.post('/', async (req, res) => {

Product.create(req.body)
.then((product) => {
  // if there's product tags, we need to create pairings to bulk create in the ProductTag model
  if (req.body.tagIds && req.body.tagIds.length) {
    const prodTagId = req.body.tagIds.map((tag_id) => {
      return {
        product_id: product.id, tag_id,
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

// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  const productData = await Product.destroy({ where: {
    id: req.params.id,
   }
  })


   .then((productData) => {
    console.log(productData);
    res.json(productData);

   })
   
   .catch((error) => res.status(500).json(error));
 });


module.exports = router;
