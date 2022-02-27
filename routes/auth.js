const router = require("express").Router()
const jwt = require("jsonwebtoken")
const CryptoJS = require("crypto-js")
const User = require("../models/User")


///register router full route is (/api/auth/register)

router.post("/register" , async(req , res)=>{

    //registering the new User 

        const user = new User({
            username : req.body.username,
            email : req.body.email,
             //hashing the password
            password : CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
        })

    try{

        //saving it in our db

        const save =await user.save()

        //sending the response

        res.json({message : save }).status(201)


    }catch(err){
       res.json({message : err}).status(500)
    } 
})

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

//login route full route (/api/auth/login)


router.post("/login" , async(req , res)=>{
    try{
        //finding the user in the db if it is registered or not  (by user's name)

        const logedUser = await User.findOne({username : req.body.username})

        // if the user do not exist
       !logedUser && res.json({message : "user do not exist"}).status(404)

       //hashing the password 
       //logedUser has all the user information like (email , password , username)
       //so to get password we type (logedUser.password)

       const hashPassword = CryptoJS.AES.decrypt(logedUser.password, process.env.PASS_SEC).toString(CryptoJS.enc.Utf8)

       //checking if the password matches

       hashPassword != req.body.password &&  res.status(401).json("Wrong Credentials")


       //generation a jwt token that we will use further 
       // fetching the logedUser id and checking if the user is Admin or not to generate a jwt tokens
       // the token will expire in 3days as defined below and we making key for JWT In ENV file

       const accessToken = jwt.sign({ id: logedUser._id,isAdmin: logedUser.isAdmin},process.env.JWT_SEC,
        {expiresIn:"3d"} )
        
       
        //sending all the logedUser  data except the password 

        const { password, ...others } = logedUser._doc

        // sending the response
        res.json({...others, accessToken}).status(200)

    }catch(err){
       res.json({message : err}).status(500)
    } 
})


module.exports = router