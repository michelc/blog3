---
date: 2022-01-11 13:36:08 +02:00
lang: en-US
tags: [ javascript, jeux ]
title: LeMOT to play WORDLE in French
cover:
  image: /public/2022/lemot-wordle-fr.png
  link: https://www.solitaire-play.com/lemot/
  text: LeMOT - Un jeu de mot chaque jour
excerpt: This weekend, I started a French version of WORDLE. I developed my own code in Vanilla JS and most importantly, I found a great name "LeMOT", and even a slogan "One Word, One Day"!
---

> TL;TR : Let me [play Wordle in French](https://www.solitaire-play.com/lemot/)!

Some time ago, I saw some funny pictures appear on Twitter. It looked a bit like GitHub's contributions, but over a single week?

I finally figured out what it was and discovered [WORDLE](https://powerlanguage.co.uk/wordle/), a new word game, a kind of cross between Mastermind and Hangman, created by Josh Wardle. Wordle / Wardle: clever!

So of course, I played too, or rather I tried to play... Because I quickly had to admit that my English vocabulary was not enough to win regularly. Although I'm proud to follow series or movies in VO with English subtitles! Or maybe I have a big problem when it comes to 5 letter English words?

2 or 3 years ago, I had collected some French word lists to write a program that would allow me to optimize my Scrabble level (or cheat, if you want). In the end, I had never programmed anything.

But this weekend, after getting up at dawn around 10am, I went for it! And just after midnight, I had already code something pretty good that I was able to put online on my solitaire games site: [https://www.solitaire-play.com/lemot/](https://www.solitaire-play.com/lemot/). I was very happy because I didn't just adapt Josh Wardle's code, but I wrote my own version in Vanilla JS. And on top of that, I had come up with a great name: "**LeMOT**". WORD-Le => Le-WORD => Le-MOT !

And I even had an idea for a slogan to complete the title: "One Word, One Day", inspired by the french TV show "One Book, One Day".

After that I went to sleep and the next day I just kept going and made a lot of improvements.

* Adjusted the backup of the game in progress, to be able to come back to it later when you are stuck.
* Added a "beta version" watermark under the game title because I'm afraid of bugs :)
* Minimized the JavaScript and CSS files to optimize loading.
* Displayed the messages in some sort of "flash" popup (useful to tell if a word is unknown or to inform that the result at the end of the game has been copied to the clipboard to be pasted in Twitter or WhatsApp).
* Updated the page content and the meta and Open Graph tags, with an image inspired by WORDLE.
* Modified the export of the results in emoji to add the mention "(beta)" and a hashtag "#LeMotLeJeu".

This kept me busy until early afternoon. I didn't get back to it until the evening, to properly handle the color clues when there are duplicate letters, either in the word to guess or in the answers entered.

It was a lot of fun to do and no doubt I will continue to work on it.

Already, I have at least a couple of things to do to get my game right.

* On some phones, the last row of keys of the keyboard is not completely visible (especially when there are several tabs in a group and that partly hides the bottom of the keyboard).
* To code quickly, I used Unicode characters to represent icons. They should be replaced by SVG to make it look nicer.
* Check at what time the word is renewed. I use UTC dates and therefore in France, it should be at 1am.

Then there are a few things to add to try to reproduce the original game's features as well as possible.

* Statistics: to make the game more attractive and encourage people to keep playing and seek for a great winning streak.
* Have a button to explicitly share your result.
* Handle settings to manage color sets adapted for people with visual difficulties or the "dark mode".

Another interesting task will be to limit the list of words offered as guesses. In the original version, Josh Wardle selected only 20% of the 12500 English 5-letter words to be among the happy few to guess. I'm not sure why he did this, and on what criteria. Probably their frequency of use. So, how can I do this in French?

In the meantime, feel free to test your French vocabulary on [LeMOT - Un jeu de mot chaque jour](https://www.solitaire-play.com/lemot/), to see if you can do better than me!

[![LeMOT](/public/2022/lemot2.png "Who can do better?")](https://www.solitaire-play.com/lemot/)

<div class="encart">

Version en français : {% goto_fr "LeMOT pour jouer à WORDLE en français", "2022-01-10-le-mot-wordle-en-francais" %}.

</div>
