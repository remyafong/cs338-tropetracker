const Twitter = require('twitter');
const axios = require('axios');
const cheerio = require('cheerio');
const Tropes = require('./TropeList');
const MultiMap = require("collections/multi-map");
const fs = require('fs');
const consolidate = require('./ConsolidateData');

const client1 = new Twitter({
  consumer_key: 'UruGJu3E78afMz3WPQMPUUnDk',
  consumer_secret: 'tzuOh4TtKIDJv1MbCdAF0v1XEyHAdL7KUhMWqpzCRD3V2azYIy',
  access_token_key: '2712861973-K86EyvN8NfsYbI7AARM2eMQMRd5C0wLxLlwl9Ak',
  access_token_secret: 'ZTSzVHBUcVZPKQnXAHX7EL0KJRrDfob2WgddCMZ3p74Jl'
});

const client2 = new Twitter({
  consumer_key: 'faUJyytfWWdUGFHD3XCfZqivU',
  consumer_secret: 'K4G0KIhskWOBiRpbvqdX1gv4xa1gGSfEXHe16SNFtGiOX3v5ov',
  access_token_key: '1021569060339888128-KD45s6XczRWNQtkHlZjgdbicGyTSkx',
  access_token_secret: 'kxr9ki5AedHdACqFVVKSX75zKSDAQbLmZbV1WYOBOZ4Jf'
});

const client3 = new Twitter({
  consumer_key: 'n6iho43YhEwBEZKJXBu0Ur1IK',
  consumer_secret: 'ytCs4X0uFBQId0qPm3ysPxzN51z2sAv77Q4DlFHv83DEakSECA',
  access_token_key: '1061881225-SxV07ZRFMtsmkd5qI2kKe88OHqmGUgzw6R0aAks',
  access_token_secret: 'OZrOGD8XMAGt0fLRSOPYdzsHEcQnkktT5eVKy8xyHYY3C'
});

const TropeThirds = Math.ceil(Tropes.length / 3);

const clients = [{c: client1, t: Tropes.slice(0, TropeThirds)},
  {c: client2, t: Tropes.slice(TropeThirds, TropeThirds*2)},
  {c: client3, t: Tropes.slice(TropeThirds*2, TropeThirds*3)}];

const file = {};
let totalQueries = 0;
let finishedQueries = 0;

const params = {
  q: null,
  lang: 'en',
  count: 100,
  tweet_mode: 'extended'
}

function shuffle(array) {
  for(let i = array.length - 1; i; i--){
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

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

const searchTwitterSiteTerm = (client, term, site = 'filter:links') => {
  params.q = site + ' ' + term.queries;

  client.get('search/tweets', params, async function(error, tweets, response) {
    if (!error) {
      for (tweet of tweets.statuses) {
        for (url of tweet.entities.urls){
					if (url.expanded_url.match(/https:\/\/twitter\.com/)) {
						const pageHTML = await axios.get(url.expanded_url);
						const $ = cheerio.load(pageHTML.data);
						const realURL = $('.TweetTextSize--jumbo .js-display-url').parent().attr('title');

						if (realURL) {
							url.expanded_url = realURL;
						}
						else {
							continue;
						}
					}
          file[tweet.id_str] = {trope: term.name, link: url.expanded_url, text: tweet.full_text};
        }
      }

      console.log(term.name + ' + ' + site + " has " + tweets.statuses.length + " of 100 tweets");
    }
    else {
      console.log(error);
    }

    finishedQueries++;

    if (finishedQueries == totalQueries) {
      //let result = JSON.stringify(file).replace(/\}\,/g, '},\n');
      //fs.writeFileSync("../Data/file_" + Date.now() + ".json", result);
      console.log("Saved " + Object.keys(file).length + " results");
      consolidate.cd(file);
      return;
    }
  });
  return;
}

(() => {
  finishedQueries = 0;
  totalQueries = Tropes.length * newsSiteQuerys.length;
  shuffle(newsSiteQuerys);

  for (client of clients) {
    shuffle(client.t);
    for (q of client.t) {
      for (site of newsSiteQuerys) {
        searchTwitterSiteTerm(client.c, q, site);
      }
    }
  }
  return;
})()
