import React, { useState, useEffect } from 'react';
import Drawer from '@material-ui/core/Drawer';
import { Button } from '@material-ui/core';
import "./SingleTrope.css";
import { Link } from 'react-router-dom';

import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

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

const SingleTrope = (props) => {
    const [trope] = useState(props.location.pathname.replace('/trope/','').replace(/[^a-zA-Z0-9]/g,'_'));
    const [tropeData, setTropeData] = useState([])
    const [tweetPanel, setTweetPanel] = useState(false);
    const [tweetPanelData, setTweetPanelData] = useState();
    const [loading, setLoading] = useState(true);

    const classes = useStyles();
    console.log(props)

    useEffect(() => {
    if (props.tropeList.length > 0) {
      setTropeData(getTropeData(trope));
      setLoading(false);
    }
  }, [props.tropeList])

    function getTropeData(trope) {
      var trope2 = trope.replace(/_/g,' ');
      if (trope2 === "David vs  Goliath")
        trope2 = "David vs. Goliath"
      var data = props.tropeList.find(x => x.trope === trope2);
      return data;
    }

    function openTweetPanel(articleName,trope,link) {
        var articleName2 = articleName.replace(/[^a-zA-Z0-9]/g,'_');;
        var trope2 = trope.replace(/ /g,'_');
        if (trope2 === "David_vs._Goliath")
          trope2 = "David_vs__Goliath"
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
      <div className="tropepage">
          <div className="title">
              <h2>{trope.replace(/_/g,' ').replace(trope[0],trope[0].toUpperCase())}</h2>
          </div>
          <div style={{ marginTop: -15, marginLeft: 20 }}>
           <Link to='/tropes' className="returnToTropes" style={{ textDecoration: "none", color: "#ff8080", fontWeight: "bold", fontSize: 14 }}>Return to all tropes</Link>
          </div>
           {loading && 
            <div style={{ marginLeft: 20 }}>
              <p>Loading tropes...</p>
              </div>
            }  
            {!loading &&
              <div>
                <div className="tropes">
                {tropeData.numArticles > 0 && tropeData.links.map((v,i) => (
                    <div className="entry">
                        <Card className={classes.card}>
                         <div className={classes.details}>
                        <a href={v[0]} rel="noopener noreferrer" target="_blank" style={{ textDecoration: "none" , color: "black"}}>
                          <CardActionArea>
                          <div className={classes.content}>
                          {v[3] && 
                            <img
                              className={classes.media}
                              src={v[3]}
                              alt={v[1]}
                            />
                          }   
                             <CardContent className={classes.text}>
                              <Typography gutterBottom variant="h5" component="h2" style={{ fontSize: 18, fontWeight: "bold" }}>
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
                         <CardActionArea onClick={() => { openTweetPanel(v[1], tropeData.trope, v[0])}} className={classes.actions}> 
                          <CardActions>    
                            <Button size="small" color="primary" style={{ backgroundColor: 'transparent',  margin: "0 auto", display: "block" }} onClick={() => { openTweetPanel(v[1], tropeData.trope, v[0])}}>
                              View {v[2]} Tweet{v[2] > 1 && 's'}
                            </Button>
                          </CardActions>
                          </CardActionArea>
                        </Card>
                       </div>
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
    )
}

export default SingleTrope;
            