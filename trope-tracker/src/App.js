import React, { useState, useEffect } from 'react';
import Search from "./Components/Search/Search.js";
import SearchResults from "./Components/SearchResults/SearchResults.js";
import Tropes from "./Components/Tropes/Tropes.js";
import SingleTrope from "./Components/SingleTrope/SingleTrope.js"

import './App.css';

import {
	Route,
	NavLink,
	HashRouter
} from "react-router-dom";

import firebase from 'firebase/app';
import 'firebase/database';
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
const db = firebase.database().ref();

function App () {
  const [tropeList, setTropeList] = useState([]);
  const [linkList, setLinkList] = useState([]);
  const [articleList, setArticleList] = useState(null);
  const [tweetList, setTweetList] = useState(null);

  useEffect(() => {
     db.on("value", function(snapshot) {
      setTropeList(formatTropes(snapshot.val()["trope"],snapshot.val()["link"]));
      setLinkList(formatLinks(snapshot.val()["trope"],snapshot.val()["link"]));
      setArticleList(snapshot.val()["article"]);
      setTweetList(snapshot.val()["tweet_id"]);
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });
  }, [])

  function formatTropes(tropeList,linkList) {
    //console.log(tropeList)
    var formattedTropes = [];

    Object.entries(tropeList).forEach(([key, value]) => {
      var trope = value["value"];
      var links = [];
      var numArticles = 0;

      Object.entries(value).forEach(([k, v]) => {
        if (k !== 'value' && linkList.hasOwnProperty(k) && linkList[k]["articleTitle"]) {
          var url = linkList[k]["value"];
          var articleTitle = linkList[k]["articleTitle"];
          var count = v["count"];
          var articleImg = linkList[k]["articleImg"];
          var articleDesc = linkList[k]["articleDesc"];
          links.push([url,articleTitle,count,articleImg,articleDesc]);
          numArticles = numArticles + 1;
        }
      })
       
       formattedTropes.push({trope: trope, links: links, numArticles: numArticles});
    })

    formattedTropes = formattedTropes.sort(function(a, b) {
        a = a["trope"].toUpperCase();
        b = b["trope"].toUpperCase();

        return a < b ? -1 : (a > b ? 1 : 0);
    });

    //console.log(formattedTropes)
   
    return formattedTropes;
  }

  function formatLinks(tropeList,linkList) {
    var formattedLinks = [];

    Object.entries(linkList).forEach(([key, value]) => {
      if (value["articleTitle"]) {
        var link = value["value"];
        var articleTitle = value["articleTitle"];
        var articleImg = value["articleImg"];
        var articleDesc = value["articleDesc"];
        var tropes = [];

        Object.entries(value).forEach(([k, v]) => {
          if (k !== 'value') {
            if (tropeList.hasOwnProperty(k)) {
              var trope = tropeList[k]["value"];
              var count = v["count"];
              tropes.push([trope,count]);
            }
          }
        })
         
         formattedLinks.push({link: link, articleTitle: articleTitle, articleImg: articleImg, articleDesc: articleDesc, tropes: tropes});
        }
     })
    
    //console.log(formattedLinks);
    return formattedLinks;
  }

  return (
      <HashRouter>
        <div className="app">
          <ul className="header">
            <li>
              <NavLink 
                exact to="/" 
                activeStyle={{ color: 'red' }}
                isActive={(match, location) => {
                  return location.pathname === '/' || location.pathname.includes('search');
                }}
                >
                Search
              </NavLink>
            </li>
            <li>
              <NavLink 
                exact to="/tropes" 
                activeStyle={{ color: 'red' }}
                isActive={(match, location) => {
                  return location.pathname === '/trope' || location.pathname.includes('trope');
                }}
                >
                Tropes
              </NavLink>
            </li>
          </ul>
          <div className="content">
            {/* <Route 
              exact path="/"
              render={() => <SearchBar tropeList={tropeList} linkList={linkList} articleList={articleList} tweetList={tweetList}></SearchBar>}
            /> */}
            <Route 
              exact path="/"
              render={(props) => <Search {...props} tropeList={tropeList} linkList={linkList} articleList={articleList} tweetList={tweetList}></Search>}
            />
            <Route 
              path="/search/"
              render={(props) => <SearchResults {...props} tropeList={tropeList} linkList={linkList} articleList={articleList} tweetList={tweetList}/>}
            />
            <Route 
              exact path="/tropes" 
              render={(props) => <Tropes {...props} tropeList={tropeList} articleList={articleList} tweetList={tweetList}/>}
            />
            <Route 
              path="/trope/" 
              render={(props) => <SingleTrope {...props} tropeList={tropeList} articleList={articleList} tweetList={tweetList}/>}
            />
          </div>
        </div>
      </HashRouter>
    );
}
	
export default App; 