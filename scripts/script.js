const body = document.body;
const startBtn = document.getElementById('btn-start');
const gameStartBtn = document.getElementById('btn-game-start');
const openingScreen = document.getElementById('title-screen');
const gameScreen = document.getElementById('game-screen');
const gameBoard = document.getElementsByClassName('game-board');
const cards =  document.querySelectorAll('.card');
const cardImage = document.querySelectorAll('.card-image');
const score = document.getElementById('score');
const missDisplay = document.getElementById('missed');
const timeDisplay = document.getElementById('time-count');
const winPopup = document.getElementById('end-game-pop-up-win');
const losePopup = document.getElementById('end-game-pop-up-lose');
const winYesBtn = document.getElementById('win-yes');
const winNoBtn = document.getElementById('win-no');
const loseYesBtn = document.getElementById('lose-yes');
const loseNoBtn = document.getElementById('lose-no');
const endGameBtn = document.getElementById('btn-end-game');
const btnMuteAudioOp = document.getElementById('btn-audio-mute-title-screen');
const btnMuteAudioGs = document.getElementById('btn-audio-mute-game-screen');
const muteAudioIcon = document.getElementsByClassName('icon-image-audio-on-off');
const muteDisplay = document.getElementsByClassName('audio-text');
const muteAudioIconGs = document.getElementById('icon-image-audio-on-off-Gs');
const muteDisplayGs = document.getElementById('audio-text-Gs');
const enableSoundBtn = document.getElementById('btn-enable-sound');
const disableSoundBtn = document.getElementById('btn-disable-sound');
const audioWarningPopUp = document.getElementById('audio-warning-pop-up');
const audioWarningPopUpContent = document.getElementById('audio-warning-pop-up-content');

// audio
const openingSound = document.querySelector('audio[data-key="music-opening"]');
const gameStartSound = document.querySelector('audio[data-key="game-start"]');
const gameBackMusic = document.querySelector('audio[data-key="music-game"]');
const gameWinMusic = document.querySelector('audio[data-key="music-end-game-win"]');
const gameLoseMusic = document.querySelector('audio[data-key="music-end-game-lose"]');
const comeWithMe = document.querySelector('audio[data-key="come-with-me"]');
const hasta = document.querySelector('audio[data-key="hasta"]');
const illBeBack= document.querySelector('audio[data-key="ill-be-back"]');
const youAreTerminated = document.querySelector('audio[data-key="terminated"]');
const gunShot = document.querySelector('audio[data-key="gunshot"]');
const missShot = document.querySelector('audio[data-key="no-hit"]');
const negative = document.querySelector('audio[data-key="negative"]');
const allAudio =  document.getElementsByTagName('audio');

//video
const winVideo = document.getElementById("video-win");
const loseVideo = document.getElementById("video-lose");


let counter = 21;
let miss = 0;
let hit = 0;
let lastCard, randomNum;
let silence= false;

const moles = ['terminator1', 'terminator2', 'terminator3', 'terminator4'];


enableSoundBtn.addEventListener('click', ()=>{
    audioWarningPopUp.classList.add('animation-running');
    openingSound.play();
    setMuteAudioBtns();
});

disableSoundBtn.addEventListener('click', ()=>{
    audioWarningPopUp.classList.add('animation-running');
    openingSound.play();
    muteAudio();
    setMuteAudioBtns();
});



//Jump page from opening to game screen
startBtn.addEventListener('click', ()=>{
    goToGamePage();
    startSound();
});

startBtn.addEventListener('mousedown', function(e){
    e.preventDefault();
});
function goToGamePage(){
    openingScreen.classList.add('game-has-started');
    gameScreen.classList.add('show');
}
function startSound() {  
    openingSound.pause();
    gameStartSound.play();
} ;

//When user click game start btn, gamestart
gameStartBtn.addEventListener('click', gameStart);

function gameStart(){
    comeWithMe.play();
    gameBackMusic.pause();
    comeWithMe.addEventListener("ended", function (){
        gameBackMusic.play();
    });
    setTimeout(()=>{
    showUpByTime();
    counter=21;
    timeCounter();
    for (let i = 0; i < cards.length; i++) {
        cards[i].addEventListener('click', evalBox);
      }
    },2000);
}


//set up different time to pop up the img randomly
//random time 
function randomTime(min, max){
    return Math.floor(Math.random() * (max-min) + min);
}

//random Cards
function randomCard(cards){
    const idx = Math.floor(Math.random() * cards.length);

    const card = cards[idx];
    if(card === lastCard){
        // console.log('the same one is showing');
        return randomCard(cards);
    }
    lastCard = card;
    return lastCard;
}

