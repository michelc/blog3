---
date: 2020-01-29 12:38:22+200
layout: post
lang: en-US
tags: livres
title: "Hey! Firefox scrollbar-color is magical"
image: "/public/2020/firefox-scrollbar-color.jpg"
excerpt: "With Firefox, the scrollbar for my Solitaire-Play games is in the «green» tones, like the rest of the website, but I don't know why..."
---

I think so. I just came back from my site [Solitaire-Play](https://www.solitaire-play.com/) and I realized that the vertical scrollbar is "green", which is the dominant color of any solitaire game. Cool!

<figure>
  <img src="{{ page.image }}" alt="firefox-scrollbar-color" />
  <figcaption>
    <a href="https://www.solitaire-play.com/klondike-turn-three/">Look! Scrollbar is green</a>
  </figcaption>
</figure>

I check with Chrome and there, the scrollbar is "gray" as usual. No matter where I look, I can't find anything to explain this behavior.

According to [MDN web docs](https://developer.mozilla.org/en-US/docs/Web/CSS/scrollbar-color), it's possible to define the color used for the scrollbar with the experimental property `scrollbar-color` :

```css
scrollbar-color: auto | dark | light | <color> <color>;
```

And to define which colour to use, the following values are available:

* `auto` => default platform rendering for the track portion of the scrollbar, in the absence of any other related scrollbar color properties. (so "gray" in my case)
* `dark` => show a dark scrollbar, which can be either a dark variant of scrollbar provided by the platform, or a custom scrollbar with dark colors
* `light` => show a light scrollbar, which can be either a light variant of scrollbar provided by the platform, or a custom scrollbar with light colors
* `<color> <color>` => the two colours to be applied ("yellow" and "magenta" for example ...)

So no `magic` value to tell the browser to use colors that will match the general color theme of the site...

And I swear that I have no `scrollbar` or `scrollbar-color` property in my CSS and nothing redefined in the "normalize.css" I use.

Since I haven't yet set up a "manifest.json" file, I don't have any "theme_color" property that could have been a good idea to follow.

For now, I'm going to put this in an added bonus of switching from Chrome to Firefox. We don't see any other explanation...

{:.encart}
Version en français : [Waouh ! La scrollbar de Firefox est magique]({% post_url 2020-01-28-firefox-couleur-scrollbar-magique %}){:hreflang="fr"}.
