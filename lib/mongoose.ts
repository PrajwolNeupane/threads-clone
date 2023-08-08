import mongoose from 'mongoose';

let isConnected = false;

export const connectToDB = async ()=>{
    mongoose.set('strictQuery',true);
    if(!process.env.MONGODB_URL){
        console.log('Mongo DB URL not found');
        return;
    }
    if(isConnected){
        console.log("Already connected to MongoDB");
        return;
    }
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to mongodb");
        isConnected = true;
    }catch(error){
        console.log("Error on connecting mongo db");
        console.log(error);
    }
}