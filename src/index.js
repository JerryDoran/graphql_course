const { GraphQLServer } = require('graphql-yoga');

// Type definitions (schema)
const typeDefs = `
  type Query {
    hello: String!
    name: String!
    location: String!
    bio: String!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    hello() {
      return 'This is my first query';
    },
    name() {
      return 'Steve Rogers';
    },
    location() {
      return 'Somewhere in time';
    },
    bio() {
      return 'Super soldier';
    },
  },
};

const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

server.start(() => console.log('The server is up and running!'));
