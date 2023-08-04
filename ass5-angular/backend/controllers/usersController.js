const User = require('../models').users;
const Role = require('../models').roles;
const Customer = require('../models').customers;

class UsersController {
    async getUsers(req, res) {
        try {
            const users = await User.findAll({
                attributes: ['id', 'first_name', 'middle_name', 'last_name', 'email', 'phone_number', 'address'],
                include: [
                    {
                        model: Customer,
                        as: 'customer',
                        attributes: ['name'],
                        required: false
                    },
                    {
                        model: Role,
                        as: 'role',
                        attributes: ['name'],
                        required: false
                    }
                ]
            });
            const formattedUsers = users.map((user) => {
                const customerName = user.customer ? user.customer.name : null;
                const roleName = user.role ? user.role.name : null;
                return { ...user.toJSON(), customer: customerName, role: roleName };
            });
            res.json(formattedUsers);
        } catch (error) {
            console.error('Error reading users:', error);
            res.status(500).json({ error: 'Failed to read users.' });
        }
    }

    async getUser(req, res) {
        try {
            const id = req.params.id;
            const user = await User.findOne({
                where: { id },
                attributes: ['id', 'first_name', 'middle_name', 'last_name', 'email', 'phone_number', 'address'],
                include: [
                    {
                        model: Customer,
                        as: 'customer',
                        attributes: ['name'],
                        required: false
                    },
                    {
                        model: Role,
                        as: 'role',
                        attributes: ['name'],
                        required: false
                    }
                ]
            });
            if (user) {
                const customerName = user.customer ? user.customer.name : null;
                const roleName = user.role ? user.role.name : null;
                const formattedUser = { ...user.toJSON(), customer: customerName, role: roleName };
                res.json(formattedUser);
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error('Error reading users:', error);
            res.status(500).json({ error: 'Failed to read users.' });
        }
    }

    async createUser(req, res) {
        try {
            const newUser = req.body;
            const createdUser = await User.create(newUser);
            res.json(createdUser);
        } catch (error) {
            console.error('Error creating user:', error);
            res.status(500).json({ error: 'Failed to create user.' });
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const updatedUser = req.body;
            const [rowsAffected, [updatedUsers]] = await User.update(updatedUser, {
                where: { id: userId },
                returning: true,
            });
            if (rowsAffected > 0) {
                res.json(updatedUsers);
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error('Error updating user:', error);
            res.status(500).json({ error: 'Failed to update user.' });
        }
    }

    async deleteUser(req, res) {
        try {
            const userId = req.params.id;
            const deletedUser = await User.destroy({ where: { id: userId } });
            if (deletedUser) {
                res.json(deletedUser);
            } else {
                res.status(404).json({ error: 'User not found.' });
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            res.status(500).json({ error: 'Failed to delete user.' });
        }
    }
}

module.exports = UsersController;