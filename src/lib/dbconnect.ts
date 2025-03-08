import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

const URI = process.env.MONGODB_URI
async function dbConnect(): Promise<void> {
    if (connection.isConnected) {
        console.log("Already connected to database");
        return
    }

    try{
        const db = await mongoose.connect('mongodb+srv://JustAskingUser:JustAskingPassword@justasking.cxleo.mongodb.net/' , {})

        connection.isConnected = db.connections[0].readyState

        console.log("DB connected successfully");

    }catch(error){
        console.log("Database connection failed", error)
        
        process.exit()
    }
}

export default dbConnect;