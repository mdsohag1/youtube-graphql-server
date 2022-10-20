const { GraphQLString, GraphQLList } = require("graphql");
const { User, Video } = require("../../models");

const { VideoType } = require("../../graphql/types");

const addVideo = {
   type: VideoType,
   description: "Create new video",
   args: {
      tittle: { type: GraphQLString },
      desc: { type: GraphQLString },
      imgUrl: { type: GraphQLString },
      videoUrl: { type: GraphQLString },
   },
   resolve(parent, args, { verifiedUser }) {
      console.log("Verified User: ", verifiedUser);
      if (!verifiedUser) {
         throw new Error("Unauthorized");
      }
      const video = new Video({
         userId: verifiedUser._id,
         tittle: args.tittle,
         desc: args.desc,
         imgUrl: args.imgUrl,
         videoUrl: args.videoUrl,
      });

      return video.save();
   },
};

const updateVideo = {
   type: VideoType,
   description: "update video",
   args: {
      id: { type: GraphQLString },
      desc: { type: GraphQLString },
      imgUrl: { type: GraphQLString },
      videoUrl: { type: GraphQLString },
   },
   async resolve(parent, args, { verifiedUser }) {
      console.log("Verified User: ", verifiedUser);
      if (!verifiedUser) {
         throw new Error("Unauthorized");
      }
      const updateVideo = await Video.findOneAndUpdate(
         {
            _id: args.id,
            userId: verifiedUser._id,
         },
         {
            tittle: args.tittle,
            desc: args.desc,
            imgUrl: args.imgUrl,
            videoUrl: args.videoUrl,
         },
         { new: true }
      );

      return updateVideo;
   },
};

const deleteVideo = {
   type: GraphQLString,
   description: "delete video",
   args: {
      id: { type: GraphQLString },
   },
   async resolve(parent, args, { verifiedUser }) {
      if (!verifiedUser) {
         throw new Error("Unauthenticated");
      }
      const userDeleted = await User.findOneAndDelete({
         _id: args.id,
         userId: verifiedUser._id,
      });
      if (!userDeleted) {
         throw new Error("No video with the given ID found for the author");
      }

      return "video deleted";
   },
};

module.exports = { addVideo, updateVideo, deleteVideo };
