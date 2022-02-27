//importing  User Model from models
const User = require("../models/User");
//importing verify Token
const {verifyTokenAndAuthorization,verifyTokenAndAdmin} = require("./verifyToken")
//creating a router
const router = require("express").Router()



///As we have performed the login and register function in the auth file Now we will perform other operation in this 
//file

//////////////////////////////////

// Only the user with a valid token can update
//Update 

router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
    
    // if password exists than we will encrypt the password


  if (req.body.password) {  req.body.password = CryptoJS.AES.encrypt( req.body.password,process.env.PASS_SEC).toString() }

 
  try {
      // now we will update the user with the id

    const updatedUser = await User.findByIdAndUpdate( req.params.id,{$set : req.body},{new : true})

    // sending the response if the user is updated
    res.status(200).json(updatedUser)

  } catch (err) {
      // sending the response if there occured an errror
    res.status(500).json(err)
  }
});



// Deleting the user
// if the user has the token than he can del the user

router.delete("/:id", verifyTokenAndAuthorization, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("User has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});


//Only admin can get the user with a specific id
//GET USER
router.get("/find/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    // sending all the fileds of user except the password
    const { password, ...others } = user._doc
    // sending the response
    res.status(200).json(others)
  } catch (err) {
// if there occured an error it will give the following response

    res.status(500).json(err);
  }
});

//GET ALL USER
// Only the admin can get all the user

router.get("/", verifyTokenAndAdmin, async (req, res) => {
    //query
  const query = req.query.new;
  try {

    //if query exists then sort the users by the desending case limit will be 5
    const users = query
      ? await User.find().sort({ _id: -1 }).limit(5)
      : await User.find()

      // sending the response
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});


// Only the admin can get the stats like how many users registerd loged or how many purchased
//GET USER STATS

router.get("/stats", verifyTokenAndAdmin, async (req, res) => {
    // gettng the date
  const date = new Date()
   // setting the Year to previous so to get the previous year result
  const lastYear = new Date(date.setFullYear(date.getFullYear() - 1))

  try {
    // Advanced mongodb functions
    const data = await User.aggregate([
      { $match: { createdAt: { $gte: lastYear } } },
      {
        $project: {
          month: { $month: "$createdAt" },
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: 1 },
        },
      },
    ]);
    res.status(200).json(data)
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
