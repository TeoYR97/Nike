import mongoose from "mongoose";
import dns from "dns";

dns.setServers(["8.8.8.8"]);

const connectDB = async () => {

    try {

        mongoose.connection.on("connected", () => {
            console.log("DB Connected");
        });

        await mongoose.connect(`${process.env.MONGODB_URL}/Nike`);

    } catch (error) {

        console.log("MongoDB connection error:");
        console.log(error.message);

    }
};

export default connectDB;