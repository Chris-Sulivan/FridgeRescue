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

const TEST_DB = process.env.TEST_DB_NAME || "fridgerescue_test";
const URI = process.env.MONGO_URI_TEST || process.env.MONGO_URI;

let passed = 0;
let failed = 0;
let findings = 0;

const check = (label, condition) => {
    if (condition) {
        passed++;
        console.log("PASS:", label);
    } else {
        failed++;
        console.log("FAIL:", label);
    }
};

const finding = (label) => {
    findings++;
    console.log("FINDING:", label);
};

const expectError = async (label, fn, matcher = () => true) => {
    try {
        await fn();
        check(label, false);
    } catch (error) {
        const ok = matcher(error);
        if (!ok) console.log("   (unexpected error:", error.name, "-", error.message, ")");
        check(label, ok);
    }
};

const isValidation = (field) => (error) =>
    error.name === "ValidationError" && (!field || !!error.errors?.[field]);
const isDuplicate = (error) => error.code === 11000;

// Safety: never write anywhere except a database whose name ends in _test
const assertTestDatabase = () => {
    const name = mongoose.connection.name;
    if (!name.endsWith("_test")) {
        throw new Error(`Refusing to run: connected to "${name}", which is not a _test database`);
    }
};

const clearAll = async () => {
    assertTestDatabase();
    await Promise.all([FoodItem, Category, Unit, User].map((Model) => Model.deleteMany({})));
};

