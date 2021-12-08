---
date: 2019-12-17 12:09:42+200
layout: post
tags: css
lang: en-US
title: "A new CSS and 5 tips to know"
image: "/public/2019/sapin-de-noel.jpg"
excerpt: "For the coming new year, I have refreshed the visual style of my blog. Besides the 'tout nouveau, tout beau' point, it allowed me to find 2 or 3 things from CSS and Jekyll that I didn't know."
---

For the coming new year, I have refreshed the visual style of my blog. Besides the "tout nouveau, tout beau" point, it allowed me to find 2 or 3 things from CSS and [Jekyll](https://jekyllrb.com/) that I didn't know.

<figure>
  <img src="{{ page.image }}" alt="sapin-de-noel" />
  <figcaption>
    <a href="https://unsplash.com/photos/ySNkCkdKyTY">Christmas tree - Rodion Kutsaev</a>
  </figcaption>
</figure>

I started by changing the font. Until recently, I used to like the "Century Gothic" font a lot, but lately I've preferred to stick to system fonts.

* Before: `font-family: "Century Gothic", "Trebuchet MS", Verdana, Helvetica, Sans-Serif;`
* After: `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;`

I also increased the default font size and came back to a "true" black to improve readability.

* Before: `color: #444; font-size: 14px;`
* After: `color: #000; font-size: 16px;`

During my last style update, I decided to no longer display the content in the center of the screen, but rather on the left side. Finally (or at least for now), I find that centering the content is clearer and that it gives some "page" aspect that makes reading easier.

* After: `.container { margin: 0 auto; padding: 1rem; }`

And to improve the readability and clean side of the page, I have increased the horizontal "margin" on PC screens:

```css
@media screen and (min-width: 48rem) {
    .container {
        padding: 1rem 3rem;
    }
}
```

I like to separate internal and external links. Over time, I have tried different solutions: adding an icon next to external links, underlining external links only (or vice versa), using a different color for each type of link... For this time, I choose to present external links with a light bold.

* After: `a[href*='//'] { font-weight: 600; }`

**Tip #1**: I said "light" bold because before (the last time I tried), using `font-weight: 600;` or `font-weight: 900;` didn't make any difference. Now I can see the difference very clearly, at least on my PC....

For my titles, I more or less kept what I had in the previous version, especially in terms of colors.

* h1: blue => blog name and main navigation
* h2: chocolate => post title
* h3: green => post subtitles
* h4: grey => level 2 subtitles

I was therefore satisfied with the following modifications:

1. The blog title (h1) is `16px` by default and changes to `1.5rem` on PC screens
1. I increased the size of the other titles and their vertical margins to improve readability
1. The post title (h2) is now centered, which makes it much more visible on small screens
1. Added `line-height: 1;` to avoid too big line spacing when titles expand on several lines with small screens

For the source code parts, I tried to do a bit like [dev.to](https://dev.to/) and highlight them compared to the rest of the content. To do this, I used:

* a "very light" gray background color: `background-color: #f8f8f8f8;`
* slightly darker vertical borders: `border-color: #eee;`

But above all, I "stick" this block to the edges of the page, so that it looks better compared to the rest of the content (especially on PC screens).

```css
.container { padding: 1rem; }
pre { margin: 1rem -1rem; }

@media screen and (min-width: 48rem) {
    .container { padding: 1rem 3rem; }
    pre { margin: 1rem -3rem; }
}
```

And finally, I shared this style with the one for other types of "blocks", such as quotes and `div.insert`:

```css
blockquote, pre, .encart {
    background-color: #fff;
    border-bottom: 1px solid #fff;
    border-top: 1px solid #fff;
    clear: both;
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
    margin: 1rem -1rem;
    padding: .5rem 1rem;
    text-align: left;
}

blockquote {
    background-color: #fbfaea; /* ocre */
    border-color: #e3d0aa;
}

pre {
    background-color: #f8f8f8; /* gris */
    border-color: #eee;
    font-size: small;
}

.encart {
    background-color: #eaf7ff; /* bleu */
    border-color: #6b90da;
}
```

**Tip #2**: `color-adjust: exact` allows these blocks to also have a background color when printed.

Also, for source code, I used again a snippet of CSS which automatically word-wrap line inside source code. This avoids having to scroll horizontally to see the entire code or worse to lose end of lines when printing.

```css
/* https://stackoverflow.com/questions/248011/how-do-i-wrap-text-in-a-pre-tag */
pre {
    white-space: pre-wrap;
    white-space: -moz-pre-wrap !important;
    white-space: -pre-wrap;
    white-space: -o-pre-wrap;
    word-wrap: break-word;
}
```

After a few tries, I decided to reserve this for PC screens and printing.

Speaking of printing, I also made sure that the full width of the page is used:

```css
@media print {
    .container {
        max-width: 100rem;
        padding: 0 !important;
    }
}
```

But despite everything, you must leave some margin otherwise everything is stuck on the edges of the page. A simple `margin` or` padding` is not enough:

* this has an effect on the horizontal margins => ok
* the margin-top only works on the 1st printed page => ko
* the margin-bottom only works on the last printed page => ko

That's where my **tip #3** comes in:

```css
@page {
    margin: 1.5cm 1cm; /* centimeters for IE */
}
```

And of course, for the impressions to be perfect, I hide unnecessary content:

```css
@media print {
    div > header, nav, .pub { display: none; }
}
```

Not bad at all. I still had to make 2 more changes. First, I have a problem with the archive page that generates list with `<li><p>Post title</p></li>`. This makes a big interline between the different posts of the same month. Rather than bother to understand the problem, I go with a CSS tweak:

```css
li p {
    margin: 0 auto; /* archives page generate <li><p>...</p></li> */
}
```
And lately, I have sometimes used an "encart" div to display a table of contents. For example:

```markdown
<div class="encart">

1. [Comment j'ai (bientôt) remplacé jQuery]({% post_url 2019-04-30-dquery-remplacer-jquery %})
2. [Une version compatible IE9 / ES5]({% post_url 2019-05-07-dquery-compatibilite-ie9-es5 %})
3. [Ma librairie pour manipuler le DOM]({% post_url 2019-05-14-dquery-librairie-js-manipulation-dom %})
4. [La délégation des évènements en JS]({% post_url 2019-05-21-dquery-delegation-evenement-javascript %})
5. [Délégation d'évènements et « event.target »]({% post_url 2019-05-28-dquery-delegation-evenement-event-target %})
6. [Délégation d'évènements et iOS]({% post_url 2019-06-04-dquery-delegation-evenement-ios %})

</div>
```

Well, that doesn't work... The Markdown code inside the `div` tag is not transformed into html :( For the simplest cases with only one link, I used to replace the `div.encart` tag by its Markdown equivalent, using the `{:.encart}` syntax:

```
{:.encart}
Version en français : [Gérer le menu hamburger de Bootstrap 4 en Vanilla JS]({% post_url 2019-12-09-menu-hamburger-bootstrap-vanilla-js %}).
```

For more complicated cases, I had given up and written everything in HTML. But during the revision of my CSS style, I look a little further and fortunately there is a solution: [Embedding Markdown in Jekyll HTML](https://stackoverflow.com/a/23384161).

**Tip #4**: Just add a `markdown="1"` attribute to make the Markdown code inside an HTML tag also correctly transformed.

```markdown
<div class="encart" markdown="1">

...

</div>
```

I know I insist, but here's a **5th tip**: always create a print CSS to ensure a good result when printing.

{:.encart}
Version en français : [Nouvelle CSS et 5 trucs bons à savoir]({% post_url 2019-12-16-nouvelle-css-quelques-trucs %}){:hreflang="fr"}.
