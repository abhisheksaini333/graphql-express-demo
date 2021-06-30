const express = require('express');
const expressGraphQL = require('express-graphql').graphqlHTTP;
const schema = require('./schema/schema');

const port = 4800;

const app = express();

app.use('/hello', (req, res) => {
    res.status(200).json({ response: "Hi, how are you ?" });
})

app.use('/graphql', expressGraphQL({
    graphiql: true,
    schema
}));

app.listen(port, () => {
    console.log(`My Server is up and running on port ${port}`);
})