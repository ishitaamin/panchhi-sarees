import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const getAllProducts = async (req, res) => {
  const products = await Product.find({});
  res.json(products);
};

export const getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });
  res.json(product);
};

export const createProduct = async (req, res) => {
  const { name, price, description, quantity, category, fabric, image } = req.body;

  let imageUrl = image;
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path);
    imageUrl = result.secure_url;
  }

  const product = new Product({
    name,
    price,
    description,
    quantity,
    category,
    fabric,
    image: imageUrl,
  });

  const created = await product.save();
  res.status(201).json(created);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  await product.deleteOne();
  res.json({ message: "Product deleted" });
};
