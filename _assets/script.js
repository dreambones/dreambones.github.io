var domainRe = /https?:\/\/.+\.neocities\.org\/(.+).*/i
try { var page = document.URL.match(domainRe)[1]; }
catch (TypeError) { var page = "home"; }

var tagsSorted = false;
var originalElement = null;

window.onload = function () { loadContent() };

function loadSectionLinks() {
  let sections = document.querySelectorAll("main :is(h1, h2)");
  for (let sec of sections) {
    if (sec.id != "") {
      let link = document.createElement("a");
      link.classList.add("section-link");
      link.innerText = "#";
      link.href = `#${sec.id}`;
      sec.insertBefore(link, sec.children[0]);
    }
  }
}

function createPageNav() {
  let sections = document.querySelectorAll("main h1");
  if (sections.length >= 3) {
    let nav = document.createElement("article");
    let list = document.createElement("ol");
    //nav.style.fontFamily = "ConcertOne, sans-serif";
    nav.style.fontSize = "1.15em";
    list.style.margin = 0;
    for (let sec of sections) {
      sec.id = `section-${sec.innerHTML}`
      let item = document.createElement("li");
      let link = document.createElement("a");
      link.innerText = sec.innerHTML;
      link.href = `#section-${sec.innerHTML}`;
      item.append(link);
      list.append(item);
    }
    nav.append(list);
    let main = document.querySelector("main");
    let heading = document.createElement("h2");
    heading.innerText = "Navigation";
    main.insertBefore(nav, main.children[0]);
    main.insertBefore(heading, main.children[0]);
  }
}

function loadContent() {
  //createPageNav();
  loadSectionLinks();
  loadSpoilers();
  loadCitations();
  loadTags();
  if (document.querySelector("#lightbox")) { loadLightbox(); }
}

function loadCitations() {
  var alphabet = "abcdefghijklmnopqrstuvwxyz"; // I prefer this over some char code fuckery to get the next letter.
  var refsCites = {};
  var references = document.querySelectorAll("ol#reference-list > li");
  for (let ref = 0; ref < (references.length); ref++) {
    references[ref].id = `reference-no${ref+1}`;
    refsCites[ref+1] = [];
  }
  var citations = document.querySelectorAll(".cite");
  for (let cite = 0; cite < (citations.length); cite++) {
    var dupeCites = 0;
    var refNo = citations[cite].innerHTML.match(/\d+/i);
    citations[cite].id = `citation-no${cite+1}`;
    citations[cite].href = `#reference-no${refNo}`;
    var reference = document.querySelector(`li#reference-no${refNo}`);
    refsCites[refNo].push(cite);
    dupeCites = refsCites[refNo].length-1;
    var splitIndex = reference.innerHTML.search(/(<\/sup>)(?= (?!<).+)/);
    if (splitIndex != -1) {
      let text = splitAtIndex(reference.innerHTML, splitIndex+6);
      reference.innerHTML = `${text[0]} <sup><a href="#citation-no${cite+1}">${alphabet[dupeCites]}</a></sup> ${text[1]}`;
    }
    else {
      reference.innerHTML = `<sup><a href="#citation-no${cite+1}">a</a></sup> ${reference.innerHTML}`;
    }
  }
}

function splitAtIndex(value, index) {
  return [value.substring(0, index), value.substring(index)];
}

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

function loadTags() {
  var tags = [];
  var buttons = document.querySelectorAll("div.tags button");
  for (let button of buttons) {
    tags.push(button.innerHTML);
  }
  var uniqueTags = [...new Set(tags)]; // https://stackoverflow.com/questions/9229645/remove-duplicate-values-from-js-array
  uniqueTags.sort();
  var mainTags = document.querySelector("div.tags"); // Just getting the first occurence.
  for (let tag of uniqueTags) {
    let button = document.createElement("button");
    button.setAttribute("onClick", "sortByTag(this)");
    button.innerHTML = tag;
    mainTags.appendChild(button);
  }
}

