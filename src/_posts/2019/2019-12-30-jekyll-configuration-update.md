---
date: 2019-12-30 14:02:34+200
layout: post
tags: jekyll
lang: en
title: "Jekyll configuration update"
image: "/public/2019/source-code.jpg"
excerpt: "After having refreshed the CSS of my blog, I started to upgrade it. Since I switched from GandiBlog to Jekyll there were still a few things left to do. Since this year I've started blogging again, it's worth it."
---

After having refreshed the CSS of my blog, I started to upgrade it. In fact, since I switched from GandiBlog to Jekyll almost 3 years ago, there were still a few things left to do to finalize the migration. And since this year I've started blogging again, it's worth it.

<figure>
  <img src="{{ page.image }}" alt="source-code" />
  <figcaption>
    <a href="https://unsplash.com/photos/5Ntkpxqt54Y">Source code on a screen - Sai Kiran Anagani</a>
  </figcaption>
</figure>


## Debugging Atom feed

To begin with, a scary bug: the Atom feed wasn't working because of something really stupid. The `<link rel="alternate" type="application/atom+xml">` tag pointed to `/atom.xml`  while the "\_config.yaml" declared `path: feed/atom`.

=> correcting the `path` attribute in "\_config.yaml" :

```yaml
plugins:
  - jekyll-feed

feed:
  path: atom.xml
```

