import { Association, DataTypes, Model, Sequelize } from 'sequelize';
import { Entry } from './Entry';

export class Namespace extends Model {
    id!: number;
    name!: string;
    code!: string;

    public static relations: {
        entries: Association<Namespace, Entry>;
    };
}

export function init(sequelize: Sequelize): void {
    Namespace.init(
        {
            id: {
                type: DataTypes.INTEGER.UNSIGNED,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(64),
                allowNull: false,
            },
            code: {
                type: DataTypes.STRING(20),
                unique: true,
            },
        },
        {
            sequelize,
            tableName: 'namespaces',
        }
    );
}
