import React, { useState, useEffect } from 'react';
import "./SearchResults.css";
import { Link } from 'react-router-dom';
import { Button, TextField } from '@material-ui/core';
import * as TropeQueries from "../../TropeQueries";
import TropeSearchView from '../TropeSearchView/TropeSearchView.js';
import UrlSearchView from '../UrlSearchView/UrlSearchView.js';

const SearchResults = (props) => {
	const [searchQuery, setSearchQuery] = useState(props.location.pathname.replace('/search/',''));
	const [results, setResults] = useState('');
	const [finishedSearch, setFinishedSearch] = useState(false);
	const [isTropeSearch, setTropeSearch] = useState(true);
	
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
		setFinishedSearch(false)
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
			setFinishedSearch(true);
			setTropeSearch(false);
			return [];
		}
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
					{finishedSearch && results.length === 0 && isTropeSearch &&
						<p>No results found. Please try another search or visit the <Link to='/tropes' style={{ textDecoration: "none", color: "red", fontWeight: "bold" }}>Tropes</Link> page.</p>
					}
					{finishedSearch && results.length > 0 && isTropeSearch &&
						<TropeSearchView tweetList={props.tweetList} articleList={props.articleList} results={results}></TropeSearchView>
					}
					{finishedSearch && !isTropeSearch &&
						<UrlSearchView tweetList={props.tweetList} articleList={props.articleList} searchUrl={searchQuery}></UrlSearchView>
					}
				</div>
		</div> 
	);
}
	
export default SearchResults;