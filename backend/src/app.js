const express =require("express");
const cookieParser=require("cookie-parser");
const cors=require("cors");
const app=express();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin:"http://localhost:5173",
    credentials:true    //->we setup data through cookies
}))


/* require all the routes here */
const authRouter = require("./routes/auth.routes");
const interviewRouter = require("./routes/interview.routes");



/* using all the routes here ->add prefix like /api/auth*/
app.use("/api/auth", authRouter);
app.use("/api/interview", interviewRouter);

app.use((error, req, res, next) => {
    if (error.name === "MulterError") {
        const message = error.code === "LIMIT_FILE_SIZE"
            ? "Resume PDF must be 5MB or smaller."
            : "Please upload a PDF file using the 'resume' field.";
        return res.status(400).json({ message });
    }

    if (error) {
        return res.status(500).json({ message: error.message || "Unexpected server error." });
    }

    next();
});



module.exports=app;
