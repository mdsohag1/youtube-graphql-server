const {
   GraphQLObjectType,
   GraphQLID,
   GraphQLString,
   GraphQLList,
   GraphQLBoolean,
   GraphQLInt,
} = require("graphql");

const { User, Comment } = require("../models");

const UserType = new GraphQLObjectType({
   name: "User",
   description: "User type",
   fields: () => ({
      _id: { type: GraphQLID },
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      img: { type: GraphQLString },
      coverImg: { type: GraphQLString },
      subscriber: { type: GraphQLInt },
      subscribedUsers: {
         type: new GraphQLList(GraphQLID),
         resolve(parent, args) {
            return parent.subscribedUsers.map((id) => {
               return User.find({ _id: id });
            });
         },
      },
      token: { type: GraphQLString },
      fromGoogle: { type: GraphQLBoolean },
      channelVideos: {
         type: new GraphQLList(VideoType),
         async resolve(parent, args) {
            return await Video.find({ userId: parent._id });
         },
      },
      likedVideos: {
         type: new GraphQLList(VideoType),
         async resolve(parent, args) {
            const allVideo = await Video.find();
            const likedVideos = allVideo.map((video) => {
               video.likes.includes(parent._id);
            });
            return likedVideos;
         },
      },
   }),
});

const VideoType = new GraphQLObjectType({
   name: "Video",
   description: "Video type",
   fields: () => ({
      _id: { type: GraphQLID },
      userId: { type: GraphQLID },
      tittle: { type: GraphQLString },
      desc: { type: GraphQLString },
      imgUrl: { type: GraphQLString },
      videoUrl: { type: GraphQLString },
      views: { type: GraphQLInt },
      createdAt: {
         type: GraphQLString,
      },
      updatedAt: { type: GraphQLString },
      likes: {
         type: new GraphQLList(GraphQLID),
         resolve(parent, args) {
            return parent.likes;
         },
      },
      dislikes: {
         type: new GraphQLList(GraphQLID),
         resolve(parent, args) {
            return parent.dislikes;
         },
      },
      tags: {
         type: new GraphQLList(GraphQLID),
         resolve(parent, args) {
            return parent.tags;
         },
      },
      author: {
         type: UserType,
         resolve(parent, args) {
            return User.findById(parent.userId);
         },
      },
      comments: {
         type: GraphQLList(CommentType),
         resolve(parent, args) {
            return Comment.find({ videoId: parent.id });
         },
      },
   }),
});

const CommentType = new GraphQLObjectType({
   name: "Comment",
   description: "Comment type",
   fields: () => ({
      _id: { type: GraphQLID },
      desc: { type: GraphQLString },
      user: {
         type: UserType,
         resolve(parent, args) {
            return User.findById(parent.userId);
         },
      },
      video: {
         type: VideoType,
         resolve(parent, args) {
            return Video.findById(parent.videoId);
         },
      },
   }),
});

module.exports = { UserType, CommentType, VideoType };
