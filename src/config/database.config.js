require('dotenv').config();

const databaseConfig = {
    MONGODB_URI: process.env.MONGODB_URI,
    DB_NAME: process.env.DB_NAME || 'ecommerce_onda_sonar',

    mongooseOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
};

if (!databaseConfig.MONGODB_URI) {
    console.error('ERROR: MONGODB_URI no está definida en .env');
    process.exit(1);
}

module.exports = databaseConfig;