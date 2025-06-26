import Product from "../models/Product.js";
import cloudinary from "../config/cloudinary.js";

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}).sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Failed to fetch products:", error);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (error) {
    console.error("❌ Get Product Error:", error);
    res.status(500).json({ message: "Failed to fetch product" });
  }
};

export const createProduct = async (req, res) => {
  try {
    let { name, price, description, quantity, category, fabric, size } = req.body;

    if (size && !Array.isArray(size)) {
      size = [size];
    } else if (!size) {
      size = [];
    }

    let imageUrl = "";
    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "products",
        });
        imageUrl = result.secure_url;
      } catch (uploadError) {
        console.error("❌ Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ message: "Cloudinary upload failed" });
      }
    } else {
      console.warn("⚠️ No image file uploaded.");
    }

    const product = new Product({
      name,
      price,
      description,
      quantity,
      category,
      fabric,
      size,
      image: imageUrl,
    });

    const created = await product.save();
    res.status(201).json(created);
  } catch (error) {
    console.error("❌ Product Creation Error:", error);
    res.status(500).json({ message: "Product creation failed" });
  }
};

export const updateProduct = async (req, res) => {
  try {
    let { name, price, description, quantity, category, fabric, size } = req.body;

    if (size && !Array.isArray(size)) {
      size = [size];
    } else if (!size) {
      size = [];
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "products",
        });
        product.image = result.secure_url;
      } catch (uploadError) {
        console.error("❌ Cloudinary Upload Error (Update):", uploadError);
        return res.status(500).json({ message: "Cloudinary upload failed" });
      }
    }

    product.name = name;
    product.price = price;
    product.description = description;
    product.quantity = quantity;
    product.category = category;
    product.fabric = fabric;
    product.size = size;

    const updated = await product.save();
    res.json(updated);
  } catch (error) {
    console.error("❌ Product Update Error:", error);
    res.status(500).json({ message: "Product update failed" });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    await product.deleteOne();
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("❌ Product Deletion Error:", error);
    res.status(500).json({ message: "Product deletion failed" });
  }
};