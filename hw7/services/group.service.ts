import { UserDataService } from '../data-access/user-data.service';
import { Model } from 'sequelize';
import { Group, UserGroup } from '../models';
import { v4 as uuidv4 } from 'uuid';

export class GroupService {
    private dataAccessService;

    constructor(userDataService: UserDataService) {
        this.dataAccessService = userDataService;
    }

    getGroupList(): Promise<Model<string, Group>[]> {
        return this.dataAccessService.getGroups();
    }

    getGroupById(id: string): Promise<Model<string, Group>> {
        return this.dataAccessService.getGroupById(id);
    }

    createGroup(groupData: Group): Promise<Model<string, Group>> {
        const group = {
            ...groupData,
            id: uuidv4()
        };

        return this.dataAccessService.createGroup(group);
    }

    updateGroupById(id: string, group: Group): Promise<Model<string, Group>> {
        return this.dataAccessService.updateGroupById(id, group);
    }

    deleteGroupById(id: string): Promise<void> {
        return this.dataAccessService.deleteGroupById(id);
    }

    async addUsersToGroup(groupId: string, userIds: string[]): Promise<Array<Model<string, UserGroup>>> {
        await this.dataAccessService.generateTransaction();

        try {
            await this.dataAccessService.getGroupById(groupId);

            const result = userIds.map(async (userId) => {
                await this.dataAccessService.getUserById(userId);

                const userGroup = {
                    group_id: groupId,
                    user_id: userId,
                    id: uuidv4()
                };

                return await this.dataAccessService.createUserGroup(userGroup);
            });

            const res = await Promise.all(result);
            await this.dataAccessService.commitTransaction();

            return res;
        } catch (err) {
            await this.dataAccessService.rollbackTransaction();
        }

        return [];
    }
}
