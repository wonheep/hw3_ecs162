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

		script.src = beginning+query+callback;	
		script.id = "jsonpCall";

		// put new script into DOM at bottom of body
		document.body.appendChild(script);	
		}
	else
		emptyBookList();

}	


function handleResponse(bookListObj) {
	var bookList = bookListObj.items;

	/* where to put the data on the Web page */ 
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

			if (book.volumeInfo.hasOwnProperty('imageLinks')) {
				var images = book.volumeInfo.imageLinks.thumbnail;
			}

			var divPgh = document.createElement("div");
			var divimg = document.createElement("div");
			var divtext = document.createElement("div");
			var titlePgh = document.createElement("p");
			var authorPgh = document.createElement("p");
			var descriptionPgh = document.createElement("p");
			var imagePgh = document.createElement("img");
			var closeButton = document.createElement("button");		

			/* ALWAYS AVOID using the innerHTML property */
			divPgh.setAttribute("class", "each_Div");
			divimg.setAttribute("class", "each_divimage");
			divtext.setAttribute("class", "each_divtext");


			//give unique identifiers to each div. Starts from result1
			var divIdNumber = idNumberTracker();
			divPgh.id = "result"+divIdNumber;
			closeButton.textContent = "X";
			closeButton.id = "closeButton"+divIdNumber;
			closeButton.setAttribute("class", "closeButton");
			changeOnClick(closeButton,deleteTile,divIdNumber);

			titlePgh.textContent = title;
			titlePgh.setAttribute("class", "each_Title");

			authorPgh.textContent = "By "+author;
			authorPgh.setAttribute("class", "each_Author");

			descriptionPgh.textContent = description;
			imagePgh.src = images;
			imagePgh.setAttribute("alt", "img not found");
			imagePgh.setAttribute("class", "each_Image");


			descriptionPgh.setAttribute("class", "each_description");

			overlayInner.appendChild(divPgh).appendChild(divimg).appendChild(imagePgh);
			overlayInner.appendChild(divPgh).appendChild(divtext).appendChild(titlePgh);
			overlayInner.appendChild(divPgh).appendChild(divtext).appendChild(authorPgh);
			overlayInner.appendChild(divPgh).appendChild(divtext).appendChild(descriptionPgh);
   		    overlayInner.appendChild(divPgh).append(closeButton);
    		closeButton.style.display="none";

			divPgh.style.display="none";
		}	
		/*show first result*/
		var firstResult = document.getElementById("result1");
		var keepButton = document.getElementById("keepButton");
		var leftButton = document.getElementById("leftButton");
		var rightButton = document.getElementById("rightButton");
	
		rightButton.style.display="block";
		if(bookList.length == 1)
			rightButton.style.display="none";
		else
		{
			changeOnClick(rightButton,nextBook,1);
		}
		leftButton.style.display="none";

		firstResult.style.display="flex";
    	changeLandingPage();

		document.getElementById("overlay").style.display="flex";
		keepButton.textContent="Keep";
		changeOnClick(keepButton,keepBook,1);

	}
}
//changes from landing page view to tile page view
function changeLandingPage(){

	var bodyList = document.getElementsByTagName("body");
	var headerList = document.getElementsByTagName("h1");
	var mainInputsList = document.getElementsByClassName("main_inputs");

	var or = document.getElementsByClassName("or");
	var searchBy = document.getElementById("search_by");

	var mainInputs = mainInputsList[0];
	var searchButton = document.getElementById("searchButton");
	var main_f = document.getElementById("main_f");
	var bookDisplay = document.getElementById("bookDisplay");
	var allInputContainers = document.getElementById("allInputContainers");
	var headerAndMainInputs = document.getElementById("headerAndMainInputs");

	var body = bodyList[0];
	var header = headerList[0];


	or[0].style.display="none";
	or[1].style.display="none";
	searchBy.style.display="none";

	mainInputs.style.flexDirection="row";
	searchButton.style.alignSelf="flex-end";
	searchButton.style.marginBottom="10px";
	headerAndMainInputs.insertBefore(header,mainInputs);
	headerAndMainInputs.style.flexDirection="row";
	header.style.marginRight="75px";
	headerAndMainInputs.style.width="100%";
	header.style.whiteSpace="nowrap";
	headerAndMainInputs.style.marginTop="-20px";
	main_f.style.backgroundColor="#EDEDED";
}

