import mongoose,{ Schema} from "mongoose";

const pdfschema=new Schema({
    file_url:{
        type:String,
        required:true
    },
    cloudinary_id:{
        type:String,
        required:true
    }
})

export const Pdf=mongoose.model("Pdf",pdfschema)