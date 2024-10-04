import mongoose from "mongoose";

const dbConnect = async () => {
  try {

    const connect = await mongoose.connect(process.env.MONGODBURI, {
      dbName: "musicapp",
    });
   
    connect.connection.on("connected", () => {
      console.log("db connected");
    });

  } catch (error) {
    console.log(error);
  }
};

export default dbConnect;
