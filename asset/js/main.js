const UNCOMPLETED_LIST_BOOK_ID = "incompleteBookshelfList";
const COMPLETED_LIST_BOOK_ID = "completeBookshelfList";
const BOOK_ITEMID = "itemId";
const searchButton = document.getElementById("searchSubmit");

function makeBook(title, author, year, isCompleted) {
  const textTitle = document.createElement("h3");
  textTitle.innerText = title;
  const textAuthor = document.createElement("p");
  textAuthor.innerText = "Author: " +  author;
  const textYear = document.createElement("p");
  textYear.innerText = "Year: " + year;
  const buttonSection = document.createElement("div");
  buttonSection.classList.add("action");
  const textbookItem = document.createElement("article");
  textbookItem.classList.add("book_item");
  const formData = document.createElement("div");
  formData.className = "formdata";
  formData.innerHTML +=
    `<form class="book_edit">
      <div class="input">
        <label>Tilte</label>
        <input class="input-edit" value="` + title + `" type="text" id="titleEdit">
      </div>
      <div class="input">
        <label>Author</label>
        <input class="input-edit" value="` + author + `" type="text" id="authorEdit">
      </div>
      <div class="input">
        <label>Year</label>
        <input class="input-edit" value="` + year + `" type="number" id="yearEdit">
      </div>
    </form>
    <div class="actionEdit">
      <button class="grey button" onclick="closeEdit(bookElements)">Close</button>
      <button class="yellow button" onClick="saveEdit(bookElements)">Save</button>
    </div>`;
  formData.style.display = "none";
  textbookItem.append(textTitle, textAuthor, textYear, formData);

  if (isCompleted) {
    buttonSection.append(
    createUndoButton(),
    createEditButton(),
    createTrashButton()
    );
    textbookItem.append(buttonSection);
  } else {
    buttonSection.append(
    createCheckButton(),
    createEditButton(),
    createTrashButton()
    );
    textbookItem.append(buttonSection);
  }
  return textbookItem;
}

function addBook() {
  const completedBookList = document.getElementById(COMPLETED_LIST_BOOK_ID);
  const uncompletedBookList = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  const title = document.getElementById("inputBookTitle").value;
  const author = document.getElementById("inputBookAuthor").value;
  const year = document.getElementById("inputBookYear").value;
  const isCompleted = document.getElementById("inputBookIsComplete").checked;
  const book = makeBook(title, author, year, isCompleted);
  const bookObject = composeBookObject(title, author, year, isCompleted);

  book[BOOK_ITEMID] = bookObject.id;
  books.push(bookObject);
  (isCompleted) 
  ? completedBookList.append(book) 
  : uncompletedBookList.append(book);
  updateDataToStorage();
}

function createButton(buttonTypeClass, eventListener, text) {
  const button = document.createElement("button");

  button.classList.add("button", buttonTypeClass);
  button.innerText = text;
  button.addEventListener("click", function (event) {
    eventListener(event);
  });
  return button;
}

function addBookToCompleted(bookElement) {
  const textTitle = bookElement.querySelector(".book_item > h3").innerText;
  const textAuthor = bookElement.querySelectorAll(".book_item > p")[0].innerText.replace("Author: ", "");
  const textYear = bookElement.querySelectorAll(".book_item > p")[1].innerText.replace("Year: ", "");
  const newBook = makeBook(textTitle, textAuthor, textYear, true);
  const listCompleted = document.getElementById(COMPLETED_LIST_BOOK_ID);
  const book = findBook(bookElement[BOOK_ITEMID]);

  book.isCompleted = true;
  newBook[BOOK_ITEMID] = book.id;
  listCompleted.append(newBook);
  bookElement.remove();
  updateDataToStorage();
}

function createCheckButton() {
  return createButton (
    "green", function (event) {
      addBookToCompleted (event.target.parentElement.parentElement);
    }, "Finish" 
  );
}

function undoBookFromCompleted(bookElement) {
  const textTitle = bookElement.querySelector(".book_item > h3").innerText;
  const textAuthor = bookElement.querySelectorAll(".book_item > p")[0].innerText.replace("Author: ", "");
  const textYear = bookElement.querySelectorAll(".book_item > p")[1].innerText.replace("Year: ", "");
  const newBook = makeBook(textTitle, textAuthor, textYear, false);
  const listCompleted = document.getElementById(UNCOMPLETED_LIST_BOOK_ID);
  const book = findBook(bookElement[BOOK_ITEMID]);

  book.isCompleted = false;
  newBook[BOOK_ITEMID] = book.id;
  listCompleted.append(newBook);
  bookElement.remove();
  updateDataToStorage();
}

function createUndoButton() {
  return createButton (
    "green", function (event) {
      undoBookFromCompleted (event.target.parentElement.parentElement);
    }, "Unfinished" 
  );
}

function removeBookFromCompleted(bookElement) {
  const bookPosition = findBookIndex(bookElement[BOOK_ITEMID]);

  books.splice(bookPosition, 1);
  bookElement.remove();
  updateDataToStorage();
}

function createTrashButton() {
  return createButton (
    "red", function (event) {
      removeBookFromCompleted (event.target.parentElement.parentElement);
    }, "Delete" 
  );
}

function openEdit(bookElement) {  
  bookElements = bookElement;
  
  bookElement.querySelector(".book_item > h3").style.display = "none";
  bookElement.querySelectorAll(".book_item > p")[0].style.display = "none";
  bookElement.querySelectorAll(".book_item > p")[1].style.display = "none";
  bookElement.querySelector(".action").style.display = "none";
  bookElement.querySelector(".formdata").style.display = "block";
}

function closeEdit(bookElement) {
  bookElement.querySelector(".formdata").style.display = "none";
  bookElement.querySelector(".book_item > h3").style.display = "block";
  bookElement.querySelectorAll(".book_item > p")[0].style.display = "block";
  bookElement.querySelectorAll(".book_item > p")[1].style.display = "block";
  bookElement.querySelector(".action").style.display = "block";
}

function saveEdit(bookElement) {
  const bookElements = bookElement;
  const bookPosition = findBook(bookElement[BOOK_ITEMID]);
  const allBooks = getAllBook();
  const bookID = bookPosition.id;
  console.log(bookID);

  const book = allBooks.find(function (item) {
    return item.id == bookID;
  });

  book.title = bookElements.querySelector("#titleEdit").value;
  book.author = bookElements.querySelector("#authorEdit").value;
  book.year = bookElements.querySelector("#yearEdit").value;

  const data = JSON.stringify(allBooks);
  localStorage.setItem(STORAGE_KEY, data);
  location.reload();
}

function createEditButton() {
  return createButton (
    "yellow", function (event) {
      openEdit (event.target.parentElement.parentElement);
    }, "Edit" 
  );
}

searchButton.addEventListener("click", (event) => {
  event.preventDefault();

  const searchTitle = document.getElementById("searchBookTitle").value.toLowerCase();
  const textItem = document.querySelectorAll("article");

  for (value of textItem) {
    const title = value.firstElementChild.textContent.toLowerCase();

    (title.indexOf(searchTitle) != -1) 
    ? value.style.display = "block" 
    : value.style.display = "none";
  }
});

