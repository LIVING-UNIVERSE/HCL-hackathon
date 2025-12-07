import itemModel from "../models/itemModel.js";

// Add new item (Admin)
const addItem = async (req, res) => {
    try {
        const { name, description, price, category, stock } = req.body;
        const image = req.file ? req.file.filename : "";

        if (!name || !description || !price || !category) {
            return res.json({ success: false, message: "Missing details" });
        }

        const itemData = {
            name,
            description,
            price: Number(price),
            category,
            image,
            stock: stock ? Number(stock) : 0,
        };

        const newItem = new itemModel(itemData);
        await newItem.save();

        res.json({ success: true, message: "Item added successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get all items
const getItems = async (req, res) => {
    try {
        const items = await itemModel.find({ available: true });
        res.json({ success: true, items });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Get item by ID
const getItemById = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await itemModel.findById(id);

        if (!item) {
            return res.json({ success: false, message: "Item not found" });
        }

        res.json({ success: true, item });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update item (Admin)
const updateItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, category, available, stock } = req.body;
        
        const updateData = {};
        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (price) updateData.price = Number(price);
        if (category) updateData.category = category;
        if (available !== undefined) updateData.available = available;
        if (stock !== undefined) updateData.stock = Number(stock);
        if (req.file) updateData.image = req.file.filename;

        const item = await itemModel.findByIdAndUpdate(id, updateData, { new: true });

        if (!item) {
            return res.json({ success: false, message: "Item not found" });
        }

        res.json({ success: true, message: "Item updated successfully", item });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Delete item (Admin)
const deleteItem = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await itemModel.findByIdAndDelete(id);

        if (!item) {
            return res.json({ success: false, message: "Item not found" });
        }

        res.json({ success: true, message: "Item deleted successfully" });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

// Update stock (Admin)
const updateStock = async (req, res) => {
    try {
        const { itemId, quantity, operation } = req.body;

        if (!itemId || quantity === undefined || !operation) {
            return res.json({ success: false, message: "Missing details" });
        }

        const item = await itemModel.findById(itemId);
        if (!item) {
            return res.json({ success: false, message: "Item not found" });
        }

        if (operation === "add") {
            item.stock += Number(quantity);
        } else if (operation === "subtract") {
            if (item.stock < Number(quantity)) {
                return res.json({ success: false, message: "Insufficient stock" });
            }
            item.stock -= Number(quantity);
        } else {
            return res.json({ success: false, message: "Invalid operation" });
        }

        await item.save();
        res.json({ success: true, message: "Stock updated successfully", stock: item.stock });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

export { addItem, getItems, getItemById, updateItem, deleteItem, updateStock };
