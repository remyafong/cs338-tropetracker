import React, { useState, useEffect } from 'react';
import "./UrlSearchView.css";
import { Button } from '@material-ui/core';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import cheerio from 'cheerio';

const UrlSearchView = (props) => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState([]);
    const [tropes, setTropes] = useState([]);
    //const [tropeKeys, setTropeKeys] = useState([]);
    const [tweets, setTweets] = useState([]);
    const [tweetIds, setTweetIds] = useState([]);
    //console.log("results are ", results)

    useEffect(() => {
        async function getResults() {
            const proxyUrl = 'https://cors-anywhere.herokuapp.com/';
            const fullUrl = proxyUrl + props.searchUrl
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
        if (props.articleList && props.tweetList) {
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
                setLoading(false);
            });
        }
        
       
    }, [props.articleList, props.tweetList, props.searchUrl]);

    return (
        <div>
            <div className="tropes">
                {loading && 
                    <p>Loading results...</p> 
                }
                {!loading && tweets.length === 0 &&
                    <p>No results found.</p> 
                }
                {!loading && tweets.length > 0 && 
                <div>
                    <h3 className="article-info">{results[0].articleTitle}</h3>
                    <h4 className="article-info article-desc">{results[0].articleDesc}</h4>
                    {tropes.map((value, index) => (
                        <ExpansionPanel key={index}>
                            <ExpansionPanelSummary>
                                <h3 className="trope-name">{value}</h3>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>
                                <div>
                                    {/* {console.log("tweets are", tweets)} */}
                                    {tweets[index].map((v, i) => (
                                        <div key={v+i}>
                                            <div className="tweet">{v}</div>
                                            <a href={`http://twitter.com/a/status/${tweetIds[index][i]}`} rel="noopener noreferrer" target="_blank" style={{ textDecoration: "none"}}>
                                                <Button 
                                                    variant="outlined"
                                                    style={{ textTransform: "none", fontSize: "15px", fontWeight: "bold" }} 
                                                        color="primary"
                                                    >
                                                    View tweet on Twitter
                                                </Button>
                                            </a>
                                        </div>
                                    ))}
                                </div>
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    ))}
                </div>}
            </div>
        </div>
    );
}

export default UrlSearchView;