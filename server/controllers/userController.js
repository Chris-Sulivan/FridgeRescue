import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// Never send passwordHash back to the client
const safe = (user) => {
  const obj = user.toObject();
  delete obj.passwordHash;
  return obj;
};

export const getAll = async (req, res) => {
  try {
    res.json(await User.find().select('-passwordHash'));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getById = async (req, res) => {
  try {
    const item = await User.findById(req.params.id).select('-passwordHash');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// body: { name, email, password }
export const create = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!password || password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    res.status(201).json(safe(await User.create({ name, email, passwordHash })));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// body: { name?, email?, password? }
export const update = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const changes = { name, email };
    if (password !== undefined) {
      if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
      }
      changes.passwordHash = await bcrypt.hash(password, 12);
    }
    Object.keys(changes).forEach((k) => changes[k] === undefined && delete changes[k]);

    const item = await User.findByIdAndUpdate(req.params.id, changes, { new: true, runValidators: true }).select('-passwordHash');
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const remove = async (req, res) => {
  try {
    const item = await User.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'User deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/users - remove ALL users
export const removeAll = async (req, res) => {
  try {
    const result = await User.deleteMany({});
    res.json({ message: 'All users deleted', deletedCount: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};