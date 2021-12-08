---
date: 2019-12-10 12:24:10+200
layout: post
tags: javascript, bootstrap
lang: en-US
title: "Switch Bootstrap 4 hamburger menu with Vanilla JS"
image: "/public/2019/hamburger-menu.jpg"
excerpt: "I only use 'bootstrap.min.js' to handle the Bootstrap hamburger menu. So I 'replaced' the 57 ko of this file with 3 lines of JS."
---

## Introduction

Some weeks ago, I wrote a small ASP.NET MVC application where I already have to [Search and filter a table with JavaScript]({% post_url 2019-10-01-search-filter-table-javascript %}).

<figure>
  <img src="{{ page.image }}" alt="hamburger-menu" />
  <figcaption>
    <a href="https://unsplash.com/photos/Nb_Q-M3Cdzg">Hamburger with a beer - Edward Franklin</a>
  </figcaption>
</figure>

This application uses Bootstrap 4, which allows me to have a totally responsive result without too much effort. In particular the navigation bar is fully displayed when there is enough space or is replaced by a "hamburger" menu on smaller screens.

This result is achieved very simply by using the standard Bootstrap code to create a navigation bar:

```html
<nav class="navbar navbar-expand-lg">
  <a class="navbar-brand" href="/">Home</a>
  <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
  </button>
  <div class="collapse navbar-collapse" id="navbarSupportedContent">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="/one">One</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/two">Two</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="/three">Three</a>
      </li>
    </ul>
  </div>
</nav>
```

In Windows, the navigation bar is fully displayed with the entries "Home", "One", "Two" and "Three". When emulating a smartphone, only the "Home" menu appears with a hamburger "icon" next to it. Clicking on it brings up a submenu with the choices "One", "Two" and "Three".

Clicking on the hamburger menu changes the `div#navbarSupportedContent` tag and adds a "show" class (after a very slight animation).

```html
<div class="collapse navbar-collapse show" id="navbarSupportedContent">
  ...
</div>
```

Clicking on the hamburger icon again, the submenu disappears because the `div#navbarSupportedContent` loses its "show" class:

```html
<div class="collapse navbar-collapse" id="navbarSupportedContent">
  ...
</div>
```


## There is a problem...

Currently, this is the only Bootstrap feature I use in this application and it requires the "bootstrap.min.js" script. So, only for one rather ridiculous feature, I have to embed 2 scripts on all my pages:

* jquery-3.4.1.min.js (87 ko)
* bootstrap.min.js (57 ko)

It's a bit of a waste...

Practically, I need jQuery, but only with input forms, because it's ASP.NET MVC and it uses the [jQuery Validation](https://jqueryvalidation.org/) plugin. But I don't think it's very ecological to load jQuery in all pages because it's easier and that anyway it's cached after a while. Not to mention the 57 kb of "bootstrap.min.js" which serves me absolutely nothing but on the hamburger menu...

## The solution (based on jQuery)

That's why I decided to write my own "navbar-toggler.js" script.

```javascript
$("button.navbar-toggler").on("click", function(e) {
  var target = $(this).data("target");
  $(target).toggleClass("show");
});
```

And that's all!

* `$("button.navbar-toggler")` finds the button used to switch the submenu
* `.on("click", ...)` handles the click on this button
* `$(this)` finds the clicked button
* `.data("target")` finds the value of its attribute "data-target" (i.e. "#navbarSupportedContent" in this case)
* `$(target)` finds the div containing the sub-menu
* `.toggleClass("show")` adds or removes the "show" class from this div, which allows you to show or hide it

I could stick to `$("#navbarSupportedContent").toggleClass("show")` since the value of "data-target" will never change, but since the attribute is defined, you might as well use it...

The important and good thing is that I didn't "create" a new hamburger menu system or anything else. I simply use all the HTML and CSS part that Bootstrap 4 offers. Thus, I get all the responsive side that goes with this navigation bar and that fits perfectly to my usage.

Bonus: the animation part is lost when displaying / hiding the hamburger menu, but it's way better for my blood pressure.

## The same solution (based on Vanilla JS)

To be perfect, this tiny script should not even rely on jQuery. So that's what I'm going to do now.

```javascript
document.querySelectorAll("button.navbar-toggler")[0].addEventListener("click", function (event) {
  var target = this.getAttribute("data-target");
  var subbar = document.querySelectorAll(data_target)[0];
  subbar.className = (subbar.className + " show").replace(/ show show/, "");
});
```

It's literally the same!

* `document.querySelectorAll("button.navbar-toggler")[0]` finds the button used to switch the submenu
* `.addEventListener("click", ...)` handles the click on this button
* `this` retrouve le bouton cliqué
* `.getAttribute("target")` finds the value of its "data-target" attribute
* `document.querySelectorAll(data_target)[0]` finds the div containing the sub-menu
* `(subbar.className + " show").replace(/ show show/, "")` adds or removes the "show" class from this div, which allows you to show or hide it


## The final "js-navbar-toggler.js" source code

This gives the following source file, ready to be integrated with a `<script src="/js/js-navbar-toggler.js"></script>` :

```javascript
// Vanilla JS navbar toggler for Bootstrap 4
// Source: https://blog.pagesd.info/2019/12/09/gerer-menu-hamburger-bootstrap-vanilla-js

(function () {
  "use strict";

  document.querySelectorAll("button.navbar-toggler")[0].addEventListener("click", function (event) {
    var target = this.getAttribute("data-target");
    var subbar = document.querySelectorAll(target)[0];
    subbar.className = (subbar.className + " show").replace(/ show show/, "");
  });

})();
```

{:.encart}
Version en français : [Gérer le menu hamburger de Bootstrap 4 en Vanilla JS]({% post_url 2019-12-09-menu-hamburger-bootstrap-vanilla-js %}){:hreflang="fr"}.
