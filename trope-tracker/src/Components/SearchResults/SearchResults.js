import React, { useState, useEffect } from 'react';
import "./SearchResults.css";
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import * as TropeQueries from "../../TropeQueries";
import TropeSearchView from '../TropeSearchView/TropeSearchView.js';
import UrlSearchView from '../UrlSearchView/UrlSearchView.js';
import cheerio from 'cheerio';

const SearchResults = (props) => {
	const [searchQuery, setSearchQuery] = useState(props.location.pathname.replace('/search/',''));
  const [results, setResults] = useState([]);
  const [tropes, setTropes] = useState([]);
	const [finishedSearch, setFinishedSearch] = useState(false);
	const [isTropeSearch, setTropeSearch] = useState(true);
  const [suggestTrope, toggleSuggestTrope] = useState(false);
  const [tweets, setTweets] = useState([]);
  const [tweetIds, setTweetIds] = useState([]);

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
		if(e.keyCode === 13){
			props.history.push(`/search/${searchQuery}`);
			window.location.reload();
		}
	}
	
	function searchButtonClick() {
		props.history.push(`/search/${searchQuery}`);
		window.location.reload();
	}
	
	function getResults(searchTerm) {
    console.log(props)
		if (!searchTerm.includes("/")) {
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
					var trope = props.tropeList.find(x => x.trope === t["name"]);
					if (trope !== undefined) {
						tropes.push(trope);
					}
				})
				console.log("it was a trope", tropes);
				setFinishedSearch(true);
				return tropes;
			}
			else {
				setFinishedSearch(true);
				return [];
			}
		}
		else {
      setTropeSearch(false);
		}
	}

  useEffect(() => {
    async function getResults() {
        const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
        const fullUrl = proxyUrl + searchQuery
        const urlResponse = await fetch(fullUrl);
        const htmlString = await urlResponse.text();
        const $ = await cheerio.load(htmlString);
        const articleTitle = $('head title').text();
        let searchResults = [];
        Object.entries(props.articleList).forEach(([k, v]) => {
            if (v.articleTitle === articleTitle) {
                searchResults.push(v)
            }
        })
        return searchResults;
    }
    console.log(props.articleList)
    if (props.articleList && props.tweetList && !isTropeSearch) {
        getResults().then(val => {
            //console.log("val is", val);
            setResults(val);
            let resultTropes = [];
            let keyNames = [];
            val.forEach((hit) => {
                Object.keys(hit).forEach((k) => {
                    if (k.includes("_")) {
                        keyNames.push(k)
                        const tropeName = k.replace(/_/g, ' ');
                        resultTropes.push(tropeName);
                    }
                })
            })
            //console.log(keyNames, resultTropes);
            setTropes(resultTropes);
            //setTropeKeys(keyNames);
            let resultTweets = []
            let tweetIdArr = [];
            keyNames.forEach((x, i) => {
                let currTweets = [];
                const idArr = val[0][x].id
                idArr.forEach((id) => {
                    Object.entries(props.tweetList).forEach(([k, v]) => {
                        if (k === id) {
                            currTweets.push(v.text);
                        }
                    })
                })
                tweetIdArr.push(idArr);
                resultTweets.push(currTweets);
            })
            setTweetIds(tweetIdArr);
            //console.log("tweetIdArr is", tweetIdArr);
            setTweets(resultTweets); 
            setFinishedSearch(true);
        });
    }

  }, [props.articleList, props.tweetList, isTropeSearch])
	
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
					{finishedSearch && results.length === 0 && isTropeSearch && 
              <p><span style={{ fontWeight: 'bold' }}>No results found</span>. Please try another search, visit the <Link to='/tropes' style={{ textDecoration: "none", color: "red", fontWeight: "bold" }}>Tropes</Link> page for a list of existing tropes, or <Link onClick={() => toggleSuggestTrope(true)} style={{ textDecoration: "none", color: "red", fontWeight: "bold" }}>suggest a new trope</Link>!</p>
          }
					{finishedSearch && results.length > 0 && isTropeSearch &&
            <div style={{ marginLeft: -20}}>
						<TropeSearchView tweetList={props.tweetList} articleList={props.articleList} results={results}></TropeSearchView>
					 </div>
          }
          {finishedSearch && results.length === 0 && !isTropeSearch && 
              <p><span style={{ fontWeight: 'bold' }}>No results found</span>. Please try another search!</p>
          }
					{finishedSearch && !isTropeSearch &&
            <div style={{ marginLeft: -20}}>
						<UrlSearchView tweetList={props.tweetList} articleList={props.articleList} tweets={tweets} tweetIds={tweetIds} results={results} tropes={tropes}></UrlSearchView>
					</div>
          }
          {suggestTrope && 
              <div style={{left: 0}} >
                <iframe title="tropeSuggestion" src="https://docs.google.com/forms/d/e/1FAIpQLSeAeg2L5Z4jYwzBYyMCz3BZKPf00CY4vEnorplLn3jReEq0vA/viewform?embedded=true" width="640" height="800" frameborder="0" marginheight="0" marginwidth="0"></iframe>
              </div>
          }
				</div>
		</div> 
	);
}
	
export default SearchResults;