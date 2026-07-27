const mongoose = require("mongoose");

function connectDb() {
    mongoose
        .connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Server is connected to database");
        })
        .catch((err) => {
            console.log("Error occurred connecting to DB");
            console.error(err);
            process.exit(1); // Close the server if DB connection fails
        });
}

module.exports = connectDb;