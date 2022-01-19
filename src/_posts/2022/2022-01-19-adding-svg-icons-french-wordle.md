---
date: 2022-01-19 13:30:22 +02:00
lang: en-US
tags: [ javascript, jeux ]
title: Adding SVG Icons to my French Wordle
cover:
  image: /public/2022/lemot-wordle-fr.png
  link: https://www.solitaire-play.com/lemot/
  text: LeMOT - Un jeu de mot chaque jour
excerpt: Just after I modified my French Wordle game to use accessible colors, I took a moment to add some SVG icons.
---

Just after I modified my [French Wordle](https://www.solitaire-play.com/lemot/) game to use accessible colors, I took a little time to add SVG icons.

## My first "icons"

Initially, I only used simple Ascii or Unicode characters to represent the game actions or the keyboard keys:

* "?" for the Help menu
* "⚙" for the Settings menu
* "↵" for Enter key
* "⌫" for Backspace key

It's simple, it works, and considering that I've rarely had the opportunity to use SVG icons, this was the most practical solution to quickly create **LeMOT**.

![Original icons](/public/2022/lemot-apres.png "Original «icons»")

It was decent, but it didn't look the same depending on what you're playing on: Windows PC, phone, iPhone, ... And then I had to tweak some CSS to give a "button" look to my menu icons.

```css
.menu {
  background-color: #ddd;
  color: #fff;
  border-radius: 50%;
  font-size: 24px;
  width: 35px;
  height: 35px;
  text-align: center;
  cursor: pointer;
  user-select: none;
}

.menu:hover {
  background-color: #bbb;
}
```


## Switching to SVG icons

Regardless, I had planned from the beginning to look at SVG icons to improve **LeMOT**. As I had a number of SVG icon sets bookmarks, I looked for one that would be the best fit.

* [Feather – Simply beautiful open source icons](https://feathericons.com/)
* [Vue Unicons – 1000+ Pixel-perfect svg icons](https://antonreshetov.github.io/vue-unicons/)
* [Iconoir – An Open-Source SVG Icons Library](https://iconoir.com/)
* [Heroicons – Beautiful hand-crafted SVG icons](https://heroicons.com/)
* [Phosphor Icons – A flexible icon family](https://phosphoricons.com/)

Though in the end these are not the icons I selected, I listed them here because they are all very good. But I had some difficulties finding icons to represent the Enter and Backspace keys. Also, just at that time, Josh Wardle had added a new icon in the menu to view stats.

Also, because I was impatient, I had trouble finding explanations for how to color or resize them.

Luckily, I finally tilted and thought again about [Bootstrap icons](https://icons.getbootstrap.com/) that I sometimes use as icon fonts! And there we are, everything I needed, plus they were easily customizable with a bit of CSS.

To set the color:

```css
svg {
  fill: green;
}
```

To resize them:

```css
svg {
  height: 1.75em;
  width: 1.75em;
}
```

The icing on the cake, using the "em" unit allows them to be sized proportionally to the font size.

![SVG icons](/public/2022/lemot-icones-svg.png "SVG icons")


## Problem with clicking on SVG icons

As it was late and I hadn't tested enough (or not at all?), it bugged :(

<blockquote class="twitter-tweet"><p lang="fr" dir="ltr"><a href="https://twitter.com/ms_michel?ref_src=twsrc%5Etfw">@ms_michel</a> hello je te signale un bug impossible d’effacer des lettres le jeu est planté</p>&mdash; Guillaume (@yomz) <a href="https://twitter.com/yomz/status/1481782505309192194?ref_src=twsrc%5Etfw">January 14, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

On the phones, it was no longer possible to go back and correct a letter or to validate the word entered! All of this because my code was still relying on the Unicode characters "↵" and "⌫" to detect which key had been used.

```js
  if (touche === "↵") {
    validerLigne();
  } else if (touche === "⌫") {
    retourArriere();
  }
```

Or something like that...

Never mind, I just had to add a `data-attribute` on the 2 keys and problem solved!

Unfortunately, when you click on an SVG, the `event.target` given by the "click" event doesn't necessarily correspond to the DOM element "button" that represents the key. It can be the "SVG" element or even the "PATH" element depending on the exact place where you clicked...

*Note: Most certainly on a phone it will always fall on the "button" (unless you have a super thin finger), but I don't want to leave anything to chance.*

Fortunately, this is a well-known problem that I had already encountered in my previous run-ins with event delegation. In his post "[Detecting click events on SVGs with vanilla JS event delegation](https://gomakethings.com/detecting-click-events-on-svgs-with-vanilla-js-event-delegation/)", Chris Ferdinandi gives two solutions to solve the problem.

Of course, I took the simpler solution and added a `pointer-events: none;` to my CSS file.

And that's why it's now possible to play [French Wordle](https://www.solitaire-play.com/lemot/) on a phone and with pretty icons.


<div class="encart">

Version en français : {% goto_fr "Ajout d'icônes SVG à mon Wordle français", "2022-01-16-ajout-icones-svg_wordle-francais" %}.

</div>