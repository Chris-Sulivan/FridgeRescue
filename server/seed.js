// One-time seed: adds the default (shared) categories and units.
// Run from the server folder:  node seed.js
// Safe to run more than once: existing names are skipped.
import './config/env.js';
import mongoose from 'mongoose';
import Category from './models/Category.js';
import Unit from './models/Unit.js';

const CATEGORIES = [
  'Fruits',
  'Vegetables',
  'Dairy',
  'Meat',
  'Seafood',
  'Grains & Bread',
  'Beverages',
  'Condiments & Sauces',
  'Snacks',
  'Frozen',
  'Leftovers',
  'Other',
];

const UNITS = ['pcs', 'g', 'kg', 'mL', 'L', 'packs'];

async function seedCollection(Model, names, label) {
  let added = 0;
  for (const name of names) {
    // userId: null = default/shared item (matches the model default)
    const exists = await Model.findOne({ userId: null, name }).collation({
      locale: 'en',
      strength: 2,
    });
    if (!exists) {
      await Model.create({ name, userId: null });
      added += 1;
      console.log(`  + ${label}: ${name}`);
    }
  }
  console.log(`${label}: ${added} added, ${names.length - added} already there`);
}

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error('MONGO_URI is not set in server/.env');
  process.exit(1);
}

try {
  await mongoose.connect(MONGO_URI);
  console.log('Connected. Seeding...');
  await seedCollection(Category, CATEGORIES, 'Category');
  await seedCollection(Unit, UNITS, 'Unit');
  console.log('Done.');
} catch (err) {
  console.error('Seed failed:', err.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}