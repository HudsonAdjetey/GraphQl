# GraphQL, Node.js, and MongoDB Server Setup

This guide provides a step-by-step walkthrough to set up a server using GraphQL, Node.js, and MongoDB. The combination of these technologies allows for efficient data querying, robust backend development, and scalable data storage.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Project Setup](#project-setup)
3. [Setting up MongoDB](#setting-up-mongodb)
4. [Creating the Node.js Server](#creating-the-nodejs-server)
5. [Setting up GraphQL](#setting-up-graphql)
6. [Connecting to MongoDB](#connecting-to-mongodb)
7. [Defining GraphQL Schemas and Resolvers](#defining-graphql-schemas-and-resolvers)
8. [Running the Server](#running-the-server)
9. [Testing GraphQL Queries](#testing-graphql-queries)
10. [Conclusion](#conclusion)

## Prerequisites

Before you begin, ensure you have the following installed on your machine:

- Node.js (v12.x or higher)
- npm (Node Package Manager)
- MongoDB (local or cloud instance, e.g., MongoDB Atlas)
- A code editor (e.g., VSCode)

## Project Setup

1. **Initialize a new Node.js project**:

   ```bash
   mkdir graphql-node-mongodb
   cd graphql-node-mongodb
   npm init -y
   ```

   <button onclick="copyToClipboard('npm init -y')">Copy</button>

2. **Install necessary packages**:

   ```bash
   npm install express graphql express-graphql mongoose
   ```

   <button onclick="copyToClipboard('npm install express graphql express-graphql mongoose')">Copy</button>

## Setting up MongoDB

If you haven't set up MongoDB yet, you can use MongoDB Atlas for a cloud instance or install MongoDB locally.

- **MongoDB Atlas**: Follow [this guide](https://docs.atlas.mongodb.com/getting-started/) to set up a free-tier MongoDB Atlas cluster.
- **Local MongoDB**: Follow [this guide](https://docs.mongodb.com/manual/installation/) to install MongoDB locally.

## Creating the Node.js Server

1. **Create the main server file**:

   ```bash
   touch index.js
   ```

   <button onclick="copyToClipboard('touch index.js')">Copy</button>

2. **Set up the basic Express server** in `index.js`:

   ```js
   const express = require("express");
   const { graphqlHTTP } = require("express-graphql");
   const mongoose = require("mongoose");
   const schema = require("./schema/schema"); // We'll define this later

   const app = express();

   // Connect to MongoDB
   mongoose.connect("your_mongodb_connection_string", {
     useNewUrlParser: true,
     useUnifiedTopology: true,
   });
   mongoose.connection.once("open", () => {
     console.log("Connected to MongoDB");
   });

   // Use graphqlHTTP middleware
   app.use(
     "/graphql",
     graphqlHTTP({
       schema,
       graphiql: true,
     })
   );

   const PORT = 4000;
   app.listen(PORT, () => {
     console.log(`Server is running on http://localhost:${PORT}/graphql`);
   });
   ```

   <button onclick="copyToClipboard('const express = require(\'express\');\nconst { graphqlHTTP } = require(\'express-graphql\');\nconst mongoose = require(\'mongoose\');\nconst schema = require(\'./schema/schema\'); // We\'ll define this later\n\nconst app = express();\n\n// Connect to MongoDB\nmongoose.connect(\'your_mongodb_connection_string\', { useNewUrlParser: true, useUnifiedTopology: true });\nmongoose.connection.once(\'open\', () => {\n  console.log(\'Connected to MongoDB\');\n});\n\n// Use graphqlHTTP middleware\napp.use(\'/graphql\', graphqlHTTP({\n  schema,\n  graphiql: true,\n}));\n\nconst PORT = 4000;\napp.listen(PORT, () => {\n  console.log(`Server is running on http://localhost:${PORT}/graphql`);\n});')">Copy</button>

## Setting up GraphQL

1. **Create a `schema` directory**:

   ```bash
   mkdir schema
   touch schema/schema.js
   ```

   <button onclick="copyToClipboard('mkdir schema\ntouch schema/schema.js')">Copy</button>

2. **Define the GraphQL schema and resolvers** in `schema/schema.js`:

   ```js
   const graphql = require("graphql");
   const {
     GraphQLObjectType,
     GraphQLSchema,
     GraphQLString,
     GraphQLID,
     GraphQLList,
   } = graphql;
   const mongoose = require("mongoose");

   // Define Mongoose models
   const User = mongoose.model(
     "User",
     new mongoose.Schema({
       name: String,
       email: String,
     })
   );

   // Define GraphQL Object Types
   const UserType = new GraphQLObjectType({
     name: "User",
     fields: () => ({
       id: { type: GraphQLID },
       name: { type: GraphQLString },
       email: { type: GraphQLString },
     }),
   });

   // Define RootQuery
   const RootQuery = new GraphQLObjectType({
     name: "RootQueryType",
     fields: {
       user: {
         type: UserType,
         args: { id: { type: GraphQLID } },
         resolve(parent, args) {
           return User.findById(args.id);
         },
       },
       users: {
         type: new GraphQLList(UserType),
         resolve(parent, args) {
           return User.find({});
         },
       },
     },
   });

   // Define Mutations
   const Mutation = new GraphQLObjectType({
     name: "Mutation",
     fields: {
       addUser: {
         type: UserType,
         args: {
           name: { type: GraphQLString },
           email: { type: GraphQLString },
         },
         resolve(parent, args) {
           const user = new User({
             name: args.name,
             email: args.email,
           });
           return user.save();
         },
       },
     },
   });

   module.exports = new GraphQLSchema({
     query: RootQuery,
     mutation: Mutation,
   });
   ```

   <button onclick="copyToClipboard('const graphql = require(\'graphql\');\nconst { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLID, GraphQLList } = graphql;\nconst mongoose = require(\'mongoose\');\n\n// Define Mongoose models\nconst User = mongoose.model(\'User\', new mongoose.Schema({\n  name: String,\n  email: String,\n}));\n\n// Define GraphQL Object Types\nconst UserType = new GraphQLObjectType({\n  name: \'User\',\n  fields: () => ({\n    id: { type: GraphQLID },\n    name: { type: GraphQLString },\n    email: { type: GraphQLString },\n  }),\n});\n\n// Define RootQuery\nconst RootQuery = new GraphQLObjectType({\n  name: \'RootQueryType\',\n  fields: {\n    user: {\n      type: UserType,\n      args: { id: { type: GraphQLID } },\n      resolve(parent, args) {\n        return User.findById(args.id);\n      },\n    },\n    users: {\n      type: new GraphQLList(UserType),\n      resolve(parent, args) {\n        return User.find({});\n      },\n    },\n  },\n});\n\n// Define Mutations\nconst Mutation = new GraphQLObjectType({\n  name: \'Mutation\',\n  fields: {\n    addUser: {\n      type: UserType,\n      args: {\n        name: { type: GraphQLString },\n        email: { type: GraphQLString },\n      },\n      resolve(parent, args) {\n        const user = new User({\n          name: args.name,\n          email: args.email,\n        });\n        return user.save();\n      },\n    },\n  },\n});\n\nmodule.exports = new GraphQLSchema({\n  query: RootQuery,\n  mutation: Mutation,\n});')">Copy</button>

## Connecting to MongoDB

Replace `'your_mongodb_connection_string'` in the `index.js` file with your actual MongoDB connection string. If using MongoDB Atlas, it should look something like:

```js
mongoose.connect(
  "mongodb+srv://username:password@cluster.mongodb.net/myDatabase?retryWrites=true&w=majority",
  { useNewUrlParser: true, useUnifiedTopology: true }
);
```
