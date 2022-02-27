const mongoose = require("mongoose")

let Conn = async()=>{
    try{

        let db =await mongoose.connect("mongodb://localhost:27017/ecommercesite")
        
        console.log("Connection Established ")
        console.log(`Mongodb connected with ${db.connection.host}`)

    }catch(err){
         console.log(err)
    }
}

module.exports = Conn