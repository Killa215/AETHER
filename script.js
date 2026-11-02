const covers = document.querySelectorAll(".sound-card img");
 
function playMusic(event) {
  const card = event.currentTarget.parentElement
  console.log(card.dataset.track);
}

covers.forEach((cover) => {

  cover.addEventListener("click", playMusic);
});
