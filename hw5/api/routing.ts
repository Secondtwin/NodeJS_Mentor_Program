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
let userService: UserService;
let groupService: GroupService;

export function initialize(sequelize: Sequelize): void {
    dataAccessService = new UserDataService(sequelize);
    userService = new UserService(dataAccessService);
    groupService = new GroupService(dataAccessService);
}

router.get('/getUserList', async (req: Request, res: Response) => {
    const users = await userService.getUserList();

    res.json(users);
});

router.get('/getUser/:id', async (req: Request, res: Response) => {
    const user = await userService.getUserById(req.params.id);

    res.json(user);
});

router.delete('/deleteUser/:id', async (req: Request, res: Response) => {
    const user = await userService.deleteUserById(req.params.id);

    res.json(user);
});

router.post('/addUser', validateUser(userSchema), (req: Request, res: Response) => {
    const user = userService.addUser(req.body);

    res.json(user);
});

router.put('/updateUser/:id', validateUser(userSchema), async (req: Request, res: Response) => {
    const user = await userService.updateUserById(req.params.id, req.body);

    res.json(user);
});

router.get('/getAutoSuggestUsers', async (req: Request, res: Response) => {
    const users = await userService.getAutoSuggestUsers(req.body.loginSubstring, req.body.limit);

    res.json(users);
});

router.get('/getGroupList', async (req: Request, res: Response) => {
    const groups = await groupService.getGroupList();

    res.json(groups);
});

router.get('/getGroup/:id', async (req: Request, res: Response) => {
    const group = await groupService.getGroupById(req.params.id);

    res.json(group);
});

router.post('/createGroup', (req: Request, res: Response) => {
    const user = groupService.createGroup(req.body);

    res.json(user);
});

router.put('/updateGroup/:id', async (req: Request, res: Response) => {
    const user = await groupService.updateGroupById(req.params.id, req.body);

    res.json(user);
});

router.delete('/deleteGroup/:id', async (req: Request, res: Response) => {
    const user = await groupService.deleteGroupById(req.params.id);

    res.json(user);
});

router.post('/addUsersToGroup', async (req: Request, res: Response) => {
    const user = await groupService.addUsersToGroup(req.body.groupId, req.body.userIds);

    res.json(user);
});
