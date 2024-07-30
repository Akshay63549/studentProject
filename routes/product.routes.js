const express = require('express')
const route = express.Router();
const product_controller = require('../controllers/product.controller')
const multer = require('multer');
const upload = require("../middleware/upload.middleware");
//available routes
//add product
route.post('/addproduct',  upload.fields([{ name: "gallery", maxCount: 3 }]),product_controller.add_product)
//getall product
route.get('/getallproduct', product_controller.get_all_products)
//get single product
route.get('/singleproduct/:id', product_controller.single_product)
//update product
route.put('/updateproduct/:id', upload.fields([{ name: "gallery", maxCount: 3 }]), product_controller.update_product)
//delete product
route.delete('/deleteproduct/:id', product_controller.delete_product)
module.exports = route;
