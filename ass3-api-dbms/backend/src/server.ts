import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { readFileSync, writeFileSync } from 'fs';
import { Pool } from 'pg';

// const dataPath = 'data/data.json';

const pool = new Pool({
    user: 'architbansal',
    host: 'localhost',
    database: 'sourcefuse',
    port: 5432,
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

// app.get('/api/users', (req: Request, res: Response) => {
//     try {
//         const users: any[] = JSON.parse(readFileSync(dataPath, 'utf8'));
//         res.json(users);
//     } catch (error) {
//         console.error('Error reading users:', error);
//         res.status(500).json({ error: 'Failed to read users.' });
//     }
// });

app.get('/api/users', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT users.id, users.first_name, users.middle_name, users.last_name, users.email, users.phone_number, users.address, roles.name AS role, customers.name AS customer_name FROM users LEFT JOIN customers ON users.customer_id=customers.id LEFT JOIN roles ON users.role_id=roles.id;');
        const users = result.rows;
        res.json(users);
    } catch (error) {
        console.error('Error reading users:', error);
        res.status(500).json({ error: 'Failed to read users.' });
    }
});

// app.get('/api/users/:id', (req: Request, res: Response) => {
//     try {
//         const users: any[] = JSON.parse(readFileSync(dataPath, 'utf8'));
//         const id = parseInt(req.params.id);
//         const user = users[id];
//         if (user) {
//             res.json([user]);
//         } else {
//             res.status(404).json({ error: 'User not found.' });
//         }
//     } catch (error) {
//         console.error('Error reading users:', error);
//         res.status(500).json({ error: 'Failed to read users.' });
//     }
// });

app.get('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const result = await pool.query('SELECT users.id, users.first_name, users.middle_name, users.last_name, users.email, users.phone_number, users.address, roles.name AS role, customers.name AS customer_name FROM users LEFT JOIN customers ON users.customer_id=customers.id LEFT JOIN roles ON users.role_id=roles.id WHERE users.id=$1;', [id]);
        const user = result.rows[0];
        if (user) {
            res.json([user]);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error('Error reading users:', error);
        res.status(500).json({ error: 'Failed to read users.' });
    }
});

// app.post('/api/users', (req: Request, res: Response) => {
//     try {
//         const users: any[] = JSON.parse(readFileSync(dataPath, 'utf8'));
//         const newUser: any = req.body;
//         users.push(newUser);
//         writeFileSync(dataPath, JSON.stringify(users));
//         res.json(newUser);
//     } catch (error) {
//         console.error('Error creating user:', error);
//         res.status(500).json({ error: 'Failed to create user.' });
//     }
// });

app.post('/api/users', async (req: Request, res: Response) => {
    try {
        const newUser = req.body;
        const result = await pool.query('INSERT INTO users (first_name, middle_name, last_name, email, phone_number, role_id, address, customer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *', [newUser.first_name, newUser.middle_name, newUser.last_name, newUser.email, newUser.phone_number, newUser.role_id, newUser.address, newUser.customer_id]);
        const createdUser = result.rows[0];
        res.json(createdUser);
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user.' });
    }
});

// app.put('/api/users/:id', (req: Request, res: Response) => {
//     try {
//         const users: any[] = JSON.parse(readFileSync(dataPath, 'utf8'));
//         const userIndex = parseInt(req.params.id);
//         if (userIndex !== -1) {
//             users[userIndex] = req.body;
//             writeFileSync(dataPath, JSON.stringify(users));
//             res.json(users[userIndex]);
//         } else {
//             res.status(404).json({ error: 'User not found.' });
//         }
//     } catch (error) {
//         console.error('Error updating user:', error);
//         res.status(500).json({ error: 'Failed to update user.' });
//     }
// });

app.put('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const userIndex = req.params.id;
        const updatedUser = req.body;
        const result = await pool.query('UPDATE users SET first_name=$1, middle_name=$2, last_name=$3, email=$4, phone_number=$5, address=$6 WHERE id=$7 RETURNING *', [updatedUser.first_name, updatedUser.middle_name, updatedUser.last_name, updatedUser.email, updatedUser.phone_number, updatedUser.address, userIndex]);
        const user = result.rows[0];
        if (user) {
            res.json(user);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user.' });
    }
});

// app.delete('/api/users/:id', (req: Request, res: Response) => {
//     try {
//         const users: any[] = JSON.parse(readFileSync(dataPath, 'utf8'));
//         const userIndex = parseInt(req.params.id);
//         if (userIndex !== -1) {
//             const deletedUser = users.splice(userIndex, 1)[0];
//             writeFileSync(dataPath, JSON.stringify(users));
//             res.json(deletedUser);
//         } else {
//             res.status(404).json({ error: 'User not found.' });
//         }
//     } catch (error) {
//         console.error('Error deleting user:', error);
//         res.status(500).json({ error: 'Failed to delete user.' });
//     }
// });

app.delete('/api/users/:id', async (req: Request, res: Response) => {
    try {
        const userIndex = req.params.id;
        const result = await pool.query('DELETE FROM users WHERE id=$1 RETURNING *', [userIndex]);
        const deletedUser = result.rows[0];
        if (deletedUser) {
            res.json(deletedUser);
        } else {
            res.status(404).json({ error: 'User not found.' });
        }
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Failed to delete user.' });
    }
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}.`);
});
