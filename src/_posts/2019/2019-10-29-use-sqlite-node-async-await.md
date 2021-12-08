---
date: 2019-10-29 12:33:18+200
layout: post
lang: en-US
tags: javascript, node, sql
title: "Use SQlite3 in async / await mode"
image: "/public/2019/grand-bain.jpg"
---

I go on my series of tutorials to learn Node JS and more specifically how to develop small web applications with ExpressJS. I have already seen how to access a [SQlite]({% post_url 2019-10-08-crud-with-express-sqlite-10-steps %}) database, then [PostgreSQL]({% post_url 2019-10-15-crud-with-express-postgresql-10-steps %}). In the previous tutorial, I compared how to access [SQlite and PostgreSQL with Express]({% post_url 2019-10-22-comparing-sqlite-postgresql-express %}) to be able to write the same code to access both databases.

In this tutorial, I will modify the existing code so that I no longer have to use a callback function when I make a query on the database.

<figure>
  <img src="{{ page.image }}" alt="grand-bain" />
  <figcaption>
    <a href="https://www.rottentomatoes.com/m/sink_or_swim_2018">Sink or Swim - Gilles Lellouche</a>
  </figcaption>
</figure>


## Asynchronous operation / callback

Last time, I found out how to get the same JavaScript code to access both databases:

```javascript
// GET /books
app.get("/books", (req, res) => {
  const sql = "SELECT * FROM Books ORDER BY Title";
  db.query(sql, [], (err, result) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("books", { model: result.rows });
  });
});
```

The SQL query is executed via the `.query()` method, which runs asynchronously and then calls a callback function when the query is completed. In the example above, the callback function is an anonymous lambda function that corresponds to the following code part:

```javascript
(err, result) => {
  if (err) {
    return console.error(err.message);
  }
  res.render("books", { model: result.rows });
}
```

It's not too complicated, but it's not that clear either. In fact, this way of coding results from the async / callback operation which is as difficult to read as it is to write.

In a nutshell, you have to:

* pass a callback function to the `.query()` method,
* when the request is completed, the `.query()` method calls this callback function by sending it an `Error` parameter and the result of executing the request,
* and finally, the callback function must handle this error (if any) and this result...

Note: It's difficult to read, difficult to write, and also difficult to explain.


## Async / await operation

This is why JavaScript has regularly evolved and today allow to use an async / await operation which, although doing the "same" thing, seems much more "natural".

Which gives:

```javascript
// GET /books
app.get("/books", async (req, res) => {
  try {
    const sql = "SELECT * FROM Books ORDER BY Title";
    const result = await db.query(sql, []);
    res.render("books", { model: result.rows });
  } catch (err) {
    return console.error(err.message);
  }
});
```

This time, we run the query with `await db.query(...)` without callback.

But (!) to be able to use "await", it is necessary that the function in which one makes the await be decorated with an "async" attribute. In our example, the function is the callback function passed to the `app.get()` method, namely the following anonymous lambda function :

```javascript
(req, res) => {
  try {
    const sql = "SELECT * FROM Books ORDER BY Title";
    const result = await db.query(sql, []);
    res.render("books", { model: result.rows });
  } catch (err) {
    return console.error(err.message);
  }
}
```

And so, instead of writing:

```javascript
app.get("/books", (req, res) => {
...
```

We write (but without the "+++++"):

```javascript
app.get("/books", async (req, res) => {
                  +++++
...
```

Note: We are not looking at the fact that there is always a callback for `app.get()` and we stay focus on the database...

In case of problem, the error is recovered via `try / catch` and when all goes well, the result of the request is returned and the current processing can resume its normal course....

Note: It looks like synchronous operation, it's written like synchronous, but it's still asynchronous since we code "async" and "await".

It's much more beautiful and it works too! But sadly only when I use PostgreSQL and node-postgres... Because with SQlite, everything is broken:

```
Cannot read property 'rows' of undefined
E:\Code\AppTestAA\node_modules\sqlite3\lib\trace.js:27
                    throw err;
                    ^

TypeError: callback is not a function
    at Statement.<anonymous> (E:\Code\AppTestAA\index.js:39:7)
--> in Database#all('SELECT * FROM Books ORDER BY Title', [], [Function])

...
```


## Async / Await with the SQlite3 module

I guess it was its way of saying that the SQlite3 module doesn't handle async / await operation.

Well, it's not complicated. I have to look at how to make SQlite3 support async / await, or at worst I have to look for another module for SQlite that can do it...

...

Well, it's complicated:(

It doesn't work, nothing is working, I have to change everything, I'm fed up, I knew that asynchronous would only be fuc...

...

Another day.

I "just" need to improve my `.query()` hack (so that SQlite3 looks like node-postgres)  so that it works with async / wait.

```javascript
// Hack to look like node-postgres
db.query = function (sql, params, callback) {
  this.all(sql, params, function (err, rows) {
    callback(err, { rows: rows });
  });
};
```

I don't know how to do it, but at least the Internet is of some use and by taking inspiration from several examples, by trying a little bit in all directions, I finally manage to hack a little more:

```javascript
// Hack to look like node-postgres
// (and handle async / await operation)
db.query = function (sql, params) {
  var that = this;
  return new Promise(function (resolve, reject) {
    that.all(sql, params, function (error, rows) {
      if (error)
        reject(error);
      else
        resolve({ rows: rows });
    });
  });
};
```

I'm testing a...gain: http://localhost:3000/books

...

It works :)


## Conclusion

Personally, I like the async / await syntax much better. It's more beautiful, it looks more natural and avoids indentations of death:

