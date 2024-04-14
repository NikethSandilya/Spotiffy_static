console.log("Starting Java Script");
let currentSong = new Audio();
let songs;
function convertSecondsToMinutesAndSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "Invalid input";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

// Example usage:
const totalSeconds = 125;
const formattedTime = convertSecondsToMinutesAndSeconds(totalSeconds);
console.log(formattedTime); // Output: "02:05"

async function getSongs() {
    let a = await fetch("http://127.0.0.1:5500/audio/");
    let responces = await a.text();
    // currentSong.src="/audio/%5BiSongs.info%5D%200"+songs[0];
    console.log(responces);
    let div = document.createElement("div");
    div.innerHTML = responces;
    let as = div.getElementsByClassName("icon icon icon-mp3 icon-default");
    var songs = [];
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split("%200")[1]);
        }
    }
    return songs;

}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/audio/%5BiSongs.info%5D%200" + track);
    currentSong.src = "/audio/%5BiSongs.info%5D%200" + track;
    if (!pause) {
        currentSong.play();
        play.src = "images/pause.svg";
    }
    //it help in keeping of currently updating
    // console.log(audio);
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    // document.querySelector(".songtime").innerHTML="00:00/00:00";
}

async function main() {

    //Get the list of all the songs present in directly
    songs = await getSongs();
    // console.log(songs);
    playMusic(songs[0], true);
    // Show all the songs in play list
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0];
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>  
        <img src="images/music.svg" alt="">
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Jai Shree Ram</div>
                            </div>
                            <div>
                            <img src="images/play.svg" alt="">
                            </div> </li>`;
    }

    //Attach a event listner to each song
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    })

    //Attach a event listener to next and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "images/pause.svg";
        }
        else {
            currentSong.pause();
            play.src = "images/play.svg";
        }
    })

    //Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        // console.log(currentSong.currentTime, currentSong.duration);
        document.querySelector(".songtime").innerHTML = `${convertSecondsToMinutesAndSeconds(currentSong.currentTime)}/${convertSecondsToMinutesAndSeconds(currentSong.duration)}`;
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //Add event listner to seek bar
    document.querySelector(".seekbar").addEventListener("click", e => {
        // console.log((e.offsetX / e.target.getBoundingClientRect().width) * 100);//getBoundingClientRect() function helps in understanding the width and repectivity corrdinates
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100;
    })

    //Add a event listner to pervoius and next
    let index;
    previous.addEventListener("click", ()=>{
        console.log("previous is clicked");
        index = songs.indexOf(currentSong.src.split("%200")[1]);
        if((index-1)>=0){
            playMusic(songs[index-1]);
        }
        else{
            index=songs.length-1;
            playMusic(songs[index]);
        } 
        
       
    })

    next.addEventListener("click", ()=>{
        index = songs.indexOf(currentSong.src.split("%200")[1]);
        if((index+1)<songs.length){
            playMusic(songs[index+1]);
        }
        else{
            index=0;
            playMusic(songs[index]);
        }
    })

    //Add a event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100;
    })

}

main();