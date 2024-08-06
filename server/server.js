var { graphql, buildSchema } = require("graphql");

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
