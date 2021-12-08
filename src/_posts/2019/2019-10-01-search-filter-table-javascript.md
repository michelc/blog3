---
date: 2019-10-01 12:23:34
layout: post
lang: en-US
tags: javascript, jquery
title: "Search and filter a table with JavaScript"
image: "/public/2019/filter-table-js.jpg"
excerpt: "How to search and filter the content of an HTML table in JavaScript. From the script found on codepen.io to a final version slightly reworked after some explanations."
---

Some time ago, I needed to propose a simple search in a table. Normally, I
prefer the good old `Ctrl+F` but not everyone likes it (and also the goal was
more to filter the display to the data found, which is not possible with a
Chrome search).

<figure>
  <img src="{{ page.image }}" alt="filter-table-js" />
  <figcaption>
    <a href="https://www.harborfreight.com/4-piece-funnel-set-744.html">Funnel Set 4 Pc + JavaScript</a>
  </figcaption>
</figure>

As my site wasn't yet using jQuery, I looked for a ready-made Vanilla JS script
and found a very simple and easily understandable example with a demonstration
on [codepen.io](https://codepen.io/priyankamalviya/pen/zzWZEa).


## The original script

First of all, the script as developed by
[Priyanka Malviya](https://twitter.com/priyankamalvi18) before explaining what
it does and how.

```
(function() {
  'use strict';

  var TableFilter = (function() {
    var Arr = Array.prototype;
    var input;

    function onInputEvent(e) {
      input = e.target;
      var table1 = document.getElementsByClassName(input.getAttribute('data-table'));
      Arr.forEach.call(table1, function(table) {
        Arr.forEach.call(table.tBodies, function(tbody) {
          Arr.forEach.call(tbody.rows, filter);
        });
      });
    }

    function filter(row) {
      var text = row.textContent.toLowerCase();
      var val = input.value.toLowerCase();
      row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
    }

    return {
      init: function() {
        var inputs = document.getElementsByClassName('table-filter');
        Arr.forEach.call(inputs, function(input) {
          input.oninput = onInputEvent;
        });
      }
    };

  })();

 TableFilter.init();
})();
```

## How does it work?

To be able to use this code, you must add an input tag to the page and decorate
it with the "table-filter" class:

```
<p>
  Filter: <input type="text" class="table-filter" data-table="books">
</p>
...
<table class="books">
  ...
</table>
...
<script src="/scripts/js-table-filter.js"></script>

```

The "table-filter" class of the control `<input ...>` is used to indicate that
this input box is intended to filter the content of a table.

The "data-table" attribute allows you to define the name of the class
corresponding to the table to be filtered, in this case the HTML table with the
"books" class.

The "js-table-filter.js" script directly launches the `TableFilter.init()`
function which searches for all tags with the "table-filter" class and applies
the `TableFilter.onInputEvent` function to each tag on its `oninput` event.
If necessary, the system allows you to have several tables with each one its own
input box to filter its content:

```
init: function() {
  var inputs = document.getElementsByClassName('table-filter');
  Arr.forEach.call(inputs, function(input) {
    input.oninput = onInputEvent;
  });
}
```

This event is triggered as soon as the user enters text in the search box. It
executes the `onInputEvent` function associated with the event during
initialization.

This `onInputEvent` function will perform the search by testing all existing
rows in the table:

* stores the input tag that triggered the `oninput` event (i.e. "event.target")
in the "input" variable
* finds the class of the table to be filtered from the "data-table" attribute of
this input field
* searches for all tables with this CSS class
* loop on each of these tables, then for each table, on each of its blocks of
type `<tbody>`, then for each "body", on each of its lines `<tr>`, and applies
the `TableFilter.filter` function on them.

```
function onInputEvent(e) {
  input = e.target;
  var table1 = document.getElementsByClassName(input.getAttribute('data-table'));
  Arr.forEach.call(table1, function(table) {
    Arr.forEach.call(table.tBodies, function(tbody) {
      Arr.forEach.call(tbody.rows, filter);
    });
  });
}
```

The function `filter()` is used to filter the rows. It will show or hide one row
depending on whether the search is positive or not:

* stores the lowercase content of the line in the local variable "text".
* stores the text to be searched in lowercase in the local variable "val"
* displays the line `<tr>` when it contains the text you are looking for
* hides the line `<tr>` if it doesn't contain the searched text

```
function filter(row) {
  var text = row.textContent.toLowerCase();
  var val = input.value.toLowerCase();
  row.style.display = text.indexOf(val) === -1 ? 'none' : 'table-row';
}
```

Hiding/displaying a row is done via the CSS `display` property which is defined
as "none" or "table-row".


## Modification #1: a first contact

After studying how these few lines operate, I made a very small change that
enabled me to understand how the code worked.

```
(function () {
  "use strict";

  var TableFilter = (function () {
    var Arr = Array.prototype;
    var search;

    function onInputEvent(e) {
      search = e.target.value.toLowerCase();
      var tables = document.getElementsByClassName(e.target.getAttribute("data-table"));
      Arr.forEach.call(tables, function (table) {
        Arr.forEach.call(table.tBodies, function (tbody) {
          Arr.forEach.call(tbody.rows, filter);
        });
      });
    }

    function filter(row) {
      var text = row.textContent.toLowerCase();
      row.style.display = text.indexOf(search) === -1 ? "none" : "table-row";
    }

    return {
      init: function () {
        var inputs = document.getElementsByClassName("table-filter");
        Arr.forEach.call(inputs, function (input) {
          input.oninput = onInputEvent;
        });
      }
    };

  })();

  TableFilter.init();
})();
```

In addition to converting single quote into double quotes (I prefer it this
way), I have replaced the variable "input" which stores the input tag by a
variable "search" which only stores the text to be searched after turning it
into lowercase.

Advantages:

* Storage of a simple text variable rather than a "DOM" object.
* The text to be searched is no longer transformed into lowercase for each row
tested.


## Modification #2: a small improvement

My table displays a list of books. The filter system works perfectly: I can type
a few things and the table only shows the books that match the search.

Then you can click on one of the rows of the table and it sends you to a detail
page that displays more information about the selected book.

But strangely enough, when you go back via the browser, you find the search box
with the pre-filled filter but not applied: all the lines of the table are
visible...

It is therefore necessary to find a way to reactivate the search as soon as the
input field is pre-filled. It's really not that complicated and you just have to
trigger the `oninput` event if the search input value is not empty:

```
init: function() {
  var inputs = document.getElementsByClassName('table-filter');
  Arr.forEach.call(inputs, function(input) {
    input.oninput = onInputEvent;
    if (input.value !== "") input.oninput({ target: input });
  });
}
```

The line `if (input.value !== "") input.oninput({ target: input });` checks if
the input field is not empty, and if so, triggers the event by passing it the
current input tag.


## Modification #3: a little modernity

Once I procrastinated, I decided to replace the
`document.getElementsByClassName()` with a much more trendy
`document.querySelectorAll()`, and while at it, take the opportunity to simplify
the different selections.

I started by creating a `TableFilter.dquery()` function to standardize how to
use `querySelectorAll()` and get an array from it:

```
function dquery(selector) {
  return Array.prototype.slice.call(document.querySelectorAll(selector));
}
```

Note: This is copy/paste from my JavaScript mini-library
[dQuery]({% post_url 2019-04-30-dquery-remplacer-jquery %}) (post in french).

Then I was able to change the way the relevant input fields were selected:

```
// BEFORE
var inputs = document.getElementsByClassName("table-filter");
Arr.forEach.call(inputs, function (input) { ... });

// AFTER
var inputs = dquery(".table-filter");
[].forEach.call(inputs, function (input) { ... });
```

Especially, I could change the loop over the lines of the table:

```
var tables = document.getElementsByClassName(e.target.getAttribute("data-table"));
Arr.forEach.call(tables, function (table) {
  Arr.forEach.call(table.tBodies, function (tbody) {
    Arr.forEach.call(tbody.rows, filter);
  });
});
```

who became:

```
var lignes = dquery(e.target.getAttribute("data-table") + " tbody tr");
[].forEach.call(lignes, filter);
```

Note: The "data-table" attribute that previously contained "books" (a class name
that was expected by `.getElementsByClassName()`) must now be changed to
".books" (a CSS selector that is intended for `.querySelectorAll()`).


## Modification #4: a slight optimization

Every time we start a search, all the rows of the table are converted to
lowercase in order to make the comparison... Suppose I have a small table with
200 books, if I want to filter on the elements that contain the word "BIRD", I
do :

* 200 lowercase transformations when I type "B"
* \+ 200 lowercase transformations when I add "I"
* \+ 200 lowercase transformations when I add "R"
* \+ 200 lowercase transformations when I add "D"

That's silly. So I cached the "textual" content of the line after turning it
into lowercase to "save" a little bit of time:

```
if (!row.lowerTextContent) {
  row.lowerTextContent = row.textContent.toLowerCase();
}
row.style.display = row.lowerTextContent.indexOf(search) === -1 ? "none" : "table-row";
```

Note: Given the size of the tables on which I use "js-table-filter.js", it's
more for the sake of detail than for real optimization.


## Modification #5: a new feature

This time, I made a little more useful modification. The title of the table is
"List of books", followed by the number of books in parentheses.

```
<h2>List of books (<%= model.length %>)</h2>
<p>
  Filter: <input type="text" class="table-filter" data-table=".books">
</p>
...
<table class="books">
  ...
</table>
```

And when you filter the contents of the table, this counter doesn't evolve since
it was initialized on the server side and corresponds to the total number of
rows in the table, whether they are displayed or hidden...

So I completed the existing code to update this counter as we filter the data:

```
...
[].forEach.call(lignes, filter);
var writer = input.getAttribute("data-count");
if (writer) {
  var count = rows.reduce(function (t, x) { return t + (x.style.display === "none" ? 0 : 1); }, 0);
  dquery(writer)[0].textContent = count;
}
```

For this to work, you must add a "data-count" attribute to the input field to
identify where to display the number of lines. And of course, add a tag
corresponding to this attribute, i.e. `<span id="count">...</span>` in the
example below :

```
<h2>List of books (<span id="count"><%= model.length %></span>)
<p>
  Filter: <input type="text" class="table-filter" data-table=".books" data-count="#count">
</p>
...
```

Note: If the attribute "data-count" does not exist, then the condition `if
(writer) { ... }` avoids trying to count lines.


## Modification #6: simplifications

On this occasion, we can also notice that the "table-filter" class is not really
essential. The presence of the "data-table" attribute can also be used to
determine which input tags are intended to perform a search.

Which gives on the HTML side:

```
<p>
  Filter: <input type="text" data-table=".books" data-count="#count">
</p>
```

And on the JavaScript side:

```
// BEFORE
var inputs = dquery(".table-filter");
[].forEach.call(inputs, function (input) { ... });

// AFTER
var inputs = dquery("input[data-table]");
[].forEach.call(inputs, function (input) { ... });
```


## The "js-table-filter.js" file up to date

Here's where I am (until I want to handle accented characters). And with a few
comments, the code is still as short and simple as ever:

```
// Vanilla JS table filter
// Source: https://blog.pagesd.info/2019/10/01/search-filter-table-javascript/

(function () {
  "use strict";

  var TableFilter = (function () {
    var search;

    function dquery(selector) {
      // Returns an array of elements corresponding to the selector
      return Array.prototype.slice.call(document.querySelectorAll(selector));
    }

    function onInputEvent(e) {
      // Retrieves the text to search
      var input = e.target;
      search = input.value.toLocaleLowerCase();
      // Get the lines where to search
      // (the data-table attribute of the input is used to identify the table to be filtered)
      var selector = input.getAttribute("data-table") + " tbody tr";
      var rows = dquery(selector);
      // Searches for the requested text on all rows of the table
      [].forEach.call(rows, filter);
      // Updating the line counter (if there is one defined)
      // (the data-count attribute of the input is used to identify the element where to display the counter)
      var writer = input.getAttribute("data-count");
      if (writer) {
        // If there is a data-count attribute, we count visible rows
        var count = rows.reduce(function (t, x) { return t + (x.style.display === "none" ? 0 : 1); }, 0);
        // Then we display the counter
        dquery(writer)[0].textContent = count;
      }
    }

    function filter(row) {
      // Caching the tr line in lowercase
      if (row.lowerTextContent === undefined)
        row.lowerTextContent = row.textContent.toLocaleLowerCase();
      // Hide the line if it does not contain the search text
      row.style.display = row.lowerTextContent.indexOf(search) === -1 ? "none" : "table-row";
    }

    return {
      init: function () {
        // get the list of input fields with a data-table attribute
        var inputs = dquery("input[data-table]");
        [].forEach.call(inputs, function (input) {
          // Triggers the search as soon as you enter a search filter
          input.oninput = onInputEvent;
          // If we already have a value (following navigation back), we relaunch the search
          if (input.value !== "") input.oninput({ target: input });
        });
      }
    };

  })();

  TableFilter.init();
})();
```

As a bonus, the HTML part, ready for when I add this to a Bootstrap 4 template:

```
<div class="input-group mb-3">
  <div class="input-group-prepend">
    <span class="input-group-text" id="filter">Filter</span>
  </div>
  <input type="text" class="form-control" data-table="table" data-count="#count" placeholder="Enter text to filter..." aria-label="Filter" aria-describedby="filter">
</div>
```

{:.encart}
Version en français : [Rechercher et filtrer une table en JavaScript]({% post_url 2019-09-30-rechercher-filtrer-table-javascript %}){:hreflang="fr"}.
