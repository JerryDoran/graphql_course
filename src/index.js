const { GraphQLServer } = require('graphql-yoga');

// Demo user data
const users = [
  { id: '1', name: 'Steve', email: 'steve@avengers.com', age: 100 },
  { id: '2', name: 'Tony', email: 'tony@avengers.com', age: 45 },
  { id: '3', name: 'Natasha', email: 'natasha@avengers.com' },
];

const posts = [
  {
    id: '1',
    title: 'GraphQL 101',
    body: 'blah blah blah',
    published: true,
    authorId: '1',
  },
  {
    id: '2',
    title: 'JavaScript',
    body: 'blah blah blah',
    published: false,
    authorId: '3',
  },
  {
    id: '3',
    title: 'CSS Basics',
    body: 'blah blah blah',
    published: true,
    authorId: '1',
  },
];

const comments = [
  { id: '11', text: 'A good post', authorId: '2', postId: '1' },
  { id: '12', text: 'A not so good post', authorId: '3', postId: '2' },
  { id: '13', text: 'One of the best posts ever', authorId: '2', postId: '3' },
  { id: '14', text: 'One of the worst posts ever', authorId: '1', postId: '2' },
];

// Type definitions (schema).  Leaving off the '!' means it's OK to get a null value
const typeDefs = `
  type Query {
    users(query: String): [User!]! 
    posts(query: String): [Post!]!  
    comments: [Comment!]!
    me: User!
    post: Post!    
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int
    posts: [Post!]!
    comments: [Comment!]!
  }

  type Post {
    id: ID!
    title: String!
    body: String!
    published: Boolean!
    author: User!
    comments: [Comment!]!
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, args, ctx, info) {
      if (!args.query) {
        return users;
      }

      // Filter users by name
      return users.filter((user) =>
        user.name.toLowerCase().includes(args.query.toLowerCase())
      );
    },

    // Returns back an array of objects that match up against the Post schema
    posts(parent, args, ctx, info) {
      if (!args.query) {
        return posts;
      }

      // Filter posts by title or body
      return posts.filter(
        (post) =>
          post.title.toLocaleLowerCase().includes(args.query.toLowerCase()) ||
          post.body.toLowerCase().includes(args.query.toLowerCase())
      );
    },

    comments(parent, args, ctx, info) {
      return comments;
    },

    me() {
      return {
        id: 'abc123',
        name: 'Tony',
        email: 'tony@avengers.com',
        age: 45,
      };
    },
    post() {
      return {
        id: '123456',
        title: 'Learning graphQL',
        body: 'blah blah blah',
        published: false,
      };
    },
  },
  Post: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.authorId);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.postId === parent.id);
    },
  },
  User: {
    posts(parent, args, ctx, info) {
      return posts.filter((post) => post.authorId === parent.id);
    },
    comments(parent, args, ctx, info) {
      return comments.filter((comment) => comment.authorId === parent.id);
    },
  },
  Comment: {
    author(parent, args, ctx, info) {
      return users.find((user) => user.id === parent.authorId);
    },
    post(parent, args, ctx, info) {
      return posts.find((post) => post.id === parent.postId);
    },
  },
};

// Create the graphQL server
const server = new GraphQLServer({
  typeDefs: typeDefs,
  resolvers: resolvers,
});

server.start(() => console.log('The server is up and running on port 4000!'));
