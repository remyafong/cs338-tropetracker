const fs = require('fs');

const sortedObject = (obj) => {
	const arr = [];
	
	Object.keys(obj).forEach((key) => arr.push([key, obj[key]]));

	arr.sort((a,b) => (a[1] < b[1]) ? 1 : -1);

	obj = {};

	arr.forEach((a) => obj[a[0]] = a[1]);

	return obj;
}

(() => {
	const DataFolder = "../Data/";
	const allDataFile = "../ConsolidatedData.json";

	var allResults = {};
	const files = fs.readdirSync(DataFolder);
	
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
	return;
})()
