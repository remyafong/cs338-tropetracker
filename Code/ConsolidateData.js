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
const idRef = ref.child('tweet_id');
const tropeRef = ref.child('trope');
const linkRef = ref.child('link');

const sortedObject = (obj) => {
	const arr = [];

	Object.keys(obj).forEach((key) => arr.push([key, obj[key]]));

	arr.sort((a,b) => (a[1] < b[1]) ? 1 : -1);

	obj = {};

	arr.forEach((a) => obj[a[0]] = a[1]);

	return obj;
}

const id2trope = (data) => {
	const tropeTable = {};

	Object.keys(data).forEach((id) => {
    const l = data[id].link.replace(/[\#\.\/ ]/g, '_');
    const t = data[id].trope.replace(/[\#\.\/ ]/g, '_');

		if (tropeTable[t] && tropeTable[t][l]) {
      tropeTable[t][l].count++;
      tropeTable[t][l].id.push(id);
    }
    else {
      tropeTable[t] = tropeTable[t] ? tropeTable[t] : {};
      tropeTable[t][l] = {count: 1, id: [id]};
    }
	});

  return tropeTable;
}

const id2link = (data) => {
	const tropeTable = {};

	Object.keys(data).forEach((id) => {
    const l = data[id].link.replace(/[\#\.\/ ]/g, '_');
    const t = data[id].trope.replace(/[\#\.\/ ]/g, '_');

		if (tropeTable[l] && tropeTable[l][t]) {
      tropeTable[l][t].count++;
      tropeTable[l][t].id.push(id);
    }
    else {
      tropeTable[l] = tropeTable[l] ? tropeTable[l] : {};
      tropeTable[l][t] = {count: 1, id: [id]};
    }
	});

  return tropeTable;
}

const firebaseUpload = (data) => {
	idRef.set(data);
	tropeRef.set(id2trope(data));
	linkRef.set(id2link(data));
}

const main = async () => {
	const DataFolder = "../Data/";
	const allDataFile = "../ConsolidatedData.json";
	const files = fs.readdirSync(DataFolder);

	let allResults = {};
  await idRef.once('value').then(function(snapshot) {
    allResults = snapshot.val();
  });

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
