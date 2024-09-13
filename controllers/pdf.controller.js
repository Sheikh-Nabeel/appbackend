import {apierror}from '../utils/apierror.js'
import {asynchandler}from '../utils/asynchandler.js'
import {apiresponse}from '../utils/responsehandler.js'
 
import { User } from '../models/user.model.js'
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../middlewares/cloudinary.middelware.js';
import fs from 'fs';
import { promisify } from 'util'
 

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadpdf=asynchandler(async(req,res)=>{
//  const filename=req.file.filename
 
const {pdfname}=req.body


 try {
    const user=await User.findById(req.params.id).select("-password")
    const result= await cloudinary.uploader.upload(req.file.path,{
        resource_type:"raw",
        access_mode:"public",
        format:"pdf",
        use_filename:true,
        unique_filename:false

    })
    user.pdfs.push({
        pdfname:pdfname,
        file_url:result.secure_url,
        cloudinary_id:result.public_id
       
     })
     
     await user.save()
     res.json({
        status:"File created",user
     })
    
 } catch (error) {
   
    throw new apierror(400,"Error while uploading file")
 }
 
})

const getpdf=asynchandler(async(req,res)=>{
    try {
        let user=await User.findById(req.params.id).select("-password")
        
        res.send(user)
    } catch (error) {
        console.log(error)
    }
})

const destroyAsync = promisify(cloudinary.uploader.destroy);
const deletepdf=asynchandler(async(req,res)=>{
  
    try {
        // Fetch the user document without the password field
        const user = await User.findById(req.params.id).select("-password");
        
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        const pdfid =req.params.pdfid.toString();
    
        // Destroy the PDF from Cloudinary
     await   cloudinary.uploader.destroy(pdfid,{invalidate:true,resource_type:"raw",}, async (error, result) => {
          if (error) {
            console.error('Cloudinary delete error:', error);
            return res.status(500).json({ message: "Failed to delete file from Cloudinary" });
          }
           
          console.log('Cloudinary delete result:', result);
    
          // Update the user document by removing the PDF with the matching Cloudinary ID
          const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $pull: { pdfs: { cloudinary_id: pdfid } } },
            { new: true } // Return the updated document
          );
    
          if (!updatedUser) {
            return res.status(404).json({ message: "Failed to update user" });
          }
    
          // Send the updated user document in the response
          res.json(updatedUser);
        });
      } catch (error) {
        // Log and send the error response
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }
     

})

const updatepdf=asynchandler(async(req,res)=>{
    const {pdfname}=req.body
    try {
        // Fetch the user document without the password field
        const user = await User.findById(req.params.id).select("-password");
       
        if (!user) {
          return res.status(404).json({ message: "User not found" });
        }
    
        const pdfid = req.params.pdfid.toString();
    
        // Destroy the PDF from Cloudinary
        const cloudinaryDestroyResult = await cloudinary.uploader.destroy(pdfid, {
          invalidate: true,
          resource_type: "raw"
        });
    
        console.log('Cloudinary delete result:', cloudinaryDestroyResult);
    
        // Update the user document by removing the PDF with the matching Cloudinary ID
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { $pull: { pdfs: { cloudinary_id: pdfid } } },
          { new: true } // Return the updated document
        );
    
        if (!updatedUser) {
          return res.status(404).json({ message: "Failed to update user" });
        }
    
        // Upload the new PDF to Cloudinary
        const result2 = await cloudinary.uploader.upload(req.file.path, {
          resource_type: "raw",
          access_mode: "public",
          format: "pdf"
        });
    
        updatedUser.pdfs.push({
          file_url: result2.secure_url,
          cloudinary_id: result2.public_id
        });
    
        await updatedUser.save();
    
        // Send the updated user document in the response
        res.json(updatedUser);
    
      } catch (error) {
        // Log and send the error response
        console.error(error);
        res.status(500).json({ message: "Internal Server Error" });
      }

})

export {uploadpdf,getpdf,deletepdf,updatepdf}