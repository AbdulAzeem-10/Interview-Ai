require("dotenv").config();
const connectDb=require("./src/config/db");
const app=require("./src/app");


connectDb();


app.listen(3000,()=>{
    console.log("server is up and running on port 3000");
})