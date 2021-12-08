---
date: 2012-06-14 22:56:00
layout: post
redirect_from: "post/2012/06/14/abondance-de-bien-ne-nuit-pas"
tags: ruby
title: "Abondance de bien ne nuit pas"
---

J'ai fait une fonction pour générer un Hash qui va me servir dans la vue à
générer les liens pour un bloc de pagination. Je lui passe le libellé du lien,
le n° de la page vers laquelle doit pointer le lien et le numéro de la page en
cours, avec les règles suivantes :

* si la page de destination n'est pas définie, il ne faut pas faire de lien
mais afficher seulement le texte du lien (c'est utile pour les liens page
précédente / page suivante quand on a atteint un des bords)
* si la page de destination est la même que la page en cours, il ne faut pas
faire de lien et avoir un truc pour dire qu'on est sur la page en cours
* et en bonus, si la page de destination est la 1° page, il ne faut pas faire
le lien vers "/page/1" mais vers "/" (c'est plus joli)

Dans la pratique, je génère en fait un tableau de Hash pour les différentes
pages. Le but, c'est ensuite d'utiliser chaque Hash pour générer un lien de mon
bloc de navigation :

```
<li>
  <% if link[:here] %>
    <strong><%= link[:text] %></strong>
  <% elsif link[:href] == nil %>
    <span><%= link[:text] %></span>
  <% else %>
    <a href="<%= link[:href] %>"><%= link[:text] %></a>
  <% end %>
</li>
```

Ce qui me permet :

* de mettre en évidence la page en cours (balise
`<strong>`)
* de désactiver les liens avant / après si nécessaire (balise
`<span>`)

Pour la fonction qui génère le Hash, j'ai testé pas mal de trucs pour voir
ce que Ruby permet de faire et essayer de m'éloigner un peu de mon style de
CSharpiste, ex VB6isste.

## 1° essai - ce qui m'est venu naturellement (basique mais ça marche)

```
def v1_pagination_lien(texte, destination = nil, page_courante = 0)
  un_lien = { text: texte, href: "/page/#{destination}" }
  if destination == nil
    # pas de page de destination => pas de lien
    un_lien[:href] = nil
  elsif destination == page_courante
    # page de destination est la page en cours => pas de lien
    un_lien[:href] = nil
    un_lien[:here] = true
  elsif destination == 1
    # page de destination est 1° page => lien vers racine
    un_lien[:href] = "/"
  end
  un_lien
end
```

## 2° essai - ce qui pourrait se faire (je me lache)

```
def v2_pagination_lien(texte, destination = nil, page_courante = 0)
  {
    text: texte,
    here: destination == page_courante,
    href: case destination
          when nil then nil           # pas de destination => pas de lien
          when page_courante then nil # destination est la page en cours => pas de lien
          when 1 then "/"             # destination est la 1° page => lien vers racine
          else "/page/#{destination}" # lien vers la page de destination
          end
  }
end
```

## 3° essai - ce qui ferait moins compact (bof bof bof)

```
def v3_pagination_lien(texte, destination = nil, page_courante = 0)
  un_lien = { text: texte }
  un_lien[:href] = case destination
                   when nil then
                     # pas de destination => pas de lien
                     nil
                   when page_courante then
                     # destination est la page en cours => pas de lien
                     un_lien[:here] = true
                     nil
                   when 1 then
                     # destination est la 1° page => lien vers racine
                     "/"
                   else
                     # lien vers la page de destination
                     "/page/#{destination}"
                   end
  un_lien
end
```

## 4° essai - ce qui me parait le plus lisible (à ce jour)

```
def pagination_lien(texte, destination = nil, page_courante = 0)
  case destination
  when nil then
    # pas de page de destination => pas de lien
    un_lien = { text: texte, href: nil }
  when page_courante then
    # page de destination est la page en cours => pas de lien
    un_lien = { text: texte, href: nil, here: true }
  when 1 then
    # page de destination est 1° page => lien vers racine
    un_lien = { text: texte, href: "/" }
  else
    # lien vers la page de destination
    un_lien = { text: texte, href: "/page/#{destination}" }
  end
  un_lien
end
```

Je sais que le dernier `un_lien` n'est pas indispensable, mais je
trouve que sa présence rend plus explicite ce que la fonction retourne.

L'autre avantage, c'est que je me dit que si je faisais des tests unitaires,
ce code là y répondrait parfaitement. Enfin il me semble.
