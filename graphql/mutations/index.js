const userMutation = require("./userMutation");
const commentMutation = require("./commentMutation");
const videoMutation = require("./videoMutation");

module.exports = {
   ...userMutation,
   ...commentMutation,
   ...videoMutation,
};
