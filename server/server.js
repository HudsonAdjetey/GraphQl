require("dotenv").config();
const express = require("express");

const { connectDB } = require("./config/dbConfig");
const { createHandler } = require("graphql-http/lib/use/express");
const { ruruHTML } = require("ruru/server");
const { createSchema, createYoga } = require("graphql-yoga");
const schema = require("./schema/schema");
connectDB().then((re) => {
  console.log("Database connected successfully".green);
});
require("colors");
const app = express();

app.use(express.json());

const handler = createHandler({
  schema,
  graphiql: process.env.NODE_ENV === "development",
});
app.use("/graphql", handler);

app.all("/", (req, res) => {
  res.type("html");
  res.end(
    ruruHTML({
      endpoint: "/graphql",
    })
  );
});

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
