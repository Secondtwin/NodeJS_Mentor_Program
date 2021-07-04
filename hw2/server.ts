import { Request, Response } from 'express';
import { addUser, deleteUserById, getUserById, getUserList, updateUserById } from './utils';
import express = require('express');

const app = express();
const router = express.Router();

app.use(express.json());
app.use('/api', router);

router.get('/users', (req: Request, res: Response) => {
    const users = getUserList();

    res.json(users);
});

router.get('/user/:id', (req: Request, res: Response) => {
    const user = getUserById(req.params.id);

    res.json(user);
});

router.delete('/delete/:id', (req: Request, res: Response) => {
    const user = deleteUserById(req.params.id);

    res.json(user);
});

router.post('/add', (req: Request, res: Response) => {
    const user = addUser(req.body);

    res.json(user);
});

router.put('/update/:id', (req: Request, res: Response) => {
    const user = updateUserById(req.params.id, req.body);

    res.json(user);
});

app.listen(3000);
