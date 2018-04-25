function newRequest() {

	var title = document.getElementById("title").value;
	title = title.trim();
	title = title.replace(" ","+");

	if(title === "")
		inputVars.title = "Title";
	else
		inputVars.title = title;

	var author = document.getElementById("author").value;
	author = author.trim();
	author = author.replace(" ","+");
	
	if(author === "")
		inputVars.author = "Author";
	else
		inputVars.author = author;

	var isbn = document.getElementById("isbn").value;
	isbn = isbn.trim();
	isbn = isbn.replace("-","");

	if(isbn === "")
		inputVars.isbn = "000-0-00-000000-0";
	else
		inputVars.isbn = isbn;

	var query = ["",title,author,isbn].reduce(fancyJoin);

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
	//var bookDisplay = document.getElementById("bookDisplay");
	var overlayInner = document.getElementById("overlayInner");

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
			//if(typeof book.volumeInfo.imagesLinks != 'undefined')
			var images = book.volumeInfo.imageLinks.thumbnail;
			
			var divPgh = document.createElement("div");
			var titlePgh = document.createElement("p");
			var authorPgh = document.createElement("p");
			var descriptionPgh = document.createElement("p");
			var imagePgh = document.createElement("img");

			/* ALWAYS AVOID using the innerHTML property */
			divPgh.setAttribute("class", "each_Div");

			//give unique identifiers to each div. Starts from result1
			divPgh.id ="result"+idNumberTracker();
			titlePgh.textContent = title;
			titlePgh.setAttribute("class", "each_Title");
			authorPgh.textContent = author;
			titlePgh.setAttribute("class", "each_Author");
			descriptionPgh.textContent = description;
			imagePgh.src = images;
			imagePgh.setAttribute("alt", "img not found");
			titlePgh.setAttribute("class", "each_Image");

			//divPgh.onclick= showDivOverlay;
			overlayInner.appendChild(divPgh).append(imagePgh);
			overlayInner.appendChild(divPgh).append(titlePgh);
			overlayInner.appendChild(divPgh).append(authorPgh);
			overlayInner.appendChild(divPgh).append(descriptionPgh);
			divPgh.style.display="none";
		}	
		/*show first result*/
		var firstResult = document.getElementById("result1");
		var keepButton = document.getElementById("keepButton");
		var leftButton = document.getElementById("leftButton");
		var rightButton = document.getElementById("rightButton");
	
		if(bookList.length == 1)
			rightButton.style.display="none";
		else
		{
			changeOnClick(rightButton,nextBook,1);
		}
		leftButton.style.display="none";
		firstResult.style.display="block";
		document.getElementById("overlay").style.display="flex";
		changeOnClick(keepButton,keepBook,1);

	}
}

function fancyJoin(a,b) {
    if (a == "") { return b; }	
    else if (b == "") { return a; }
    else { return a+"+"+b; }
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
	var msg2 = document.createElement("p");
	var lineBreak = document.createElement("br");
	var another = document.createElement("p");
	var bold = document.createElement("b");

	divMsg.id = "emptyMessage";
	
	msg2.textContent = inputVars.title;
	msg2.style.fontWeight = "bold";
	/*TODO fix bold of authors,title,isbn*/
	msg.textContent = "The book " + msg2.textContent.bold() + " by " + inputVars.author + " or ISBN number " + inputVars.isbn + " could not be found.";


	another.textContent = "Try another search";
	document.getElementById("overlayInner").appendChild(divMsg).append(msg);
	document.getElementById("overlayInner").appendChild(divMsg).append(lineBreak);
	document.getElementById("overlayInner").appendChild(divMsg).append(another);

}

/*clone the div clicked and add it into the overlay*/
/*
function showDivOverlay(){
	//remove old overlay node
	var overlayInner = document.getElementById("overlayInner");
  overlayInner.removeChild(overlayInner.firstChild);
	var div = this;
	var divClone = div.cloneNode(true);
	document.getElementById("overlay").style.display="flex";
	document.getElementById("overlayInner").appendChild(divClone);
}
*/

