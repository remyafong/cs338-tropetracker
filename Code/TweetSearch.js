const Twitter = require('twitter');
const Tropes = require('./TropeList');
const MultiMap = require("collections/multi-map");
//import firebase from 'firebase/app';
//import 'firebase/database';


/* const firebaseConfig = {
  apiKey: "AIzaSyDJsNN9qdUAdwkQmL-8D91-m4frOKjzSHs",
  authDomain: "trope-tracker-62549.firebaseapp.com",
  databaseURL: "https://trope-tracker-62549.firebaseio.com",
  projectId: "trope-tracker-62549",
  storageBucket: "trope-tracker-62549.appspot.com",
  messagingSenderId: "790085425651",
  appId: "1:790085425651:web:8033e73a0115794231da86",
  measurementId: "G-BCFM30M7FE"
};

firebase.initializeApp(firebaseConfig); */

const client = new Twitter({
  consumer_key: 'UruGJu3E78afMz3WPQMPUUnDk',
  consumer_secret: 'tzuOh4TtKIDJv1MbCdAF0v1XEyHAdL7KUhMWqpzCRD3V2azYIy',
  access_token_key: '2712861973-K86EyvN8NfsYbI7AARM2eMQMRd5C0wLxLlwl9Ak',
  access_token_secret: 'ZTSzVHBUcVZPKQnXAHX7EL0KJRrDfob2WgddCMZ3p74Jl'
});

//const ref = firebase.storage().ref();

const file = new Map();
let totalQueries = 0;
let finishedQueries = 0;

const newsSiteQuerys = [
	'url:cnn',
	'url:nbcnews',
	'url:huffpost',
	'url:cbsnews',
	'url:usatoday',
	'url:nytimes',
	'url:foxnews',
	'url:washingtonpost',
	'url:businessinsider',
	'url:npr'
];

const searchTwitterBySite = async (newsSite) => {
	const params = {
		q: newsSite,
		lang: 'en',
		count: 100
	}
	
	await client.get('search/tweets', params, function(error, tweets, response) {
		if (!error) {
			const name = tweets.search_metadata.max_id;
			const metadata = {
				contentType: 'json'
			};

		 for (tweet of tweets.statuses) {
			 for (trope of Tropes) {
				 if (tweet.text.match(trope.regex)) {
					 for (url of tweet.entities.urls) {
						 file.set(url.expanded_url, trope.name);
						 file.set(tweet.text, url.expanded_url);
					 }
					 break;
				 }
			 }
		 }
		 console.log(newsSite + " has " + tweets.statuses.length + " of 100 tweets");
		 finishedURLs++;
		 if (finishedURLs == newsSiteQuerys.length) {
			 console.log(JSON.stringify(file));
		 }

	/*    const task = ref.child(name).put(JSON.stringify(file), metadata);
		 task.then(snapshot => snapshot.ref.getDownloadURL())
			 .then((url) => {
				 console.log(url);
			 }).catch(console.error); */
		}
		else {
			console.log(error);
		}
	});
}

const searchTwitterSiteTerm = async (term, site = 'filter:links') => {
	const params = {
		q: site + ' ' + term.queries,
		lang: 'en',
		count: 100
	}
	
	await client.get('search/tweets', params, function(error, tweets, response) {
		if (!error) {
			const name = tweets.search_metadata.max_id;
			const metadata = {
				contentType: 'json'
			};

		 for (tweet of tweets.statuses) {
			 for (url of tweet.entities.urls){
				 file.set(url.expanded_url, term.name);
				 file.set(tweet.text, url.expanded_url);
			 }
		 }
		 console.log(term.name + ' + ' + site + " has " + tweets.statuses.length + " of 100 tweets");
		}
		else {
			console.log(error);
		}
		
	 finishedQueries++;
	 
	 if (finishedQueries == totalQueries) {
		 console.log(JSON.stringify(file));
	 }
	});
}

(() => {
/* 	finishedQueries = 0;
	totalQueries = newsSiteQuerys.length;
	for (site of newsSiteQuerys) {
		searchTwitterSite(site);
	} */
	
/* 	finishedQueries = 0;
	totalQueries = Tropes.length;
	for (q of Tropes) {
		searchTwitterSiteTerm(q);
	} */
	
 	finishedQueries = 0;
	totalQueries = Tropes.length * newsSiteQuerys.length;
	for (q of Tropes) {
		for (site of newsSiteQuerys) {
			searchTwitterSiteTerm(q, site);
		}
	}
	return;
})()