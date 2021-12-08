---
date: 2019-10-22 12:20:34+200
layout: post
lang: en-US
tags: javascript, node, sql
title: "Comparing SQlite or PostgreSQL with Express"
image: "/public/2019/microscope.jpg"
---

After writing two tutorials on Express to access [SQlite]({% post_url 2019-10-08-crud-with-express-sqlite-10-steps %}) and [PostgreSQL]({% post_url 2019-10-15-crud-with-express-postgresql-10-steps %}) databases, I realized that there were not such big gaps between the two systems.

<figure>
  <img src="{{ page.image }}" alt="microscope" />
  <figcaption>
    <a href="https://unsplash.com/photos/6q5QG8iIgRo">Observing samples under the microscope - Trust "Tru" Katsande</a>
  </figcaption>
</figure>

For the moment, I have seen 5 differences, more or less important:

* Marker for SQL parameters: "$1" or "?"
* The way to define the parameters: always an array or not
* Available methods: .query() or .run() + .all() +.get()
* Parameters passed to the callback function
* Names of the columns in lowercase


## Markers for SQL parameters

Generally, examples for SQlite use "?, ?, ? ..." to identify parameters in parameterized queries. So I followed this method. When you go to PostgreSQL, you see more like "$1, $2, $3 ...".

```javascript
db.run("UPDATE Books SET Title = ? WHERE Book_ID = ?", [title, id], callback);
query.pool("UPDATE Books SET Title = $1 WHERE Book_ID = $2", [title, id], callback);
```

But this is absolutely not a problem, because the SQlite database supports very well parameters in the form "$1, $2, $3 ...".

```javascript
db.run("UPDATE Books SET Title = $1 WHERE Book_ID = $2", [title, id], callback);
```

One!


## SQL parameters in tabular form

When there is only one SQL parameter, the SQlite3 module accepts that this unique data is transmitted as a value, and not within an array:

```javascript
db.get("SELECT * FROM Books WHERE Books_ID = $1", id, callback);
```

Whereas for the node-postgres module, it's imperative that it be within an array:

```javascript
pool.query("SELECT * FROM Books WHERE Books_ID = $1", [id], callback);
```

Similarly, when it's not a parameterized query, the SQlite3 module allows the parameter to be completely zapped, whereas the node-postgres module requires an empty array:

```javascript
db.all("SELECT * FROM Books", callback);
pool.query("SELECT * FROM Books", [], callback);
```

But this time, the SQlite3 module is very flexible and we can do exactly as with node-postgres :

```javascript
db.get("SELECT * FROM Books WHERE Books_ID = $1", [id], callback);
db.all("SELECT * FROM Books", [], callback);
```

It's even better, because that way you're sure you haven't forgotten a parameter by mistake.

Two.


## .query() vs .run(), .all() and .get()

The SQlite3 module defines 3 methods:

* `.run()` to run update queries
* `.all()` to perform SELECTs that return multiple rows
* `.get()` for SELECTs by identifier that return a single line

While on the node-postgres side, everything is done with a single `.query()` method.

After some tests, we can always use the `.all()` method from the SQlite3 module, because it handles perfectly:

* the "SELECT" for an identifier: it seemed obvious
* all update queries: cool!

We can therefore write without any problem:

```javascript
db.all("CREATE TABLE Books ...", [], callback);
db.all("UPDATE Books SET Title = $1 WHERE Book_ID = $2", [title, id], callback);
db.all("SELECT * FROM Books WHERE Books_ID = $1", [id], callback);
db.all("SELECT * FROM Books", [], callback);
```

Just like we do with node-postgres:

```javascript
pool.query("CREATE TABLE Books ...", [], callback);
pool.query("UPDATE Books SET Title = $1 WHERE Book_ID = $2", [title, id], callback);
pool.query("SELECT * FROM Books WHERE Books_ID = $1", [id], callback);
pool.query("SELECT * FROM Books", [], callback);
```

Three...


## Callback function parameters

The `.query()` method of the node-postgres module always returns 2 objects to the callback function that it chains:

* an `Error` object (according to the "error-first" pattern popularized by Node)
* a `Result` object that contains the result returned by the executed query and information about the execution of this query.

On the SQlite3 module side, the `.all()` method also provides 2 objects to its callback function :

