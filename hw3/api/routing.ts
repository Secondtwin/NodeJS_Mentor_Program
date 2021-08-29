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

router.get('/users', async (req: Request, res: Response) => {
    const users = await userService.getUserList();

    res.json(users);
});

router.get('/users/:id', async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);

    res.json(user);
});

router.delete('/users/:id',  async (req: Request, res: Response) => {
    const user = await userService.deleteUserById(req.params.id);

    res.json(user);
});

router.post('/users', validateUser(userSchema), (req: Request, res: Response) => {
    const user = userService.addUser(req.body);

    res.json(user);
});

router.put('/users/:id', validateUser(userSchema), async (req: Request, res: Response) => {
    const user = await userService.updateUserById(req.params.id, req.body);

    res.json(user);
});

router.get('/users/auto-suggested', async (req: Request, res: Response) => {
    const users = await userService.getAutoSuggestUsers(req.body.loginSubstring, req.body.limit);

    res.json(users);
});
