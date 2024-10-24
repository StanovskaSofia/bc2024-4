const http = require('http');
const { Command } = require('commander');
const program = new Command();

program
  .requiredOption('-h, --host <host>', 'server host')
  .requiredOption('-p, --port <port>', 'server port')
  .requiredOption('-c, --cache <path>', 'cache directory');

program.parse(process.argv);

const options = program.opts();

const server = http.createServer((req, res) => 
{
 res.end('Hello, World!\n');
});

server.listen(options.port, options.host, () => 
{
  console.log(`server running at http://${options.host}:${options.port}/`);
});