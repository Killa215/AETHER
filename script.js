const covers = document.querySelectorAll(".sound-card img")
const progress = document.getElementById("progress")
const startTime = document.getElementById("start-treck")
const endTime = document.getElementById("end-treck")
const previousButton = document.getElementById("previous-button")
const nextButton = document.getElementById("next-button")
const repeatButton = document.getElementById("repeat-button")
const shuffleButton = document.getElementById("shuffle-button")
const currentCover = document.getElementById("current-cover")
const playerStatus = document.getElementById("player-status")
const muteButton = document.getElementById("mute-button")
const volume = document.getElementById("volume")
const muteIcon = document.querySelector(".mute-icon") 
const playerTrack = document.querySelector(".player-track") 


const track = document.getElementById("current-track")
const artist = document.getElementById("current-artist")
const playButton = document.getElementById("play-button")

let isPlaying = false
let isRepeat = false
let isShuffle = false
let randomIndex

let currentIndex = 0
let currentTrack = {
  title: null,
  artist: null,
  src: null 
  }
const tracks = [
  {title: 'Баллада',
  artist: 'Xcho и Мот',
  src: "./audio/Баллада.mp3" },
  {title: 'Лужники',
  artist: 'Basta, Guf ',
  src: "./audio/Лужники.mp3" },
  {title: 'Marlboro',
  artist: 'Miyagi',
  src: "./audio/Marlboro.mp3" },
]

const audio = new Audio()
audio.volume = 0.5
volume.style.background =`
  linear-gradient(
    to right,
    var(--blue) 50%,
    rgba(255,255,255,0.15) 50%
`

audio.addEventListener("play", ()=>{
  isPlaying = true
  playButton.textContent = '⏸ Pause'
})
audio.addEventListener("pause", ()=>{
  isPlaying = false
  playButton.textContent = '▶ Play'
})
audio.addEventListener("playing", ()=>{
  playerTrack.classList.remove("loading")
})
audio.addEventListener("error", ()=>{
  isPlaying = false
  playButton.textContent = '▶ Play'

  playerStatus.textContent = "Не удавлось загрузить аудиофайл"
})
audio.addEventListener("ended", ()=> {
  if(isRepeat){
    playMusic(currentIndex)
  }else{
    if(isShuffle){
      playRandomTrack()
    }else{
      currentIndex++
      if(currentIndex >= tracks.length){
        currentIndex = 0
      }
      playMusic(currentIndex)
    }
  }
})
audio.addEventListener("loadedmetadata", ()=>{
  progress.max = audio.duration
  endTime.textContent = formatTime(audio.duration)
})

function updateProgress(){
  const percent = (audio.currentTime / audio.duration) * 100
  progress.style.setProperty("--progress", `${percent}%`)
}

audio.addEventListener("timeupdate", ()=> {
  progress.value = audio.currentTime
  startTime.textContent = formatTime(audio.currentTime)
  updateProgress()
})
progress.addEventListener("input", ()=>{
  audio.currentTime = progress.value
})

function playMusic(index) {
  playerTrack.classList.add("loading")
  currentIndex = index
  currentTrack = tracks[index]
  
  currentCover.src = covers[index].src
  audio.src = currentTrack.src
  progress.value = 0
  startTime.textContent = "00:00"
  endTime.textContent = "00:00"
  audio.play().catch(error => {
    console.error("Ошибка воспроизведения:", error);
  })

  track.textContent = currentTrack.title
  artist.textContent = currentTrack.artist
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

function playRandomTrack(){
  if(tracks.length <=1) return
  do{
    randomIndex = Math.floor(Math.random() * tracks.length)
  }while(randomIndex === currentIndex)
  currentIndex = randomIndex
  playMusic(currentIndex)
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
    playRandomTrack()
  }else{
    currentIndex++
    if(currentIndex >= tracks.length){
      currentIndex = 0
    }
    playMusic(currentIndex)
  }
});
repeatButton.addEventListener("click", ()=>{
  isRepeat = !isRepeat
  repeatButton.classList.toggle("active")
})
shuffleButton.addEventListener("click", ()=>{
  isShuffle = !isShuffle
  shuffleButton.classList.toggle("active")
})

covers.forEach((cover, index) => {
  cover.addEventListener("click", ()=> playMusic(index));
});

playButton.addEventListener("click", ()=>{
  if (currentTrack.title === null) return
  if (isPlaying){
    audio.pause()
  }else {
    audio.play().catch(error => {
      console.error("Ошибка воспроизведения:", error);
    })
  }
})

function updateVolumeIcon(){
  if(audio.muted || audio.volume === 0){
    muteIcon.src = "./icon/mute.png"
  }else{
    muteIcon.src = "./icon/music.png"
  }
}

function updateVolumeSlider(){
  const value = Number(volume.value) * 100
  volume.style.background = `
  linear-gradient(
    to right,
    var(--blue) ${value}%,
    rgba(255,255,255,0.15) ${value}%
  )`
}
updateVolumeSlider()

volume.addEventListener("input", ()=>{
  updateVolumeSlider()
  audio.volume = Number(volume.value)

  if (audio.volume > 0){
    audio.muted = false
  }

  updateVolumeIcon()
})

muteButton.addEventListener("click", ()=>{
  audio.muted = !audio.muted
  updateVolumeIcon()
})