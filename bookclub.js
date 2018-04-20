var globalTitle;
var globalAuthor;
var globalIsbn;

function newRequest() {

	var title = document.getElementById("title").value;
	title = title.trim();
	title = title.replace(" ","+");

	if(title === "")
		globalTitle = "Title";
	else
		globalTitle = title;

	var author = document.getElementById("author").value;
	author = author.trim();
	author = author.replace(" ","+");
	
	if(author === "")
		globalAuthor = "Author";
	else
		globalAuthor = author;

	var isbn = document.getElementById("isbn").value;
	isbn = isbn.trim();
	isbn = isbn.replace("-","");

	if(isbn === "")
		globalIsbn = "000-0-00-000000-0";
	else
		globalIsbn = isbn;

	var query = ["",title,author,isbn].join("+");

	if (query != "") {

		// remove old script
		var oldScript = document.getElementById("jsonpCall");
		if (oldScript != null) {
			document.body.removeChild(oldScript);
		}

		/*removes old search results*/
		var bookDisplay = document.getElementById("bookDisplay");
		if(bookDisplay.childElementCount != 0)
		{
			while(bookDisplay.firstChild)
			{
				bookDisplay.removeChild(bookDisplay.firstChild);
			}
		}
		

		// make a new script element
		var script = document.createElement('script');

		// build up complicated request URL
		var beginning = "https://www.googleapis.com/books/v1/volumes?q="
		var callback = "&callback=handleResponse"

		script.src = beginning+query+callback	
		script.id = "jsonpCall";

		// put new script into DOM at bottom of body
		document.body.appendChild(script);	
		}

}	


function handleResponse(bookListObj) {
	var bookList = bookListObj.items;

	/* where to put the data on the Web page */ 
	var bookDisplay = document.getElementById("bookDisplay");

	/* write each title, author, description, and  as a new paragraph */
	if(typeof bookList == 'undefined')
		emptyBookList();
	else{

		for (i=0; i<bookList.length; i++) {
			var book = bookList[i];

			var title = book.volumeInfo.title;
			var author = book.volumeInfo.authors;
			var description = book.volumeInfo.description;

			//TODO handle cases for thumbnail being undefined
			var images = book.volumeInfo.imageLinks.thumbnail;

			var divPgh = document.createElement("div");
			var titlePgh = document.createElement("p");
			var authorPgh = document.createElement("p");
			var descriptionPgh = document.createElement("p");
			var imagePgh = document.createElement("img");

			/* ALWAYS AVOID using the innerHTML property */
			divPgh.setAttribute("class", "each_Div");

			//give unique identifiers to each div. Starts from result0
			divPgh.id ="result"+idNumberTracker();
			titlePgh.textContent = title;
			titlePgh.setAttribute("class", "each_Title");
			authorPgh.textContent = author;
			titlePgh.setAttribute("class", "each_Author");
			descriptionPgh.textContent = description;
			imagePgh.src = images;
			imagePgh.setAttribute("alt", "img not found");
			titlePgh.setAttribute("class", "each_Image");

			/*TODO divPgh is evaluated after the click, not during assignment.
			 all onclicks show the last result currently*/
			divPgh.onclick= showDivOverlay;

			bookDisplay.appendChild(divPgh).append(titlePgh);
			bookDisplay.appendChild(divPgh).append(authorPgh);
			bookDisplay.appendChild(divPgh).append(descriptionPgh);
			bookDisplay.appendChild(divPgh).append(imagePgh);
		}	
	}
}

/*display the message for no results found*/
function emptyBookList()
{
	/*remove old overlay node*/
	var overlayInner = document.getElementById("overlayInner");
	overlayInner.removeChild(overlayInner.firstChild);

	document.getElementById("overlay").style.display="flex";
	var divMsg = document.createElement("div");
	var msg = document.createElement("p");
	var lineBreak = document.createElement("br");
	var another = document.createElement("p");

	divMsg.id = "emptyMessage";
	msg.textContent = "The book " + globalTitle.bold() + " by " + globalAuthor.bold() + " or ISBN number " + globalIsbn.bold() + " could not be found. "
	another.textContent = "Try another search";
	document.getElementById("overlayInner").appendChild(divMsg).append(msg);
	document.getElementById("overlayInner").appendChild(divMsg).append(lineBreak);
	document.getElementById("overlayInner").appendChild(divMsg).append(another);

}

/*clone the div clicked and add it into the overlay*/
function showDivOverlay(){

	/*remove old overlay node*/
	var overlayInner = document.getElementById("overlayInner");
	overlayInner.removeChild(overlayInner.firstChild);

	var div = this;
	var divClone = div.cloneNode(true);
	document.getElementById("overlay").style.display="flex";
	document.getElementById("overlayInner").appendChild(divClone);
}

function overlayGo(){
	document.getElementById("overlay").style.display="none";
}

function idNumberTracker(){
	if(typeof idNumberTracker.currentId == 'undefined')
		idNumberTracker.currentId = 0;
	else
		idNumberTracker.currentId++;
	return idNumberTracker.currentId;
}
