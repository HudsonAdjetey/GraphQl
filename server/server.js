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

const app = express();

app.use(express.json());

/* var schema = buildSchema(`
  type Query {
    hello(username: String!): String,
    age: Int!,
    hobbies: [String]!
    users: User!
  }
    type User {
    id: ID!,
    name: String!,
 posts: [Posts]
  },
  type Posts {
  id: ID!,
  title: String!,
  content: String!,
  user: User!
}
`); */

// with the ! makes it strict not optional

const User = new GraphQLObjectType({
  name: "User",
  fields: {
    id: { type: GraphQLInt },
    name: { type: GraphQLString },
  },
});

const schema = new GraphQLSchema({
  // query type
  query: new GraphQLObjectType({
    name: "RootQueryType",
    fields: {
      hello: {
        type: GraphQLString,
        args: { username: { type: GraphQLString } },
        resolve: (parent, { username }) => {
          return `Hello ${username}!`;
        },
      },
      users: {
        type: User,
        resolve: () => {
          return {
            id: 1,
            name: "John Doe",
          };
        },
      },
    },
  }),
});

var rootValue = {
  hello: ({ username }) => "Hello " + username,
  age: 23,
  hobbies: ["Carting", "Reading", "Fishing", "Dancing"],
  users: () => {
    return {
      id: 1,
      name: "John Doe",
      posts: [
        {
          id: 1,
          title: "First Post",
          content: "This is the first post",
          user: {
            id: 1,
            name: "John Doe",
          },
        },
        {
          id: 2,
          title: "Second Post",
          content: "This is the second post",
          user: {
            id: 2,
            name: "Hudson Doe",
          },
        },
      ],
    };
  },
};

var source = "{ hello, age }";

var handler = createHandler({ schema, graphiql: true });

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
