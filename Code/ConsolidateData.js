const fs = require('fs');
const axios = require('axios');
const cheerio = require('cheerio');
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

const createTable = async (key, value, data) => {
	const table = {};
  let completed = 0;
  const dataLength = Object.keys(data).length;

  for (id of Object.keys(data)) {
    const k = data[id][key].replace(/[\#\.\/ ]/g, '_');
    const v = data[id][value].replace(/[\#\.\/ ]/g, '_');

		if (table[k] && table[k][v]) {
      table[k][v].count++;
      table[k][v].id.push(id);
    }
    else {
      if (table[k] == undefined) {
        table[k] = {value: data[id][key]};
        try {
          if (key == 'link') {
            const pageHTML = await axios.get(data[id][key]);
            const $ = cheerio.load(pageHTML.data);
            table[k]["articleTitle"] = $('head title').text();
          }
        }
        catch (e) {
          console.log(e.toString());
        }
      }
      table[k][v] = {count: 1, id: [id]};
    }

    completed++;
    if (key == 'link') console.log(completed/dataLength*100);
	}

  return table;
}

const id2trope = async (data) => {
	return await createTable('trope', 'link', data);
}

const id2link = async (data) => {
	return await createTable('link', 'trope', data);
}

const firebaseUpload = async (data) => {
	idRef.set(data);
	await tropeRef.set(await id2trope(data));
	await linkRef.set(await id2link(data));
  return;
}

const cd = async (newData) => {
	const DataFolder = "../Data/";
	const allDataFile = "../ConsolidatedData.json";
	const files = fs.readdirSync(DataFolder);

	let allResults = {};
  await idRef.once('value').then(function(snapshot) {
    allResults = snapshot.val();
  });

  allResults = {...allResults, ...newData};

	console.log("There are " + Object.keys(allResults).length + " data points");
	fs.writeFileSync(allDataFile, JSON.stringify(allResults).replace(/\}\,/g, '},\n'));

	const tropeCount = {};
	for (tweet in allResults) {
		tropeCount[allResults[tweet].trope] == undefined ? tropeCount[allResults[tweet].trope] = 1 : tropeCount[allResults[tweet].trope]++;
	}

	console.log(sortedObject(tropeCount));

	await firebaseUpload(allResults);
  return process.exit(22);
}

module.exports = {cd};
