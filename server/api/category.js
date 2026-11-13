const express = require('express');
const router = express.Router();
const controller = require('../controllers/category');

router.route('/')
  .get(controller.getAll)     // GET    /api/categories
  .post(controller.create);   // POST   /api/categories

router.route('/:id')
  .get(controller.getById)    // GET    /api/categories/:id
  .put(controller.update)     // PUT    /api/categories/:id
  .delete(controller.remove); // DELETE /api/categories/:id

module.exports = router;