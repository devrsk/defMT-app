const { Product } = require("../models/Product");
const { isAdmin } = require("../middleware/auth");
const cloudinary = require("../utils/cloudinary");
const multer = require("multer");

// Use multer for file handling
const storage = multer.memoryStorage(); // Store file in memory
const upload = multer({ storage }); // Initialize multer with memory storage

const router = require("express").Router();

// CREATE
router.post("/", isAdmin, upload.single("image"), async (req, res) => {
  const { name, brand, desc, price } = req.body;
  const image = req.file; // Get file from multer

  try {
    let imageUrl = "";

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image.buffer, {
        upload_preset: "online-shop",
      });

      if (uploadedResponse) {
        imageUrl = uploadedResponse.secure_url; // Save URL of uploaded image
      }
    }

    const product = new Product({
      name,
      brand,
      desc,
      price,
      image: imageUrl, // Save URL in product
    });

    const savedProduct = await product.save();
    res.status(200).send(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: error.message });
  }
});

// DELETE
router.delete("/:id", isAdmin, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).send("Product has been deleted...");
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  const qbrand = req.query.brand;
  try {
    let products;

    if (qbrand) {
      products = await Product.find({ brand: qbrand });
    } else {
      products = await Product.find();
    }

    res.status(200).send(products);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// GET PRODUCT
router.get("/find/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

// UPDATE
router.put("/:id", isAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).send(updatedProduct);
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

module.exports = router;
