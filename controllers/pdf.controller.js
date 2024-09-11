import {apierror}from '../utils/apierror.js'
import {asynchandler}from '../utils/asynchandler.js'
import {apiresponse}from '../utils/responsehandler.js'
import { Pdf } from '../models/pdf.model.js'
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../middlewares/cloudinary.middelware.js';
import fs from 'fs';
import { User } from '../models/user.model.js';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadpdf=asynchandler(async(req,res)=>{
//  const filename=req.file.filename
 

 try {
    
    const result= await cloudinary.uploader.upload(req.file.path,{
        resource_type:"raw",
        access_mode:"public",
        format:"pdf"
    })
   let data=await  Pdf.create({
        file_url:result.secure_url,
        cloudinary_id:result.public_id
       
     })
     res.json({
        status:"File created"
     })
    
 } catch (error) {
   
    throw new apierror(400,"Error while uploading file")
 }
 
})

const getpdf=asynchandler(async(req,res)=>{
    try {
        let data=await Pdf.find({})
        res.send(data)
    } catch (error) {
        console.log(error)
    }
})

const deletepdf=asynchandler(async(req,res)=>{
  
    try {
        let pdf=await Pdf.findById(req.params.id)

        await cloudinary.uploader.destroy(pdf.cloudinary_id);

         await Pdf.deleteOne({cloudinary_id:pdf.cloudinary_id})
         res.json({File:"Deleted"})
      


    } catch (error) {
        console.log(error)
    }
   

     

})

const updatepdf=asynchandler(async(req,res)=>{
   
    try {
        let pdf=await Pdf.findById(req.params.id)

        await cloudinary.uploader.destroy(pdf.cloudinary_id);
      
        const result= await cloudinary.uploader.upload(req.file.path)
        let data={
             file_url:result.secure_url || pdf.file_url,
             cloudinary_id:result.public_id ||pdf.cloudinary_id
            
        }

        pdf=await Pdf.findByIdAndUpdate(req.params.id,data,{new:true})
        res.json(pdf)
    } catch (error) {
        console.log(error)
    }


})

export {uploadpdf,getpdf,deletepdf,updatepdf}