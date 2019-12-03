import React, { useState } from 'react';
import algoliasearch from 'algoliasearch';
import { Button, TextField } from '@material-ui/core';
import "./SearchBar.css";
import Autocomplete from "algolia-react-autocomplete";
import "algolia-react-autocomplete/build/css/index.css";
import Drawer from '@material-ui/core/Drawer';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import { Link } from 'react-router-dom';


const SearchBar = (props) => {
    const [results, setResults] = useState('');
    console.log("initial results ", results)
    const [tweetPanel, setTweetPanel] = useState(false);
    const [tweetPanelData, setTweetPanelData] = useState();
    const [finishedSearch, setFinishedSearch] = useState(false);
    const [textFieldValue, setTextFieldValue] = useState('');
    const searchClient = algoliasearch('W9NY6P6NCG','f0ddc5bc5ff2affdf1a32876e6a2f4d7');
    const indexes = [
        {
            source: searchClient.initIndex('trope-tracker'),
            displayKey: 'name',
            templates: {
                header: () => <h2 className="aa-suggestions-category">Tropes</h2>,
                suggestion: (suggestion, isSelected) => <div data-selected={isSelected}>{suggestion.value}</div>
            }
        }
    ]

    const displayData = (trope) => {
        console.log("trope is", trope)
        // not all tropes have first letter capitalized i think is the issue - early bird catches the worm
        const searchResults = props.tropeList.find(x => x.trope === trope)
        setResults([searchResults]);
        setFinishedSearch(true);
    }

    const openTweetPanel = (articleName,trope,link) => {
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
    };

    return (
        <div>
        <div className="search-page">
            <div className="title">
                <h1>Trope Tracker</h1>
            </div>
            <div className="search-field">
                <Autocomplete indexes={indexes} onSelectionChange={selectedSuggestion => displayData(selectedSuggestion.value)}>
                    <TextField key="input" type="search" value={results} placeholder="Enter a trope or news article url..." className="aa-input-search" autocomplete="off" />
                </Autocomplete>
            </div>
        </div>
        <div className="searchresults">
        {finishedSearch && results.length === 0 &&
          <p>No results found. Please try another search or visit the <Link to='/tropes' style={{ textDecoration: "none", color: "red", fontWeight: "bold" }}>Tropes</Link> page.</p>
        }
        {finishedSearch && results.length > 0 &&
          <div>
            <div className="tropes">
              {console.log(finishedSearch)}
              {/* results is the trope you click on after typing in search bar */}
              {console.log("results are", results)}
              {results.map((value, index) => (
                  <ExpansionPanel key={value}>
                      {console.log("value is ", value)}
                    <ExpansionPanelSummary>
                      <h4>{value.trope.replace(value.trope[0],value.trope[0].toUpperCase())}</h4>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <div>
                        {value.links.map((v,i) => (
                          <div className="entry" key={v + i}>
                            <div className="url">
                              <a href={v[0]} rel="noopener noreferrer" target="_blank">{v[1]}</a>
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
                    <a href={tweetPanelData["link"]} rel="noopener noreferrer" target="_blank">{tweetPanelData["articleName"]}</a>
                  </div>
                  <div className="tweetPanelContent">
                    <h4>Tweets</h4>
                    {tweetPanelData["tweets"].map((value, index) => (
                      <div>
                        <p className="tweetText">{value["text"]}</p>
                        <a href={value["link"]} rel="noopener noreferrer" target="_blank" style={{ textDecoration: "none"}}>
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

export default SearchBar;