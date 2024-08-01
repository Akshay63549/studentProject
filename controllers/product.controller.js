const Product = require('../models/productModel');
const remove = require("../utils/remove.util");
//add product
exports.add_product = async (req, res) => {
    try {
       
        const {title, desc,price} = req.body;
        let gallery = [];
          if (req.files.gallery.length) {
            gallery = req.files.gallery.map((file) => ({
              url: file.path,
              public_id: file.filename,
            }));
          }
        // Create a new product
        let product = await Product.create({
            title, desc,price,gallery 
        })
        res.status(201).json({ success: true, message: 'Product added successfully', data: product });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}

//get all products
exports.get_all_products = async (req, res) => {
    try {
        let page = Number(req.query.page) || 1;
        let limit = Number(req.query.limit) || 10;
        let skip = (page - 1) * limit;
        const searchQuery = req.query.search || '';
        // Create a regular expression for case-insensitive search
        const searchRegex = new RegExp(searchQuery, 'i');

        // Define the search conditions
        const searchConditions = {
            $or: [
                { title: { $regex: searchRegex } },
                { desc: { $regex: searchRegex } },
                // Add more fields as needed
            ],
        };

        // Query products with search condition and pagination
        const products = await Product.find(searchConditions)
            .skip(skip)
            .limit(limit).sort({_id:-1});

        // Count total items for pagination
        const count = await Product.countDocuments(searchConditions);

        const response = {
            success: true,
            message: 'data found',
            page: page,
            perPage: limit,
            data: products,
            totalItems: count
        };

        res.status(200).send(response);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
};

//update product
exports.update_product = async (req, res) => {
    try {
        const id = req.params.id;
        const updates = req.body;
        let gallery = [];
        // Find the existing product by ID
        const existingProduct = await Product.findById(id);
        
        if (
            !req?.body?.gallery?.length > 0 &&
            req.files &&
            req.files.gallery?.length > 0
          ) {
            for (let i = 0; i < existingProduct.gallery.length; i++) {
              await remove(existingProduct.gallery[i].public_id);
            }
        
            updates.gallery = req.files.gallery.map((file) => ({
              url: file.path,
              public_id: file.filename,
            }));
          }


        if (req?.files?.gallery?.length) {
          gallery = req.files.gallery.map((file) => ({
            url: file.path,
            public_id: file.filename,
          }));
        }
        const options = { new: true };
      
        // If the product with the given ID does not exist
        if (!existingProduct) {
            return res.status(404).json({ success: false, message: 'Product not found' });
        }

            const result = await Product.findByIdAndUpdate(id, updates, options);
            res.send(result);
    } catch (error) {
        console.log(error.message);
        res.status(500).send(error.message);
    }
};

//delete product
exports.delete_product = async (req, res) => {
    try {
        const id = req.params.id
        const product = await Product.findById(id);

        if (product.gallery && product.gallery.length > 0) {
          for (let i = 0; i < product.gallery.length; i++) {
            await remove(product.gallery[i].public_id);
          }
        }
        const result = await Product.findByIdAndDelete(id)
        const response = {
            success: true,
            message: 'data deleted successfully',
        }
        res.status(200).send(response)
    } catch (error) {
        console.log(error.message);
        res.status(500).send('Internal Server Error');
    }
}

//single product
exports.single_product = async (req, res) => {
    const id = req.params.id
    try {
        const product = await Product.findById(id)
        const response = {
            success: true,
            message: 'product details',
            data: product
        }
        res.status(200).send(response)
    } catch (error) {
        console.log(error.message);
        res.status(404).send("Not Found");

    }
}





