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

var targets = document.querySelectorAll('.draggable');
for (t of targets) {
	t.addEventListener('mousedown', (event) => {
		var css = document.createElement('style');
		css.type = 'text/css';
		css.classList.add('cursor-style');
		css.innerHTML = '* {cursor: grabbing !important;}';
		document.body.appendChild(css);
	});

	t.addEventListener('mouseup', (event) => {
		var styles = document.querySelectorAll('.cursor-style');
		for (s of styles) { s.remove(); }
	});	
}