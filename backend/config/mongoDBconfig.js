import mongoose from "mongoose";

const connectDB= async()=>{
    try {
        const connectionInstance= await mongoose.connect(`${process.env.MONGODB_URI}`)
        mongoose.connection.on('connected',()=>console.log('Database Connected'))
        console.log(`\n MongoDB connectd!!! DB HOST :${connectionInstance.connection.host}`)
        
    } catch (error) {
        console.log("MondgoDB database connection error",error)
    }
}

export default connectDB