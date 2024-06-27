let currentSong = new Audio();
let songs;

// Convert seconds to min:sec format
function convertSecondsToMinSec(seconds) {
  let minutes = Math.floor(seconds / 60);
  let remainingSeconds = seconds % 60;
  minutes = parseInt(minutes);
  remainingSeconds = parseInt(remainingSeconds);

  const formattedSeconds =
    remainingSeconds < 10 ? "0" + remainingSeconds : remainingSeconds;

  return `${minutes}:${formattedSeconds}`;
}

function extractFilename(urlOrFilename) {
  const match = urlOrFilename.match(/([^/]+)$/);
  if (match) {
    return match[1];
  }
  return urlOrFilename;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/SpotifyClone/tree/main/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/tree/main/${folder}/`)[1]);
    }
  }

  let songUL = document.querySelector(".songList ul");
  songUL.innerHTML = "";

  for (const song of songs) {
    songUL.innerHTML += `
      <li>
        <img class="invert" src="/SpotifyClone/images/music.svg" alt="">
        <div class="info">
          <div>${song.replace("https://tanmayhh3009.github.io/SpotifyClone/songs/", " ")}</div>
        </div>
        <div class="playNow">
          <span>Play Now</span>
          <img class="invert" src="/SpotifyClone/images/play.svg" alt="">
        </div>
      </li>`;

    Array.from(document.querySelector(".songList li")).forEach((e) => {
      e.addEventListener("click", (element) => {
        console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
      });
    });
  }
  return songs;
}

const playMusic = (track, pause = false) => {
  currentSong.src = `${currFolder}/` + track;
  if (!pause) {
    currentSong.play();
    play.src = "/SpotifyClone/images/pause.svg";
  }

  document.querySelector(".songInfo").innerHTML = track;
  document.querySelector(".songTime").innerHTML = "00:00/00:00";
};

async function displayAlbums() {
  let a = await fetch(`/SpotifyClone/tree/main/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardContainer = document.querySelector(".cardContainer");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split("/").slice(-1)[0];
      let a = await fetch(`/SpotifyClone/blob/main/songs/${folder}/info.json`);
      let response = await a.json();
      cardContainer.innerHTML += `<div data-folder=${folder} class="cards">
        <div class="play">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="black">
            <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" stroke-width="1.5" stroke-linejoin="round" fill="black"/>
          </svg>
        </div>
        <img src="/SpotifyClone/songs/${folder}/cover.jpeg" alt="">
        <h2>${response.title}</h2>
        <p>${response.singers}</p>
      </div>`;
    }
  }

  Array.from(document.getElementsByClassName("cards")).forEach(e => {
    e.addEventListener("click", async item => {
      console.log(item.currentTarget, item.currentTarget.dataset.folder);
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
      playMusic(songs[0]);
      console.log(songs, item.currentTarget.dataset.folder);
    });
  });
}

async function main() {
  await getSongs("/SpotifyClone/songs/Ashique2");
  console.log(songs, extractFilename(songs[0]));
  playMusic(extractFilename(songs[0]), true);

  displayAlbums();

  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "/SpotifyClone/images/pause.svg";
    } else {
      currentSong.pause();
      play.src = "/SpotifyClone/images/play.svg";
    }
  });

  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${convertSecondsToMinSec(
      currentSong.currentTime
    )} / ${convertSecondsToMinSec(currentSong.duration)}`;
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".playBar").style.bottom = "-120px";
  });

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
    document.querySelector(".playBar").style.bottom = "20px";
  });

  let previous = document.getElementsByClassName("prev")[0];
  previous.addEventListener("click", () => {
    currentSong.pause();
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(extractFilename(songs[index - 1]));
    } else {
      playMusic(extractFilename(songs[songs.length - 1]));
    }
  });

  let next = document.getElementsByClassName("next")[0];
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(extractFilename(songs[index + 1]));
    } else {
      playMusic(extractFilename(songs[0]));
    }
  });

  document.querySelector(".volume input").addEventListener("change", e => {
    currentSong.volume = parseInt(e.target.value) / 100;
    if (currentSong.volume == 0) {
      document.getElementById("v").src = "/SpotifyClone/images/mute.svg";
    } else {
      document.getElementById("v").src = "/SpotifyClone/images/volume.svg";
    }
  });

  document.getElementById("v").addEventListener("click", e => {
    if (e.target.src.includes("volume.svg")) {
      e.target.src = "/SpotifyClone/images/mute.svg";
      currentSong.volume = 0;
    } else {
      e.target.src = "/SpotifyClone/images/volume.svg";
      currentSong.volume = 0.1;
    }
  });
}

main();
