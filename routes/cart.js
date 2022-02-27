//importing cart modal from Cart
const Cart = require("../models/Cart");
//importing verify Token
const { verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken");
//creating a router
const router = require("express").Router();

// create a cart  
// user can create a cart if the user has the token
//route (/api/carts/)

router.post("/", verifyToken, async (req, res) => {
    // newCart has data that is in req.body

  const newCart = new Cart(req.body);

  try {
      //saving the cart in our db
    const savedCart = await newCart.save()
    // sending the response
    res.status(200).json(savedCart)

  } catch (err) {
      // if there is error then sending this response
    res.status(500).json(err);
  }
});

//updating the cart 
// the user will be able to update the cart if he is admin or if he has the same id that is in the request
//route (/api/carts/:id)

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
      // finding the cart products and updating it
    const updatedCart = await Cart.findByIdAndUpdate(req.params.id,{$set: req.body},{ new: true } )

    // sending the responses after updating
    res.status(200).json(updatedCart)

  } catch (err) {
      //sending the response if there is an error
    res.status(500).json(err)
  }
});


/// Deleting the Cart
// The user can delete the cart if he is admin or the cart belongs to him
//route (/api/carts/:id)

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
   // finding the Cart by id and deleting it
    await Cart.findByIdAndDelete(req.params.id)

    res.status(200).json("Cart has been deleted...")

  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER CART
// the id does not mean the cart id 
// but the id to which it belongs
//route (/api/carts/find/:userId)

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
      // finding the cart with the specific id
    const cart = await Cart.findOne({ userId: req.params.userId });
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json(err);
  }
});


//GET ALL
// Only The admin can get all the cart data
//route (/api/carts/)

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
      //getting all the carts
    const carts = await Cart.find()

    res.status(200).json(carts);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
