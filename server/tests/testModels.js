import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import mongoose from "mongoose";
import User from "../models/auth.js";
import Category from "../models/Category.js";
import Unit from "../models/Unit.js";
import FoodItem from "../models/FoodItem.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const TEST_EMAIL = "model-test@fridgerescue.test";
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
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB Connected:", mongoose.connection.host);
        await Category.init();
        await Unit.init();
        await cleanUp();

        const user = await User.create({
            name: "Model Tester",
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

        // Valid item saves (no shelf), and populate returns names
        const food = await FoodItem.create(base);
        check("valid FoodItem saves", !!food._id);

        const found = await FoodItem.findById(food._id).populate("category unit");
        check("populate returns category name", found.category.name === TEST_CATEGORY);
        check("populate returns unit name", found.unit.name === TEST_UNIT);

        // Shelf is optional, but must be a whole number of 1 or more
        const shelved = await FoodItem.create({ ...base, name: "Eggs", shelf: 2 });
        check("item with shelf 2 saves", shelved.shelf === 2);

        // Validation failures
        await expectError("missing category is rejected", () =>
            new FoodItem({ ...base, category: undefined }).validate());
        await expectError("missing unit is rejected", () =>
            new FoodItem({ ...base, unit: undefined }).validate());
        await expectError("text instead of an ID is rejected", () =>
            new FoodItem({ ...base, category: "Dairy" }).validate());
        await expectError("quantity 0 is rejected", () =>
            new FoodItem({ ...base, quantity: 0 }).validate());
        await expectError("shelf 0 is rejected", () =>
            new FoodItem({ ...base, shelf: 0 }).validate());
        await expectError("fractional shelf is rejected", () =>
            new FoodItem({ ...base, shelf: 1.5 }).validate());
        await expectError("text shelf is rejected", () =>
            new FoodItem({ ...base, shelf: "top" }).validate());

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