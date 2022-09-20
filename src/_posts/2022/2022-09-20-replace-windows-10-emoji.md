---
date: 2022-09-20 19:31:55 +02:00
lang: en-US
tags: [ javascript, twitter ]
title: "Replace Windows 10's emoji"
cover:
  image: /public/2022/emoji-beebee.png
excerpt: Turns out, it's not that easy to replace Windows 10's old-school emojis with something a little more modern and cheerful...
---

Lately, I've been back on developing a sort of Twitter client / application to help me track interactions around my [French Wordle game](https://www.solitaire-play.com/lemot/) (and the 3 other games that I developed later).

This weekend, to take my mind off things a bit, I tried to improve the look of the emojis.

Initially, since it's a web application, they are displayed with the default Windows 10 font for emojis, which isn't super great:

<figure>
  <img src="/public/2022/emoji-defaut.png" alt="" />
  <figcaption>Basic emoji for Windows 10</figcaption>
</figure>


## 1st try: "Segoe UI Emoji" from Windows 11

To make it easier, I tried to install the latest version of the "Segoe UI Emoji" font from Windows 11 and see what happened... Not much actually!

<figure>
  <img src="/public/2022/emoji-defaut.png" alt="" />
  <figcaption>Still using the original Windows 10 "Segoe UI Emoji" font :(</figcaption>
</figure>

I now have two "Segoe UI Emoji" fonts on my PC which doesn't seem to be ready to use the newer one by default.

However, Firefox has proved to be smarter:

<figure>
  <img src="/public/2022/emoji-firefox.png" alt="" />
  <figcaption>The new "Segoe UI Emoji" font in Windows 11 :)</figcaption>
</figure>


## 2nd try: "Noto Color Emoji" from Google

Then I saw a new font from Google: "Noto Color Emoji" ([https://fonts.google.com/noto/specimen/Noto+Color+Emoji](https://fonts.google.com/noto/specimen/Noto+Color+Emoji)).

After downloading it, I could have try to use it as a "system" font for emojis... But there was no reason for it to do better than Microsoft's "Segoe UI Emoji".

And there is nothing at the HTML/CSS level to indicate how emojis should be displayed using a particular font. If I want that, the easiest way is to include the emojis to be displayed inside a `<span>` tag with a class to later define its font. Something like `<span class="font-emoji">🥳</span>` for example...

I wrote a quick code so that the emojis would be displayed using this font. To do this, I wrapped all the emojis in a "pseudo" `<e>` tag by using the following function:

```
private string MakePrettyEmojis(string content)
{
    var pretty = "";
    var runes = content.EnumerateRunes();
    foreach (var r in runes)
    {
        var one = r.ToString();
        if (one == "\u2b1c")
            pretty += "<e>" + one + "</e>";
        else if (one == "\u26aa")
            pretty += "<e>" + one + "</e>";
        else if (r.IsBmp == false)
            pretty += "<e>" + one + "</e>";
        else
            pretty += r.ToString();
    }
    pretty = pretty.Replace("</e><e>", "");
    return pretty;
}
```

*Note: As all emojis are apparently not on the same boat, I will have to try a little harder to manage all the existing emojis (something like a `Regex` certainly).*

The `<e>` tag does not exist but browsers do not seem to be disturbed. And so, `<e>🥳</e>` will be  more "soft" than a long `<span class="font-emoji">🥳</span>` :)

I update my CSS to define that `<e>` elements must be displayed with the "Noto Color Emoji" font:

```
e {
    font-family: "Noto Color Emoji"
}
```

And the result is finally there, whatever the browser!

<figure>
  <img src="/public/2022/emoji-font-google.png" alt="" />
  <figcaption>Finally more cute emojis!!!</figcaption>
</figure>

But I'm not a big fan of this little 3D effect. It feels like being back in the days of Windows 3.1 :)


## 3rd try: "Segoe UI Emoji" the return

Of course, I'll take a chance on:

```
e {
    font-family: "Segoe UI Emoji"
}
```

But since there are 2 "Segoe UI Emoji" fonts on my Windows, the new one still doesn't override the old one... Unless there is a `font-version` somewhere...

<figure>
  <img src="/public/2022/emoji-defaut.png" alt="" />
  <figcaption>Back to square one (except Firefox)</figcaption>
</figure>


## 4th try: "Twitter Color Emoji SVGinOT Font" by ???

I'm looking if there are other emoji fonts and I find one based on Twitter emojis, even though it looks more like DIY than official stuff: [https://github.com/eosrei/twemoji-color-font](https://github.com/eosrei/twemoji-color-font).

I download, install and then:

```
e {
    font-family: "Twitter Color Emoji"
}
```

And oops...

<figure>
  <img src="/public/2022/emoji-font-twitter.png" alt="" />
  <figcaption>All emojis are light gray...</figcaption>
</figure>


## 5th try: "Emoji for everyone" from Twitter!!!

However, it led me to the "Twemoji" page: [https://twemoji.twitter.com/](https://twemoji.twitter.com/).

> Twitter's open source emoji has you covered for all your project's emoji
> needs. With support for the latest Unicode emoji specification, featuring
> 3,245 emojis, and all for free.

Wait, that's awesome!

It looks like this is exactly what I'm looking for! Something not complicated that can replace all the emojis of a page with the image of the corresponding Twitter emoji. That's good, cause I really like Twitter emojis :)

I delete my "MakePrettyEmojis" function and my piece of CSS to return to the starting situation.

I add some JavaScript to my "_Layout.cshtml" file:

```
<script src="https://twemoji.maxcdn.com/v/latest/twemoji.min.js" crossorigin="anonymous"></script>

<script>
    window.onload = function () {
        // https://gist.github.com/Armster15/db063ab0dc5be699ae07a067a7333752
        // Parses the document body and
        // inserts <img> tags in place of Unicode Emojis
        twemoji.parse(document.body,
            { folder: 'svg', ext: '.svg' } // This is to specify to Twemoji to use SVGs and not PNGs
        );
    }
</script>
```

Then I size the emojis with CSS:

```
.emoji {
    height: 1.2em;
    width: 1.2em;
    margin: 0 1px;
}
```

<figure>
  <img src="/public/2022/emoji-twitter.png" alt="" />
  <figcaption>Tada! It's perfectly perfect.</figcaption>
</figure>


## Conclusion

Initially, my plan was to replace the Windows 10 emojis with more modern ones (and the latest ones from Microsoft were fine for me). But with the difficulties and to avoid having to "hack" my system, I preferred to just modify my application so that it displays the pretty emojis from Twitter instead.


<div class="encart">

Version en français : {% goto_fr "Remplacer les émojis de Windows 10", "2022-09-19-remplacer-emojis-windows-10" %}.

</div>
