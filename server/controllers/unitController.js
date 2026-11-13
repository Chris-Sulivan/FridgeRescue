import Unit from '../models/Unit.js';

export const getAll = async (req, res) => {
  try {
    res.json(await Unit.find());
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const item = await Unit.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const create = async (req, res) => {
  try {
    res.status(201).json(await Unit.create(req.body));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const update = async (req, res) => {
  try {
    const item = await Unit.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await Unit.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Unit deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/units - remove ALL units
export const removeAll = async (req, res) => {
  try {
    const result = await Unit.deleteMany({});
    res.json({ message: 'All units deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};