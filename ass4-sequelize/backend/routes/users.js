const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/usersController');
const usersController = new UsersController();

router.get('/', usersController.getUsers);
router.get('/:id', usersController.getUser);
router.post('/', usersController.createUser);
router.put('/:id', usersController.updateUser);
router.delete('/:id', usersController.deleteUser);

module.exports = router;