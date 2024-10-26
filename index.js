const http = require('http');
const { promises: fs } = require('fs');
const { Command } = require('commander');
const path = require('path');
const program = new Command();

program
  .requiredOption('-h, --host <host>', 'server host')
  .requiredOption('-p, --port <port>', 'server port')
  .requiredOption('-c, --cache <path>', 'cache directory');

program.parse(process.argv);
const { host, port, cache } = program.opts();

const getFilePath = (code) => path.join(cache, `${code}.jpg`);

const server = http.createServer(async (req, res) => {
  const code = req.url.slice(1);
  const filePath = getFilePath(code);

  if (req.method === 'GET') {
    try {
      const data = await fs.readFile(filePath);
      res.writeHead(200, { 'Content-Type': 'image/jpeg' });
      res.end(data);
    } catch (error) {
      res.writeHead(404);
      res.end('Not Found\n');
    }
  } 
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
