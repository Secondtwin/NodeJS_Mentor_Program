import { Request, Response } from 'express';
import { validateUser } from '../validators/user.validator';
import { userSchema } from '../models/user.schema';
import express = require('express');
import { Sequelize } from 'sequelize';
import { UserDataService } from '../data-access/user-data.service';
import { UserService } from '../services/user.service';

export const router = express.Router();

let dataAccessService: UserDataService;
let userService: UserService;

export function initialize(sequelize: Sequelize): void {
    dataAccessService = new UserDataService(sequelize);
    userService = new UserService(dataAccessService);
}

router.get('/getUserList', (req: Request, res: Response) => {
    const users = userService.getUserList();

    res.json(users);
});

router.get('/getUser/:id', (req: Request, res: Response) => {
    const user = userService.getUserById(req.params.id);

    res.json(user);
});

router.delete('/deleteUser/:id', (req: Request, res: Response) => {
    const user = userService.deleteUserById(req.params.id);

    res.json(user);
});

router.post('/addUser', validateUser(userSchema), (req: Request, res: Response) => {
    const user = userService.addUser(req.body);

    res.json(user);
});

router.put('/updateUser/:id', validateUser(userSchema), (req: Request, res: Response) => {
    const user = userService.updateUserById(req.params.id, req.body);

    res.json(user);
});

router.get('/getAutoSuggestUsers', (req: Request, res: Response) => {
    const users = userService.getAutoSuggestUsers(req.body.loginSubstring, req.body.limit);

    res.json(users);
});
