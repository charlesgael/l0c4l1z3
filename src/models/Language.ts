import { Association, DataTypes, Model, Sequelize } from 'sequelize';
import { Entry } from './Entry';

export class Language extends Model {
    id!: number;
    name!: string;
    code!: string;

    public static relations: {
        entries: Association<Language, Entry>;
    };
}

export function init(sequelize: Sequelize): void {
    Language.init(
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
                type: DataTypes.STRING(10),
                unique: true,
            },
        },
        {
            sequelize,
            tableName: 'languages',
        }
    );
}
