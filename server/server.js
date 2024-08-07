require("dotenv").config();
const express = require("express");
var { graphql, buildSchema } = require("graphql");
const run = require("./config/dbConfig");

const app = express();


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
