---
date: 2020-02-12 12:21:34+200
layout: post
lang: en-US
tags: javascript, node, sql
title: "Deploy an application on Glitch in 5 steps"
image: "/public/2020/ichthyology.jpg"
---

It's been a while since I wanted to test Glitch "for real" and deploy the project I made for my [CRUD application with Express and SQlite in 10 steps]({% post_url 2019-10-08-crud-with-express-sqlite-10-steps %}) tutorial. I finally found the time to get started and it's working great.

<figure>
  <img src="{{ page.image }}" alt="ichthyology" />
  <figcaption>
    <a href="https://www.biodiversitylibrary.org/page/9665742">An introduction to the natural history of fishes - BHL</a>
  </figcaption>
</figure>


## 1. Create an account on Glitch

Right now, I don't want to get attached. On the [https://glitch.com/](https://glitch.com/) page, I click on the "Sign in" button (top right) and then I just :

* click on "Create an account" (bottom middle),
* then click on "Email Magic Link" to get an email that will contain a temporary link / code to connect me (after giving my email address),
* from my mailbox, I click on the link received and I'm connected to Glitch.


## Import a GitHub project

Glitch allows to manage Node applications, with Express and icing on the cake, an SQlite database. So this is exactly what I need to try to host my AppTest application developed a few months ago. All I need to do is :

* click on "New Project" (top right),
* choose "Clone from Git Repo" (at the bottom of the mini list),
* Paste the URL of my Git repository: https://github.com/michelc/AppTest.

Voilà! I end up with the source code of my Node project directly in the Glitch editor.


## 3. Adapt my project to Glitch

After reading a few docs, I know that with Glitch the SQlite database must be saved in a ".data" folder which is:

* hidden, at least in the file editor, but visible from the console,
* persistent, allowing the application data to be stored there.

In the tutorial I created a "data" directory to save the database. So I only have 2 small changes to make to conform to Glitch:

* rename the "data" folder to ".data",
* modify line 15 of the "index.js" file to replace the "data" path with ".data".

```javascript
const db_name = path.join(__dirname, ".data", "apptest.db");
```

Glitch normally accepts a secret ".env" file where you can configure and secure this kind of stuff. But so far, I haven't done anything about this in my AppTest application.


## Launch the application

These few changes should be enough to allow me to run my program from Glitch:

* click on the "Show" button (top left),
* choose "In a New Window" (while you are at it) to launch / display the application in a new window / tab,
* a new tab opens with the URL [https://michelc-apptest.glitch.me/](https://michelc-apptest.glitch.me/) and displays the home screen of my application!

Now, if I click on "Livres" (Books) in the menu bar, I get the list of books as I created it. To test, I can update this list and everything works fine!


## 5. Include the Glitch button

But... the fish are missing! I take a quick look at how it's done with Glitch's default Node + Express project and it's quite simple. I have to add a few lines to my pseudo EJS "layout":

* open the file "_footer.ejs" in the "views" directory,
* add the following 4 lines just before closing the `</body>` tag:

```erb
  <!-- include the Glitch button to show what the webpage is about and
        to make it easier for folks to view source and remix -->
  <div class="glitchButton" style="position:fixed;top:20px;right:20px;"></div>
  <script src="https://button.glitch.me/button.js"></script>

</body>
```

That's it. After a page refresh, I see the famous Glitch fish button in case someone wants to reuse my application :) Thanks to them, I can even embed my application here:

<div class="glitch-embed-wrap" style="height: 486px; width: 100%;">
  <iframe
    allow="geolocation; microphone; camera; midi; encrypted-media"
    src="https://glitch.com/embed/#!/embed/michelc-apptest?previewSize=100&previewFirst=true&sidebarCollapsed=true"
    alt="michelc-apptest on Glitch"
    style="height: 100%; width: 100%; border: 0;">
  </iframe>
</div>


## Conclusion

For a first try, it was super easy. Now, it's worth investing some time on it to master and do more concrete things...

{:.encart}
Version en français : [Déployer une application sur Glitch en 5 étapes]({% post_url 2020-02-11-deployer-application-glitch-5-etapes %}){:hreflang="fr"}.
