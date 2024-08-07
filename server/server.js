require("dotenv").config();
const express = require("express");
var { graphql, buildSchema } = require("graphql");
const run = require("./config/dbConfig");
const { createHandler } = require("graphql-http/lib/use/express");
const { ruruHTML } = require("ruru/server");

const app = express();

app.use(express.json());

var schema = buildSchema(`
  type Query {
    hello(username: String!): String,
    age: Int!,
    hobbies: [String]!
    users: User!
  }
    type User {
    id: ID!,
    name: String!,
 
  },
`);

// with the ! makes it strict not optional

var rootValue = {
  hello: ({ username }) => "Hello " + username,
  age: 23,
  hobbies: ["Carting", "Reading", "Fishing", "Dancing"],
  users: () => {
    return {
      id: 1,
      name: "John Doe",
    };
  },
};

var source = "{ hello, age }";

var handler = createHandler({ schema, rootValue, graphiql: true });

app.use("/graphql", handler);

app.get("/", (req, res) => {
  res.type("html");
  console.log(res);
  res.end(
    ruruHTML({
      endpoint: "/graphql",
    })
  );
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
