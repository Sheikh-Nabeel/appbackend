import mongoose,{ Schema} from "mongoose";

const pdfschema=new Schema({
    filename:{
        type:String,
        required:true
    },
})

export const Pdf=mongoose.model("Pdf",pdfschema)