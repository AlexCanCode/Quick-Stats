// Object to hash and store player names with their stats key in [key]value: hash->index
class StatMap {
    constructor() {
    this.list = [];
  }

  get(x) { 
    let j = x.toLowerCase();
    let result = this.list[j];
    if(typeof j === "function" || typeof result === "function"){ //checks if string is also the name of a function, which results in an error when you run .reduce on it.
        return
      }

    else if(!result){
        return -1;  
    }
    else {
        return result.reduce(function(all, item, index){
            all.push(item[1]);
            return all;
        }, [])
    };
  };

  set(x, y) {
    if(!this.list[x]) {
        this.list[x] = [];
    }

    this.list[x].push([x, y]);
  }

  setHashAll(arr){  
    for(let i = 0; i < (arr.length - 1); i++){  
        let x = arr[i].toLowerCase();

        if(!this.list[x]){
            this.list[x] = [];
        }

        this.list[x].push([x, i]); 
    }
  }

  searchErrorHandler(str1, str2) { //look into implementing cleaner version of this
    if(!str1) {
      return false
    }
    else if (str1 === -1) {
      return false
    } 
    else if(!str2) {
      return false
    }
    else if (str2 === -1) {
      return false
    }
    else {
      return true;
    }
  };

  playerSearch(arr, location){ //added location so script can run getData(arr, location) in a file that does not contain the stats file.
    let fullMatches = [];
    let searchedHash;
    let secondHash;

     for(let i = 0; i < (arr.length - 1); i++){
        searchedHash = this.get(arr[i]);
        //if(searchedHash is found in this.specialCases){  } for nickname and special cases - need to create additional lists which involves updating get and set
        secondHash = this.get(arr[(i + 1)]); 

        if(this.searchErrorHandler(searchedHash, secondHash)) {
            fullMatches.push(searchedHash.filter(element => secondHash.includes(element)));
        }
    }
    return this.getData(fullMatches.filter(element => element.length >= 1), location); 
  }

  getData(arr, location){ // Get data from location (which is entered, as of now, in the playerSearch function. Need to determine format and ultimate location once architecture is clearer. this function will need to be rewritten to access stats location later on in development 
         let statArr = [];
         arr.forEach(element => {
          if(!statArr.includes(location[element])) {
          statArr.push(location[element])
       }
     });
         return statArr;
    }

  clearHash(){
    this.list = [];
  }
}

// Create new instance of StatMap
let PlayerMap = new StatMap(); 

// Grab all first and last names from stats and put them, respectively, into first and last name arrays 
let firstNames = [];
let lastNames = [];

function grabNames(arr){
    arr.map((item, index) => {
        let tempArr = item.Player.split(" ");
        firstNames.push(tempArr[0]);
        lastNames.push(tempArr[1]);
    });
};

grabNames(formattedStatsObjectJSON); 

//Hash all first and last names
PlayerMap.setHashAll(firstNames);
PlayerMap.setHashAll(lastNames);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      updateDataCheck(request[1]);
      // console.log(PlayerMap.playerSearch(request, formattedStatsObjectJSON));
      sendResponse({response: (PlayerMap.playerSearch(request[0], formattedStatsObjectJSON))});
      console.log(sender.url); //test sender.url for NBA and blacklist and take action according to options selected. 
  }); 



