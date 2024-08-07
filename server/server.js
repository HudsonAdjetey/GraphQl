require("dotenv").config();
const express = require("express");

const run = require("./config/dbConfig");
const { createHandler } = require("graphql-http/lib/use/express");
const { ruruHTML } = require("ruru/server");
const { createSchema, createYoga } = require("graphql-yoga");
const schema = require("./schema/schema");

const app = express();

app.use(express.json());

var handler = createHandler({
  schema,
  graphiql: process.env.NODE_ENV === "development",
});
app.use("/graphql", handler);

app.get("/", (req, res) => {
  res.type("html");
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
