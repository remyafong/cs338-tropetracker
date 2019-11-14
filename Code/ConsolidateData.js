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
const articleRef = ref.child('article');

const sortedObject = (obj) => {
	const arr = [];

	Object.keys(obj).forEach((key) => arr.push([key, obj[key]]));

	arr.sort((a,b) => (a[1] < b[1]) ? 1 : -1);

	obj = {};

	arr.forEach((a) => obj[a[0]] = a[1]);

	return obj;
}

const removeOldIDs = () => {
		idRef.once('value').then(function(snapshot) {
		let data = snapshot.val();
    let orderedIDs = Object.keys(data).sort();
		
		for (let i = 0; i < orderedIDs.length-2; i++) {
			let id1 = orderedIDs[i];
			let id2 = orderedIDs[i+1];
			
			if (data[id1] && data[id1].text && data[id2] && data[id1].text == data[id2].text) {
				if (id2.slice(-2) == "00") {
					delete data[id2];
				}
				else if (id1.slice(-2) == "00") {
					delete data[id1];
				}
			}
		}
		
		idRef.set(data);
  });
}

const removeDuplicates = (tropeData, linkData) => {
	
	// Trope Duplicates
	for (trope in tropeData) {
		for (let i = 0; i < Object.keys(tropeData[trope]).length; i++) {
			let ld1 = Object.keys(tropeData[trope])[i];
			if (ld1 != 'articleTitle' && ld1 != 'value') {
				for (let j = i + 1; j < Object.keys(tropeData[trope]).length; j++) {
					let ld2 = Object.keys(tropeData[trope])[j];
					if (ld2 != 'articleTitle' && ld2 != 'value') {
						if (linkData[ld1] && linkData[ld2] && linkData[ld1].articleTitle == linkData[ld2].articleTitle) {
							tropeData[trope][ld1].count += tropeData[trope][ld2].count;
							tropeData[trope][ld1].id = tropeData[trope][ld1].id.concat(tropeData[trope][ld2].id);
							delete tropeData[trope][ld2];
							j++;
						}
					}
				}
			}
		}
	}
	
	// Link Duplicates
	for (let i = 0; i < Object.keys(linkData).length; i++) {
		let ld1 = linkData[Object.keys(linkData)[i]];
		for (let j = i + 1; j < Object.keys(linkData).length; j++) {
			let ld2 = linkData[Object.keys(linkData)[j]];
			if (ld1.articleTitle && ld1.articleTitle == ld2.articleTitle) {
				for (trope in ld2) {
					if (trope != 'articleTitle' && trope != 'value') {
						if (ld1[trope]) {
							ld1[trope].count += ld2[trope].count;
							ld1[trope].id = ld2[trope].id.concat(ld1[trope].id);
						}
						else {
							ld1[trope] = ld2[trope];
						}
					}
				}
				delete linkData[Object.keys(linkData)[j]];
				j++;
			}
		}
	}
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
	let tropeData = await id2trope(data);
	let linkData = await id2link(data);
	
	removeDuplicates(tropeData, linkData);
	
	let articleData = {};
	
	for (link in linkData) {
		if (linkData[link].articleTitle) articleData[linkData[link].articleTitle.replace(/[^a-zA-Z0-9]/g, '_')] = linkData[link];
	} 
	
	idRef.set(data);
	tropeRef.set(tropeData);
	linkRef.set(linkData);
	articleRef.set(articleData);
  return;
}

const cd = async (newData) => {
	const DataFolder = "../Data/";
	const allDataFile = "../ConsolidatedData.json";

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