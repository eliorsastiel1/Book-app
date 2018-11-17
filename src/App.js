import React, { Component } from "react";
import { Route } from "react-router-dom";
import { Link } from "react-router-dom";
import * as BooksAPI from "./BooksAPI";
import "./App.css";
import BookShelf from "./BookShelf";
import BookSearch from "./BookSearch";

class BooksApp extends Component {
  state = {
    books: [],
    isLoaded: false
  };

  componentDidMount() {
    BooksAPI.getAll().then(res => {
      this.setState({
        books: res,
        isLoaded: true
      });
    });
  }

  changeShelf = (book, event) => {
    return new Promise((resolve) => {
      var shelf = event.target.value;
      if (book.shelf !== "none") {
        BooksAPI.update(book, event.target.value).then(
          this.setState(state => ({
            books: state.books.map(b => {
              if (b.title === book.title) {
                b.shelf = shelf;
                return b;
              } else {
                return b;
              }
            }),
            isLoaded:false
          }))
        );
      } else {
        var value=event.target.value;
        BooksAPI.update(book, event.target.value).then(
          this.setState(state => ({
            books:state.books.concat(this.changeShelf1(book,value)),
            isLoaded:false
         })
        ),resolve(BooksAPI.getAll())
      )
      }
    })
  };

  changeShelf1 = (book,value) => {
    book['shelf']=value;
    return book;
  }

  render() {
    const { isLoaded, books } = this.state;
    return (
      <div className="app">
        <Route
          path="/search"
          render={() => (
            <BookSearch shelvedBooks={books} onChangeShelf={this.changeShelf} />
          )}
        />
        <Route
          exact
          path="/"
          render={() => (
            <div className="list-books">
              <div className="list-books-title">
                <h1>MyReads</h1>
              </div>
              <div className="list-books-content">
                <div>
                  <BookShelf
                    key="Currently Reading"
                    shelfName="Currently Reading"
                    appLoaded={isLoaded}
                    fBooks={books.filter(
                      book => book.shelf === "currentlyReading"
                    )}
                    onChangeShelf={this.changeShelf}
                  />
                  <BookShelf
                    key="Want to Read"
                    shelfName="Want to Read"
                    appLoaded={isLoaded}
                    fBooks={books.filter(book => book.shelf === "wantToRead")}
                    onChangeShelf={this.changeShelf}
                  />
                  <BookShelf
                    key="Read"
                    shelfName="Read"
                    appLoaded={isLoaded}
                    fBooks={books.filter(book => book.shelf === "read")}
                    onChangeShelf={this.changeShelf}
                  />
                </div>
              </div>
              <div className="open-search">
                <Link to="/search">Add Book</Link>
              </div>
            </div>
          )}
        />
      </div>
    );
  }
}

export default BooksApp;