const run = async () => {
    try {
        await mongoose.connect(URI, { dbName: TEST_DB });
        assertTestDatabase();
        console.log(`Connected to test database "${mongoose.connection.name}" on ${mongoose.connection.host}`);
        await Promise.all([User, Category, Unit, FoodItem].map((Model) => Model.init()));
        await clearAll();

        // ---------- Test 1: User creation ----------
        console.log("\n--- Test 1: User creation ---");
        const userA = await User.create({
            name: "  Alice Tester ",
            email: "Alice.Test@Example.COM",
            passwordHash: "hash-a"
        });
        const savedA = await User.findById(userA._id);
        check("user is saved and can be read back", !!savedA);
        check("name is trimmed", savedA.name === "Alice Tester");
        check("email is stored in lowercase", savedA.email === "alice.test@example.com");
        check("passwordHash is stored", savedA.passwordHash === "hash-a");
        check("timestamps are set", !!savedA.createdAt && !!savedA.updatedAt);
        await expectError("missing name is rejected", () =>
            new User({ email: "x@example.com", passwordHash: "h" }).validate(), isValidation("name"));
        await expectError("missing email is rejected", () =>
            new User({ name: "No Email", passwordHash: "h" }).validate(), isValidation("email"));
        await expectError("missing passwordHash is rejected", () =>
            new User({ name: "No Hash", email: "y@example.com" }).validate(), isValidation("passwordHash"));
        await expectError("name that is too short is rejected", () =>
            new User({ name: "A", email: "z@example.com", passwordHash: "h" }).validate(), isValidation("name"));
        await expectError("invalid email format is rejected", () =>
            new User({ name: "Bad Email", email: "not-an-email", passwordHash: "h" }).validate(), isValidation("email"));

        // ---------- Test 2: Duplicate email ----------
        console.log("\n--- Test 2: Duplicate email ---");
        await expectError("same email is rejected", () =>
            User.create({ name: "Alice Two", email: "alice.test@example.com", passwordHash: "h" }), isDuplicate);
        await expectError("same email with different capitalization is rejected", () =>
            User.create({ name: "Alice Three", email: "ALICE.TEST@EXAMPLE.COM", passwordHash: "h" }), isDuplicate);
        check("only one user with that email exists",
            (await User.countDocuments({ email: "alice.test@example.com" })) === 1);

        // Setup for the food tests
        const userB = await User.create({ name: "Bob Tester", email: "bob.test@example.com", passwordHash: "hash-b" });
        const category = await Category.create({ name: "Test Category" });
        const unit = await Unit.create({ name: "Test Unit" });
        const base = {
            userId: userA._id,
            name: "Milk",
            category: category._id,
            quantity: 2,
            unit: unit._id,
            expirationDate: new Date("2026-11-20")
        };

        // ---------- Test 3: Food inventory (create, read, update, delete) ----------
        console.log("\n--- Test 3: Food inventory CRUD ---");
        const created = await FoodItem.create(base);
        check("food item is created", !!created._id);
        const fetched = await FoodItem.findById(created._id);
        check("food item can be retrieved by id", !!fetched && fetched.name === "Milk");
        const listed = await FoodItem.find({ userId: userA._id });
        check("food item appears in its owner's list", listed.length === 1);
        const updated = await FoodItem.findByIdAndUpdate(
            created._id, { quantity: 5, shelf: 3 }, { new: true, runValidators: true });
        check("food item can be updated", updated.quantity === 5 && updated.shelf === 3);
        const reread = await FoodItem.findById(created._id);
        check("the update is stored in the database", reread.quantity === 5 && reread.shelf === 3);
        await expectError("update to quantity 0 is rejected when runValidators is on", () =>
            FoodItem.findByIdAndUpdate(created._id, { quantity: 0 }, { runValidators: true }), isValidation("quantity"));
        const bypass = await FoodItem.findByIdAndUpdate(created._id, { quantity: 0 }, { new: true });
        if (bypass.quantity === 0) {
            finding("an update WITHOUT runValidators saved quantity 0 (edit routes must pass runValidators: true)");
        }
        await FoodItem.deleteOne({ _id: created._id });
        check("food item can be deleted", (await FoodItem.findById(created._id)) === null);

        // ---------- Test 4: Data validation ----------
        console.log("\n--- Test 4: Data validation ---");
        for (const field of ["userId", "name", "category", "quantity", "unit", "expirationDate"]) {
            await expectError(`missing ${field} is rejected`, () =>
                new FoodItem({ ...base, [field]: undefined }).validate(), isValidation(field));
        }
        await expectError("quantity 0 is rejected", () =>
            new FoodItem({ ...base, quantity: 0 }).validate(), isValidation("quantity"));
        await expectError("negative quantity is rejected", () =>
            new FoodItem({ ...base, quantity: -1 }).validate(), isValidation("quantity"));
        await expectError("text quantity is rejected", () =>
            new FoodItem({ ...base, quantity: "abc" }).validate(), isValidation("quantity"));
        await expectError("name of only spaces is rejected", () =>
            new FoodItem({ ...base, name: "   " }).validate(), isValidation("name"));
        await expectError("name over 100 characters is rejected", () =>
            new FoodItem({ ...base, name: "x".repeat(101) }).validate(), isValidation("name"));
        await expectError("invalid expiration date is rejected", () =>
            new FoodItem({ ...base, expirationDate: "not a date" }).validate(), isValidation("expirationDate"));
        await expectError("invalid userId is rejected", () =>
            new FoodItem({ ...base, userId: "123" }).validate(), isValidation("userId"));
        await expectError("shelf 0 is rejected", () =>
            new FoodItem({ ...base, shelf: 0 }).validate(), isValidation("shelf"));
        await expectError("text shelf is rejected", () =>
            new FoodItem({ ...base, shelf: "top" }).validate(), isValidation("shelf"));

        // ---------- Test 5: User relationships ----------
        console.log("\n--- Test 5: User relationships ---");
        await FoodItem.create({ ...base, name: "Eggs" });
        await FoodItem.create({ ...base, name: "Bread" });
        await FoodItem.create({ ...base, userId: userB._id, name: "Cheese" });
        const aItems = await FoodItem.find({ userId: userA._id });
        const bItems = await FoodItem.find({ userId: userB._id });
        check("user A sees only A's items", aItems.length === 2 && aItems.every((i) => i.userId.equals(userA._id)));
        check("user B sees only B's item", bItems.length === 1 && bItems[0].name === "Cheese");
        check("user A's list does not include B's item", !aItems.some((i) => i.name === "Cheese"));
        const withOwner = await FoodItem.findOne({ name: "Cheese" }).populate("userId");
        check("populate returns the correct owner", withOwner.userId.email === "bob.test@example.com");
        check("A cannot find B's item when the query is scoped by owner",
            (await FoodItem.findOne({ _id: bItems[0]._id, userId: userA._id })) === null);
        try {
            await FoodItem.create({ ...base, userId: new mongoose.Types.ObjectId(), name: "Ghost item" });
            finding("a food item with a user ID that does not exist WAS saved (the model does not verify the user; routes must take the user from the login token)");
        } catch (error) {
            check("food item with a nonexistent user is rejected", true);
        }

        // ---------- Test 6: Database connection ----------
        console.log("\n--- Test 6: Database connection ---");
        check("connection state is connected", mongoose.connection.readyState === 1);
        const ping = await mongoose.connection.db.admin().ping();
        check("database answers a ping", ping.ok === 1);

        const startedAt = Date.now();
        await expectError("unreachable server fails with an error", async () => {
            const conn = mongoose.createConnection("mongodb://127.0.0.1:1/fridgerescue_test", { serverSelectionTimeoutMS: 3000 });
            try {
                await conn.asPromise();
            } finally {
                await conn.close().catch(() => {});
            }
    }, (error) => /ServerSelection|MongoNetwork|ECONNREFUSED/.test(error.name + " " + error.message));
        check("the failure is reported within 10 seconds (no hang)", Date.now() - startedAt < 10000);

        await expectError("wrong password is rejected", async () => {
            const bad = new URL(URI);
            bad.password = "wrong-password-for-test";
            const conn = mongoose.createConnection(bad.toString(), { dbName: TEST_DB, serverSelectionTimeoutMS: 8000 });
            try {
                await conn.asPromise();
            } finally {
                await conn.close().catch(() => {});
            }
        }, (error) => error.code === 18 || /auth/i.test(error.message));
    } catch (error) {
        failed++;
        console.error("Test run error:", error.message);
    } finally {
        try {
            if (mongoose.connection.readyState === 1) await clearAll();
        } catch (error) {
            console.error("Cleanup failed:", error.message);
        }
        await mongoose.connection.close();
        console.log(`\n${passed} passed, ${failed} failed, ${findings} findings`);
        process.exitCode = failed ? 1 : 0;
    }
};

run();