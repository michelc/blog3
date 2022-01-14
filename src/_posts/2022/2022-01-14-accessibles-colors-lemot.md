---
date: 2022-01-14 13:03:20 +02:00
lang: en-US
tags: [ javascript, jeux ]
title: Accessible colors for LeMOT
cover:
  image: /public/2022/lemot-couleurs.png
  link: https://www.solitaire-play.com/lemot/
  text: LeMOT - Un jeu de mot chaque jour
excerpt: I continue to improv my French Wordle game, trying to make its colors more accessible to people with color blindness.
---

I really thought about it and decided to change the color of the clues in my game [Wordle in French](https://www.solitaire-play.com/lemot/).

This past [Saturday]({% post_url "2022-01-11-le-mot-play-wordle-in-french" %}), when I created **LeMOT**, I picked the colors used by Josh Wardle.

![Original colors](/public/2022/lemot-avant.png "Original colors")

In the [original Wordle](https://powerlanguage.co.uk/wordle/), there is also a "Color Blind Mode" with more contrasting colors for people who are [color blind](https://en.wikipedia.org/wiki/Color_blindness).

!['Color Blind Mode' in Wordle](/public/2022/wordle-color-blind-mode.png "'Color Blind Mode' in Wordle")

I can't find it, but a few days ago I saw a tweet saying that it would be easier to directly use colors suitable for everyone, rather than offering them through a setting.

Since my game is in its early days, that's what I did. And now my version of Wordle in French uses directly accessible colors for people with visual impairments.

![New colors](/public/2022/lemot-apres.png "New colors")

I started with the "IBM Design Library" color palette found in the [Coloring for Colorblindness](https://davidmathlogic.com/colorblind/) article by David Nichols. I then tested it with the accessibility tools provided by Firefox and found that it was fine.


## Demonstrations

### No red (protanopia)

![protanopia](/public/2022/protanopie.png)

### No green (deuteranopia)

![deuteranopia](/public/2022/deuteranopie.png)

### No blue (tritanopia)

![tritanopia](/public/2022/triteranopie.png)

### No color (achromatopsia)

![achromatopsia](/public/2022/achromatopsie.png)

Note: I also took the opportunity of this color change to increase the font size for nearsighted people like me, to have less shades of gray and to use a darker black font for the text.


## Impact on the result grid

I have of course adapted the result grid invented by [@irihapeta](https://twitter.com/irihapeta/status/1481336946190614531) to adopt the same color scheme. Although I know it doesn't change the problems that all these emojis generate for screen reader software.

![LeMOT grid](/public/2022/lemot-grille.png "This is a fake")


## Advantages of accessible colors

One, everyone can play directly, without having to think about where and how to set up the game.

Two, colors are as pretty as the original ones (if not prettier).

Three, I don't need to code a screen to set it up, nor to save this setting to reactivate it on each visit.

*Note: Colors are now accessible for colorblind people, other elements of the game are not accessible.*


## Disadvantages of new colors

The color of emojis in the result grid will probably confuse people, but I don't know what to do... Except of course to generate a more accessible one, which is not an easy thing to do right now. But normally, seeing the last line all orange, people will understand that it's represent correct letters.

What is a bit more annoying is that players are getting used to GREEN = correct letter and ORANGE = present letter. Except for some beginners who are still hesitant and frequently have to display help :). Not to mention the confusion for those who play Wordle in French and English.

But for that, I found a great solution that I'm very proud of!

When a letter is correct, I repeat it as a watermark on the next line. With this, you can play immediately without having to think about the color code and concentrate all your available human brain time on finding the right word.

![In the 2nd box, letter E is correct](/public/2022/lemot-info.png "In the 2nd box, letter E is correct")

Whatever! It's time to go [play Wordle in French](https://www.solitaire-play.com/lemot/) :)

<div class="encart">

Version en français : {% goto_fr "Des couleurs accessibles pour LeMOT", "2022-01-13-couleurs-accessibles-lemot" %}.

</div>