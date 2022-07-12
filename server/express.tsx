import React from 'react';
import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import ReactDOMServer from 'react-dom/server';
import App from '../src/App';

dotenv.config();

const app: Express = express();

app.get(
  /\.(js|css|map|ico)$/,
  express.static(path.resolve(__dirname, '../../dist'))
);

app.use('*', (req, res) => {
  // читаем файл `index.html`
  let indexHTML = fs.readFileSync(
    path.resolve(__dirname, '../../../dist/index.html'),
    {
      encoding: 'utf8',
    }
  );

  let appHTML = ReactDOMServer.renderToString(<App />);

  indexHTML = indexHTML.replace(
    '<div id="root"></div>',
    `<div id="root">${appHTML}</div>`
  );

  // устанавливаем заголовок и статус
  res.contentType('text/html');
  res.status(200);

  return res.send(indexHTML);
});

app.listen('9000', () => {
  console.log('Express server started at <http://localhost:9000>');
});
