const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphql/schema");
const { authenticate } = require("./middleware/auth");
const cors = require("cors");

const PORT = process.env.PORT || 5000;
dotenv.config();
const app = express();

app.use(cors());
app.use(authenticate);

app.use(
   "/graphql",
   graphqlHTTP({
      schema,
      graphiql: true,
   })
);

app.get("/", (req, res) => {
   res.send("hello world");
});

mongoose.connect(process.env.DB_URL).then(() => {
   app.listen(PORT, () => {
      console.log(`the server is running ${PORT}`);
   });
});
