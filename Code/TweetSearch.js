const Twitter = require('twitter');
const Tropes = require('./tropes');
const MultiMap = require("collections/multi-map");

const client = new Twitter({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
});

const ref = firebase.storage().ref();

const params = {
  q: 'url:cnn url:nbcnews url:huffpost url:cbsnews url:usatoday url:nytimes url:foxnews url:washingtonpost url:businessinsider url:npr',
  lang: 'en',
  count: 100
};

client.get('search/tweets', params, function(error, tweets, response) {
  if (!error) {
    const file = new MultiMap();
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

   const task = ref.child(name).put(JSON.stringify(file), metadata);
   task.then(snapshot => snapshot.ref.getDownloadURL())
     .then((url) => {
       console.log(url);
     }).catch(console.error);
  }
});
