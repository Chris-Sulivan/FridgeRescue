import mongoose from "mongoose";

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
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category",
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            min: 0.01
        },

        unit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Unit",
            required: true
        },

        expirationDate: {
            type: Date,
            required: true
        },
        shelf: {
        type: Number,
        min: 1,
        default: null
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

const FoodItem = mongoose.model("FoodItem", foodItemSchema);

export default FoodItem;