function sortByTag(obj) {
	//var countText = document.getElementById("selection-count");
	if (!tagsSorted) {
		disableButtons(obj);
		colorSwitch(obj);
		tagsSorted = true;
		sortPage(obj.innerHTML);
		//countText.innerHTML = `${tagCount.replace(/[{}]/g, "")} item(s) selected`;
		//countText.style.visibility = "visible";
	}
	else {
	  var container = document.querySelector("div.block-list");
	  clearFilter(container, originalElement);
		enableButtons();
		colorSwitch(obj);
		tagsSorted = false;

		//countText.style.visibility = "hidden";
		
	}
}

function disableButtons(obj) {
	const buttons = document.querySelectorAll("div.tags > button");
	for (const button of buttons) {
		if (button != obj) {
			button.disabled = true;
        }
    }
}

function enableButtons() {
	const buttons = document.querySelectorAll("div.tags > button");
	for (const button of buttons) {
		button.disabled = false;
		button.style.opacity = "";
	}
}

function sortPage(sortTag) {
  var container = document.querySelector("div.block-list");
  originalElement = container.cloneNode(true);
  var items = document.querySelectorAll("div.block-list article");
  var matched = document.createElement("div");
  matched.id = "matching-items";
  container.insertBefore(matched, container.children[0]);
  for (let item of items) {
    var buttons = item.querySelectorAll("div.tags > button");
    let match = false;
    for (let button of buttons) {
      if (button.innerHTML == sortTag) {
        button.style.borderColor = "#33c764";
        button.style.color = "#33c764";
        matched.appendChild(item);
        match = true;
      }
    }
    if (!match) {
      item.style.opacity = "0.33";
    }
  }
}

function clearFilter(node, original) {
  node.replaceWith(original);
}

function loadSpoilers() {
  var spoilers = document.querySelectorAll(".spoiler");
  for (let spoiler of spoilers) {
    spoiler.setAttribute("onClick", "revealSpoiler(this)");
    spoiler.setAttribute("title", "Click to reveal spoiler!");
  }
}

function revealSpoiler(obj) {
  if (obj.nodeName == "SPAN") {
    obj.style.backgroundColor = "#150c39";
    obj.style.padding = "3px";
  }
  obj.classList.remove("spoiler");
}

function openNavigation(button) {
  var navigation = document.querySelector("#sidebar");
  navigation.style.display = "block";
  document.querySelector("body").style.overflow = "hidden";
  button.setAttribute("onClick", "closeNavigation(this)");
  button.innerHTML = "✕";
  colorSwitch(button);
}

function closeNavigation(button) {
  var navigation = document.querySelector("#sidebar");
  navigation.style.display = "none";
  document.querySelector("body").style.overflow = "initial";
  button.setAttribute("onClick", "openNavigation(this)");
  button.innerHTML = "☰";
  colorSwitch(button);
}

function colorSwitch(obj) {
  var backgroundColor = window.getComputedStyle(obj, null).getPropertyValue("background-color");
  var color = window.getComputedStyle(obj, null).getPropertyValue("color");
  obj.style.backgroundColor = color;
  obj.style.color = backgroundColor;
}

function loadLightbox() {
  var images = document.querySelectorAll("main img")
  for (let image of images) {
    image.style.cursor = "zoom-in";
    image.setAttribute("onClick", "openLightbox(this)");
  }
}

function openLightbox(obj) {
	var lightbox = document.querySelector("#lightbox");
	var content = document.querySelector("#lightbox img");
	var caption = document.querySelector("#lightbox figcaption");
	var date = obj.getAttribute("data-date");
	lightbox.style.display = "flex";
	content.src = obj.src.replace("thumbnails/", "");
	caption.innerHTML = date;
}

function closeLightbox() {
	if (event.target != event.currentTarget) return; // Making it so it only works on the parent container.
	var lightbox = document.querySelector("#lightbox");
	lightbox.style.display = "none";
}