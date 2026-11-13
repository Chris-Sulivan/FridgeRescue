const express = require('express');
const router = express.Router();
const controller = require('../controllers/unit');

router.route('/')
  .get(controller.getAll)     // GET    /api/units
  .post(controller.create);   // POST   /api/units

router.route('/:id')
  .get(controller.getById)    // GET    /api/units/:id
  .put(controller.update)     // PUT    /api/units/:id
  .delete(controller.remove); // DELETE /api/units/:id

module.exports = router;