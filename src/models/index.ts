import { Sequelize } from 'sequelize/types';
import { Entry, init as initEntry } from './Entry';
import { init as initLanguage, Language } from './Language';
import { init as initNamespace, Namespace } from './Namespace';

export const init = async (sequelize: Sequelize, force = false) => {
    [initEntry, initLanguage, initNamespace].forEach((it) => {
        it(sequelize);
    });

    // relations
    Entry.belongsTo(Language, {
        targetKey: 'id',
        foreignKey: 'lng',
    });
    Entry.belongsTo(Namespace, {
        targetKey: 'id',
        foreignKey: 'ns',
    });

    await sequelize.sync({
        force,
    });
};
