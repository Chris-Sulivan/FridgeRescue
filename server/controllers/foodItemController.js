import FoodItem from '../models/FoodItem.js';

const populate = [
  { path: 'category', select: 'name' },
  { path: 'unit', select: 'name' }
];

export const getAll = async (req, res) => {
  try {
    res.json(await FoodItem.find().populate(populate));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const item = await FoodItem.findById(req.params.id).populate(populate);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    const item = await FoodItem.create(req.body);
    res.status(201).json(await item.populate(populate));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate(populate);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await FoodItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Food item deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/food-items - remove ALL food items
export const removeAll = async (req, res) => {
  try {
    const result = await FoodItem.deleteMany({});
    res.json({ message: 'All food items deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};