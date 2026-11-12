require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const User = require("../models/User");
const FoodItem = require("../models/FoodItem");

const testModels = async () => {
    try {
        await connectDB();


    await User.deleteMany({
        email: "noah@test.com"
    });

    const user = await User.create({
        name: "Noah Test",
        email: "noah@test.com",
        passwordHash: "hashedpassword123"
    });

    console.log("User created:", user.email);

    const food = await FoodItem.create({
        userId: user._id,
        name: "Milk",
        category: "Dairy",
        quantity: 2,
        unit: "L",
        expirationDate: new Date("2026-11-15")
    });

    console.log("Food item created:", food.name);

    const foundItems = await FoodItem.find({
        userId: user._id
    }).populate("userId");

console.log("Retrieved items:", foundItems.length);

await FoodItem.deleteMany({ userId: user._id });
await User.deleteMany({ email: "noah@test.com" });

await mongoose.connection.close();

} catch (error) {
    console.error(error);
}
};

testModels();