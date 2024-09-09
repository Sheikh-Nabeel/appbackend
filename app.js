import express from "express";
import cors from 'cors';
import cookieParser from "cookie-parser";

const app=express()

app.use(express.static('public'))
app.use(express.urlencoded({extended:true}))
app.use(express.json());
app.use(cors())
app.use(cookieParser())


import userrouter from "./Routes/user.routes.js";
import pdfrouter from './Routes/pdf.routes.js'

app.use('/api/v1/user',userrouter)
app.use('/api/v1/file',pdfrouter)

export {app}
