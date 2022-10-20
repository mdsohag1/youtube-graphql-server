const { GraphQLList, GraphQLID } = require("graphql");
const { CommentType, UserType, VideoType } = require("./types");
const { User, Comment, Video } = require("../models");

const users = {
   type: new GraphQLList(UserType),
   description: "Retrieves list of users",
   resolve(parent, args) {
      return User.find();
   },
};

const user = {
   type: UserType,
   description: "Retrieves one user",
   args: { id: { type: GraphQLID } },

   resolve(parent, args) {
      return User.findById(args.id);
   },
};

const trendVideos = {
   type: new GraphQLList(VideoType),
   description: "trends vidseos",
   async resolve() {
      return await Video.find().sort({ views: -1 });
   },
};

const randomVideos = {
   type: new GraphQLList(VideoType),
   description: "random Videos",
   async resolve() {
      return await Video.aggregate([{ $sample: { size: 40 } }]);
   },
};

const video = {
   type: VideoType,
   description: "Retrieves one video",
   args: { id: { type: GraphQLID } },
   async resolve(_, args) {
      return await Video.findById(args.id);
   },
};

const channelVideos = {
   type: new GraphQLList(VideoType),
   description: "channels videos",
   args: { id: { type: GraphQLID } },
   async resolve(_, args) {
      return await Video.find({ userId: args.id });
      // const videos = await Video.find({ userId: args.id });
      // console.log(videos);
   },
};

const comment = {
   type: CommentType,
   description: "Retrieves one comment",
   args: { id: { type: GraphQLID } },
   resolve(_, args) {
      return Comment.findById(args.id);
   },
};

module.exports = {
   users,
   user,
   comment,
   trendVideos,
   video,
   randomVideos,
   channelVideos,
};
