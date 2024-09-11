import { apierror } from '../utils/apierror.js';
import { asynchandler } from '../utils/asynchandler.js';
import { apiresponse } from '../utils/responsehandler.js';
import { Pdf } from '../models/pdf.model.js';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../middlewares/cloudinary.middelware.js';
import fs from 'fs';

// Get __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Upload PDF and Save to Cloudinary
const uploadpdf = asynchandler(async (req, res) => {
  try {
    // Upload PDF to Cloudinary as a raw file
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      format: "pdf",  // Ensures it's a PDF
      public_id: req.file.originalname.replace('.pdf', ''),
      access_mode: "public",
    });

    // Force the file to download with a .pdf extension
    const downloadUrl = cloudinary.url(result.public_id + ".pdf", {
      resource_type: "raw",
      flags: "attachment"
    });

    // Save the download URL to the database instead of the Cloudinary secure URL
    let data = await Pdf.create({
      file_url: downloadUrl, // Storing the download URL
      cloudinary_id: result.public_id
    });

    // Respond with success and the download URL
    res.json({
      status: "File created",
      download_url: downloadUrl,
      data: data
    });

    // Optionally delete the file from the server after upload
    fs.unlinkSync(req.file.path);

  } catch (error) {
    throw new apierror(400, "Error while uploading file");
  }
});

// Get All PDFs
const getpdf = asynchandler(async (req, res) => {
  try {
    let data = await Pdf.find({});
    res.send(data);
  } catch (error) {
    console.log(error);
    throw new apierror(500, "Error fetching PDFs");
  }
});

// Delete PDF
const deletepdf = asynchandler(async (req, res) => {
  try {
    let pdf = await Pdf.findById(req.params.id);

    // Delete the file from Cloudinary
    await cloudinary.uploader.destroy(pdf.cloudinary_id, {
      resource_type: "raw"
    });

    // Delete from the database
    await Pdf.deleteOne({ cloudinary_id: pdf.cloudinary_id });
    res.json({ message: "File deleted" });

  } catch (error) {
    console.log(error);
    throw new apierror(500, "Error deleting file");
  }
});

// Update PDF
const updatepdf = asynchandler(async (req, res) => {
  try {
    let pdf = await Pdf.findById(req.params.id);

    // Delete the old PDF from Cloudinary
    await cloudinary.uploader.destroy(pdf.cloudinary_id, {
      resource_type: "raw"
    });

    // Upload the new file to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      format: "pdf",
      public_id: req.file.originalname.replace('.pdf', ''),
      access_mode: "public"
    });

    // Construct the new download URL
    const downloadUrl = cloudinary.url(result.public_id + ".pdf", {
      resource_type: "raw",
      flags: "attachment"
    });

    // Update the PDF details in the database with the download URL
    let data = {
      file_url: downloadUrl, // Updating with the new download URL
      cloudinary_id: result.public_id || pdf.cloudinary_id
    };

    pdf = await Pdf.findByIdAndUpdate(req.params.id, data, { new: true });
    res.json({
      status: "File updated",
      download_url: downloadUrl,
      data: pdf
    });

    // Optionally delete the new file from the server after upload
    fs.unlinkSync(req.file.path);

  } catch (error) {
    console.log(error);
    throw new apierror(500, "Error updating file");
  }
});

export { uploadpdf, getpdf, deletepdf, updatepdf };