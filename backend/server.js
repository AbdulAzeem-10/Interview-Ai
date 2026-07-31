require("dotenv").config();
const connectDb=require("./src/config/db");
const app=require("./src/app");
// const invokeGeminiAi=require("./src/services/ai.service")->testing
// const generateInterviewReport=require("./src/services/ai.service")->testing
connectDb();
// invokeGeminiAi();->testing


app.listen(3000,()=>{
    console.log("server is up and running on port 3000");
})