* an `Error` object (we're good)
* an array of "rows" that contains the rows returned by the query.

Then, as we use `.all()` to do everything, it will actually give:

* an array with the list of rows for a "SELECT" query returning multiple lines
* an array with the unique row found for a "SELECT" query by identifier
* an empty array for an update request

This is where you have to trick and kill two birds with one stone by adding a `.query()` method to the `Database` object of the SQlite3 module in order to return an object that looks like the `Result` of the node-postgres module :

```javascript
db.query = function (sql, params, callback) {
  if (!Array.isArray(params)) throw new Error("params is not an array!");
  this.all(sql, params, function (err, rows) {
    callback(err, { rows: rows });
  });
};
```

Note: I throw an error if "params" is not an array because the goal during development on SQlite is to be the closest to what will work in production with PostgreSQL. And so, if I forget to use an array, it's better to crash during development rather than in production.

Thanks to this new method, we can finally write the same code for SQlite (via the SQlite3 module) as for PostgreSQL (via the node-postgres module), excepted for the main object name:

```javascript
xxx.query("CREATE TABLE Books...", [], (err, result) => {});
xxx.query("UPDATE Books SET Title = $1 WHERE Book_ID = $2", [title, id], (err, result) => {});
xxx.query("SELECT * FROM Books WHERE Books_ID = $1", [id], (err, result) => {});
xxx.query("SELECT * FROM Books", [], (err, result) => {});
```

It's four!


## The lowercase problem

I usually write SQL keywords in capital letters and the names of tables, columns, views, sequences ... in PascalCase.

It works very well in C# with ADO.NET / [Dapper](https://stackexchange.github.io/Dapper/). In Ruby, I didn't have any problems (probably because I've always used [DataMapper](https://datamapper.org/) or [Sequel](https://sequel.jeremyevans.net/)). But in JavaScript it becomes annoying as it's a very sensitive language.

So, in both tutorials, I created my test table as follows:

```sql
CREATE TABLE IF NOT EXISTS Books (
  Book_ID XXXXXXXXXXXXXXXXXX,
  Title VARCHAR(100) NOT NULL,
  Author VARCHAR(100) NOT NULL,
  Comments TEXT
);
```

The SQlite database followed my way of writing and created a "Books" table with the columns "Book_ID", "Title", "Author" and "Comments".

The PostgreSQL database has all lowercase and created a "books" table with the columns "book_id", "title", "author" and "comments".

In both cases, I can write SQL queries as I want:

```sql
SELECT Title FROM Books WHERE Book_ID = 1
SELECT title FROM FROM books WHERE book_id = 1
SELECT TITLE FROM FROM books WHERE book_Id = 1
...
```

But in both cases, the property names of the resulting object exactly match the names of the columns in the database.

And therefore, for the following query:

```javascript
xxx.query("SELECT * FROM Books WHERE book_ID = $1", [1], (err, result) => {
  console.log(result.rows[0]);
});
```

I get this object with SQlite3:

```javascript
{
  Book_ID: 1,
  Title: "Mrs. Bridge",
  Author: "Evan S. Connell",
  Comments: "First of the series"
}
```

And this one with node-postgres:

```javascript
{
  book_id: 1,
  title: "Mrs. Bridge",
  author: "Evan S. Connell",
  comments: "First of the series"
}
```

Ok. There's no need to complicate my life, and the simplest thing is that I always use lowercase letters to name objects in the database (at least in [Data Definition Language queries](https://en.wikipedia.org/wiki/Data_definition_language)):

```sql
CREATE TABLE IF NOT EXISTS books (
  book_id XXXXXXXXXXXXXXXXXX,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  comments TEXT
);
```

And five => no more difference.


## Use a "common" object

Currently, I do not use the same way to connect to databases:

```javascript
// SQlite
const db = new sqlite3.Database(db_name, err => { ... });
// PostgreSQL
const pool = new Pool({ ... });
```

First of all, I will always name the variable "db" because "pool" is not great. And most importantly, I will use `process.env.NODE_ENV` to choose how to make the connection.

That will give something like:

```javascript
// Connection to the database
let db = null;
if (process.env.NODE_ENV === "production") {
  // PostgreSQL
  db = new Pool({
    ...
  });
} else {
  // SQlite
  const db_name = path.join(__dirname, "data", "apptest.db");
  db = new sqlite3.Database(db_name, err => {
    ...
  });
  // Hack to look like node-postgres
  db.query = function (sql, params, callback) {
    ...
  };
}
console.log("Successful connection to the database");
```

Note: I should search how to isolate this confusing things in 2 separate files. But later...


## Conclusion

I solved all problems related to the fact that SQlite3 and node-postgres modules work a little differently. It only took a few modifications to successfully develop a simple enough solution to have exactly the same code for both databases:

* SQlite for development
* PostgreSQL in production

I don't need to manage more than these two databases. This is already what I am doing with Sinatra (SQlite + PostgreSQL) or ASP.NET MVC (SQL Server CE + SQL Server).

However, there are still some problems with SQL. It's a pretty standard language, but you have to be careful. For example, to create the unique identifier in the "books" table, I have to do it differently depending on the database:

* SQlite : `book_id INTEGER PRIMARY KEY AUTOINCREMENT`
* PostgreSQL : `book_id SERIAL PRIMARY KEY`

And then there are a few other things. But this shouldn't be too much of a problem for "small" beginner applications and tutorials. If I need to do more, it will mean it's time for me to look at ORMs (or make separate SQL scripts).

In the meantime, I can once again add a hack:

```javascript
db.query = function (sql, params, callback) {
  if (!Array.isArray(params)) throw new Error("params is not an array!");
  sql = sql.replace(/SERIAL PRIMARY KEY/, "INTEGER PRIMARY KEY AUTOINCREMENT");
  this.all(sql, params, function (err, rows) {
    callback(err, { rows: rows });
  });
};
```

Note: It must slow down a tad, but we're in development, it gives us time to think.


## The complete code for "index.js"

As always, the entire "index.js" file to get an overview of the new system.

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

// Creating the Books table (Book_ID, Title, Author, Comments)
const sql_create = `CREATE TABLE IF NOT EXISTS books (
  book_id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  author VARCHAR(100) NOT NULL,
  comments TEXT
);`;
db.query(sql_create, [], (err, result) => {
  if (err) {
    return console.error(err.message);
  }
  console.log("Successful creation of the 'Books' table");
  // Database seeding
  db.query("SELECT COUNT(*) AS count FROM Books", [], (err, result) => {
    const count = result.rows[0].count;
    if (count === 0) {
      const sql_insert = `INSERT INTO Books (Title, Author, Comments) VALUES
        ('Mrs. Bridge', 'Evan S. Connell', 'First of the series'),
        ('Mr. Bridge', 'Evan S. Connell', 'Second in the series'),
        ('L\'ingénue libertine', 'Colette', 'Minne + Les égarements de Minne');`;
      db.query(sql_insert, [], (err, result) => {
        if (err) {
          return console.error(err.message);
        }
        console.log("Successful creation of 3 books");
      });
    }
  });
});

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
    titre: "Test",
    items: ["one", "two", "three"]
  };
  res.render("data", { model: test });
});

