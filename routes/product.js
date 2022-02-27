//importing the product modal from product
const Product = require("../models/Product");
//importing the verifyTokenAdmin from "verifyToken"
const { verifyTokenAndAdmin } = require("./verifyToken");
//making the the router with express.Router()
const router = require("express").Router();


// Creating the product 
// Only the admin will have the authority to create the product
// route (/api/products/)


router.post("/", verifyTokenAndAdmin, async (req, res) => {

    // creating the product 
    // req.body contains all the fields
    const newProduct = new Product(req.body);

  try {
    //saving the product in our db
    const savedProduct = await newProduct.save()
    // sending the response if every thing goes well
    res.json(savedProduct).status(201)

  } catch (err) {
      // if there is error it will send the below response
    res.status(500).json(err);
  }
});

// Only the admin will have the authority to update the product
// Update 
// route (/api/products/:id)

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
      // first finding the product by id and then updating it
      //mongodb function included
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, {$set : req.body} ,{new : true})

    // sending the res 
    res.json(updatedProduct).status(200)

  } 
  catch (err) {
    // if there is error then it will send the following error
    res.status(500).json(err);
  }
});


// Only the Admin will have the authority to del the product
//DELETE
// route (/api/products/:id)

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
      // finding the product by its id and deleting it 
    await Product.findByIdAndDelete(req.params.id)
    // sending the response
    res.status(200).json("Product has been deleted...");
  } catch (err) {
      // if error occured
    res.status(500).json(err);
  }
});



//GET PRODUCT by id
// User will have the authority to get single product
// route (/api/products/find/:id)

router.get("/find/:id", async (req, res) => {
  try {
      //finding product by its id
    const product = await Product.findById(req.params.id)
    //sending the response
    res.status(200).json(product);
  } catch (err) {
      //sending the response if there is an error
    res.status(500).json(err);
  }
});

// The user will have the authority to get product
//GET ALL PRODUCTS
// route (/api/products/)

router.get("/", async (req, res) => {
    // getting query so that we will use it to show the related porducts
  const qNew = req.query.new
  const qCategory = req.query.category

  try {

    let products
  // if qNew exist then it will find all the product will the latest date
    if (qNew) {
      products = await Product.find().sort({ createdAt: -1 }).limit(1);
    } else if (qCategory) {

        // finding the product based on query and using advanced mongodb funcion ($in)
      products = await Product.find({
        categories: {
          $in: [qCategory],
        },
      });
    } else {
        //if there is no query it will give you all the products
      products = await Product.find();
    }

    //sending the response
    res.status(200).json(products)

  } catch (err) {
      //res as error
    res.status(500).json(err);
  }
});

module.exports = router;
