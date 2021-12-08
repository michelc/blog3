---
date: 2019-11-05 12:11:04+200
layout: post
lang: en-US
tags: javascript, tutoriel
title: "How I wrote a Node JS tutorial"
image: "/public/2019/ididitmyself.jpg"
---

A few weeks ago, I started writing a tutorial on developing a Node JS application with Express to manage an SQlite database. I published it on my blog under the title [CRUD Application with Express and SQlite in 10 steps]({% post_url 2019-10-08-crud-with-express-sqlite-10-steps %}) and I did some publicity about it in the hope that it could be used by others.

<figure>
  <img src="{{ page.image }}" alt="#ididitmyself" />
  <figcaption>
    <a href="https://commons.wikimedia.org/wiki/File:Dirty_dishes.jpg">C'est moi qui l'ait fait !</a>
  </figcaption>
</figure>

But anyway, I wrote this tutorial primarily for my own account. I am trying to improve myself gradually in JavaScript (and therefore Node) and my objective is to achieve some console programs or small web applications.

There are a lot of very good things on the internet and it helps a lot to learn at your own pace. What is particularly interesting is the wide range of variety. If you block somewhere, you always find other items that are more suitable and help you get by. And when you get tired of a subject, you can also find other things to do to change your mind and get motivation back.

But sometimes it's still difficult to "really" get started. For example, for the web part, even if you can easily find lots of tutorials, it's not always easy. They are almost always in English - it can be fine. They are not always very recent - the web goes so fast. But my biggest problem is that either they are too basic, or I get lost on the way because they also try to explain a lot of other things to me: MongoDB, WebPack, TypeScript, React, Vue, Docker....

So I had been trying to develop a small web application with Node for a while. This meant using Express since it is the most popular framework on the market. I don't have too much time to devote to it, so don't bother getting lost with Koa, Hapi, Polka and others...

The dream would have been to find something that tinkered with, like when I discovered Sinatra with "[I did it my way]({% post_url 2010-07-22-installer-sinatra-windows-7 %})". But well, [Darren Jones](https://twitter.com/daz4126)  doesn't seem determined to do it again with Node :)

One day (I had just finished a quick application with ASP.NET MVC 5 and Bootstrap 4 that I could have done in Node if I had known how), I told myself that apart from time, I didn't really need much to get around it:

* A simple example of an ExpressJS application, without falling directly into its generator part
* The basics of using a SQL database with JS Node

Personally, I already know:

* JavaScript (I'm working on it)
* Node (I regularly go back to it)
* HTML (hence the EJS views without any problem)
* SQL (as long as there is no INNER JOIN)
* ASP.NET MVC and Sinatra (so the organization of a web application)
* Bootstrap (at least the copy/paste side)

In theory, I had everything I needed to try to develop a first application on my own. That's what I did. And looking at it, pretty quickly actually. Then I rewrote it a second time to clean it up a little bit and remove all the bits of code that were going in all directions. Then more or less a third time by noting how I wrote a blog post so I wouldn't forget anything.

And that's how I finally ended up with a "big" tutorial. A short weekend, a few checks, a dozen screenshots and the result was ready to be published!

The advantage is that it's quite exactly the tutorial I would have liked to find. It would have saved me time, but it wouldn't have been as concrete and I probably wouldn't have assimilated as well what I was doing by following someone else's tutorial. It always seems obvious when you do a tutorial and you easily let yourself go to a few copy/paste, to "I see" without trying too hard to understand...

The other advantage is that from this initial application, I was able to extend my experiments and see how:

* Access a PostgreSQL database
* Use more or less the same code for SQlite and PostgreSQL
* Replace callbacks with async / await
* Validate the data entry form
* And so on...

{:.encart}
Version en français : [Comment j'ai écrit un tutoriel Node JS]({% post_url 2019-11-04-comment-j-ai-ecrit-un-tutoriel %}){:hreflang="fr"}.
