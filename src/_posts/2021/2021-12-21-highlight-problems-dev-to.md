---
date: 2021-12-21 13:04:18
tags: [ 11ty ]
title: "Two highlight problems on dev.to"
cover:
  image: /public/2021/matrix.jpg
  text: It's raining code
  link: https://en.wikipedia.org/wiki/The_Matrix
excerpt: Yesterday, I had troubles to highlight my Nunjucks code on dev.to. Also, I had a very strange bug with my markdown snippets.
---

Yesterday, I had troubles to highlight my Nunjucks code on [dev.to](https://dev.to/). Also, I had a very strange bug with my markdown snippets.


## How to highlight Nunjucks on dev.to?

According to [Forem technical docs](https://github.com/forem/forem-docs/blob/main/docs/technical-overview/stack.md), they use [Rouge](https://github.com/rouge-ruby/rouge) to highlight code snippets. Rouge can highlight [over 200 different languages](https://github.com/rouge-ruby/rouge/blob/master/docs/Languages.md). But not [Nunjucks](https://github.com/rouge-ruby/rouge/issues/758)... On the other hand, it supports Liquid, Jinja and Twig who look a lot like Nunjucks.

So I did some tests directly on [dev.to](https://dev.to/michelc) (where results are much more relevant than here on my blog).

### Using &#96;&#96;&#96;liquid

```liquid
<!DOCTYPE html>
<html lang="{% raw %}{{ site.lang }}{% endraw %}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% raw %}{{ title }} - {{ site.title }}{% endraw %}</title>
</head>
<body>
  <!-- Le contenu généré par Eleventy sera ajouté là -->
  {% raw %}{{ content | safe }}{% endraw %}
</body>
</html>
```

### Using &#96;&#96;&#96;jinja

```jinja
<!DOCTYPE html>
<html lang="{% raw %}{{ site.lang }}{% endraw %}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% raw %}{{ title }} - {{ site.title }}{% endraw %}</title>
</head>
<body>
  <!-- Le contenu généré par Eleventy sera ajouté là -->
  {% raw %}{{ content | safe }}{% endraw %}
</body>
</html>
```

### Using &#96;&#96;&#96;twig

```twig
<!DOCTYPE html>
<html lang="{% raw %}{{ site.lang }}{% endraw %}">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{% raw %}{{ title }} - {{ site.title }}{% endraw %}</title>
</head>
<body>
  <!-- Le contenu généré par Eleventy sera ajouté là -->
  {% raw %}{{ content | safe }}{% endraw %}
</body>
</html>
```

### Solution

Liquid doesn't work. Probably because it's the template used by Forem. Jinja and Twig are fine. So I will write my Nunjucks examples by starting my code blocks with <code>&#96;&#96;&#96;jinja</code>.


## A bug with Markdown highlight?

I don't know why, but my Markdown code snippets are not all properly highlighted. If you search for "layout: layout.njk" in my post "[Création de mon site Eleventy](https://dev.to/michelc/creation-de-mon-site-eleventy-mo2)" on dev.to, the first frontmatter is correctly highlighted. But not in the second and third snippets.

I always wrote:

```md
---
layout: layout.njk
---
...
```

But the last two times, it generates too many dashes. And it can't to recognize my code anymore?

```
--------
layout: layout.njk
--------
...
```

*Note: Maybe it's not related to <code>&#96;&#96;&#96;markdown</code>, because it also does it with only <code>&#96;&#96;&#96;</code> at the beginning of the code. On dev.to, I write `--------` (8 dashes) to show exactly what I get on my previous post and it generates `-------------` (13 dashes) instead :)*

And if I move these two blocks at the beginning of my post, the highlight is magically fixed...

If anyone has the solution, I'm curious. But it's not that bad.

*Note: It's fixed! Many thanks to [Daniel](https://dev.to/djuber/comment/1kikf) for solving this problem so quickly and to the whole Forem team for building such a good product.*

Sure, I don't have all this problems on my [blog](https://blog.pagesd.info/). But to be fair, all snippets are just raw code.
