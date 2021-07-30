import { Model, ModelCtor, Op, Sequelize, Transaction } from 'sequelize';
import { Group, User, defineGroups, defineUser, UserGroup, defineUserGroup } from '../models';
import { NonNullFindOptions } from 'sequelize/types/lib/model';

export class UserDataService {
    public user: ModelCtor<Model<string, User>>;
    public group: ModelCtor<Model<string, Group>>;
    public userGroup: ModelCtor<Model<string, UserGroup>>;
    public sequelize: Sequelize;
    public transaction: Transaction | Promise<Transaction>;

    constructor(sequelize: Sequelize) {
        this.authenticate(sequelize);
        this.sequelize = sequelize;
        this.transaction = sequelize.transaction();


        Promise.all([
            this.user = defineUser(sequelize),
            this.group = defineGroups(sequelize),
            this.userGroup = defineUserGroup(sequelize),
            this.syncInstances()
        ])
            .then(() => {
                this.user.belongsToMany(this.group, { through: this.userGroup, as: 'groups', foreignKey: 'user_id' });
                this.group.belongsToMany(this.user, { through: this.userGroup, as: 'users', foreignKey: 'group_id' });
            });
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

    getGroups(): Promise<Model<string, Group>[]> {
        return this.group.findAll();
    }

    getGroupById(id: string): Promise<Model<string, Group>> {
        return this.group.findOne({
            where: {
                id
            },
            rejectOnEmpty: false
        } as NonNullFindOptions);
    }

    createGroup(groupData: Group): Promise<Model<string, Group>> {
        return this.group.create(groupData);
    }

    async updateGroupById(id: string, groupData: Group): Promise<Model<string, Group>> {
        const result = await this.getGroupById(id);

        if (result) {
            Object.assign(result, groupData);

            return await result.save();
        }

        throw new Error('There is no group with that id');
    }

    async deleteGroupById(id: string): Promise<void> {
        const result = await this.getGroupById(id);

        if (result) {
            return await result.destroy();
        }

        throw new Error('There is no group with that id');
    }

    createUserGroup(userGroup: UserGroup):  Promise<Model<string, UserGroup>> {
        return this.userGroup.create(userGroup, { transaction: this.transaction as Transaction });
    }

    async authenticate(sequelize: Sequelize): Promise<void> {
        await sequelize.authenticate();
    }

    async syncInstances(): Promise<void> {
        await this.user.sync();
        await this.group.sync();
        await this.userGroup.sync();
    }

    async generateTransaction(options = {}): Promise<void> {
        this.transaction = await this.sequelize.transaction(options);
    }

    async commitTransaction(): Promise<void> {
        await (this.transaction as Transaction).commit();
    }

    async rollbackTransaction(): Promise<void> {
        await (this.transaction as Transaction).rollback();
    }
}
