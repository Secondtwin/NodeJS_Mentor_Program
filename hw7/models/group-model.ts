import { DataTypes, Model, ModelCtor, Sequelize } from 'sequelize';
import { Group } from '../models';

const attributes = {
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true
    },
    name: {
        type: DataTypes.STRING,
        unique: {
            name: 'name',
            msg: 'This group name is already taken'
        },
        allowNull: false,
        validate: {
            notNull: { msg: 'Property name is required' }
        }
    },
    permissions: {
        type: DataTypes.ARRAY(DataTypes.ENUM({
            values: ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES']
        })),
        validate: {
            isAllAcceptable(value: string[]) {
                const enumValues = ['READ', 'WRITE', 'DELETE', 'SHARE', 'UPLOAD_FILES'];

                if (!value.map((val: string) => enumValues.includes(val)).every((el) => el)) {
                    throw new Error('The permissions value could consist only of [\'READ\', \'WRITE\', \'DELETE\', \'SHARE\', \'UPLOAD_FILES\']');
                }
            }
        }
    }
};

export function defineGroups(sequelize: Sequelize): ModelCtor<Model<string, Group>> {
    return sequelize.define('groups', attributes,
        {
            timestamps: false
        });
}
