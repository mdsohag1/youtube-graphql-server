// Import required stuff from graphql
const { GraphQLObjectType, GraphQLSchema } = require("graphql");

//import queries
const {
   users,
   comment,
   user,
   video,
   trendVideos,
   randomVideos,
   channelVideos,
} = require("./queries");

//import mutations
const {
   register,
   login,
   updateUser,
   deleteUser,
   addVideo,
   updateVideo,
   deleteVideo,
   addComment,
   updateComment,
   deleteComment,
   googleSignin,
} = require("./mutations");

// defind queries types
const QueryType = new GraphQLObjectType({
   name: "QueryType",
   description: "Queries",
   fields: {
      users,
      comment,
      user,
      video,
      trendVideos,
      randomVideos,
      channelVideos,
   },
});

// defind mutation types
const MutationType = new GraphQLObjectType({
   name: "MutationType",
   description: "Mutation",
   fields: {
      register,
      login,
      updateUser,
      deleteUser,
      addVideo,
      updateVideo,
      deleteVideo,
      addComment,
      updateComment,
      deleteComment,
      googleSignin,
   },
});

module.exports = new GraphQLSchema({
   query: QueryType,
   mutation: MutationType,
});
