const express = require('express');
const router = express.Router();
const controller = require('../controllers/authController');

router.route('/')
  .get(controller.getAll)     // GET    /api/auth
  .post(controller.create);   // POST   /api/auth

router.route('/:id')
  .get(controller.getById)    // GET    /api/auth/:id
  .put(controller.update)     // PUT    /api/auth/:id
  .delete(controller.remove); // DELETE /api/auth/:id

module.exports = router;
