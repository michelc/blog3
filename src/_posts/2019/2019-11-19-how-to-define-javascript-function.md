---
date: 2019-11-19 12:22:52+200
layout: post
tags: javascript
lang: en-US
title: "How to define a JavaScript function"
image: "/public/2019/butterfly-collection.jpg"
excerpt: "A personal reminder post to list some of the JavaScript methods to define a function: declaration, expression and arrow syntax."
---

As I always have a little trouble remembering everything and also because there is a little collection side that I like, here is a summary of the different ways that exist to define functions in JavaScript.

<figure>
  <img src="{{ page.image }}" alt="butterfly-collection" />
  <figcaption>
    <a href="https://unsplash.com/photos/X8pnAEjqmqI">Wall decorations with colorful butterflies - __ drz __</a>
  </figcaption>
</figure>


## Through a declaration

The classic method dates back to the origins of JavaScript and simply consists of declaring the function with the keyword `function`.

```javascript
function hello (firstname) {
  console.log(`Hello ${firstname}`);
}
```

This function has the name "hello", which makes it a named function.


## Through an expression

A more modern method that highlights the fact that functions are objects like any other and can also be assigned to variables.

```javascript
const hello = function (firstname) {
  console.log(`Hello ${firstname}`);
};
```

Even if this is not obvious, this function is anonymous:

* It is created without giving it a name (just "function (...) { ... }")
* Although it is assigned to a variable that has a name

Note: Since this is an assignment to a variable (in this case it's a function that is assigned), the command ends with a semicolon, exactly as is the case for all other assignments: `const pi = 3.14;`.


## Through the arrow syntax

With ES6 came the new syntax "arrow" to declare functions via an expression:

* Remove the keyword `function` before the list of arguments.
* Add the symbol `=>` after this list.

```javascript
const hello = (firstname) => {
  console.log(`Hello ${firstname}`);
};
```

It's more compact and the goal is to get a cleaner code. This is why arrows functions can be further simplified:

* Only one parameter => no need to put it in parentheses.
* Only one line of code in the function => no need for a block "{ ... }".
* If the function only makes a "return..." => the keyword `return` is useless.

In the end, the following three declarations are identical:

```javascript
const hello1 = function (firstname) {
  return `Hello ${firstname}`;
};

const hello2 = (firstname) => {
  return `Hello ${firstname}`;
};

const hello3 = firstname => `Hello ${firstname}`; // (°~°)
```

This clean aspect is really useful for callbacks. For example, with the `.map()` method of tables that expects a callback function, you can get some interesting stuffs:

```javascript
const test = [1, 2, 3];

function doubler (x) {
  return x * 2;
}
test.map(doubler);                          // [2, 4, 6]

test.map(function (x) { return x * 2; });   // [2, 4, 6]

test.map((x) => { return x * 2; });         // [2, 4, 6]

test.map(x => x * 2);                       // [2, 4, 6] Bingo!
```

{:.encart}
Version en français : [Comment définir une fonction JavaScript]({% post_url 2019-11-18-comment-definir-fonction-javascript %}){:hreflang="fr"}.
