import mongoose from "mongoose";

const db = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/graphql");
        console.log("db connected")
        
    } catch (error) {
        console.error(error)
        process.exit(1)
    }
}

export {db}