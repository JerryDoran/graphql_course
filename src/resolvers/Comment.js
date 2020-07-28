const Comment = {
  author(parent, args, { db }, info) {
    return db.users.find((user) => user.id === parent.authorId);
  },
  post(parent, args, { db }, info) {
    return db.posts.find((post) => post.id === parent.postId);
  },
};

module.exports = Comment;

// export { Comment as default };
