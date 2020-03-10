const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');

const replaceTemplate = require('./modules/replaceTemplate').default;

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);

const dataObj = JSON.parse(data);

/* const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs); */

//HTTP Request
const server = http.createServer((request, response) => {
  const { query, pathname } = url.parse(request.url, true);

  //Overview Page
  if (pathname === '/' || pathname === '/overview') {
    response.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    response.end(output);

    //PRODUCT PAGE
  } else if (pathname === '/product') {
    response.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    response.end(output);

    //API
  } else if (pathname === '/api') {
    response.writeHead(200, {
      'Content-type': 'application/json'
    });

    response.end(data);
  } else {
    response.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    response.end(`<h1>Page not found!</h1>`);
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Listening for requests on port 8000');
});
