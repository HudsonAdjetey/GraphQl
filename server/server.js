require("dotenv").config();
const express = require("express");
var { graphql, buildSchema } = require("graphql");
const run = require("./config/dbConfig");

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

graphql({ schema, source, rootValue }).then((response) => {
  console.log(response);
});

run()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.error("Error connecting to the database", error);
  });
