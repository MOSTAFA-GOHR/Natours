const fs = require("fs");
const mongoose = require("mongoose");
const Tour = require('./../models/toursModel');
const User = require('./../models/usersModel');
const Review = require('./../models/reviewModel');


const dotenv = require("dotenv");


dotenv.config({ path: "./../config.env" });




const DB = process.env.DATABASE.replace(
	"<db_password>",
	process.env.DATABASE_PASSWORD
);




// Clean and modern connection
mongoose
	.connect(DB)
	.then(() => console.log("DB is connected"))
	.catch(err => console.error("DB connection error:", err));

// Read file system
const tours = JSON.parse(fs.readFileSync("./tours.json", 'utf-8'));
const users = JSON.parse(fs.readFileSync("./users.json", 'utf-8'));
const reviews = JSON.parse(fs.readFileSync("./reviews.json", 'utf-8'));


const importData = async () => {
	try {
		await Tour.create(tours);
		// await User.create(users, { validateBeforeSave: false });
		// await Review.create(reviews);
		console.log('the data successfuly loaded!');
	} catch (err) {
		console.log(err);
	};
	process.exit();
};

const deleteData = async () => {
	try {
		await Tour.deleteMany();
		// await User.deleteMany();
		// await Review.deleteMany();
		console.log('the data successfuly deleted!');
	} catch (err) {
		console.log(err);
	};
	process.exit();
}

console.log(process.argv)

if (process.argv[2] === "--import") {
	importData();
} else if (process.argv[2] === "--delete") {
	deleteData();
}