function fancyJoin(a,b) {
    if (a == "") { return b; }	
    else if (b == "") { return a; }
    else { return a+"+"+b; }
}

/*display the message for no results found*/
function emptyBookList()
{
	//hide buttons
	document.getElementById("leftButton").style.display="none";
	document.getElementById("rightButton").style.display="none";
	var keepButton = document.getElementById("keepButton");
	keepButton.textContent="OK";
	keepButton.onclick=overlayGo;


	document.getElementById("overlay").style.display="flex";

	var divMsg = document.createElement("div");

	var title = document.createElement("p");
	var author = document.createElement("p");
	var isbn = document.createElement("p");
	var msg = document.createElement("div");
	var lineBreak = document.createElement("br");
	var another = document.createElement("p");

	var msgChild1 = document.createElement("p");
	var msgChild2 = document.createElement("p");
	var msgChild3 = document.createElement("p");
	var msgChild4 = document.createElement("p");

	var line1 = document.createElement("div");
	var line2 = document.createElement("div");
	var line3 = document.createElement("div");

	divMsg.id = "emptyMessage";
	title.setAttribute("class", "boldWords");
	author.setAttribute("class", "boldWords");
	isbn.setAttribute("class", "boldWords");

	divMsg.style.display="flex";
	divMsg.style.flexDirection="column";

	line1.style.display="flex";
	line2.style.display="flex";
	line3.style.display="flex";

	msg.style.display="flex";
	msg.style.flexDirection="column";
	msg.style.alignItems="center";

	msgChild1.style.whiteSpace="nowrap";
	msgChild2.style.whiteSpace="nowrap";
	msgChild3.style.whiteSpace="nowrap";
	msgChild4.style.whiteSpace="nowrap";
	isbn.style.whiteSpace="nowrap";

	title.textContent = inputVars.title;
	author.textContent = inputVars.author;
	isbn.textContent = inputVars.isbn;

	msgChild1.textContent = "The book ";
	msgChild2.textContent = " by ";
	msgChild3.textContent = " or ISBN number ";
	msgChild4.textContent = " could not be found.";

	another.textContent = "Try another search";


	document.getElementById("overlayInner").appendChild(divMsg).appendChild(msg).appendChild(line1).append(msgChild1);
	document.getElementById("overlayInner").appendChild(divMsg).appendChild(msg).appendChild(line1).append(title);
	document.getElementById("overlayInner").appendChild(divMsg).appendChild(msg).appendChild(line1).append(msgChild2);
	document.getElementById("overlayInner").appendChild(divMsg).appendChild(msg).appendChild(line1).append(author);
	document.getElementById("overlayInner").appendChild(divMsg).appendChild(msg).appendChild(line2).append(msgChild3);
	document.getElementById("overlayInner").appendChild(divMsg).appendChild(msg).appendChild(line2).append(isbn);
	document.getElementById("overlayInner").appendChild(divMsg).appendChild(msg).appendChild(line3).append(msgChild4);

	document.getElementById("overlayInner").appendChild(divMsg).append(lineBreak);
	document.getElementById("overlayInner").appendChild(divMsg).append(another);

}

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
	nextBookItem.style.display="flex";



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
	prevBookItem.style.display="flex";


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

function deleteTile(resultNumber){
	var book = document.getElementById("resultM"+resultNumber);
	bookDisplay.removeChild(book);
}

function keepBook(resultNumber){
	var bookDisplay = document.getElementById("bookDisplay");
	var book = document.getElementById("result"+resultNumber);
	var closeButton = document.getElementById("closeButton"+resultNumber);
	var overlayInner = document.getElementById("overlayInner");

	closeButton.style.display="block";
	book.id="resultM"+uniqueTileTracker();
	changeOnClick(closeButton,deleteTile,uniqueTileTracker.currentId);
	document.getElementById("overlay").style.display="none";
    book.classList.add("bookDisplayBook");

	if (window.matchMedia("(min-width: 481px)").matches)
        book.style.margin="30px";

	bookDisplay.appendChild(book);


	/*removes old search results*/
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

function uniqueTileTracker()
{
	if(typeof uniqueTileTracker.currentId == 'undefined')
		uniqueTileTracker.currentId = 1;
	else
		uniqueTileTracker.currentId++;
	return uniqueTileTracker.currentId;

}

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
