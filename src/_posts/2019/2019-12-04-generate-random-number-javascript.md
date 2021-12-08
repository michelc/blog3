---
date: 2019-12-04 12:23:15+200
layout: post
tags: javascript
lang: en-US
title: "Generate a random number with JavaScript"
image: "/public/2019/xkcd-221.jpg"
excerpt: "How to generate random numbers with Math.random() + How to force chance and be sure to always generate the same set of random numbers (useful for testing)."
---

## The "Math.random()" method

<figure>
  <img src="{{ page.image }}" alt="random-number" />
  <figcaption>
    <a href="https://xkcd.com/221/">XKCD #221 - Random Number</a>
  </figcaption>
</figure>

To create a random number, we have to use the `Math.random()` function. This method returns a "pseudo" random number which is:

* greater than or equal to 0.0
* strictly less than 1.0

So, if you want to get a card number to play (an integer number between 1 and 52), it is necessary:

* Multiply the result of `Math.random()` by 52, which gives us a number between 0.0 and 51.999...
* Round this number to the lower integer value with the function `Math.floor()` to have an integer between 0 and 51 (included)
* Add 1 to this value to have a number between 1 and 52

```javascript
// Get an integer between 1 and 52
const cardNumber = 1 + Math.floor(52 * Math.random());
```

Note: We talk about "pseudo" random number, because for a computer, it's not easy to reproduce chance, so it's easier to simulate.


## The "Math.seedrandom()" module

Aside from my real work (C# + Oracle), I have a side project and I run a solitaire games website: [Solitaire-Play](https://www.solitaire-play.com/), with solitaires like Klondike, Canfield, Freecell, Golf...

Each game provides a hint system. In most cases, I just present the cards that are playable according to the rules of the game. But with Klondike Solitaire, I tried to do a little better and have an algorithm that "thinks" to optimize the chances of winning.

During the development and to check that what I write has a positive impact, I have a program that tests the success rate of the games played by following only the advice of my program.

To have enough significant values, I test the results for 1000 games. The problem is that I never get exactly the same percentage of success each time I run a test set. This is "normal", since each time it's 1000 completely random games.

So I searched whether it was possible to "force" random and that my tests always run the same 1000 games. This would allow me to better evaluate the improvements I add to my hint system.

Luckily, I found David Bau's "[seedrandom.js](https://github.com/davidbau/seedrandom)" package. This code makes the result of the `Math.random()` method "predictable".

As in my case I only use it for testing, I can use directly the function `Math.seedrandom("seed")` before my 1000 tests. In the end, my test program now looks like the following code:

```javascript
function Test_Run (seed) {
  if (seed) Math.seedrandom(seed);
  var play_count = 0;
  var win_count = 0;
  for (var i = 0; i < 1000; i++) {
    play_count++;
    Test_Run_One();
    if (game.state() > 0) win_count++;
  }
  console.log(play_count + " games => "
          + "{ win: " + win_count
          + ", lost: " + (play_count - win_count)
          + ", percent: " + (Math.round(win_count * 1000 / play_count) / 10)
          + " }");
}
```

I tryed with several values for "seed" and got the following results:

* Test_Run("michel") => 41% of games won
* Test_Run("chance") => 41.2% of games won
* Test_Run("randomize") => 39.3 of games won

By playing my system as best I can, I can therefore hope to win 4 out of 10 games. Which is already not bad for "if ... else" code. And so, by using the "randomize" string as initialization value, I will have a better view of the progress made by my hint system as I develop it. The goal being of course to achieve at least a 50% success rate...

{:.encart}
Version en français : [Générer un nombre aléatoire en JavaScript]({% post_url 2019-12-03-generer-nombre-aleatoire-javascript %}){:hreflang="fr"}.
