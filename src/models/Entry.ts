import { DataTypes, Model, Sequelize } from 'sequelize';

export class Entry extends Model {
    id!: number;

    lng!: string;
    ns!: string;
    key!: string;

    value!: string;
}

export function init(sequelize: Sequelize): void {
    Entry.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            lng: {
                type: DataTypes.INTEGER.UNSIGNED,
                unique: 'accessor',
            },
            ns: {
                type: DataTypes.INTEGER.UNSIGNED,
                unique: 'accessor',
            },
            key: {
                type: DataTypes.STRING(128),
                unique: 'accessor',
            },
            value: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
        },
        {
            sequelize,
            tableName: 'entries',
        }
    );
}
