import React, { useState, useEffect } from 'react';
import "./SearchResults.css";
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import * as TropeQueries from "./TropeQueries";

import Drawer from '@material-ui/core/Drawer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import CircularProgress from '@material-ui/core/CircularProgress';

const SearchResults = (props) => {
    const [searchQuery, setSearchQuery] = useState(props.location.pathname.replace('/search/',''));
    const [results, setResults] = useState('');
    const [finishedSearch, setFinishedSearch] = useState(false);
    const [tweetPanel, setTweetPanel] = useState(false);
    const [tweetPanelData, setTweetPanelData] = useState();

    useEffect(() => {
      if (props.tropeList.length > 0) {
        setResults(getResults(searchQuery));
      }
      
    }, [props.tropeList])

    useEffect(() => {
      var newSearch = props.location.pathname.replace('/search/','');
      if (searchQuery !== newSearch) {
        window.location.reload();
      }
    }, [props.location.pathname])

    function handleSearchQueryUpdate(event) {
      setSearchQuery(event.target.value);
    }

    function keyPress(e) {
      if(e.keyCode == 13){
         props.history.push(`/search/${searchQuery}`);
         window.location.reload();
      }
    }

    function searchButtonClick() {
        props.history.push(`/search/${searchQuery}`);
        window.location.reload();
    }

    function getResults(searchTerm) {
      var searchWords = searchTerm.toLowerCase().split(" ");
      var tropeMatches = [];

      TropeQueries.forEach((trope) => {
        if (searchWords.every(item => trope["name"].toLowerCase().includes(item))) {
          tropeMatches.push(trope);
        }
      })

      if (tropeMatches.length > 0) {
        var tropes = [];
        tropeMatches.forEach((t) => {
          var trope = props.tropeList.find(x => x.trope == t["name"]);
          if (trope != undefined)
            tropes.push(trope);
        })

        tropes = tropes.sort((a,b) => (a["trope"].toLowerCase() > b["trope"].toLowerCase()) ? 1 : ((b["trope"].toLowerCase() > a["trope"].toLowerCase()) ? -1 : 0));

        console.log(tropes);
        setFinishedSearch(true);
        return tropes;
      }
      else {
        setFinishedSearch(true);
        return [];
      }
      
    }

    function openTweetPanel(articleName,trope,link) {
      var articleName2 = articleName.replace(/[^a-zA-Z0-9]/g,'_');;
      var trope2 = trope.replace(/ /g,'_');
      var tweetIDs = props.articleList[articleName2][trope2]["id"];
      
      var tweets = [];

      tweetIDs.forEach((id) => {
        var tweetData = props.tweetList[id];
        if (tweetData && tweetData.hasOwnProperty("text")) {
          tweets.push({link: `http://twitter.com/a/status/${id}`,text: tweetData["text"]});
        }
        else {
          tweets.push({link: "missing", text: "missing"});
        }
      })

      setTweetPanelData({trope: trope, articleName: articleName, link: link, tweets: tweets});
      setTweetPanel(true);  
    }

    return (
      <div className="searchresultspage">
        <div className="searchfield">
           <div className="child">

            <TextField
                id="searchbar"
                defaultValue={searchQuery}
                variant="outlined"
                onChange={handleSearchQueryUpdate}
                onKeyDown={keyPress}
              />
            </div>
              <div className="child">
                  <Button 
                    id="searchbutton" 
                    variant="contained"
                    style={{ textTransform: "capitalize", marginLeft: "10px", marginTop: "-1px", fontSize: "15px", fontWeight: "bold", height: "55px" }} 
                    color="primary"
                    onClick={() => {searchButtonClick()}}
                  >
                    Search
                  </Button>
              </div>
          </div>
          <div className="searchresults">
            {!finishedSearch &&
              <p>Loading results...</p>
            }
            {finishedSearch && results.length == 0 &&
              <p>No results found. Please try another search or visit the <Link to='/tropes' style={{ textDecoration: "none", color: "red", fontWeight: "bold" }}>Tropes</Link> page.</p>
            }
            {finishedSearch && results.length > 0 &&
              <div>
                <div className="tropes">
                  {results.map((value, index) => (
                      <ExpansionPanel>
                        <ExpansionPanelSummary>
                          <h4>{value.trope.replace(value.trope[0],value.trope[0].toUpperCase())}</h4>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                          <div>
                            {value.links.map((v,i) => (
                              <div className="entry">
                                <div className="url">
                                  <a href={v[0]} target="_blank">{v[1]}</a>
                                  <p></p>
                                </div>
                                <div className="tweets">
                                  <Button 
                                    variant="outlined"
                                    style={{ textTransform: "capitalize", margin: "8px", fontSize: "15px", fontWeight: "bold" }} 
                                      color="primary"
                                      onClick={() => { openTweetPanel(v[1], value.trope, v[0])}}
                                  >
                                  View {v[2]} Tweet{v[2] > 1 && 's'}
                                </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                  ))}
                </div>
                {tweetPanelData && 
                  <Drawer anchor="right" open={tweetPanel} onClose={() => {setTweetPanel(false)}}>
                    <div 
                      className="tweetPanel"
                      role="presentation"
                    >
                      <div className="tweetPanelHeader">
                        <h3>{tweetPanelData["trope"].replace(tweetPanelData["trope"][0],tweetPanelData["trope"][0].toUpperCase())}</h3>
                        <p></p>
                        <a href={tweetPanelData["link"]} target="_blank">{tweetPanelData["articleName"]}</a>
                      </div>
                      <div className="tweetPanelContent">
                        <h4>Tweets</h4>
                        {tweetPanelData["tweets"].map((value, index) => (
                          <div>
                            <p className="tweetText">{value["text"]}</p>
                            <a href={value["link"]} target="_blank" style={{ textDecoration: "none"}}>
                              <Button 
                                    variant="outlined"
                                    style={{ textTransform: "none", fontSize: "10px", fontWeight: "bold" }} 
                                      color="primary"
                                  >
                                  View tweet on Twitter
                                </Button>
                            </a>
                            <p></p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Drawer>
                }
              </div>
            }
          </div>
      </div> 
    );
}

export default SearchResults;