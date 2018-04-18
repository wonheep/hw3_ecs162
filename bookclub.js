

function newRequest() {

	var title = document.getElementById("title").value;
	title = title.trim();
	title = title.replace(" ","+");
	
	var author = document.getElementById("author").value;
	author = author.trim();
	author = author.replace(" ","+");

	var isbn = document.getElementById("isbn").value;
	isbn = isbn.trim();
	isbn = isbn.replace("-","");


	var query = ["",title,author,isbn].join("+");
	if (query != "") {

		// remove old script
		var oldScript = document.getElementById("jsonpCall");
		if (oldScript != null) {
			document.body.removeChild(oldScript);
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
	for (i=0; i<bookList.length; i++) {
		var book = bookList[i];
		var title = book.volumeInfo.title;
		var author = book.volumeInfo.authors;
		var description = book.volumeInfo.description;
		var images = book.volumeInfo.imageLinks.thumbnail;

		var divPgh = document.createElement("div");
		var titlePgh = document.createElement("p");
		var authorPgh = document.createElement("p");
		var descriptionPgh = document.createElement("p");
		var imagePgh = document.createElement("img");

		/* ALWAYS AVOID using the innerHTML property */
		titlePgh.textContent = title;
		authorPgh.textContent = author;
		descriptionPgh.textContent = description;
		imagePgh.src = images;
		imagePgh.setAttribute("alt", "img not found");

		bookDisplay.append(titlePgh);
		bookDisplay.append(authorPgh);
		bookDisplay.append(descriptionPgh);
		bookDisplay.append(imagePgh);
	}	
}


