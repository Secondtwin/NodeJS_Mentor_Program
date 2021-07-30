import { Model, ModelCtor, Op, Sequelize } from 'sequelize';
import { defineTable, defineUser } from '../models/user-model';
import { User } from '../models/user.model';
import { NonNullFindOptions } from 'sequelize/types/lib/model';

export class UserDataService {
    public user: ModelCtor<Model<string, User>>;

    constructor(sequelize: Sequelize) {
        this.initialize(sequelize);
        this.defineTable(sequelize);
        this.user = defineUser(sequelize);
        this.defineUser();
    }

    async initialize(sequelize: Sequelize): Promise<void> {
        await sequelize.authenticate();
    }

    async defineTable(sequelize: Sequelize): Promise<void> {
        const queryInterface = sequelize.getQueryInterface();

        await defineTable(queryInterface);
    }

    async defineUser(): Promise<void> {
        await this.user.sync();
    }

    getUsers(options = {}): Promise<Model<string, User>[]> {
        return this.user.findAll(options);
    }

    getUserById(id: string): Promise<Model<string, User>> {
        return this.user.findOne({
            where: {
                id
            },
            rejectOnEmpty: false
        } as NonNullFindOptions);
    }

    createUser(userData: User): Promise<Model<string, User>> {
        return this.user.create(userData);
    }

    async updateUserById(id: string, data: User): Promise<Model<string, User>> {
        const result = await this.getUserById(id);

        if (result) {
            Object.assign(result, data);

            return await result.save();
        }

        throw new Error('User with this id does not exist');
    }

    getAutoSuggestUsers(loginSubstring: string, limit: number): Promise<Model<string, User>[]> {
        const options = {
            where: {
                login: {
                    [Op.substring]: loginSubstring
                }
            },
            limit,
            order: [
                ['login', 'ASC']
            ]
        };

        return this.getUsers(options);
    }
}
