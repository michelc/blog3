---
date: 2009-12-07 18:53:00
layout: post
redirect_from: "post/2009/12/07/formulaires-mise-a-jour-asp-net-mvc"
tags: boulot, mvc
title: "Les formulaires de mise à jour en ASP.NET MVC"
---

J'avais prévu de finir la sixième partie du [tutoriel NerdDinner](http://tinyurl.com/NerdDinnerFR) la
semaine dernière et ça n'a pas marché. Par rapport aux autres parties, je ne
peux pas dire que ça soit beaucoup plus compliqué à suivre, c'est juste que
c'est un peu plus long. Sans compter que les conditions de travail étaient
particulièrement bruyantes cette semaine (quoique ?).

Ce qui fait que j'ai préféré me disperser plutôt que de rester des heures
sans pouvoir réellement avancer :

* j'ai fait plusieurs petits essais pour tenter d'[utiliser la même
vue pour les vues Create et Edit](http://stackoverflow.com/questions/399914/asp-net-mvc-using-the-same-form-to-both-create-and-edit "ASP.NET MVC - using the same form to both create and edit"). Mais pour l'instant j'ai préféré laisser
tombé parce que ce que je faisais n'avait plus vraiment le parfum MVC
* j'ai regardé vite fait la présentation / démonstration de Scott Hanselman
sur les [nouvelles fonctionnalités de ASP.NET MVC 2](http://www.hanselman.com/blog/PDC09ASPNETMVC2NinjasStillOnFireBlackBeltTips.aspx)
* j'ai fait quelques tests avec [T4MVC]({% post_url 2009-12-01-test-t4mvc-contact-manager %}), notamment sur le projet Contact Manager qui me sert de
bac à sable

Ces petits écarts ont quand même réussi à me maintenir à peu près d'attaque
pour venir à bout du tutoriel. Mais par contre, ça n'a pas été suffisant pour
progresser autant sur la traduction.

Le problème, c'est que si dans la journée je patauge pour suivre le
tutoriel, ça fait qu'en soirée j'ai beaucoup de mal à avancer sur la traduction
puisque c'est des trucs que je n'ai pas encore vu ou suffisamment assimilés...
C'est pour cela que malgré mes prévisions pourtant très mesurées, je n'ai pour
l'instant réussi à traduire que les 12 premières pages du tutoriel, consacrées
majoritairement à la partie [Edit
de l'application NerdDinner](/nerddinner/formulaires-crud/).

Et pour la suite, je n'ai qu'un tout petit plus de la moitié des pages
restantes prêtes pour la relecture (et malheureusement, comme j'ai fait ça dans
le désordre, je ne suis pas sûr de pouvoir mettre en ligne les pages consacrées
au ModelState avant mercredi).

Alors pour me reposer de ma semaine, je me suis laissé aller à programmer
pour de vrai. Ca m'a permis de pas mal améliorer le système de rechercher /
remplacer qui fait passer le fichier de dans lequel j'enregistre la traduction
du format Word au format Wiki de Dotclear. Pour cela, je suis parti de
l'application [CleanWordHtml](http://www.codinghorror.com/blog/archives/000485.html) de
Jeff Atwood. Maintenant, je n'ai plus qu'à exporter la traduction au format
HTML filtré et à lancer ma petite application et le résultat obtenu est
quasiment prêt à coller sous Dotclear.

Et grâce à ça, j'ai découvert l'existence de deux fonctions trop
pratiques : [File.ReadAllText()](http://msdn.microsoft.com/en-us/library/system.io.file.readalltext.aspx) et [File.WriteAllText()](http://msdn.microsoft.com/en-us/library/system.io.file.writealltext.aspx). C'est des petits trucs comme ça qui
devraient suffire à tout le monde pour admettre qu'il y a encore beaucoup de
travail avant de pouvoir réaliser proprement une vraie application en ASP.NET
3.5 (MVC ou non). Ou alors, on se contente simplement de refaire plus ou moins
bien en .NET 3.5 ou 4.0 ce qu'on a l'habitude de faire en .NET 1.1...
