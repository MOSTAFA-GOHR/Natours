
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");


process.on('uncaughtException', (err) => {
  console.log(err.name, err.message);
});

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);


// Clean and modern connection
mongoose
  .connect(DB)
  .then(() => console.log("DB is connected"))
  .catch(err => console.error("DB connection error:", err));



const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}...`);
});

