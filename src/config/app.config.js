require('dotenv').config();
const path = require('path');

const appConfig = {
    PORT: process.env.PORT || 8080,
    getFilePath: (filename) => path.join(__dirname, `../data/${filename}`)
}

module.exports = appConfig;