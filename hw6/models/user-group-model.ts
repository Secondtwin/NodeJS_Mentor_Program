import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { UserGroup } from '../models';

const attributes = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true
    },
    group_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notNull: { msg: 'Property group_id is required' }
        }
    },
    user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        validate: {
            notNull: { msg: 'Property user_id is required' }
        }
    }
};

export function defineUserGroup(sequelize: Sequelize): ModelCtor<Model<string, UserGroup>> {
    return sequelize.define('userGroup', attributes,
        {
            timestamps: false
        });
}
