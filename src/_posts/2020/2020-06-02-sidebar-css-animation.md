---
date: 2020-06-02 13:28:16+200
layout: post
lang: en-US
tags: css
title: "Sidebar animation with CSS"
image: "/public/2020/swing.jpg"
---

I've already made a [template with content + sidebar]({% post_url 2020-05-20-create-template-sidebar-content %}), then to [hide or show the sidebar]({% post_url 2020-05-28-hide-show-sidebar %}) quite simply. I will now try to improve these basic attemps with some CSS animations and a few icons.

<figure>
  <img src="{{ page.image }}" alt="swings" />
  <figcaption>
    <a href="https://unsplash.com/photos/HTCQCvwV9XY">Flying - ckturistando</a>
  </figcaption>
</figure>


## Animate the change of state

It's very simple: I just complete the "sidebar" and "content" styles with:

```css
transition: all 1s;
```

This is a CSS property which in 1 second (to have time to see what is going on) will animate the passage of the following CSS values:

```css
#sidebar {
    display: block;
}
#content {
    width: calc(100% - 299px);
}
```

To these new values:

```css
.no-sidebar #sidebar {
    display: none;
}
.no-sidebar #content {
    width: 100%;
}
```

Now, when I click on the "sidebar-toggle" button, adding the "no-sidebar" class to the "wrapper" div shouldn't immediately hide the "sidebar" and expand the "content". It should last 1 second and be done gradually.

It works right away! Almost...

For the "content", we can clearly see it "move" when we click on the button to use the full width of the screen.

On the other hand, the "sidebar” disappears or appears instantly. This is because the change of the "display” property from "block” to "none” is not handle by CSS animations :(

So we have to use a hack and hide the "sidebar" by taking it out of the screen. For this, we set a negative margin equal to its width:

```css
#sidebar {
    margin-left: 0;
}

.no-sidebar #sidebar {
    margin-left: -299px;
}
```

We can speed up the animation (because otherwise the *lorem ipsum dolor sit amet...* is pitching and will end up making me sick):

```css
transition: all 0.25s;
```

Well, it seems perfect to me.

Note: the `transition: all 0.25s` must be defined twice: once for the CSS of "#sidebar" and a second time for the CSS code of "#content".


## Use an icon to switch between states

Finally, I'm not going to use an icon but a regular character with some CSS to make it look good.

And since I'm not good enough, I copy/paste everything from StackOverflow: [Style a link to be a circle with an arrow inside](https://stackoverflow.com/questions/22975037/style-a-link-to-be-a-circle-with-an-arrow-inside).

I start by replacing the button with an `a` tag:

```html
<a href="#" id="sidebar-toggle"></a>
```

Then I add the CSS code:

```css
#sidebar-toggle {
    background-color: orange;
    border-radius: 50%;
    display: block;
    height: 2.2rem;
    left: -1.1rem;
    position: absolute;
    text-decoration: none;
    top: 7px;
    width: 2.2rem;
}
#sidebar-toggle::after {
    content: "🡐";
    color: white;
    display: block;
    font-size: 1.6rem;
    font-weight: bold;
    margin: -.2rem 0 0 0;
    text-align: center;
}
.no-sidebar #sidebar-toggle::after {
    content: "🡒";
    margin-left: .2rem;
}
#sidebar-toggle:hover {
    background-color: goldenrod;
}
```

Note: For both arrows, I picked from [Unicode Arrows](http://xahlee.info/comp/unicode_arrows.html).

Good, it works.

To be almost perfect, I have to position this "icon" right on the edge between the "sidebar" and the "content":

```css
#sidebar-toggle {
    position: absolute;
    left: -1.25rem;
    top: 7px;
}
```

Plus, remember to hide it when printing:

```css
@media print {
    #sidebar-toggle { display: none; }
}
```

This will do the trick :)


## Demonstration

<script async src="//jsfiddle.net/qo6dx3w4/1/embed/result/"></script>

Well, now that I have the template I looked for and even more thanks to these last additions, I can work for real and start coding my application...

{:.encart}
Version en français : [Animer une sidebar avec CSS]({% post_url 2020-06-01-animation-css-sidebar %}){:hreflang="fr"}.
