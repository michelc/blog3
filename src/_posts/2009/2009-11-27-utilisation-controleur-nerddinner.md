---
date: 2009-11-27 16:12:00
layout: post
redirect_from: "post/2009/11/27/Utilisation-contr%C3%B4leur-NerdDinner"
tags: mvc
title: "Utilisation du contrôleur NerdDinner"
---

J'ai fini de refaire les premières étapes du tutoriel NerdDinner et j'ai
réussi à revenir assez vite là où j'en étais au moment de mes premiers essais.
Le fait d'avoir bifurqué entre temps par le tutoriel Contact Manager m'a quand
même bien aidé ce coup-ci dans la 4° étape qui présente le pattern Repository
pour construire le modèle de l'application NerdDinner.

Suite à ça, j'ai aussi réalisé la cinquième étape du tutoriel consacrée aux
contrôleurs et aux vues. Dans cette étape, le but est de développer une
interface de type liste / détail assez classique pour afficher la liste des
dîners et pouvoir consulter un écran avec la fiche complète de chaque
dîner.

Je n'ai rencontré qu'un petit souci au moment de générer la vue
Details.aspx. Je n'ai pas compris pourquoi, mais Visual Studio ajoutait une
ligne pour afficher la propriété IsValid de l'objet Dinner :

```
        <p>
            IsValid:
            <%= Html.Encode(Model.IsValid) %>
        </p>
```

Mais apparemment je ne suis [
pas le seul](http://programujte.com/?akce=clanek&amp;cl=2009072701-asp-net-mvc-v-praxi-od-a-do-z-5-dil-%96-view-sablony) à qui ça fait ça (et pas le seul à traduire NerdDinner non
plus).

Et justement, pour en revenir sur le front de la traduction du tutoriel,
j'ai quasiment terminé de traduire cette [
5° étape](/nerddinner/controleurs-vues/ "Utiliser les contrôleurs et les vues pour réaliser une interface liste / détail") pour laquelle j'ai d'ores et déjà publié 11 pages sur 25. Je relis
le reste ce weekend et la totalité de cette partie devrait être disponible en
tout début de semaine prochaine.

Pour la suite, je vais attaquer la réalisation de la sixième partie où il
sera question des formulaires pour effectuer la mise à jour du contenu de la
table des dîners : ajout, modification et suppression d'un dîner. Ca
risque d'être un assez gros morceau, notamment côté traduction, parce qu'il y a
près de 35 pages. Mais heureusement, cela comprend pas mal de copies d'écran et
de codes sources.

Et surtout, une fois cette partie achevée, j'en serai arrivé à la moitié du
tutoriel !
