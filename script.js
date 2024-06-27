
let currentSong = new Audio();
let songs;
async function getSongs() {
  let a = await fetch("https://tanmayhh3009.github.io/songs/");
  let response = await a.text();


  //console.log(response);
  // let songs = JSON.parse(response);

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href);
    }
  }
  return songs;
}

//second to min:second
function convertSecondsToMinSec(seconds) {
  // Calculate minutes and seconds
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  minutes = parseInt(minutes);
  remainingSeconds = parseInt(remainingSeconds);

  // Format seconds to ensure it always has two digits
  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  // Return the formatted time
  return `${minutes}:${formattedSeconds}`;
}

//

function extractFilename(urlOrFilename) {
  // Use a regular expression to match the filename from the URL
  const match = urlOrFilename.match(/([^/]+)$/);

  // If a match is found, return the matched filename
  if (match) {
    return match[1];
  }

  // If no match is found, return the original string
  return urlOrFilename;
}

const playMusic = (track, pause = false) => {
  // let audio = new Audio("/songs/"+track)
  currentSong.src = "/songs/" + track;
  if (!pause) {
    currentSong.play();
    //       play.src="/images/play.svg"
    play.src = "/images/pause.svg";
  }
  
  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

async function main() {
  //get the list  of the Songs

  songs = await getSongs();
  console.log(songs);
  // currentSong.src=songs[0]
  playMusic(extractFilename(songs[0]), true);

  let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];

  for (const song of songs) {
    songUL.innerHTML += `
         <li>
               <img class = "invert"src="images//music.svg" alt="" > 
               <div class="info">
             <div>  ${song.replace("https://tanmayhh3009.github.io/songs/", " ")}</div>
             
               </div>
               <div class="playNow">
                <span>Play Now</span>
                   <img class = "invert"src="images//play.svg" alt="" > 

               </div>
           </li>`;
  }

  // Play Thw audio Songs
  document.getElementById("playButton").addEventListener("click", function () {
    var audio = new Audio(songs[5]);
    audio
      .play()
      .then(function () {
        console.log("Audio is playing");
        console.log(audio.duration, audio.currentTime);
      })
      .catch(function (error) {
        console.error("Error attempting to play audio:", error);
      });
  });

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML);
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });

  //Attach an event listener to play, next and previos

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/images/play.svg";
    }
  });

  //listen for time update event

  currentSong.addEventListener("timeupdate", () => {
    //console.log(currentSong.currentTime,currentSong.duration)
    document.querySelector(".songTime").innerHTML = `${convertSecondsToMinSec(
      currentSong.currentTime
    )} / ${convertSecondsToMinSec(currentSong.duration)}`;

    //seekbar run

    document.querySelector(".circle").style.left = (currentSong.currentTime)/(currentSong.duration) * 100 + "%";


  })


  //seekbar location change
  document.querySelector(".seekbar").addEventListener("click",e=>{
    console.log(e.offsetX)
    let percent  = (e.offsetX/e.target.getBoundingClientRect().width) * 100 ;
  document.querySelector(".circle").style.left = percent * 100 + "%";

  currentSong.currentTime = (currentSong.duration)*percent /100;

  })


  //Add eventlister to hamburger

  document.querySelector(".hamburger").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "0";
    document.querySelector(".playBar").style.bottom= "-120px";
  })
  document.querySelector(".close").addEventListener("click",()=>{
    document.querySelector(".left").style.left = "-120" + "%";
    document.querySelector(".playBar").style.bottom= "20px";
  })

//creating prev and next

//adding Event Listner for previous  song 
previous.addEventListener("click", () => {
  console.log("prev clicked");
  console.log(currentSong);
  let s = currentSong.src;
  let index = songs.indexOf(s);
  if (index - 1 >= 0) {
    console.log(index - 1);
    playMusic(extractFilename(songs[index - 1]));
  } else {
    // Play the last song if the current song is the first one
    playMusic(extractFilename(songs[songs.length - 1]));
  }
});

// Adding Event Listener for next song
next.addEventListener("click", () => {
  console.log("next clicked");
  let s = currentSong.src;
  let index = songs.indexOf(s);
  console.log(index);
  if (index + 1 < songs.length) {
    playMusic(extractFilename(songs[index + 1]));
  } else {
    // Play the first song if the current song is the last one
    playMusic(extractFilename(songs[0]));

  }
})



//Add an event to volume

document.querySelector(".volume").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
  console.log(e.target,e.target.value);
  currentSong.volume = parseInt(e.target.value)/100
})



































}
main();
