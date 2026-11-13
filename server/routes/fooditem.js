const express = require('express');
const router = express.Router();
const controller = require('../controllers/fooditem');

router.route('/')
  .get(controller.getAll)     // GET    /api/fooditems
  .post(controller.create);   // POST   /api/fooditems

router.route('/:id')
  .get(controller.getById)    // GET    /api/fooditems/:id
  .put(controller.update)     // PUT    /api/fooditems/:id
  .delete(controller.remove); // DELETE /api/fooditems/:id

module.exports = router;