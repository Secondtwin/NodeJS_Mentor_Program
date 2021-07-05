import { Request, Response } from 'express';
import { addUser, deleteUserById, getAutoSuggestUsers, getUserById, getUserList, updateUserById } from './utils';
import { validateUser } from './validators/user.validator';
import { userSchema } from './models/user.schema';
import express = require('express');

const app = express();
const router = express.Router();

app.use(express.json());
app.use('/api', router);

router.get('/getUserList', (req: Request, res: Response) => {
    const users = getUserList();

    res.json(users);
});

router.get('/getUser/:id', (req: Request, res: Response) => {
    const user = getUserById(req.params.id);

    res.json(user);
});

router.delete('/deleteUser/:id', (req: Request, res: Response) => {
    const user = deleteUserById(req.params.id);

    res.json(user);
});

router.post('/addUser', validateUser(userSchema), (req: Request, res: Response) => {
    const user = addUser(req.body);

    res.json(user);
});

router.put('/updateUser/:id', validateUser(userSchema), (req: Request, res: Response) => {
    const user = updateUserById(req.params.id, req.body);

    res.json(user);
});

router.get('/getAutoSuggestUsers', (req: Request, res: Response) => {
    const users = getAutoSuggestUsers(req.body.loginSubstring, req.body.limit);

    res.json(users);
});

app.listen(3000);
