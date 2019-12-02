const bkg = chrome.extension.getBackgroundPage();
let trope = ['Catch 22', 'Not all that Glitters is Gold', 'David and Goliath']

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
      let url = "";
      chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
        url = tabs[0].url;
        // bkg.console.log("URL IN IS: ", url)
        // return url;
      });
      // getLink(); 
      //pull data from database
      //store in variable
      displayTropes(trope) //pass variable instead of trope
      this.disabled = true;
  });

  goToTT.addEventListener('click', () => {

    let url = "";
    chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
      url = tabs[0].url;
      bkg.console.log("URL IN IS: ", url)
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

