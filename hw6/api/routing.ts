import { Request, Response } from 'express';
import { validateUser } from '../validators/user.validator';
import { userSchema } from '../models/user.schema';
import express = require('express');
import { Sequelize } from 'sequelize';
import { UserDataService } from '../data-access/user-data.service';
import { UserService } from '../services/user.service';
import { GroupService } from '../services/group.service';

export const router = express.Router();

let dataAccessService: UserDataService;
let groupService: GroupService;
export let userService: UserService;

export function initialize(sequelize: Sequelize): void {
    dataAccessService = new UserDataService(sequelize);
    userService = new UserService(dataAccessService);
    groupService = new GroupService(dataAccessService);
}

router.get('/users', async (req: Request, res: Response) => {
    const users = await userService.getUserList();

    res.json(users);
});

router.get('/users/:id', async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);

    res.json(user);
});

router.delete('/users/:id', async (req: Request, res: Response) => {
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

router.get('/groups', async (req: Request, res: Response) => {
    const groups = await groupService.getGroupList();

    res.json(groups);
});

router.get('/groups/:id', async (req: Request, res: Response) => {
    const group = await groupService.getGroupById(req.params.id);

    res.json(group);
});

router.post('/groups', (req: Request, res: Response) => {
    const user = groupService.createGroup(req.body);

    res.json(user);
});

router.put('/groups/:id', async (req: Request, res: Response) => {
    const user = await groupService.updateGroupById(req.params.id, req.body);

    res.json(user);
});

router.delete('/groups/:id', async (req: Request, res: Response) => {
    const user = await groupService.deleteGroupById(req.params.id);

    res.json(user);
});

router.post('/groups/add-users-to-groups', async (req: Request, res: Response) => {
    const user = await groupService.addUsersToGroup(req.body.groupId, req.body.userIds);

    res.json(user);
});
