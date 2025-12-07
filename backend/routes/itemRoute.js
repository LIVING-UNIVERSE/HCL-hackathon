import express from 'express';
import { addItem, getItems, getItemById, updateItem, deleteItem, updateStock } from '../controllers/itemController.js';
import upload from '../middlewares/multer.js';

const itemRouter = express.Router();

// Public routes
itemRouter.get("/list", getItems);
itemRouter.get("/:id", getItemById);

// Admin routes (add admin middleware later if needed)
itemRouter.post("/add", upload.single('image'), addItem);
itemRouter.put("/:id", upload.single('image'), updateItem);
itemRouter.delete("/:id", deleteItem);
itemRouter.put("/stock/update", updateStock);

export default itemRouter;
