---
layout: page.njk
title: Archives
cover:
  image: /public/archives.jpg
  link: https://unsplash.com/photos/05HLFQu8bFw
  text: Document folders on the shelves - Viktor Talashuk
excerpt: La page des archive de ce blogue, où je reprend à peu près tout ce que j'ai publié un peu partout depuis septembre 2004...
---

{% set current_year = "" %}
{% set current_month = "" %}

{% for post in collections.posts %}

  {% set year = post.date.getFullYear() %}
  {% if current_year != year %}
    {% set current_year = year %}
    {% set current_month = "" %}
## {{ year }}
  {% endif %}

  {% set month = post.date.getMonth() %}
  {% if current_month != month %}
    {% set current_month = month %}
### {{ post.date | date("MMMM yyyy") | capitalize }}
  {% endif %}

* [{{ post.data.title }}]({{ post.url }})
{% endfor %}
