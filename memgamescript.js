window.onload = function(){
    var gamePlaying = false;
    var gridPositions = [{"card":null, "faceUp": false, "matched": false, "position":0},{"card":null, "faceUp": false, "matched": false, "position":1},{"card":null, "faceUp": false, "matched": false, "position":2}, {"card":null, "faceUp": false, "matched": false, "position":3}, {"card":null, "faceUp": false, "matched": false, "position":4}, {"card":null, "faceUp": false, "matched": false, "position":5}, {"card":null, "faceUp": false, "matched": false, "position":6}, {"card":null, "faceUp": false, "matched": false, "position":7}, {"card":null, "faceUp": false, "matched": false, "position":8}, {"card":null, "faceUp": false, "matched": false, "position":9}, {"card":null, "faceUp": false, "matched": false, "position":10}, {"card":null, "faceUp": false, "matched": false, "position":11}];
    var cards = ["jackclubs.png", "jackdiamonds.png","queenclubs.png","queendiamonds.png","kingclubs.png","kingdiamonds.png"]
    var attempts = 0;
    var assigned = 0;
    var randomPosition = 0;
    var startButton = document.getElementById("memGameStartButton");
    /*var cardImage;*/
    var gridDiv;
    var faceUpCount = 0;
    var matchedCount = 0;
    var bestScore;

    /* If it exists, get the best score so far from local storage and put on screen*/
    if (localStorage.getItem("score")) {
        bestScore = parseInt(localStorage.getItem("score"));
        document.getElementById("memGameBestScore").innerHTML = bestScore;
    }

/*Listen for click on start button*/
    startButton.addEventListener("click", function (event){
        if (gamePlaying) {
        /* ask if they want to start a new game, if yes, gamereset and  */
            gamePlaying = !confirm("Do you want to start a new game? \n Press OK for a new game \n cancel to continue with this one.");
            if (!gamePlaying) gameReset();
        }
        while (!gamePlaying){
            /*reset variables*/
            attempts = 0;
            gridPositions = [{"card":null, "faceUp": false, "matched": false, "position":0},{"card":null, "faceUp": false, "matched": false, "position":1},{"card":null, "faceUp": false, "matched": false, "position":2}, {"card":null, "faceUp": false, "matched": false, "position":3}, {"card":null, "faceUp": false, "matched": false, "position":4}, {"card":null, "faceUp": false, "matched": false, "position":5}, {"card":null, "faceUp": false, "matched": false, "position":6}, {"card":null, "faceUp": false, "matched": false, "position":7}, {"card":null, "faceUp": false, "matched": false, "position":8}, {"card":null, "faceUp": false, "matched": false, "position":9}, {"card":null, "faceUp": false, "matched": false, "position":10}, {"card":null, "faceUp": false, "matched": false, "position":11}];
            assigned = 0;
            randomPosition = 0;
            faceUpCount = 0;
            matchedCount = 0;
            /*loop through each card type */
            for (let i=0; i<cards.length; i++){
                assigned = 0;
                /*assign, randomly, to two of the twelve spaces*/
                while (assigned <2){
                    randomPosition = Math.floor(12 * Math.random());
                    if(!gridPositions[randomPosition]["card"]){
                        gridPositions[randomPosition]["card"] = cards[i];
                        assigned++;
                    }
                }
            }
            /* deal the cards into their assigned grids on screen*/
            for (let i=0; i<12; i++){
                gridDiv = document.getElementById("memGamePosition"+[i]);
                newImage =  document.createElement("img");
                newImage.src="/images/cardback.png"
                newImage.id= i+"position";
                newImage.addEventListener("click", cardClick);
                gridDiv.appendChild(newImage);
                gamePlaying = true;
            }
            /* Put up the player's score and reset the instructions*/
            document.getElementById("memGameInstructionBlock").innerHTML = "Choose two cards"
                            
            document.getElementById("memGameInstruct").innerHTML = "Goes:  "+attempts;
                            
            
        }
    })

    function cardClick(event){
        /*work out which card we're dealing with*/
        var clickedCard = event.target;
        var position = parseInt(clickedCard.id[0].concat(event.target.id[1]));
        var pickedCardObj = gridPositions[position];

        /* turn card, providing two cards are not already face up and unmatched, or if the card clicked is already face up.
         */
        if (pickedCardObj["faceUp"]===false && faceUpCount<2){
            faceUpCount++;
            turnCard(position);
            /* If faceUpCount is 2 then increment attempts count and pause for 1 second*/
            if (faceUpCount ===2){
                attempts++;
                setTimeout(function(){
                    var matchFound = false;
                    /* find other face up card and check if matching */
                    for (let i = 0; i < gridPositions.length; i++){
                        if(gridPositions[i]["faceUp"] && gridPositions[i]["position"]!==pickedCardObj["position"] && !gridPositions[i]["matched"]){
                            otherCard = gridPositions[i];
                            i = gridPositions.length;
                        }
                    }
                    if (otherCard["card"]===pickedCardObj["card"]){
                        matchFound = true;
                        otherCard["matched"] = true;
                        pickedCardObj["matched"] = true;
                        markAsMatched(otherCard);
                        markAsMatched(pickedCardObj);
                        faceUpCount = 0;
                        document.getElementById("memGameInstructionBlock").innerHTML="You matched! <br/><br/> Click on two more cards"
                        document.getElementById("memGameInstruct").innerHTML= "Goes:  "+attempts;
                    } else {
                        turnCard(otherCard["position"]);
                        turnCard(pickedCardObj["position"]);
                        faceUpCount=0;
                        document.getElementById("memGameInstructionBlock").innerHTML="Bad luck! <br/><br/> Try again";
                        document.getElementById("memGameInstruct").innerHTML= "Goes:  "+attempts;
                    }
                    if (matchedCount===gridPositions.length){
                        /* If there's no best score or they beat the best score, reset local storage and bestScore and show congrats message. */
                        if (!bestScore || attempts<bestScore) {
                            localStorage.setItem("score", attempts.toString());
                            document.getElementById("memGameInstructionBlock").innerHTML = "Woo Hoo! You beat your best score! <br/><br/> Press Start to try again"
                            bestScore = attempts;
                            document.getElementById("memGameBestScore").innerHTML = bestScore;
                        }else{
                        document.getElementById("memGameInstructionBlock").innerHTML="Congratulations!  You won in "+attempts+" goes. <br/><br/> Press Start to try again"
                        document.getElementById("memGameInstruct").innerHTML="";
                        }
                        gameReset();
                    }
                }, 1000);
                
            }
        }
    }

    function turnCard(position){
        var cardToTurnId = position+"position";
        var cardToTurn= document.getElementById(cardToTurnId);
        var parentDiv = cardToTurn.parentNode;
        var pickedCard = gridPositions[position];
        
        parentDiv.removeChild(cardToTurn);
        newImage =  document.createElement("img");
        /*if image is face down, set image to its faceup image and set faceUP attribute to true, else set neImage to cardback image and FaceUP attribute to false*/
        if (pickedCard["faceUp"]===false){
            newImage.src="/images/"+pickedCard["card"];
            pickedCard["faceUp"]= true;
        }else
       {    newImage.src="/images/cardback.png";
            pickedCard["faceUp"]= false;} 

        newImage.id= position+"position";
        newImage.addEventListener("click", cardClick);
        parentDiv.appendChild(newImage);
    }
    function markAsMatched(cardObj){ 
        /* Mark the card as matched and increment the matched count*/   
        cardObj["matched"] = true;
        matchedCount++;
    }

    function gameReset(){
        /*remove all the cards*/
        var parentDiv;
        var cardToRemove;
        for (let i= 0; i<gridPositions.length;i++){
            cardToRemove = document.getElementById(i+"position");
            parentDiv = cardToRemove.parentNode;
            parentDiv.removeChild(cardToRemove);
        }
        gamePlaying=false;
    }
}