//img loaded into gameboard randomly
//showing up the image by different time
function showUpByTime(){
    const time = randomTime(200, 1000);
    const card = randomCard(cardImage);
    const randamImage = Math.floor(Math.random()*4);
    // console.log(time, card);
    card.classList.add('target');
    if(randamImage == 3){

        card.classList.add('friend');
    }else{
        card.classList.add('enemy');
    }
        card.style.background = `url('images/game-moles/${moles[randamImage]}.jpg') center no-repeat`;
        card.style.backgroundSize="contain";

  //  create a random timed loop
    setTimeout(()=>{
        if (card.classList.contains('enemy')){
           //if you cannot click img on time, counting up missed
            missDisplay.innerHTML = miss++;
        }
        card.classList.remove('target','friend', 'enemy');
        if (counter == 0){
            gameBackMusic.pause();
            clearTimeout();
        }else{
            showUpByTime();
        }
    }, 1000)
}

// timeCounter
//time counting start from 20 sec -> going down
function timeCounter(){
    setTimeout(() => {
      --counter
      timeDisplay.innerHTML = counter; 
      if (counter == 0) {
        //if score is more than missed, win the game- showing game-win popup
        if(hit > miss){
            setTimeout(()=>{
                winPopup.classList.add('show');
                winVideo.play();
                gameWinMusic.play();
            }, 2000)
        }else{
            youAreTerminated.play();
            gameLoseMusic.pause();
            //if score is less than missed, lose the game - showing game-lose popup
            setTimeout(()=>{
            
            youAreTerminated.addEventListener("ended", function (){
             gameLoseMusic.play();
               });
            losePopup.classList.add('show');
            loseVideo.play();
        }, 1500)
        }
       
        miss =0;
        hit=0;
        score.innerHTML = 0;
        missDisplay.innerHTML = 0;

        
        clearTimeout()
        timeDisplay.innerHTML = 20; 
      } else {

        timeCounter()
      }
    }, 1000)
  }

  // evaluate if the box has the specified class to generate point or miss
function evalBox(){
    // audio = !audio;
    if (this.firstElementChild.classList.contains('friend')){
        negative.play();
         //if user click terminator4.jpg , counting up missed
        missDisplay.innerHTML = ++miss
       
      this.firstElementChild.classList.remove('friend')
    }else if(this.firstElementChild.classList.contains('enemy')){
        gunShot.play();
        //if user click the img, counting up the score
        score.innerHTML = ++hit
        this.firstElementChild.classList.remove('enemy');
    } else{
      missShot.play()
     
    }
  }


 
winYesBtn.addEventListener('click', () => {
    gameWinMusic.pause();
    illBeBack.play();
    setTimeout(() => {
    winPopup.classList.remove('show');
    miss =0;
        hit=0;
        score.innerHTML = 0;
        missDisplay.innerHTML = 0;
    }, 1000);
});
winNoBtn.addEventListener('click', () => {
    gameWinMusic.pause();
    hasta.play();
    setTimeout(() => {
    winPopup.classList.remove('show');
    openingScreen.classList.remove('game-has-started');
    reset();
    }, 3000);
});
loseYesBtn.addEventListener('click', () => {
    gameLoseMusic.pause();
    illBeBack.play();
    setTimeout(() => {
    losePopup.classList.remove('show');
        miss =0;
        hit=0;
        score.innerHTML = 0;
        missDisplay.innerHTML = 0;
    }, 1000);
});
loseNoBtn.addEventListener('click', () => {
    gameLoseMusic.pause();
    hasta.play();
    setTimeout(() => {
    losePopup.classList.remove('show');
    openingScreen.classList.remove('game-has-started');
    reset();
}, 3000);
});

//if user click the end game -- go back to opening page
endGameBtn.addEventListener('click', () => {
    hasta.play();
    setTimeout(() => {
    openingScreen.classList.remove('game-has-started');
    gameBackMusic.pause();
    reset();
}, 3000);
});

btnMuteAudioOp.addEventListener('click', ()=>{
    muteAudio();
    setMuteAudioBtns();
});

btnMuteAudioGs .addEventListener('click', ()=>{
    muteAudio();
    setMuteAudioBtnsGs();
});
// resets the app back to initial state
function reset(){
    window.location.reload(true);
  }
//Mute Audio function
function setMuteAudioBtns(){
    if(silence){
        muteDisplay[0].innerHTML= "Play Audio";
        muteAudioIcon[0].setAttribute('src', 'images/audio/icon-audio-on.png',);
    }else{
        muteDisplay[0].innerHTML= "Mute";
        muteAudioIcon[0].setAttribute('src', 'images/audio/icon-audio-off.png',);
    }
    
}

//Set Mute Audio function for game page
function setMuteAudioBtnsGs(){
    if(silence){
        muteDisplayGs.innerHTML= "Play Audio";
        muteAudioIconGs.setAttribute('src', 'images/audio/icon-audio-on.png',);
    }else{
        muteDisplayGs.innerHTML= "Mute";
        muteAudioIconGs.setAttribute('src', 'images/audio/icon-audio-off.png',);
    }
    
}

function muteAudio(){
    if (silence) {
        for (let i = 0; i < allAudio.length; i++) {
        allAudio[i].muted = false;
        }
        silence = false;
        }
        else {
        for (let i = 0; i < allAudio.length; i++) {
        allAudio[i].muted = true;
        }
        silence = true;
        }       
}

  















