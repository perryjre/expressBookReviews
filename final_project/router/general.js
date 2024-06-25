const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!isValid(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
/*public_users.get('/',function (req, res) {
    // Send JSON response with formatted book list
    res.send(JSON.stringify(books,null,4));
});*/

let getBooks = new Promise((resolve) => {
    resolve(books);
});
public_users.get('/',function (req, res) {
    getBooks
        .then(bookList => {
            res.send(JSON.stringify(bookList, null, 4));
        })
        .catch(error => {
            res.status(500).send('Error fetching books');
        });
});

// Get book details based on ISBN
/*public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn]);
 });*/

function getBookByIsbn(isbn) {
    return new Promise((resolve, reject) => {
        const book = books[isbn];
        if (book) {
            resolve(book);
        } else {
            reject('Book not found');
        }
    });
}
public_users.get('/isbn/:isbn',function (req, res) {
    let isbn = req.params.isbn;
    getBookByIsbn(isbn)
        .then(book => {
            res.send(book);
        })
        .catch(error => {
            res.status(404).send(error);
        });
});

  
// Get book details based on author
/*public_users.get('/author/:author',function (req, res) {
    let booksbyauthor = [];
    let author = req.params.author;

    Object.values(books).forEach(book => {
        if (book.author === author) { 
            booksbyauthor.push(book);
        }
    });

    res.send(booksbyauthor);
});*/

function getBooksByAuthor(author){
    return new Promise((resolve, reject) => {
        let booksbyauthor = [];
        Object.values(books).forEach(book => {
            if (book.author === author) { 
                booksbyauthor.push(book);
            }
        });
        if(booksbyauthor.length > 0){
            resolve(booksbyauthor);
        }else{
            reject("books not found");
        }
    });
}
public_users.get('/author/:author',function (req, res) {
    let author = req.params.author;

    getBooksByAuthor(author)
        .then(booksbyauthor => {
            res.send(booksbyauthor);
        })
        .catch(error => {
            res.status(404).send(error);
        })
});

// Get all books based on title
/*public_users.get('/title/:title',function (req, res) {
    let booksbytitle = [];
    let title = req.params.title;

    Object.values(books).forEach(book => {
        if (book.title === title) { 
            booksbytitle.push(book);
        }
    });

    res.send(booksbytitle);
});*/

function getBookByTitle(title){
    return new Promise((resolve, reject) => {
        let booksbytitle = [];
        Object.values(books).forEach(book => {
            if (book.title === title) { 
                booksbytitle.push(book);
            }
        });
        if(booksbytitle.length > 0){
            resolve(booksbytitle);
        }else{
            reject("book not found");
        }
    });
}
public_users.get('/title/:title',function (req, res) {
    let title = req.params.title;

    getBookByTitle(title)
        .then(booksbytitle => {
            res.send(booksbytitle);
        })
        .catch(error => {
            res.status(404).send(error);
        })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews)
});

module.exports.general = public_users;
