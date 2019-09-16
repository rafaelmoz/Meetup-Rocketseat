/* Vamos criar no back-end usando classes, pois, a classe ela basicamente da um
nome para alguma funcionalidade dentro da nossa aplicação */

import express from 'express';
import routes from './routes';

class App {
  constructor() {
    this.server = express();

    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.use(routes);
  }
}

export default new App().server;
