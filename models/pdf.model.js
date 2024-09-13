import mongoose, { Schema } from "mongoose";

const pdfSchema = new Schema({
     pdfname:{
type:String,
 
     },
    file_url: { // URL to the uploaded PDF on Cloudinary or another cloud service
        type: String,
        required: true
    },
    cloudinary_id: { // ID of the file on Cloudinary
        type: String,
        required: true
    }
}, { timestamps: true });

export const Pdf = mongoose.model("Pdf", pdfSchema);
