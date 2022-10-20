const { GraphQLString, GraphQLList } = require("graphql");
const { User } = require("../../models");
const { createJwtToken } = require("../../util/createToken");
const bcrypt = require("bcrypt");
const { UserType } = require("../../graphql/types");

const register = {
   type: UserType,
   description: "Register a new user",
   args: {
      name: { type: GraphQLString },
      email: { type: GraphQLString },
      password: { type: GraphQLString },
   },
   async resolve(parent, args) {
      const oldUser = await User.findOne({ email: args.email });
      if (oldUser) {
         throw new Error("user already registered! please login");
      }
      const { name, email, password } = args;
      const hashPass = bcrypt.hashSync(password, 12);
      const user = new User({ name, email, password: hashPass });
      await user.save();
      const token = createJwtToken(user);
      console.log(user);
      const registerUser = { ...user._doc, token };
      return registerUser;
   },
};

const login = {
   type: UserType,
   description: "Login user",
   args: {
      email: { type: GraphQLString },
      password: { type: GraphQLString },
   },
   async resolve(parent, args) {
      const user = await User.findOne({ email: args.email });
      if (!user) {
         throw new Error("user not found! register now");
      }
      const matchPass = bcrypt.compare(args.password, user.password);

      if (!user || !matchPass) {
         throw new Error("Invalid credentials");
      }
      const token = createJwtToken(user);
      const loginUser = { ...user._doc, token };
      return loginUser;
   },
};

const googleSignin = {
   type: UserType,
   description: "google signin user",
   args: {
      email: { type: GraphQLString },
      name: { type: GraphQLString },
      img: { type: GraphQLString },
   },
   async resolve(parent, args) {
      const user = await User.findOne({ email: args.email });
      if (user) {
         const token = createJwtToken(user);
         const loginUser = { ...user._doc, token };
         return loginUser;
      } else {
         const { name, email, img } = args;
         const newUser = new User({ email, name, img });
         await newUser.save();
         const token = createJwtToken(newUser);
         console.log(newUser);
         const registerUser = { ...newUser._doc, token };
         return registerUser;
      }
   },
};

const updateUser = {
   type: UserType,
   description: "update user",
   args: {
      id: { type: GraphQLString },
      name: { type: GraphQLString },
      img: { type: GraphQLString },
      coverImg: { type: GraphQLString },
   },
   async resolve(parent, args, { verifiedUser }) {
      if (!verifiedUser) {
         throw new Error("Unauthenticated");
      }
      const updatedUser = await User.findByIdAndUpdate(
         { _id: args.id },
         { name: args.name, img: args.img, coverImg: args.coverImg },
         { new: true, runValidators: true }
      );
      if (!updatedUser) {
         throw new Error("No video with the given ID found for the author");
      }
      return updatedUser;
   },
};

const deleteUser = {
   type: GraphQLString,
   description: "update user",
   args: {
      id: { type: GraphQLString },
   },
   async resolve(parent, args, { verifiedUser }) {
      if (!verifiedUser) {
         throw new Error("Unauthenticated");
      }
      const userDeleted = await User.findByIdAndDelete({ _id: args.id });
      if (!userDeleted) {
         throw new Error("No video with the given ID found for the author");
      }

      return "user deleted";
   },
};

module.exports = { register, login, updateUser, deleteUser, googleSignin };
