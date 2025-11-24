import express from "express";
import mongoose from "mongoose";
import bodyParser from 'body-parser';

import userRouter from "./routes/userRouter.js";
import productRouter from "./routes/productRouter.js";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config()


const app = express();

const mongoUrl = process.env.MONGO_DB_URI

app.use(cors())

mongoose.connect(mongoUrl,{})

const connection = mongoose.connection;

connection.once("open",()=>{
  console.log("Database connected");
})


app.use(bodyParser.json())

app.use(

  (req,res,next)=>{



    const token = req.header("Authorization")?.replace("Bearer ","")
    console.log(token)

    if(token != null){
      jwt.verify(token,process.env.SECRET , (error,decoded)=>{

        if(!error){
          req.user = decoded   
          console.log(decoded)     
        }

      })
    }

    next()

  }

)


app.use("/api/users", userRouter);
app.use("/api/products", productRouter);


app.listen(5000, () => {
  console.log("Server is started on port 5000");
});
