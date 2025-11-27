import Product from "../models/product.js"
import { isAdmin } from "./userController.js";

export async function createProduct(req, res){
    if(!isAdmin(req)){ 
        return res.status(403).json({
            message: "You are not authorized to create a product"
        });
    }

    try {
        const productData = req.body;
        const product = new Product(productData);
        await product.save();

        res.json({
            message: "Product created successfully",
            product: product
        });  

    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Failed to create product",
            error: error.message
        });
    }
}


export async function getProducts(req, res){
    try{
        const products = await Product.find();
        res.json(products);
    }catch(error){
        console.log(error);
        res.status(500).json({
            message: "Failed to fetch products",
            error: error.message
        })
    }
}

export async function deleteProduct(req, res) {
    if(!isAdmin(req)){
        res.status(403).json({
            message: "You are not authorized to delete a product"
        })
        return
    }
    try{
        const productID = req.params.id;
        await Product.deleteOne({
            ProductID: productID
    
        })
      
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Failed to delete product",
            error: err.message
        })
    }
}


export async function updateProduct(req, res) {
    if(!isAdmin(req)){
        res.status(403).json({
            message: "You are not authorized to update a product"
        })
        return
    }
    try{
        const productID = req.params.productID;

        const updateData = req.body;
        await Product.updateOne(
           {productID: productID},
           updateData
        );
        res.json({
            message: "Product updated successfully"
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Failed to update product",
            error: err.message
        })  
        
    }
}


// In your productController.js - Update the getProductId function
export async function getProductId(req, res) {
    try {
        const productID = req.params.id; // Changed from productID to id
        const product = await Product.findOne({ productID: productID }); // Fixed findById to findOne
        
        if (!product) {
            return res.status(404).json({
                message: "Product not found"
            });
        }
        
        res.json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Failed to fetch product",
            error: err.message
        });
    }
}