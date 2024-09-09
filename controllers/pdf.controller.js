import {apierror}from '../utils/apierror.js'
import {asynchandler}from '../utils/asynchandler.js'
import {apiresponse}from '../utils/responsehandler.js'
import { Pdf } from '../models/pdf.model.js'
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadpdf=asynchandler(async(req,res)=>{
 const filename=req.file.filename
 

 try {
   let data=await  Pdf.create({
        filename,
       
     })
     res.json({
        status:"ok"
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
        
    }
})

const deletepdf=asynchandler(async(req,res)=>{
    const oldFilename = req.params.filename;
    const oldFilePath = path.join(__dirname, '../public/uploads', oldFilename);
   fs.unlink(oldFilePath,(err)=>
    {
        if (err) {
            // Handle error if file does not exist or cannot be deleted
            return res.status(500).json({ message: 'Failed to delete file' });
          }
      
          res.json({ message: 'File deleted successfully' });
      
    })
    await  Pdf.deleteOne({filename:oldFilename})
   

     

})

const updatepdf=asynchandler(async(req,res)=>{
    const oldFilename = req.params.filename;
    const oldFilePath = path.join(__dirname, '../public/uploads', oldFilename);

    fs.unlink(oldFilePath,(err)=>
        {
            if (err) {
                // Handle error if file does not exist or cannot be deleted
                return res.status(500).json({ message: 'Failed to delete file' });
              }
          
             
          
        })
        await  Pdf.deleteOne({filename:oldFilename})




        const filename=req.file.filename
 

 try {
let data=await Pdf.create({
        filename,
       
     })
     res.json(
        new apiresponse(200,data,"Data updated")
     )
    
 } catch (error) {
   
    throw new apierror(400,"Error while uploading file")
 }
 


})

export {uploadpdf,getpdf,deletepdf,updatepdf}