require("dotenv").config();

const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Category = require("../models/Category");
const Unit = require("../models/Unit");
const FoodItem = require("../models/FoodItem");

const TEST_EMAIL = "noah@test.com";
const TEST_CATEGORY = "zz-test-category";
const TEST_UNIT = "zz-test-unit";

let passed = 0;
let failed = 0;

const check = (label, condition) => {
    if (condition) {
        passed++;
        console.log("PASS:", label);
    } else {
        failed++;
        console.log("FAIL:", label);
    }
};

const expectError = async (label, fn) => {
    try {
        await fn();
        check(label, false);
    } catch (error) {
        check(label, true);
    }
};

const cleanUp = async () => {
    const user = await User.findOne({ email: TEST_EMAIL });
    if (user) {
        await FoodItem.deleteMany({ userId: user._id });
    }
    await User.deleteMany({ email: TEST_EMAIL });
    await Category.deleteMany({ name: TEST_CATEGORY });
    await Unit.deleteMany({ name: TEST_UNIT });
};

const testModels = async () => {
    try {
        await connectDB();
        await Category.init();
        await Unit.init();
        await cleanUp();

        const user = await User.create({
            name: "Noah Test",
            email: TEST_EMAIL,
            passwordHash: "hashedpassword123"
    });
    console.log("User created:", user.email);
        const category = await Category.create({ name: TEST_CATEGORY, userId: user._id });
        const unit = await Unit.create({ name: TEST_UNIT, userId: user._id });

        const base = {
            userId: user._id,
            name: "Milk",
            category: category._id,
            quantity: 2,
            unit: unit._id,
            expirationDate: new Date("2026-11-15")
        };

        // Valid item saves nd populate returns namess
        const food = await FoodItem.create(base);
        check("valid FoodItem saves", !!food._id);

        const found = await FoodItem.findById(food._id).populate("category unit");
        check("populate returns category name", found.category.name === TEST_CATEGORY);
        check("populate returns unit name", found.unit.name === TEST_UNIT);

        // Validation failures
        await expectError("missing category is rejected", () =>
            new FoodItem({ ...base, category: undefined }).validate());
        await expectError("missing unit is rejected", () =>
            new FoodItem({ ...base, unit: undefined }).validate());
        await expectError("text instead of an ID is rejected", () =>
            new FoodItem({ ...base, category: "Dairy" }).validate());
        await expectError("quantity 0 is rejected", () =>
            new FoodItem({ ...base, quantity: 0 }).validate());

        // Duplicates
        await expectError("same owner can't repeat a category name (any capitalization)", () =>
            Category.create({ name: TEST_CATEGORY.toUpperCase(), userId: user._id }));
        await expectError("same owner can't repeat a unit name", () =>
            Unit.create({ name: TEST_UNIT, userId: user._id }));

        let otherOwnerOk = true;
        try {
            await Category.create({ name: TEST_CATEGORY, userId: new mongoose.Types.ObjectId() });
        } catch (error) {
            otherOwnerOk = false;
            console.log("Reason:", error.message);
        }
        check("a different owner can use the same category name", otherOwnerOk);
    } catch (error) {
        failed++;
        console.error(error);
    } finally {
        try {
            await cleanUp();
        } catch (error) {
            console.error("Cleanup failed:", error.message);
        }
        await mongoose.connection.close();
        console.log(`\n${passed} passed, ${failed} failed`);
        process.exitCode = failed ? 1 : 0;
    }
};

testModels();