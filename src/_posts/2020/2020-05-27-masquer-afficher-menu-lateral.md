---
date: 2020-05-27 12:08:34+200
layout: post
tags: css
title: "Masquer ou afficher le menu latéral"
image: "/public/2020/switches.jpg"
---

Je continue à travailler sur un [template simplissime à 2 colonnes]({% post_url 2020-05-19-creer-template-sidebar-contenu %}). L'objectif du jour étant de pouvoir masquer le menu latéral qui sert pour la navigation.

<figure>
  <img src="{{ page.image }}" alt="interrupteurs..." />
  <figcaption>
    <a href="https://www.heure-industrielle.com/petit-musee-de-l-interrupteur/">Le petit musée de l'interrupteur</a>
  </figcaption>
</figure>

La solution simple, ce serait de mettre une classe "d-none" à la "sidebar" (puisque j'utilise Bootstrap), mais cela ne sera pas suffisant parce que le "content" ne prend pas automatiquement toute la largeur.

Allons y pas à pas et voyons ce qu'il faut faire :

* Masquer la "sidebar" => lui ajouter une classe "hidden",
* Faire en sorte que le "content" occupe tout l'écran => ajouter une classe "full-width".

Ce qui côté HTML donnerait :

```html
<nav id="sidebar" class="hidden">
    ...
</nav>
<div id="content" class="full-width">
    ...
</div>
```

Et côté CSS :

```css
#sidebar.hidden {
    display: none;
}
#content.full-width {
    width: 100%;
}
```

Et inversement, quand je veux ré-afficher la barre de navigation :

```html
<nav id="sidebar" class="visible">
    ...
</nav>
<div id="content" class="less-width">
    ...
</div>
```

Plus :

```css
#sidebar.visible {
    display: block;
}
#content.less-width {
    width: calc(100% - 299px);
}
```

Ca marche ! Voyons maintenant comment obtenir le même résultat un peu plus intelligement...

Mon premier essai mobilise 4 classes différentes alors qu'en gros il n'y a que 2 possibilités :

* On a une "sidebar" et le "content" => sidebar = true (par défaut),
* On n'a que le "content" => sidebar = false (à la demande).

Ce que je peux faire en utilisant une seule classe "no-sidebar" :

* Par défaut cette classe n'est pas utilisée => la "sidebar" est visible,
* Et pour masquer la "sidebar" il suffit d'ajouter cette classe.

Pour être malin, je fais ça au niveau du "wrapper" qui englobe "sidebar" et "content" :

```html
<div id="wrapper" class="no-sidebar">
```

Et ce coup-ci je n'ai besoin que de 2 règles CSS :

```css
.no-sidebar #sidebar {
    display: none;
}
.no-sidebar #content {
    width: 100%;
}
```

Bien mieux !

Maintenant, il suffit d'un bouton et d'un rien de Javascript pour afficher ou masquer la "sidebar".

```html
<button id="sidebar-toggle">Masquer / Afficher</button>
```

Le code Javascript vraiment tout simple (et qui utilise jQuery parce que j'en aurai aussi besoin pour mes formulaires) :

```javascript
<script src="js/jquery-3.4.1.min.js"></script>
<script>
    $(document).ready(function () {

        $("#sidebar-toggle").on("click", function () {
            $("#wrapper").toggleClass("no-sidebar");
        });

    });
</script>
```

Pour récapituler, il suffit de 4 éléments pour réaliser une présentation sur 2 colonnes, avec une barre latérale rétractable :

* Une div "#wrapper" pour englober tout le contenu,
* Un nav "#sidebar" pour contenir la barre latérale pour le menu de navigation,
* Une div "#content" pour contenir le contenu principal,
* Une classe .no-sidebar quand il faut masquer la barre latérale.

Et finalement, de très peu de CSS (si on enlève tout ce qui sert à présenter le contenu) :

```css
#wrapper {
    display: flex;
    width: 100%;
}

#sidebar {
    min-height: 100vh;
    position: fixed;
    width: 299px;
}

#content {
    min-height: 100vh;
    position: absolute;
    right: 0;
    width: calc(100% - 299px);
}

.no-sidebar #sidebar {
    display: none;
}

.no-sidebar #content {
    width: 100%;
}
```

Plus éventuellement pour ne pas imprimer la "sidebar" (comme elle destinée à contenir des éléments de navigation uniquement) :

```css
@media print {
    #sidebar { display: none;}
    #content { width: 100%; }
}
```

On peut aussi se contenter d'ajouter la classe Bootstrap "d-print-none" à "sidebar".

![](/public/2020/clic2.gif)

Youpi ! Mon 1° GIF animé depuis des siècles, ou en tout cas depuis le siècle dernier (créé grâce à [https://ezgif.com/](https://ezgif.com/)).

C'était pas très compliqué... Aussi je ferais sans doute une 3° partie pour améliorer le côté "artistique" :

* Utiliser une icone pour afficher ou cacher la "sidebar",
* Ajouter une animation pour passer d'un état à l'autre.

{:.encart}
English version: [Hide or show sidebar]({% post_url 2020-05-28-hide-show-sidebar %}){:hreflang="en"}.
