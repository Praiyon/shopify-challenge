var env = process.env.NODE_ENV || "development";
const config = require('./config/config.json')[env];
const http = require('http');
const app = require('./app');
const server = http.createServer(app).listen(config.port, () => {
    console.log('Our project is running! ', (new Date()).toString());
    console.log('running on port is runing on port ', config.port);
}).on('error', function (err) {
    console.error(JSON.stringify(err));
});
server.listen(config.port);