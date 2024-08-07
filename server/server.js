require("dotenv").config();
const express = require("express");
var {
  graphql,
  buildSchema,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLInt,
  GraphQLList,
  GraphQLString,
  GraphQLID,
} = require("graphql");
const run = require("./config/dbConfig");
const { createHandler } = require("graphql-http/lib/use/express");
const { ruruHTML } = require("ruru/server");
const { createSchema, createYoga } = require("graphql-yoga");
const app = express();

app.use(express.json());

const yoga = createYoga({
  schema: createSchema({
    typeDefs: `
        type Query {
            hello: String
        }`,
    resolvers: {
      Query: {
        hello: () => "Hello, World!",
      },
    },
  }),
});
app.use("/graphql", yoga);

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
