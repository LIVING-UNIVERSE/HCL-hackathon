import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import itemModel from "../models/itemModel.js";
import { sendOrderConfirmationEmail } from "../uitls/emailService.js";
// Place new order
const placeOrder = async (req, res) => {
    try {
        const { items, totalAmount, address, phone, paymentMethod } = req.body;
        const userId = req.userId;

        if (!items || items.length === 0) {
            return res.json({ success: false, message: "Cart is empty" });
        }

        if (!address || !address.line1) {
            return res.json({ success: false, message: "Address is required" });
        }

        if (!phone) {
            return res.json({ success: false, message: "Phone number is required" });
        }

        // Check stock availability and decrement
        for (const cartItem of items) {
            const item = await itemModel.findById(cartItem.itemId);
            if (!item) {
                return res.json({ success: false, message: `Item ${cartItem.name} not found` });
            }
            if (item.stock < cartItem.quantity) {
                return res.json({ success: false, message: `Insufficient stock for ${cartItem.name}. Available: ${item.stock}` });
            }
        }

        // Decrement stock for each item
        for (const cartItem of items) {
            await itemModel.findByIdAndUpdate(cartItem.itemId, {
                $inc: { stock: -cartItem.quantity }
            });
        }

        const orderData = {
            userId,
            items,
            totalAmount,
            address,
            phone,
            paymentMethod: paymentMethod || "COD",
            payment: paymentMethod === "Online" ? true : false,
        };

        const newOrder = new orderModel(orderData);
        await newOrder.save();

        // Populate the order with item details for better response
        const populatedOrder = await orderModel.findById(newOrder._id)
            .populate('userId', 'name email')
            .populate('items.itemId', 'name image');

        // Send order confirmation email (non-blocking)
        try {
            const user = await userModel.findById(userId);
            if (user && user.email) {
                const orderDetails = {
                    orderId: newOrder._id.toString(),
                    items: newOrder.items,
                    totalAmount: newOrder.totalAmount,
                    address: newOrder.address,
                    phone: newOrder.phone,
                    paymentMethod: newOrder.paymentMethod,
                    status: newOrder.status,
                };
                // Send email asynchronously (don't wait for it)
                sendOrderConfirmationEmail(user.email, user.name, orderDetails)
                    .then(result => {
                        if (result.success) {
                            console.log('Order confirmation email sent successfully to:', user.email);
                        } else {
                            console.error('Email sending failed:', result.error);
                        }
                    })
                    .catch(err => console.error('Email sending error:', err));
            }
        } catch (emailError) {
            // Log error but don't fail the order
            console.error('Error preparing email:', emailError);
        }

        res.json({ 
            success: true, 
            message: "Order placed successfully", 
            orderId: newOrder._id,
            order: populatedOrder
        });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get user orders
const getUserOrders = async (req, res) => {
    try {
        const userId = req.userId;
        const orders = await orderModel.find({ userId }).sort({ createdAt: -1 });

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get all orders (Admin)
const getAllOrders = async (req, res) => {
    try {
        const orders = await orderModel.find({})
            .populate('userId', 'name email')
            .sort({ createdAt: -1 });

        res.json({ success: true, orders });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update order status (Admin)
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.body;

        if (!orderId || !status) {
            return res.json({ success: false, message: "Missing details" });
        }

        const order = await orderModel.findByIdAndUpdate(
            orderId, 
            { status }, 
            { new: true }
        );

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, message: "Order status updated", order });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Cancel order
const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.userId;

        const order = await orderModel.findById(orderId);

        if (!order) {
            return res.json({ success: false, message: "Order not found" });
        }

        if (order.userId.toString() !== userId) {
            return res.json({ success: false, message: "Unauthorized" });
        }

        if (order.status === "Delivered") {
            return res.json({ success: false, message: "Cannot cancel delivered order" });
        }

        order.status = "Cancelled";
        await order.save();

        res.json({ success: true, message: "Order cancelled successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { placeOrder, getUserOrders, getAllOrders, updateOrderStatus, cancelOrder };
