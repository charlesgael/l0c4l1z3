import dotenv from 'dotenv';
import sequelize from './sequelize';

dotenv.config();

console.log('Startup sequence...');
sequelize(true)
    .then(() => {
        console.log('Database spawned');
    })
    .catch((e) => {
        console.error('DB error', e);
    });
