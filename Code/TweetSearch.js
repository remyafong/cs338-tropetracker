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

const params = {
  q: 'url:cnn url:nbcnews url:huffpost url:cbsnews url:usatoday url:nytimes url:foxnews url:washingtonpost url:businessinsider url:npr',
  lang: 'en',
  count: 100
};

(() => {
	client.get('search/tweets', params, function(error, tweets, response) {
		if (!error) {
			const file = new Map();
			const name = tweets.search_metadata.max_id;
			const metadata = {
				contentType: 'json'
			};

		 for (tweet of tweets.statuses) {
			 for (trope of Tropes) {
				 if (tweet.text.match(trope.regex)) {
					 for (url of tweet.entities.urls) {
						 file.set(url.expanded_url, trope.name);
					 }
					 break;
				 }
			 }
		 }
		 
		 console.log(JSON.stringify(file));
		 console.log(tweets.statuses.length);

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
	return;
})()