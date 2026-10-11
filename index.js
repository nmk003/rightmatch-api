import express from "express";
import dotenv from 'dotenv';

const app = express();
dotenv.config()

const PORT = process.env.PORT;

app.use(PORT, ()=>{
    console.log(`Server is Ruuning on PORT: ${PORT}`)
})