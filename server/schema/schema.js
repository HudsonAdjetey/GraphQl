// graph ql
const {
  GraphQLObjectType,
  GraphQLID,
  GraphQLString,
  GraphQLSchema,
  GraphQLList,
} = require("graphql");
const { clients, projects } = require("../dummyData");

// set up a client type
const ClientType = new GraphQLObjectType({
  name: "Clients",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    phone: { type: GraphQLString },
  }),
});

// set up a project type
const ProjectType = new GraphQLObjectType({
  name: "Project",
  fields: () => ({
    id: { type: GraphQLID },
    name: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
  }),
});

const RootQuery = new GraphQLObjectType({
  name: "RootQuery",
  fields: {
    projects: {
      type: new GraphQLList(ProjectType),
      resolve() {
        return projects;
      },
    },
    clients: {
      type: new GraphQLList(ClientType),
      resolve() {
        return clients;
      },
    },
    client: {
      type: ClientType,
      args: {
        id: { type: GraphQLID },
      },
      resolve(parent, args) {
        return clients.find((client) => client.id == args.id);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