Thanks to this, I can finally see my posts in [FeedDemon](http://www.feeddemon.com/) :)


## Adding images to posts

Lately, I've been trying to put a cover picture every time I write a new post. I started before republishing on [dev.to](https://dev.to/), but the fact that I have to search an illustration for them makes me want to continue on [blog.pagesd.info](https://blog.pagesd.info/). To display the image on this blog, I insert the following HTML code near the top of my post:

```html
<figure>
  <img src="/public/2019/sapin-de-noel.jpg" alt="sapin-de-noel" />
  <figcaption>
    <a href="https://unsplash.com/photos/ySNkCkdKyTY">Sapin de Noël - Rodion Kutsaev</a>
  </figcaption>
</figure>
```

Currently, images on my blog are 640 x 480 pixels while those on dev.to are 1000 x 420 pixels. Before sharing the same picture on the 2 websites, I can already set the image in the YAML Front Matter so that it will be automatically reused in the Atom feed:

```markdown
---
date: 2019-12-16 12:09:42+200
layout: post
tags: css
title: "Nouvelle CSS et 5 trucs bons à savoir"
image: "/public/2019/sapin-de-noel.jpg"
---

...

{% raw %}<figure>
  <img src="{{ page.image }}" alt="sapin-de-noel" />
  <figcaption>
    <a href="https://unsplash.com/photos/ySNkCkdKyTY">Sapin de Noël - Rodion Kutsaev</a>
  </figcaption>
</figure>{% endraw %}
```

That's enough for the image to be automatically reused by the [Jekyll Feed](https://github.com/jekyll/jekyll-feed) plugin:

```xml
<entry>
  ...
  <media:thumbnail url="https://blog.pagesd.info/public/2019/sapin-de-noel.jpg"/>
  <media:content medium="image" url="https://blog.pagesd.info/public/2019/sapin-de-noel.jpg"/>
</entry>
```


## Adding Jekyll SEO Tag plugin

Of course, after setting the cover image in the header, I also want to use it when I post links on Twitter. I could do this manually in the "\_layout/default.html" template, but there's a plugin that does that and more: [Jekyll SEO Tag](https://github.com/jekyll/jekyll-seo-tag).

The most important thing is that this plugin is one of the happy few to be accepted by Github Pages: [About GitHub Pages and Jekyll](https://help.github.com/en/github/working-with-github-pages/about-github-pages-and-jekyll#plugins) (and follow the "Dependency versions" link).

It's very easy to do. First I add this plugin to the list of plugins already used in "\_config.yaml":

```yaml
plugins:
  - jekyll-feed
  - jekyll-seo-tag
```

Then I add `{% raw %}{% seo %}{% endraw %}` in the template "\_layout/default.html" :

```html
    {% raw %}...
    {% seo title=false %}{% endraw %}
  </head>
```

Note: I don't do `gem 'jekyll-seo-tag'` to add the plugin to my "Gemfile" because I didn't install Jekyll locally. I rely exclusively on Github Pages to publish my blog.

I added `title=false` to prevent the plugin from adding the `<title>` tag which I already insert manually before. Voilà! Now my posts include a whole bunch more stuff to improve SEO:

```html
<meta name="generator" content="Jekyll v3.8.5" />
<meta property="og:title" content="Nouvelle CSS et 5 trucs bons à savoir" />
<meta name="author" content="michel" />
<meta property="og:locale" content="en" />
<meta name="description" content="English version: A new CSS and 5 tips to know." />
<meta property="og:description" content="English version: A new CSS and 5 tips to know." />
<link rel="canonical" href="https://blog.pagesd.info/2019/12/16/nouvelle-css-quelques-trucs/" />
<meta property="og:url" content="https://blog.pagesd.info/2019/12/16/nouvelle-css-quelques-trucs/" />
<meta property="og:site_name" content="blog.pagesd.info" />
<meta property="og:image" content="https://blog.pagesd.info/public/2019/sapin-de-noel.jpg" />
<meta property="og:type" content="article" />
<meta property="article:published_time" content="2019-12-16T10:09:42+00:00" />
<script type="application/ld+json">...</script>
```

Good. I can find my Christmas tree. Otherwise, "generator" is meh. "application/ld+json", I don't know? But most importantly, "descriptions" are totally wack :(


## Customizing posts excerpt

With Jekyll, each post is associated with an excerpt that can be used via `post.excerpt` in a table of contents for example. This is also what the Jekyll SEO Tag plugin uses to initialize the descriptions it generates.

The problem is that in my case, the excerpts generated by Jekyll are not great. By default, Jekyll takes the first paragraph of the post. You can possibly extend this by defining an `excerpt_separator: <!--more-->` in "\_config.yaml" and then setting the end of the excerpt with a `<!--more-->` in the posts.

That leaves me 3 solutions:

1. Add `<!--more-->` in all (?) posts, but I would still have the link for the translation at the beginning of the excerpt
1. Remove the link to the translation at the beginning of the post, but I find it's nice to immediatly know there is a translated version for those who are interested.
1. Manually define the content of the snippet by an `excerpt` key in the Front Matter.

As I don't think Github Pages lets me create my own plugins in the "\_plugins" directory (to be tested later but without too much hope), I leave the method of [Scott Watermasysk](https://dev.to/scottw) aside: [Better Jekyll Excerpts](https://scottw.com/blog/better-jekyll-excerpts/).

For now, I'm going to use method #3 and I'm modifying the Front Matter of my posts:

```markdown
---
date: 2019-12-16 12:09:42+200
layout: post
tags: css
title: "Nouvelle CSS et 5 trucs bons à savoir"
image: "/public/2019/sapin-de-noel.jpg"
excerpt: "Pour la nouvelle année à venir, j'ai un peu rafraîchi la charte graphique de mon blogue. Outre le côté 'tout nouveau, tout beau', cela m'a permis de voir 2 ou 3 trucs de CSS et de Jekyll que je ne connaissais pas."
---
```

But I'm not going to spend too much time on it => I only update recent posts and I'll try to stick to it in the future. Or I'll look for another solution...


## Upgrading posts structure

This is a personal thing I've been dragging since I've been blogging. I've always used the `<h1>` tag for the blog title, which leaves me with the `<h2>` tag for the post title and `<h3>` and `<h4>` tags for the different subparts of the article.

But I can see that it's a bit weird and that we usually use the `<h1>` tag for the title of the post. Besides the fact that these days it should be better for SEO, it would make it easier to republish my English posts on [dev.to] (right now I have to be careful about replacing the `### ... ` with `## ... `).

So I started a whole bunch of search & replace to update all my posts and after amending some old malstructured posts, I finally get back into line:

* h1 = title of the post
* h2 = subtitles of the post
* h3 = level 2 subtitles


## Updating the archive page

That was one of the things I had planned to do three years ago, to post the months in French and not in English. I found a few leads all over the place:

* The famous Christophe Ducamp: [Comment localiser la date en français dans Jekyll ?](https://www.christopheducamp.com/2013/12/26/jekyll-localiser-la-date/)
* The update link where he send us: [Traduire la date dans Jekyll](http://ouyaah.legtux.org/informatique/web/2017/05/19/traduire-date-jekyll.html)
* Some leads on Stack Overflow:  [Locale specific date in Jekyll](https://stackoverflow.com/questions/10714980/locale-specific-date-in-jekyll)

In the end, I did this:


```liquid
  {% raw %}{% capture month %}{{ post.date | date: "%m" }}{% endcapture %}
  {% if current_month != month %}
    {% assign current_month = month %}
### {% case month %}
      {% when "01" %}Janvier {{ year }}
      {% when "02" %}Février {{ year }}
      {% when "03" %}Mars {{ year }}
      {% when "04" %}Avril {{ year }}
      {% when "05" %}Mai {{ year }}
      {% when "06" %}Juin {{ year }}
      {% when "07" %}Juillet {{ year }}
      {% when "08" %}Août {{ year }}
      {% when "09" %}Septembre {{ year }}
      {% when "10" %}Octobre {{ year }}
      {% when "11" %}Novembre {{ year }}
      {% when "12" %}Décembre {{ year }}
    {% endcase %}
  {% endif %}{% endraw %}
```

It's not great and I had a bit of a hard time because I also wanted to add the year next to the name of the month. And [kramdown](https://kramdown.gettalong.org/) kept separating month and year so I ended up with the name of the month as `<h3>December</h3>` and the year on a separate line `<p>2019</p>`, when it wasn't `<pre>2019</pre>`.


## Removing syntax highlighting

Speaking of kramdown, I choose to disable the famous "[Code and Syntax Highlighting](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#code)" from Markdown. I don't use it on this blog, so it's not necessary for Jekyll to waste time generating all these `<span>` and for Github to lose money storing all the extra HTML code it represents.

The solution is again on all [About GitHub Pages and Jekyll](https://help.github.com/en/github/working-with-github-pages/about-github-pages-and-jekyll#syntax-highlighting) with 3 extra lines in "\_config.yaml" :

```yaml
kramdown:
  syntax_highlighter_opts:
    disable : true
```

In the end, it reduces the size of some posts with a lot of code and therefore improves the performance of my blog.


## Defining posts language

Looking closer at my new Atom feed or all the tags generated by the Jekyll SEO Tag plugin, I realized that I had a new problem. They both say that my posts are in English. In some cases, it's not wrong, but in the majority of cases, it's not true.

And since for some time I try to publish my posts in both French and English, it's now a serious problem. The solution is to start by declaring that my blog is in French in the "\_config.yaml" file:

```yaml
title: blog.pagesd.info
author: michel
lang: fr-FR
```

Note: I'm not sure which is better: `fr-FR`, `fr-fr` or `fr`.

Then for all English posts, I change the Front Matter to redefine the `lang` attribute:

```markdown
---
date: 2019-12-17 12:09:42+200
layout: post
tags: css
lang: en-US
title: "A new CSS and 5 tips to know"
---
```

Then I have to modify the template in "\_layout/default.html" to use the language defined in the post or the global language of the blog:

```html
{% raw %}<!DOCTYPE html>
<html lang="{{ page.lang | default: site.lang }}">
  <head>
    <meta charset="utf-8">
    ...{% endraw %}
```

To be complete, I also specify the language in the next / previous links at the bottom of each post:

```html
{% raw %}<nav class="paginate">
  {% if post.previous.url %}
    <a href="{{ post.previous.url }}" hreflang="{{ post.previous.lang | default: site.lang }}">{{ post.previous.title }}</a>
  {% endif %}
  {% if post.next.url %}
    <a href="{{ post.next.url }}" hreflang="{{ post.next.lang | default: site.lang }}">{{ post.next.title }}</a>
  {% endif %}
</nav>{% endraw %}
```

And also in links between the translations:

```html
{% raw %}English version: [A new CSS ...]({% post_url ... %}){:hreflang="en"}.{% endraw %}
```

Or:

```html
{% raw %}Version en français : [Nouvelle CSS ...]({% post_url ... %}){:hreflang="fr"}.{% endraw %}
```

The `{% raw %}{:hreflang="xx"}{% endraw %}` trick wasn't easy to find, but it does exist: [Additional link attributes can be added by using a span IAL after the inline link](https://kramdown.gettalong.org/syntax.html#inline-links).

{:.encart}
Version en français : [Mise à jour de la configuration de Jekyll]({% post_url 2019-12-30-maj-configuration-jekyll %}){:hreflang="fr"}.
