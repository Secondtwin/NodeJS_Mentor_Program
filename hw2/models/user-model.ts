import { DataTypes, Model, ModelCtor, QueryInterface, Sequelize } from 'sequelize';
import { User } from '../models/user.model';

const attributes = {
    id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        unique: true,
        defaultValue: Sequelize.literal('uuid_generate_v4()')
    },
    login: {
        type: DataTypes.STRING,
        unique: {
            name: 'login',
            msg: 'This login is already taken'
        },
        allowNull: false,
        validate: {
            notNull: { msg: 'Property login is required' }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: { msg: 'Property password is required' },
            checkRegex(val: string) {
                if (!/^(?=.*?[A-Za-z])(?=.*?[0-9]).{8,}$/.test(val)) {
                    throw new Error('Password must contain letters and numbers');
                }
            }
        }
    },
    age: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            min: 4,
            max: 130,
            notNull: { msg: 'Property age is required' }
        }
    },
    isDeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    }
};

export async function defineTable(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.sequelize.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');
}

export function defineUser(sequelize: Sequelize): ModelCtor<Model<string, User>> {
    return sequelize.define('users', attributes,
        {
            timestamps: false
        });
}
