import swaggerAutogen from 'swagger-autogen';
const outputFile = './docs/swagger_output.json';
const endpointsFiles = ['./routes/auth.js', './routes/user.js', './routes/doctor.js'];
const config = {
    info: {
        version: "1.0.0",
        title: "AetherWell API",
        description: "AetherWell API documentation",
    },

    tags: [
        {
            "name": "Auth",
            "description": "Endpoints for user authentication"
        },
        {
            "name": "User",
            "description": "Endpoints for user operations"
        },
        {
            "name": "Doctor",
            "description": "Endpoints for doctor operations"
        }
    ],
    securityDefinitions: { Bearer: { type: 'apiKey', name: 'Authorization', in: 'header', }, }, security: [ { Bearer: [], }, ],
    
    host: "localhost:3000",
    basePath: "/",
    schemes: ['http'],
    consumes: ['application/json'],
    produces: ['application/json'],
};
swaggerAutogen()(outputFile, endpointsFiles, config);