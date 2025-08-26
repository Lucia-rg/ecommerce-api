const app = require('./app');
const config = require('./src/config/config');

const PORT = config.PORT;

app.listen(PORT, () => {
    console.log(`🚀 Servidor ejecutándose en: http://localhost:${PORT}`);
});