/*resultNumber is the id number of the current book
  nextbook updates the current tile to the nextbook
  updates right button to point to book after next book, if exists
  updates left button to point to current book
  updates keep button to point to next book*/
function nextBook(resultNumber)
{

	var rightButton = document.getElementById("rightButton");
	var leftButton = document.getElementById("leftButton");
	var curBookItem = document.getElementById("result"+resultNumber);
	var nextBookItem = document.getElementById("result"+(resultNumber+1));
	
	curBookItem.style.display="none";
	nextBookItem.style.display="block";


	//new right button, no button if nextBook is last item in list
	if(document.getElementById("overlayInner").childElementCount <= resultNumber+1)
		rightButton.style.display="none";
	else
		changeOnClick(rightButton,nextBook,resultNumber+1);


	//new left button
	leftButton.style.display="block";
	changeOnClick(leftButton,prevBook,resultNumber+1);

	//new keep button
	changeOnClick(keepButton,keepBook,resultNumber+1);

}

/*resultNumber is the id number of the current book
  prevBook updates the current tile to the previous book
  updates right button to point to current book
  updates left button to point to book before previous book, if exists
  updates keep button to point to previous book*/
function prevBook(resultNumber)
{
	var rightButton = document.getElementById("rightButton");
	var leftButton = document.getElementById("leftButton");
	var curBookItem = document.getElementById("result"+resultNumber);
	var prevBookItem = document.getElementById("result"+(resultNumber-1));
	
	curBookItem.style.display="none";
	prevBookItem.style.display="block";

	//new right button
	rightButton.style.display="block";
	changeOnClick(rightButton,nextBook,resultNumber-1);

	//new left button
	if(resultNumber-1 == 1)
		leftButton.style.display="none";
	else
		changeOnClick(leftButton,prevBook,resultNumber-1);
	//new keep button
	changeOnClick(keepButton,keepBook,resultNumber-1);
}

//X button on tile
function removeTile(){

}

//X button on overlay
function overlayGo(){
	document.getElementById("overlay").style.display="none";

	/*removes old search results*/
	var overlayInner = document.getElementById("overlayInner");
	if(overlayInner.childElementCount != 0)
	{
		while(overlayInner.firstChild)
		{
			overlayInner.removeChild(overlayInner.firstChild);
		}
	}
	//reset the result number tracker after keep
	idNumberTracker.currentId = 0;
}

function changeOnClick(element,func,param){
	function noarg(){
		func(param);
	}
	element.onclick = noarg;
}

function keepBook(resultNumber){
	var bookDisplay = document.getElementById("bookDisplay");
	var book = document.getElementById("result"+resultNumber);
	document.getElementById("overlay").style.display="none";
	bookDisplay.appendChild(book);


	//modify below for overlayInner
	/*removes old search results*/
	var overlayInner = document.getElementById("overlayInner");
	if(overlayInner.childElementCount != 0)
	{
		while(overlayInner.firstChild)
		{
			overlayInner.removeChild(overlayInner.firstChild);
		}
	}
	//reset the result number tracker after keep
	idNumberTracker.currentId = 0;
}

/*
function keepBook(){
	
	var bookDisplay = document.getElementById("bookDisplay");
	var div = this;
	var divClone = div.cloneNode(true);
	document.getElementById("overlay").style.display="none";
	bookDisplay.appendChild(divClone);
		//removes old search results
		
		var bookDisplay = document.getElementById("bookDisplay");
		if(bookDisplay.childElementCount != 0)
		{
			while(bookDisplay.firstChild)
			{
				bookDisplay.removeChild(bookDisplay.firstChild);
			}
		}
		
}
*/

function idNumberTracker(){
	if(typeof idNumberTracker.currentId == 'undefined')
		idNumberTracker.currentId = 1;
	else
		idNumberTracker.currentId++;
	return idNumberTracker.currentId;
}

/*storing input values without the use of global variables */
function inputVars(){
  this.title;
  this.author;
  this.isbn;
}