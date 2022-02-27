const jwt = require('jsonwebtoken')


//IN this file we will check if the jwt is valid 
//This is a Middleware function thats why we are using next with req and res

const verifyToken = (req, res, next) => {
    // we are getting token from req.headers

    const authHeader = req.headers.token

    // If authHeader exists we will split the token by space and will chose the first element
    
    if (authHeader) {

      const token = authHeader.split(" ")[1]

      //verifying the jwt token by using jwt verify method

      jwt.verify(token, process.env.JWT_SEC, (err, user) => {
        // if err than token not valid
        if (err) res.status(403).json("Token is not valid!")
        // if there is no err we will return the user that have the data you can write any word instead of user its up to you
        req.user = user
        // then we will call the next 
        next()
      })

    } else {

      return res.status(401).json("You are not authenticated!")

    }
  }

  // In this we will check if the user has a valid id for the token as well as checking if the user is admin or not 
  // we are using the verifyToken middleware in it as well

  const verifyTokenAndAuthorization = (req, res, next) => {
      //verifyToken Middleware
    verifyToken(req, res, () => {

        // if the user id matchs the id that is in the params and checking if the user is admin or not
        // even if the user is not admin it will call  next()
      if (req.user.id === req.params.id || req.user.isAdmin) {

        next()
        
      } 
      else {

        res.status(403).json("You are not alowed to do that!")

      }
    });
  }

  // validation token only for admin

  const verifyTokenAndAdmin = (req, res, next) => {
      // in this we are also verfying the jwt token by the verifyToken middleware
      // if the user is admin then it will call the next() other wise call the else part
    verifyToken(req, res, () => {
      if (req.user.isAdmin) {
        next();
      } else {
        res.status(403).json("You are not alowed to do that!");
      }
    });
  }


  //now exporting the middlware function so we can use then in other files

  module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
  };