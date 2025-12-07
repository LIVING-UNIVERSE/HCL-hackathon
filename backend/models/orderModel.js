import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true },
    items: [{
        item_id: { type: mongoose.Schema.Types.ObjectId, ref: "item", required: true },
        quantity: { type: Number, required: true }
    }],
    total_price: { type: Number, required: true },
    order_date: { type: Date, default: Date.now },
    status: { type: String, enum: ['pending', 'delivered'], default: 'pending' },
    dining_option: { type: String, enum: ['dine-in', 'delivery'], required: true }
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;