// GET /books
app.get("/books", (req, res) => {
  const sql = "SELECT * FROM Books ORDER BY Title";
  db.all(sql, [], (err, rows) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("books", { model: rows });
  });
});

// GET /create
app.get("/create", (req, res) => {
  res.render("create", { model: {} });
});

// POST /create
app.post("/create", (req, res) => {
  const sql = "INSERT INTO Books (Title, Author, Comments) VALUES ($1, $2, $3)";
  const book = [req.body.title, req.body.author, req.body.comments];
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/books");
  });
});

// GET /edit/5
app.get("/edit/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Books WHERE Book_ID = $1";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("edit", { model: row });
  });
});

// POST /edit/5
app.post("/edit/:id", (req, res) => {
  const id = req.params.id;
  const book = [req.body.title, req.body.author, req.body.comments, id];
  const sql = "UPDATE Books SET Title = $1, Author = $2, Comments = $3 WHERE (Book_ID = $4)";
  db.run(sql, book, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/books");
  });
});

// GET /delete/5
app.get("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "SELECT * FROM Books WHERE Book_ID = $1";
  db.get(sql, id, (err, row) => {
    if (err) {
      return console.error(err.message);
    }
    res.render("delete", { model: row });
  });
});

// POST /delete/5
app.post("/delete/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM Books WHERE Book_ID = $1";
  db.run(sql, id, err => {
    if (err) {
      return console.error(err.message);
    }
    res.redirect("/books");
  });
});
```

{:.encart}
Version en français : [Comparaison de l'utilisation de SQlite ou PostgreSQL avec Express]({% post_url 2019-10-07-comparaison-sqlite-postgresql-express %}){:hreflang="fr"}.
