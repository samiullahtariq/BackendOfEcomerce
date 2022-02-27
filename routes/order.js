//importing Order modal form models 
const Order = require("../models/Order");
//importing verify Token
const { verifyToken,verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken")
//creating a router
const router = require("express").Router()



//creating order 
// if the user has the token then he will be able to create order
//route (/api/orders/)

router.post("/", verifyToken, async (req, res) => {
  // creating the order
  
  const newOrder = new Order(req.body);

  try {
    //saving the order in our db

    const savedOrder = await newOrder.save()

    //sending the response
    res.status(200).json(savedOrder)
  } catch (err) {
    //if there occured an error it will send this response
    res.status(500).json(err)
  }
});

//Only the admin can update the order
//route (/api/orders/:id)

router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    // finding the order and updating it
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    // sending the response
    res.status(200).json(updatedOrder)
  } catch (err) {
    res.status(500).json(err);
  }
});

//Deleting the user 
/// only the admin has the authority to delete the Order
//route (/api/orders/:id)

router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Order has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET USER ORDERS
// GET THE USER ORDERS
//route (/api/orders/:userId)

router.get("/find/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL
// Only Admin has all the order fields
//route (/api/orders/)

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET MONTHLY INCOME
/// ONly admin will have the access to this routes
//route (/api/orders/income)

router.get("/income", verifyTokenAndAdmin, async (req, res) => {
  //writing a query
  const productId = req.query.pid
  // setting a date variable
  const date = new Date()
  // getting the month by performing the action
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1))
  // getting the month before the lastMonth 
  const previousMonth = new Date(new Date().setMonth(lastMonth.getMonth() - 1));

  try {
    // using Advanced Mongodb methods

    const income = await Order.aggregate([

      //if there is productid then elemMatch productId
      { $match: { createdAt: { $gte: previousMonth },...(productId && {products:{$elemMatch :{productId}}}) } },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).json(income);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
