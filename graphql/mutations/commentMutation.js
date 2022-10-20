const { GraphQLString, GraphQLList } = require("graphql");
const { Comment } = require("../../models");
const { CommentType } = require("../../graphql/types");

const addComment = {
   type: CommentType,
   description: "Create a new comment on the video",
   args: {
      desc: { type: GraphQLString },
      videoId: { type: GraphQLString },
   },
   resolve(parent, args, { verifiedUser }) {
      const comment = new Comment({
         userId: verifiedUser._id,
         videoId: args.videoId,
         desc: args.desc,
      });
      return comment.save();
   },
};

const updateComment = {
   type: CommentType,
   description: "Update comment",
   args: {
      id: { type: GraphQLString },
      desc: { type: GraphQLString },
   },
   async resolve(parent, args, { verifiedUser }) {
      if (!verifiedUser) {
         throw new Error("Unauthenticated");
      }
      const commentUpdated = await Comment.findOneAndUpdate(
         {
            _id: args.id,
            userId: verifiedUser._id,
         },
         { desc: args.desc },
         {
            new: true,
            runValidators: true,
         }
      );

      if (!commentUpdated) {
         throw new Error("No comment with the given ID found for the author");
      }

      return commentUpdated;
   },
};

const deleteComment = {
   type: GraphQLString,
   description: "Delete comment",
   args: {
      id: { type: GraphQLString },
   },
   async resolve(parent, args, { verifiedUser }) {
      console.log(verifiedUser);
      if (!verifiedUser) {
         throw new Error("Unauthenticated");
      }
      const commentDeleted = await Comment.findOneAndDelete({
         _id: args.id,
         userId: verifiedUser._id,
      });
      if (!commentDeleted) {
         throw new Error("No post with the given ID found for the author");
      }
      return "comment deleted";
   },
};

module.exports = { addComment, updateComment, deleteComment };
