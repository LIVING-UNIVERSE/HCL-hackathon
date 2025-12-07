import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
    item_name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    inventory_count: { type: Number, required: true },
    description: { type: String },
    image_url: { type: String },
})

const itemModel = mongoose.models.item || mongoose.model("item", itemSchema);
export default itemModel;