const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
    {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 100
    },

    category: {
        type: String,
        required: true,
        enum: [
            "Dairy",
            "Produce",
            "Meat",
            "Seafood",
            "Bakery",
            "Pantry",
            "Frozen",
            "Beverages",
            "Other"
        ]
    },

    quantity: {
        type: Number,
        required: true,
        min: 0.01
    },

    unit: {
        type: String,
        required: true,
        enum: [
            "pcs",
            "g",
            "kg",
            "mL",
            "L",
            "packs"
        ]
    },

    expirationDate: {
        type: Date,
        required: true
    }
    },
        {
    timestamps: true
    }
);

foodItemSchema.index({ userId: 1 });

foodItemSchema.index({
    userId: 1,
    expirationDate: 1
});

module.exports = mongoose.model(
    "FoodItem",
    foodItemSchema
);