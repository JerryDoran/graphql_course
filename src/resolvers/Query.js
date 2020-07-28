const Query = {
  users(parent, args, { db }, info) {
    if (!args.query) {
      return db.users;
    }

    // Filter users by name
    return db.users.filter((user) =>
      user.name.toLowerCase().includes(args.query.toLowerCase())
    );
  },

  // Returns back an array of objects that match up against the Post schema
  posts(parent, args, { db }, info) {
    if (!args.query) {
      return db.posts;
    }

    // Filter posts by title or body
    return db.posts.filter(
      (post) =>
        post.title.toLocaleLowerCase().includes(args.query.toLowerCase()) ||
        post.body.toLowerCase().includes(args.query.toLowerCase())
    );
  },

  comments(parent, args, { db }, info) {
    return db.comments;
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
};

module.exports = Query;
// export { Query as default };
