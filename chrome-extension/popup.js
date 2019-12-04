// import { resolve } from "dns";

const bkg = chrome.extension.getBackgroundPage();
let trope = ['Catch 22', 'Not all that Glitters is Gold', 'David and Goliath']

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
var db = firebase.database().ref(); //new Firebase("https://trope-tracker-62549.firebaseio.com/");
//display tropes  
let displayTropes = (foundTropesList) => {
  var toAdd = document.getElementById('links');
    for(let i = 0; i < foundTropesList.length; i++){
      var newDiv = document.createElement('div');
      newDiv.innerText = foundTropesList[i];
      newDiv.className = 'tropes';
      toAdd.appendChild(newDiv);
    }
    document.body.appendChild(toAdd);
    document.getElementById('goToTT').style.visibility = 'visible'
}


// event Listener for Button
document.addEventListener('DOMContentLoaded', function() {
  var submit = document.getElementById('submit');
  var goToTT = document.getElementById('goToTT');

  //gets link from the browser
  // let getLink = () => {
  //   let url = "";
  //   chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
  //     url = tabs[0].url;
  //     bkg.console.log("URL IN IS: ", url)
  //     return url;
  //   });
  // }


  // bkg.console.log("getLink() is ", getLink())

  // onClick's logic below:
  submit.addEventListener('click', function() {
      // setTimeout(getLink(), 3000);
      let currUrl = "";
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, async function (tabs) {
        currUrl = tabs[0].url; //Get link of current browser
        // currUrl = "https://www.cnn.com/2019/11/26/tech/google-employee-tensions/index.html"
        //Getting list of tropes:
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/'; //host
        const fullUrl = proxyUrl + currUrl 
        const urlResponse = await fetch(fullUrl);
        const htmlString = await urlResponse.text(); 
        const title = htmlString.match(/<title[^>]*>([^<]+)<\/title>/)[1];
        bkg.console.log("title is: ", title)
        let articleList = [];
        
        const snapshot = await db.once("value");
        articleList = snapshot.val()["article"]
        // bkg.console.log("articel List: ", articleList)
       
        let tropes = [];

        
        Object.entries(articleList).forEach(([key,value]) => {
          // bkg.console.log("key is: ", key)
          // bkg.console.log("value is: ", value)
          // bkg.console.log("article title is: ", value.articleTitle)
          if (value.articleTitle === title) {
            Object.keys(value).forEach((k) => {
              // bkg.console.log("k is: ", k)
              if (k.includes('_')) {
                tropes.push(k.replace(/_/g,' '));
                // bkg.console.log("here")
              }
            })
          }
          // bkg.console.log("tropes INSIDE is: ", tropes)
        })


        bkg.console.log("tropes is: ", tropes)
        displayTropes(tropes)
      });
    
      this.disabled = true;
  });

  goToTT.addEventListener('click', () => {

    let url = "";
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      url = tabs[0].url;
      // url = "https://www.cnn.com/2019/11/26/tech/google-employee-tensions/index.html"
      bkg.console.log("URL IN IS: ", url)
      url = "http://trope-tracker-62549.firebaseapp.com/#/search/" + url
      chrome.runtime.sendMessage({redirect: url});
      // return url; 
    });

    // let url = setTimeout(getLink(), 1000);
    // let url = getLink();
    bkg.console.log("url is: ", url)
    // chrome.runtime.sendMessage({redirect: url});
    // chrome.runtime.sendMessage({redirect: "http://redirect"});
    // bkg.console.log("HEREE");
  })

});

