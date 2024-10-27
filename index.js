const http = require('http');
const { promises: fs } = require('fs');
const { Command } = require('commander');
const path = require('path');
const superagent = require('superagent')
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
    } 
    catch (err) {
      try {
          const response = await superagent.get(`https://http.cat/${code}`);
          await fs.writeFile(filePath, response.body);
          res.writeHead(200, { 'Content-Type': 'image/jpeg' });
          res.end(response.body);
        }
    catch (error)
     {
      res.writeHead(404);
      res.end('Not Found\n');
    }
  }
  } 
  else if (req.method === 'PUT') {
    let test = [];
        req.on('data', chunk => {test.push(chunk);})
        req.on('end', async () => {test = Buffer.concat(test);
            try {
                await fs.writeFile(filePath, test);
                res.writeHead(201);
                res.end('Created');
            } catch (err) {
                res.writeHead(404);
                res.end('Not Found');
            }
    });
  } 
  else if (req.method === 'DELETE') {
    try {
      await fs.unlink(filePath);
      res.writeHead(200);
      res.end('Deleted\n');
    } catch (error) {
      res.writeHead(404);
      res.end('Not Found\n');
    }
  } 
  else {
    res.writeHead(405);
    res.end('Method Not Allowed\n');
  }
});

server.listen(port, host, () => {
  console.log(`Server running at http://${host}:${port}/`);
});
