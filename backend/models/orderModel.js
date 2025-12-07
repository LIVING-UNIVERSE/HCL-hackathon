import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    items: [
        {
            itemId: { type: mongoose.Schema.Types.ObjectId, ref: 'item', required: true },
            name: { type: String, required: true },
            price: { type: Number, required: true },
            quantity: { type: Number, required: true, default: 1 },
        }
    ],
    totalAmount: { type: Number, required: true },
    address: {
        line1: { type: String, required: true },
        line2: { type: String },
    },
    phone: { type: String, required: true },
    status: { 
        type: String, 
        default: "Order Placed",
        enum: ["Order Placed", "Preparing", "Out for Delivery", "Delivered", "Cancelled"]
    },
    paymentMethod: { type: String, default: "COD" },
    payment: { type: Boolean, default: false },
}, { timestamps: true });

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema);
export default orderModel;
