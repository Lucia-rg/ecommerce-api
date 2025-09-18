const { server, io } = require('./src/app');
const config = require('./src/config/config');

const PORT = config.PORT;

server.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en: http://localhost:${PORT}`);
});