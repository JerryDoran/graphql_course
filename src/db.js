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

const db = {
  users,
  posts,
  comments,
};

module.exports = db;
