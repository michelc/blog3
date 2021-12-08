---
date: 2020-05-19 19:42:12+200
layout: post
tags: css
title: "Créer un template simple avec sidebar + contenu"
image: "/public/2020/first-plan.jpg"
---

Je fais quelques essais sur une application de gestion et plutôt que d'avoir une barre de navigation "compliquée" en haut de l'écran, j'aimerai tester ce que donnerait un template basique avec seulement 2 colonnes :

* Une barre latérale pour la navigation,
* Une zone principale pour tout le contenu du site.

<figure>
  <img src="{{ page.image }}" alt="premiers croquis..." />
  <figcaption>
    <a href="https://www.pexels.com/fr-fr/photo/a-l-interieur-architecte-architecture-art-323645/">Photo de Karol Dach</a>
  </figcaption>
</figure>

J'ai trouvé pas mal d'exemples et même des modèles de pages tout faits pour arriver à ce résultat, mais ils font généralement beaucoup plus que ce dont j'ai besoin, et surtout, j'aimerai arriver à comprendre comme cela fonctionne.

Pour me simplifier la vie, je vais faire ça avec Bootstrap 4, en m'inspirant grandement de ce que j'ai pu voir dans différents tutoriels et templates qui existent. Le premier truc à faire, c'est d'avoir deux blocs `div` :

* "#sidebar" pour la barre latérale de navigation,
* "#content" pour la zone de contenu général.

Pour que ces 2 blocs se tiennent côte à côte, il faut les englober dans un autre bloc `div`, le "#wrapper" :

```
<div id="wrapper">
    <nav id="sidebar">
        ...
    </nav>
    <div id="content">
        ...
    </div>
</div>
```

Puis le plus simple pour arriver à nos fins, c'est d'utiliser le modèle de boite "flexible" :

```
#wrapper {
    display: flex;
    width: 100%;
}
```

Il ne reste alors qu'à dimensionner nos 2 zones (avec un peu de rose pour mieux voir ce qui se passe) :

```
#sidebar {
    background-color: pink; /* debug */
    width: 299px;
}

#content {
    width: calc(100% - 299px);
}
```

Ce qui donne quelque chose de pas encore fini mais qui fait ce que je souhaite :

![](/public/2020/clic1-a.png)

Une première amélioration pour que la "sidebar" utilise toute la hauteur :

```
#sidebar {
    min-height: 100vh;
}
```

C'est mieux. Je peux alors tester ce qui se passe en cas de défilement en ajoutant à la fin de "content" :

```
<p class="scroll">...</p>
<p>La fin.</p>
```

Avec le CSS qui va bien :

```
.scroll {
    margin-bottom: 50rem;
}
```

Ça marche, mais la "sidebar" défile avec le reste de la page. Je ne suis pas sûr que ça me dérange tant que ça. Mais supposons que je veuille que le bloc de navigation reste fixe, alors il faut l'empêcher de se défiler avec le reste de la page :

```
#sidebar {
    position: fixed;
}
```

OK. La "sidebar" ne bouge plus. Par contre, y'a le "content" qui passe dessous et vient s'ancrer sur le côté gauche de l'écran...

![](/public/2020/clic1-b.png)

Il faut que je trouve un truc pour le coincer à gauche de la "sidebar", ou plutôt à droite de l'écran :

```
#content {
    position: absolute;
    right: 0;
}
```

C'est beaucoup mieux :

![](/public/2020/clic1-c.png)

Je peux maintenant m'attaquer au côté esthétique de la chose.

Pour commencer, faire en sorte que le contenu soit moins tassé :

```
#content {
    padding: 15px 30px 30px 30px;
}
h1 {
    margin-bottom: 30px;
}
```

Puis rendre les liens de navigation entièrement cliquables, avec un petit effet au survol :

```
#sidebar a {
    display: block;
    padding: 30px;
    text-decoration: none;
}
#sidebar .sidebar-menu a {
    padding: 10px 30px;
}
#sidebar a:hover {
    background-color: hotpink;
}

```

Et ben c'est pas mal du tout pour un début :

![](/public/2020/clic1-d.png)

C'est exactement ce que je voudrais et en plus, c'est moi qui l'ai fait ! Bon, en vrai, je voulais aussi pouvoir masquer la "sidebar"...

{:.encart}
English version: [Create a basic template with sidebar + content]({% post_url 2020-05-20-create-template-sidebar-content %}){:hreflang="en"}.
