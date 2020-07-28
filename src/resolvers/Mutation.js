// import uuidv4 from 'uuid/v4'
const { v4: uuidv4 } = require('uuid');

const Mutation = {
  createUser(parent, args, { db }, info) {
    const emailTaken = db.users.some((user) => user.email === args.data.email);
    if (emailTaken) {
      throw new Error('Email taken');
    }

    const user = {
      id: uuidv4(),
      ...args.data,
    };

    db.users.push(user);

    // This will allow the client to get the data back...especially the new id created
    return user;
  },

  deleteUser(parent, args, { db }, info) {
    const userIndex = db.users.findIndex((user) => user.id === args.id);

    // We never found a match
    if (userIndex === -1) {
      throw new Error('User not found');
    }

    const deletedUsers = db.users.splice(userIndex, 1);

    db.posts = db.posts.filter((post) => {
      const match = post.authorId === args.id;

      if (match) {
        db.comments = db.comments.filter(
          (comment) => comment.postId !== post.id
        );
      }

      return !match;
    });

    db.comments = db.comments.filter((comment) => comment.authorId !== args.id);

    return deletedUsers[0];
  },

  updateUser(parent, args, { db }, info) {
    const { id, data } = args;
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error('User not found');
    }

    if (typeof data.email === 'string') {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error('Email in use');
      }

      user.email = data.email;
    }

    if (typeof data.name === 'string') {
      user.name = data.name;
    }

    if (typeof data.age !== 'undefined') {
      user.age = data.age;
    }

    return user;
  },

  createPost(parent, args, { db, pubsub }, info) {
    // Will return true if the user exists
    const userExists = db.users.some((user) => user.id === args.data.authorId);

    if (!userExists) {
      throw new Error('User not found');
    }

    const post = {
      id: uuidv4(),
      ...args.data,
    };

    db.posts.push(post);

    if (args.data.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'CREATED',
          data: post,
        },
      });
    }

    return post;
  },

  deletePost(parent, args, ctx, info) {
    const { db, pubsub } = ctx;
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error('Post not found');
    }

    // Use array destructuring instead of deletedPosts and having to use deletedPosts[0]
    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.postId !== args.id);

    if (post.published) {
      pubsub.publish('post', {
        post: {
          mutation: 'DELETED',
          data: post,
        },
      });
    }

    return post;
  },

  updatePost(parent, args, ctx, info) {
    const { db, pubsub } = ctx;
    const { id, data } = args;

    const post = db.posts.find((post) => post.id === id);

    const originalPost = { ...post };

    if (!post) {
      throw new Error('Post not found');
    }

    if (typeof data.title === 'string') {
      post.title = data.title;
    }

    if (typeof data.body === 'string') {
      post.body = data.body;
    }

    if (typeof data.published === 'boolean') {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        // deleted
        pubsub.publish('post', {
          post: {
            mutation: 'DELETED',
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        // created
        pubsub.publish('post', {
          post: {
            mutation: 'CREATED',
            data: post,
          },
        });
      }
    } else if (post.published) {
      // updated
      pubsub.publish('post', {
        post: {
          mutation: 'UPDATED',
          data: post,
        },
      });
    }

    return post;
  },

  createComment(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.data.authorId);
    const postExists = db.posts.some(
      (post) => post.id === args.data.postId && post.published
    );

    if (!userExists || !postExists) {
      throw new Error('Unable to find user or post');
    }

    const comment = {
      id: uuidv4(),
      ...args.data,
    };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.postId}`, {
      comment: comment,
    });

    return comment;
  },

  deleteComment(parent, args, { db }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    // We never found a match
    if (commentIndex === -1) {
      throw new Error('User not found');
    }

    const deletedComments = db.comments.splice(commentIndex, 1);

    return deletedComments[0];
  },

  updateComment(parent, args, ctx, info) {
    const { id, data } = args;
    const { db } = ctx;

    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error('Comment not found');
    }

    if (typeof data.text === 'string') {
      comment.text = data.text;
    }

    return comment;
  },
};

module.exports = Mutation;

// export {Mutation as default}
