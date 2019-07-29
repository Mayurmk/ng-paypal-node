const server = require('./server');
const PORT = 3000;

server.listen(PORT, () => {
    console.log(`Server started on the port... ${PORT}`);
});

module.exports = server;
