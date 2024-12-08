function toggleDetails(obj) {
  var card = obj.closest(".card");
  card.classList.toggle("active");
  var details = obj.closest(".review").querySelector("details");
  for (let dtls of document.querySelectorAll("article details[open]")) {
    if (dtls != details) {
      dtls.open = false;
      dtls.closest(".review").querySelector(".card").classList.remove("active");
    }
  }
  details.open = !details.open;
}