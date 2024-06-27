let currentSong = new Audio();
let songs;

async function getSongs() {
  let a = await fetch("https://tanmayhh3009.github.io/songs/");
  let response = await a.text();

  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  let songList = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songList.push(element.href);
    }
  }
  return songList;
}

function convertSecondsToMinSec(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
}

function extractFilename(urlOrFilename) {
  const match = urlOrFilename.match(/([^/]+)$/);
  return match ? match[1] : urlOrFilename;
}

const playMusic = (track, pause = false) => {
  currentSong.src = track;
  if (!pause) {
    currentSong.play();
    play.src = "images/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = extractFilename(track);
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

async function main() {
  songs = await getSongs();
  console.log(songs);
  if (songs.length > 0) {
    playMusic(songs[0], true);
  }

  let songUL = document.querySelector(".songList ul");
  songUL.innerHTML = songs.map(song => `
    <li>
      <img class="invert" src="images/music.svg" alt="">
      <div class="info">${extractFilename(song)}</div>
      <div class="playNow">
        <span>Play Now</span>
        <img class="invert" src="images/play.svg" alt="">
      </div>
    </li>
  `).join("");

  Array.from(document.querySelectorAll(".songList li")).forEach((li, index) => {
    li.addEventListener("click", () => playMusic(songs[index]));
  });

  document.getElementById("playButton").addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "images/play.svg";
    }
  });

  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width);
    currentSong.currentTime = percent * currentSong.duration;
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${convertSecondsToMinSec(currentSong.currentTime)} / ${convertSecondsToMinSec(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".playBar").style.bottom = "-120px";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
    document.querySelector(".playBar").style.bottom = "20px";
  });

  document.getElementById("previous").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src);
    if (index > 0) {
      playMusic(songs[index - 1]);
    } else {
      playMusic(songs[songs.length - 1]);
    }
  });

  document.getElementById("next").addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src);
    if (index < songs.length - 1) {
      playMusic(songs[index + 1]);
    } else {
      playMusic(songs[0]);
    }
  });

  document.querySelector(".volume input").addEventListener("change", (e) => {
    currentSong.volume = e.target.value / 100;
  });
}

main();
