// import { GraphQlServer, PubSub } from 'graphql-yoga'
const { GraphQLServer, PubSub } = require('graphql-yoga');
// import db from './db'
const db = require('./db');
// import Query from './resolvers/Query'
const Query = require('./resolvers/Query');
// import Mutation from './resolvers/Mutation'
const Mutation = require('./resolvers/Mutation');
// import Subscription from './resolvers/Subscription'
const Subscription = require('./resolvers/Subscription');
// import User from './resolvers/User'
const User = require('./resolvers/User');
// import Post from './resolvers/Post'
const Post = require('./resolvers/Post');
// import Comment from './resolvers/Comment'
const Comment = require('./resolvers/Comment');

const pubsub = new PubSub();

// Create the graphQL server
const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
  context: { db, pubsub },
});

server.start(() => console.log('The server is up and running on port 4000!'));
