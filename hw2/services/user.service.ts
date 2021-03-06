import { UserDataService } from '../data-access/user-data.service';
import { v4 as uuidv4 } from 'uuid';
import { Model } from 'sequelize';
import { User } from '../models/user.model';

export class UserService {
    private dataAccessService;

    constructor(userDataService: UserDataService) {
        this.dataAccessService = userDataService;
    }

    getUserList(): Promise<Model<string, User>[]> {
        return this.dataAccessService.getUsers();
    }

    getUserById(id: string): Promise<Model<string, User>> {
        return this.dataAccessService.getUserById(id);
    }

    addUser(userData: User): Promise<Model<string, User>> {
        const user = {
            ...userData,
            isDeleted: false,
            id: uuidv4()
        };

        return this.dataAccessService.createUser(user);
    }

    updateUserById(id: string, user: User): Promise<Model<string, User>> {
        return this.dataAccessService.updateUserById(id, user);
    }

    deleteUserById(id: string): Promise<Model<string, User>> {
        return this.dataAccessService.updateUserById(id, { isDeleted: true });
    }

    getAutoSuggestUsers(login: string, limit: number): Promise<Model<string, User>[]> {
        return this.dataAccessService.getAutoSuggestUsers(login, limit);
    }
}
