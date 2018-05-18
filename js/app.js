 const deck = document.querySelector('.deck');
 const cardList = deck.getElementsByTagName('i');

 cardArray=[];
 for (var i=0;i<cardList.length;i++) {
 const cardClass = cardList[i].className;
 cardArray.push(cardClass);
 }

 const counter = document.querySelector(".moves");
 const stars = document.querySelectorAll(".fa-star");
 const starsList = document.querySelectorAll(".stars li");
 const closeicon = document.querySelector(".close");
 const modal = document.getElementById("celepage");

 const stateClose = "card";
 const stateOpen = "card open show";
 const stateMatched = "card card match";

function newDeck() {
  //shuffle and create a new deck of cards
  shuffle(cardArray);
  document.querySelector('.deck').innerHTML = '';
  const fragment = document.createDocumentFragment();
  for ( var j=0; j<cardArray.length;j++) {
    const newList = document.createElement('li');
    newList.classList.add('card');
    fragment.appendChild(newList);
    const newItem = document.createElement('i');
    newItem.classList.add('fa',cardArray[j].split(' ')[1]);
    newList.appendChild(newItem);
  }
  deck.appendChild(fragment);


// reset moves
  moves = 0;
  counter.innerHTML = moves;
// reset rating
 for (var i= 0; i < stars.length; i++){
  stars[i].style.color = "yellow";
  stars[i].style.visibility = "visible";
 }
//reset timer
 sec= 0;
 min= 0;
 hr = 0;
 var interval;
 const timer = document.querySelector('.timer');
 timer.innerHTML = "0 mins 0 secs";


    for (var i=0; i<cardArray.length;i++){
        const curCard = deck.getElementsByTagName('li')[i];
        curCard.addEventListener('click', function() {
          
          const myCardName = curCard.getElementsByTagName('i')[0].className;
          const cardState = curCard.className
          if (cardState != stateClose) {
            // do nothing
            
            return;
          }
          moveCounter();
          setCardState(curCard, stateOpen);
          const openCard = findOpenCard(curCard);
          if (null != openCard) {
            // found open one
            //console.log("found:");
            if (myCardName == openCard.getElementsByTagName('i')[0].className) {
                //console.log("matched");
                setCardState(curCard, stateMatched); 
                setCardState(openCard, stateMatched);

                if (isFinished()) {
                  // stop timer and show celebration popup
                  stopTimer();
                  finalTime = timer.innerHTML;
                  finalMoves = counter.innerHTML;
                  starRating = document.querySelector(".stars").innerHTML;
                  celebratePopup(finalTime,finalMoves,starRating);
                

                } else {
                    // do nothing
                }
            } else {
                //console.log("not matched");
                setTimeout(() => {
                    setCardState(curCard, stateClose);                     
                    setCardState(openCard, stateClose);
                }, 400);
            }
          } else {
            //console.log("no open card");
            setCardState(curCard, stateOpen);
          }

        },false); // eventlistener

    } // run through each card

} //newDeck function

function findOpenCard(curCard) {

    for (var i=0; i<cardArray.length; i++) {
        var openCard = deck.getElementsByTagName('li')[i]
        if (openCard == curCard) {
            continue
        }

        var cardState = openCard.className;
        //console.log(i, cardState)
        if (cardState == 'card open show') {
            return openCard;
        } else {
            // do nothing
        }
    }

    //console.log("findOpenCard: null")
    return null;
}

function isFinished() {
    var finished = true

    for (var i=0; i<cardArray.length; i++) {
        var cardState = deck.getElementsByTagName('li')[i].className;
        if (cardState != stateMatched) {
            return false;
        }
    }

    return finished
}

function setCardState(card, state) {
    card.className = state;
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

function startTimer() {
    interval = setInterval(function() {
        var timer = document.querySelector(".timer");
        timer.innerHTML = min+" mins "+sec+" secs ";
        sec++;
        if (sec ==60){
            min++;
            sec = 0;
        }
        if(min == 60){
            hr++;
            min = 0;
        }
    },1000);
}

function stopTimer() {
    if (interval) {
        clearInterval(interval);
    }
}

function moveCounter(){
    moves++;
    counter.innerHTML = moves;
    //start timer on first click
    if(moves == 1){
        sec = 0;
        min = 0; 
        hr = 0;
        startTimer();
    }
    // setting rates based on moves
    if (moves > 32 && moves < 60){
        for( i= 0; i < 3; i++){
            if(i > 1){
                stars[i].style.visibility = "hidden";
            }
        }
    }
    else if (moves > 60){
        for( i= 0; i < 3; i++){
            if(i > 0){
                stars[i].style.visibility = "hidden";
            }
        }
    }
}

function celebratePopup(time,move,star){
        modal.classList.add("modalShow");
        document.getElementById("finalMove").innerHTML = move;
        document.getElementById("starRating").innerHTML = star;
        document.getElementById("totalTime").innerHTML = time;
        closeModal();
}

function closeModal(){
    closeicon.addEventListener("click", function(e){
        modal.classList.remove("modalShow");
        location.reload(true);
    });
}

function playAgain(){
    modal.classList.remove("modalShow");
    newDeck();
}