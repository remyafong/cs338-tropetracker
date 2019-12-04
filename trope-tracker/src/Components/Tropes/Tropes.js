import React, { useState, useEffect } from 'react';
import { Button } from '@material-ui/core';
import Drawer from '@material-ui/core/Drawer';
import './Tropes.css';
import { Link } from 'react-router-dom';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import Collapse from '@material-ui/core/Collapse';

const useStyles = makeStyles({
  card: {
  	height: "auto",
    width: "100%",
    overflow: "auto",
    display: 'flex'
  },
  content: {
  	display: 'flex'
  },
  media: {
	  height: "auto",
	  maxHeight: 250,
	  width: 300,
	  flexGrow: 0,
	  display: 'inline-block'
  },
  text: {
  	flex: 1,
  	flexGrow: 2000,
  	display: 'inline-block'
  },
  actions: {
  	width: 200,
  	flexGrow: 100,
  	display: 'inline-block',
  },
  description: {
  	color: "blue",
  	fontSize: 14
  }
});

const Tropes = (props) => {
	const [loading, setLoading] = useState(true);
	const [tweetPanel, setTweetPanel] = useState(false);
	const [tweetPanelData, setTweetPanelData] = useState();
	const [tropeExpanded, setTropeExpanded] = useState([]);
	const classes = useStyles();

	useEffect(() => {
		if (props.tropeList.length > 0) {
			var bools = [];
			for (var i = 0; i < props.tropeList.length; i++) {
				bools.push({trope: props.tropeList[i]["trope"], expanded: false})
			}
			console.log(bools);
			setTropeExpanded(bools);
			setLoading(false);
		}
	}, [props.tropeList])

	function openTweetPanel(articleName,trope,link) {
		var articleName2 = articleName.replace(/[^a-zA-Z0-9]/g,'_');
		var trope2 = trope.replace(/ /g,'_');
		var tweetIDs = props.articleList[articleName2][trope2]["id"];
		console.log(props.articleList);
		var tweets = [];

		//console.log(tweetIDs)

		tweetIDs.forEach((id) => {
			var tweetData = props.tweetList[id];
			if (tweetData && tweetData.hasOwnProperty("text")) {
				tweets.push({link: `http://twitter.com/a/status/${id}`,text: tweetData["text"]});
			}
			else {
				tweets.push({link: "missing", text: "missing"});
			}
		})

		//console.log(tweets);

		setTweetPanelData({trope: trope, articleName: articleName, link: link, tweets: tweets});
		setTweetPanel(true);	
	}

	function showHideArticles(trope) {
		var old = tropeExpanded;
		var oldState = tropeExpanded.find(x => x.trope == trope)["expanded"];
		var index = tropeExpanded.find(x => x.trope == trope);
		old[trope] = !oldState;
		setTropeExpanded(old);
	}

    return (
		<div className="tropepage">
			<div className="title">
    			<h2>Trope List</h2>
    		</div>
    		{loading && 
    			<p>Loading tropes...</p>
    		}
			{!loading &&
				<div>
	    			<div className="tropes">
		    			{props.tropeList && props.tropeList.map((value, index) => (
					        <ExpansionPanel  key={index} TransitionProps={{ unmountOnExit: true }}>
						        <ExpansionPanelSummary>
						          <h4>{value.trope.replace(value.trope[0],value.trope[0].toUpperCase())}</h4>
						        </ExpansionPanelSummary>
						        <ExpansionPanelDetails>
						          <div>
						          	{value.numArticles == 0 &&
						          		<p>No results found.</p>
						          	}
						            {value.numArticles > 0 && value.links.slice(0,3).map((v,i) => (
						            	<div className="entry"  key={i}>
							            	<Card className={classes.card}>
							            	 <div className={classes.details}>
							            	<a href={v[0]} rel="noopener noreferrer" target="_blank" style={{ textDecoration: "none" , color: "black"}}>
										      <CardActionArea>
										      <div className={classes.content}>
										      {v[3] && 
										      	<img
										          className={classes.media}
										          src={v[3]}
										        />
										      }   
												 <CardContent className={classes.text}>
										          <Typography gutterBottom variant="h5" component="h2" style={{ fontSize: 18 }}>
										            {v[1]}
										          </Typography>
										          <Typography variant="body2" color="textSecondary" component="p" style={{ fontSize: 14 }} >
										            {v[4]}
										          </Typography>
										        </CardContent>
										        </div>
										      </CardActionArea>
										     </a>
										     </div>
										     <CardActionArea onClick={() => { openTweetPanel(v[1], value.trope, v[0])}} className={classes.actions}> 
										      <CardActions>    
										        <Button size="small" color="primary" style={{ backgroundColor: 'transparent',  margin: "0 auto", display: "block" }} onClick={() => { openTweetPanel(v[1], value.trope, v[0])}}>
										          View {v[2]} Tweet{v[2] > 1 && 's'}
										        </Button>
										      </CardActions>
										      </CardActionArea>
										    </Card>
										   </div>
						            ))}
						            {value.numArticles > 0 && value.links.length > 3 &&
						            	<Link to={`/trope/${value.trope}`} style={{ textDecoration: "none"}} target="_blank">
						            		<Button >
								            View more articles
							            	 </Button>
						            	</Link>

						            	// <Button onClick={() => { showHideArticles(value.trope) }}>
							            // 	View more articles
						            	// </Button>
						            }
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
    );
}


export default Tropes;