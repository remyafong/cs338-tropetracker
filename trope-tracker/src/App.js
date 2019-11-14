import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@material-ui/core';

import Search from "./Search";
import SearchResults from "./SearchResults";
import Tropes from "./Tropes";

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
      console.log(snapshot.val());
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

    Object.entries(tropeList).map(([key, value]) => {
      var trope = value["value"];
      var links = [];
      var numArticles = 0;

      Object.entries(value).map(([k, v]) => {
        if (k != 'value' && linkList.hasOwnProperty(k) && linkList[k]["articleTitle"]) {
          var url = linkList[k]["value"];
          var articleTitle = linkList[k]["articleTitle"];
          var count = v["count"];
          links.push([url,articleTitle,count]);
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

    Object.entries(linkList).map(([key, value]) => {
      if (value["articleTitle"]) {
        var link = value["value"];
        var articleTitle = value["articleTitle"];
        var tropes = [];

        Object.entries(value).map(([k, v]) => {
          if (k != 'value') {
            if (tropeList.hasOwnProperty(k)) {
              var trope = tropeList[k]["value"];
              var count = v["count"];
              tropes.push([trope,count]);
            }
          }
        })
         
         formattedLinks.push({link: link, articleTitle: articleTitle, tropes: tropes});
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
                  return location.pathname == '/' || location.pathname.includes('search');
                }}
                >
                Search
              </NavLink>
            </li>
            <li><NavLink to="/tropes" activeStyle={{ color: 'red' }}>Tropes</NavLink></li>
          </ul>
          <div className="content">
            <Route 
              exact path="/"
              render={(props) => <Search {...props}/>}
            />
            <Route 
              path="/search/"
              render={(props) => <SearchResults {...props} tropeList={tropeList} linkList={linkList}/>}
            />
            <Route 
              path="/tropes" 
              render={(props) => <Tropes {...props} tropeList={tropeList} articleList={articleList} tweetList={tweetList}/>}
            />
          </div>
        </div>
      </HashRouter>
    );
}

export default App;
