require("dotenv").config();
const express = require("express");
var { graphql, buildSchema } = require("graphql");
const run = require("./config/dbConfig");
const { createHandler } = require("graphql-http/lib/use/express");
const { ruruHtml } = require("ruru");

const app = express();

app.use(express.json());

var schema = buildSchema(`
  type Query {
    hello: String,
    age: Int
  }
`);

var rootValue = { hello: () => "Hello world!", age: 23 };

var source = "{ hello, age }";

var handler = createHandler({ schema, rootValue, graphiql: true });

app.use("/graphql", handler);

run()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
