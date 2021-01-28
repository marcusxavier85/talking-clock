
onload = () => {
    if ('speechSynthesis' in window) {
        let synth = speechSynthesis;
        let flag = false;

        // references to the buttons
        let playEle = document.querySelector('.playTts');
        let pauseEle = document.querySelector('.pauseTts');
        let stopEle = document.querySelector('.stopTts');

        // click event handlers for the buttons
        playEle.addEventListener('click', onClickPlay);
        pauseEle.addEventListener('click', onClickPause);
        stopEle.addEventListener('click', onClickStop);

        function onClickPlay() {
            if(!flag){
                flag = true;
                utterance = new SpeechSynthesisUtterance(
                    document.querySelector('.news-headline').textContent);
                utterance.voice = synth.getVoices()[0]; //assigns sound of voice
                utterance.onend = function(){
                    flag = false;
                    // executes when speech is finished
                };
                synth.speak(utterance); // starts initial speach
            }
            if(synth.paused) { // unpause/resume
                synth.resume();
            }
        }
        function onClickPause() {
            if(synth.speaking && !synth.paused){ // pause narration
                synth.pause();
            }
        }
        function onClickStop() {
            if(synth.speaking){ // stop narration
                flag = false;
                synth.cancel();
            }
        }
    }
    else {
        document.querySelector('.ttsButtons').textContent = 'TTS is not supported sorry.'
    }
}

function clock() {
    let date = new Date();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();

    let period = 'AM';
    if ( hours === 0) {
        hours = 12;
    } else if (hours === 12) {
        period = 'PM';
    } else {
        hours = hours - 12;
        period = 'PM';
    }
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    if (seconds < 10) {
        seconds = '0' + seconds;
    }

    if (seconds === 0) {
        getNewsHeadline();
    }

    let time = hours + ':' + minutes + ':' + seconds + period;

    document.querySelector("#clock").textContent = time;
    setInterval(clock, 1000);
}

function getNewsHeadline () {
    fetch('https://cors-anywhere.herokuapp.com/https://newsapi.org/v2/everything?domains=techcrunch.com,thenextweb.com&apiKey=4e3b136733934970919e720d4622f02c').then((data) => {
        return data.json();
    }).then((data) => {
        console.log(data);
        document.querySelector('.news-headline').innerHTML = data.articles[0].title;
    });
}

clock();