```javascript
// // Creating the Books table (Book_ID, Title, Author, Comments)
const sql_create = `CREATE TABLE IF NOT EXISTS books ... `;
db.query(sql_create, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'Books' table");
  // Database seeding
  db.query("SELECT COUNT(*) AS count FROM Books", [], (err, result) => {
    const count = result.rows[0].count;
    if (count === 0) {
      const sql_insert = `INSERT INTO Books ... `;
      db.query(sql_insert, [], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Successful creation of 3 books");
      });
    }
  });
});
```

=> Ugh...

```javascript
(async () => {
  try {
    // Creating the Books table (Book_ID, Title, Author, Comments)
    const sql_create = `CREATE TABLE IF NOT EXISTS books ... `;
    await db.query(sql_create, []);
    console.log("Successful creation of the 'Books' table");
    // Database seeding
    const result = await db.query("SELECT COUNT(*) AS count FROM Books", []);
    const count = result.rows[0].count;
    if (count === 0) {
      const sql_insert = `INSERT INTO Books ... `;
      await db.query(sql_insert, []);
      console.log("Successful creation of 3 books");
    }
  }
  catch (error) { throw error; }
})();
```

=> Yummy?


## The complete code for "index.js"

And finally, the full "index.js" source to get an overview of all changes.

```javascript
const express = require("express");
const path = require("path");
const { Pool } = require("pg");
const sqlite3 = require("sqlite3").verbose();

// Creating the Express server
const app = express();

// Server configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));

// Database connection
let db = null;
if (process.env.NODE_ENV === "production") {
  // PostgreSQL in production
  const pool = new Pool({
    user: "mystery",
    host: "xxxxx.elephantsql.com",
    database: "mystery",
    password: "asecretthingthatnoonehastosee",
    port: 5432
  });
} else {
  // SQlite by default
  const db_name = path.join(__dirname, "data", "apptest.db");
  db = new sqlite3.Database(db_name, err => {
    if (err) {
      return console.error(err.message);
    }
  });
  // Hack to look like node-postgres
  db.query = function (sql, params, callback) {
    if (!Array.isArray(params)) throw new Error("params is not an array!");
    sql = sql.replace(/SERIAL PRIMARY KEY/, "INTEGER PRIMARY KEY AUTOINCREMENT");
    this.all(sql, params, function (err, rows) {
      callback(err, { rows: rows });
    });
  };
}
console.log("Successful connection to the database");

(async () => {
  try {
    // Creating the Books table (Book_ID, Title, Author, Comments)
    const sql_create = `CREATE TABLE IF NOT EXISTS books (
      book_id SERIAL PRIMARY KEY,
      title VARCHAR(100) NOT NULL,
      author VARCHAR(100) NOT NULL,
      comments TEXT
    );`;
    await db.query(sql_create, []);
    console.log("Successful creation of the 'Books' table");
    // Database seeding
    const result = await db.query("SELECT COUNT(*) AS count FROM Books", []);
    const count = result.rows[0].count;
    if (count === 0) {
      const sql_insert = `INSERT INTO Books (Title, Author, Comments) VALUES
        ('Mrs. Bridge', 'Evan S. Connell', 'First of the series'),
        ('Mr. Bridge', 'Evan S. Connell', 'Second in the series'),
        ('L\'ingénue libertine', 'Colette', 'Minne + Les égarements de Minne');`;
      await db.query(sql_insert, []);
      console.log("Successful creation of 3 books");
    }
  } catch (e) { return console.error(e.message); }
})();

// Starting the server
app.listen(3000, () => {
  console.log("Server started (http://localhost:3000/) !");
});

// GET /
app.get("/", (req, res) => {
  // res.send("Hello world...");
  res.render("index");
});

// GET /about
app.get("/about", (req, res) => {
  res.render("about");
});

// GET /data
app.get("/data", (req, res) => {
  const test = {
    title: "Test",
    items: ["one", "two", "three"]
  };
  res.render("data", { model: test });
});

// GET /books
app.get("/books", async (req, res) => {
  try {
    const sql = "SELECT * FROM Books ORDER BY Title";
    const result = await db.query(sql, []);
    res.render("books", { model: result.rows });
  } catch (e) { console.error(e.message); }
});

// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create
app.post("/create", async (req, res) => {
  try {
    const sql = "INSERT INTO Books (Title, Author, Comments) VALUES ($1, $2, $3)";
    const book = [req.body.title, req.body.author, req.body.comments];
    const result = await db.query(sql, book);
    res.redirect("/books");
  } catch (e) { console.error(e.message); }
});

// GET /edit/5
app.get("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "SELECT * FROM Books WHERE Book_ID = $1";
    const result = await db.query(sql, [id]);
    res.render("edit", { model: result.rows[0] });
  } catch (e) { console.error(e.message); }
});

// POST /edit/5
app.post("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const book = [req.body.title, req.body.author, req.body.comments, id];
    const sql = "UPDATE Books SET Title = $1, Author = $2, Comments = $3 WHERE (Book_ID = $4)";
    const result = await db.query(sql, book);
    res.redirect("/books");
  } catch (e) { console.error(e.message); }
});

// GET /delete/5
app.get("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "SELECT * FROM Books WHERE Book_ID = $1";
    const result = await db.query(sql, [id]);
    res.render("delete", { model: result.rows[0] });
  } catch (e) { console.error(e.message); }
});

// POST /delete/5
app.post("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const sql = "DELETE FROM Books WHERE Book_ID = $1";
    const result = await db.query(sql, [id]);
    res.redirect("/books");
  } catch (e) { console.error(e.message); }
});
```

{:.encart}
Version en français : [Utiliser SQlite3 en mode async / await]({% post_url 2019-10-21-utiliser-sqlite-node-async-await %}){:hreflang="fr"}.
