const fs = require('fs');
const firebase =  require('firebase/app');
const database = require('firebase/database');
const storage = require('firebase/storage');

const firebaseConfig = {
  apiKey: "AIzaSyDJsNN9qdUAdwkQmL-8D91-m4frOKjzSHs",
  authDomain: "trope-tracker-62549.firebaseapp.com",
  databaseURL: "https://trope-tracker-62549.firebaseio.com",
  projectId: "trope-tracker-62549",
  storageBucket: "trope-tracker-62549.appspot.com",
  messagingSenderId: "790085425651",
  appId: "1:790085425651:web:8033e73a0115794231da86",
  measurementId: "G-BCFM30M7FE"
};

firebase.initializeApp(firebaseConfig);

const ref = firebase.database().ref();

const sortedObject = (obj) => {
	const arr = [];
	
	Object.keys(obj).forEach((key) => arr.push([key, obj[key]]));

	arr.sort((a,b) => (a[1] < b[1]) ? 1 : -1);

	obj = {};

	arr.forEach((a) => obj[a[0]] = a[1]);

	return obj;
}

const firebaseUpload = (data) => {
	const idRef = ref.child('tweet_id');
	idRef.set(data);
}

const main = () => {
	const DataFolder = "../Data/";
	const allDataFile = "../ConsolidatedData.json";
	const files = fs.readdirSync(DataFolder);
	
	var allResults = {};
	if (fs.existsSync(allDataFile)) {
		console.log("Loading previous data...")
		allResults = JSON.parse(fs.readFileSync(allDataFile));
	} 

	files.forEach((file) => {
		const fileData = JSON.parse(fs.readFileSync(DataFolder + file));
		allResults = {...allResults, ...fileData};
	});

	console.log("There are " + Object.keys(allResults).length + " data points");
	fs.writeFileSync(allDataFile, JSON.stringify(allResults).replace(/\}\,/g, '},\n'));

	const tropeCount = {};
	for (tweet in allResults) {
		tropeCount[allResults[tweet].trope] == undefined ? tropeCount[allResults[tweet].trope] = 1 : tropeCount[allResults[tweet].trope]++;
	}

	console.log(sortedObject(tropeCount));
	
	firebaseUpload(allResults);
	return;
}

module.exports = {main};
