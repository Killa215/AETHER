const covers = document.querySelectorAll(".sound-card img")
const progress = document.getElementById("progress")
const startTime = document.getElementById("start-treck")
const endTime = document.getElementById("end-treck")
const previousButton = document.getElementById("previous-button")
const nextButton = document.getElementById("next-button")
const repeatButton = document.getElementById("repeat-button")
const shuffleButton = document.getElementById("shuffle-button")

const track = document.getElementById("current-track")
const artist = document.getElementById("current-artist")
const playButton = document.getElementById("play-button")

let isPlaying = false
let isRepiat = false
let isShuffle = false
let randomIndex

let currentIndex = 0
let currentTrack = {
  title: null,
  artist: null,
  src: null 
  }
const tracks = [
  {title: 'Midnight',
  artist: 'Author',
  src: "./audio/Баллада.mp3" },
  {title: 'djkfdjk',
  artist: 'asd',
  src: "./audio/Лужники.mp3" },
  {title: '123',
  artist: 'Weaee',
  src: "./audio/Marlboro.mp3" },
]

const audio = new Audio()
audio.addEventListener("ended", ()=> {
  if(isRepiat){
    playMusic(currentIndex)
  }else{
    currentIndex++
    if(currentIndex >= tracks.length){
      currentIndex = 0
    }
    playMusic(currentIndex)
  }
  
})
audio.addEventListener("loadedmetadata", ()=>{
  progress.max = audio.duration
  endTime.textContent = formatTime(audio.duration)
})
audio.addEventListener("timeupdate", ()=> {
  progress.value = audio.currentTime
  startTime.textContent = formatTime(audio.currentTime)
})
progress.addEventListener("input", ()=>{
  audio.currentTime = progress.value
})

function playMusic(index) {
  isPlaying = false
  currentIndex = index
  currentTrack = tracks[index]

  audio.src = currentTrack.src
  progress.value = 0
  startTime.textContent = "00:00"
  endTime.textContent = "00:00"
  audio.play()

  isPlaying = true

  track.textContent = currentTrack.title
  artist.textContent = currentTrack.artist
  playButton.textContent = '⏸ Pause'
}

function formatTime(second){
  if(Number.isFinite(second)){
    const minutes = Math.floor(second / 60)
    const seconds = Math.floor(second % 60)

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
  }
  else{
    return "00:00"
  }
}

previousButton.addEventListener("click", ()=> {
  currentIndex--
  if(currentIndex < 0){
    currentIndex = tracks.length - 1
  }
  playMusic(currentIndex)
});
nextButton.addEventListener("click", ()=> {
  if(isShuffle){
    do{
      randomIndex = Math.floor(Math.random() * tracks.length)
    }while(randomIndex === currentIndex)
    currentIndex = randomIndex
    playMusic(currentIndex)
  }else{
    currentIndex++
    if(currentIndex >= tracks.length){
      currentIndex = 0
    }
    playMusic(currentIndex)
  }
});
repeatButton.addEventListener("click", ()=>{
  if(isRepiat === false){
    isRepiat = true
  }else{
    isRepiat = false
  }
})
shuffleButton.addEventListener("click", ()=>{
  if(isShuffle === false){
    isShuffle = true
  }else{
    isShuffle = false
  }
})

covers.forEach((cover, index) => {
  cover.addEventListener("click", ()=> playMusic(index));
});

playButton.addEventListener("click", ()=>{
  if (currentTrack.title !== null) {
    if (isPlaying === false) {
    audio.play()
    isPlaying = true
    playButton.textContent = '⏸ Pause'  
    }else{
    audio.pause()
    isPlaying = false
    playButton.textContent = '▶ Play'
    }
  } else {
    console.log("Трек не выбран")
    return
  }
})