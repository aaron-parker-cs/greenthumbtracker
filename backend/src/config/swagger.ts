const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const port = process.env.PORT || 8800;

const options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Plant API',
      version: '1.0.0',
      description: 'A simple Express API for managing plants.',
    },
    servers: [
      {
        url: `http://localhost:${port}/api`,
        description: 'Development server',
      },
    ],
  },
  apis: ['./src/routes/*.ts'],
};

export const specs = swaggerJsdoc(options);
