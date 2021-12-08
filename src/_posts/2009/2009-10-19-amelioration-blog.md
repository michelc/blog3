---
date: 2009-10-19 18:42:00
layout: post
redirect_from: "post/2009/10/19/Am%C3%A9lioration-du-blog"
tags: ap, referencement
title: "Amélioration du blog de l'Ardèche"
---

Cette fois-ci, j'ai cherché à améliorer le [blog de l'Ardèche](http://07-ardeche.com/blog.aspx). Jusqu'à
présent, c'était presque plus proche d'une saisie de pages à la chaine que d'un
véritable blog digne de ce nom.

Dans un premier temps, j'ai fait évoluer la partie administration du blog.
J'ai amélioré le contrôle utilisateur employé pour le wysiwyg afin qu'il soit
plus adapté lors de la saisie du résumé des billets. Et j'en ai profité pour
gérer de façon plus cohérente le contrôle du code html saisi, notamment en ce
qui concerne la vérification des urls relatives.

Comme pour l'instant j'utilise surtout le blog pour saisir des informations
destinées à l'agenda, j'ai décidé d'ajouter la saisie d'une période de dates à
chaque billet. Ce n'est peut-être pas très orthodoxe, mais au moins je peux
faire ressortir cette période lors de l'affichage des billets.

J'ai aussi fait quelques essais pour générer en automatique le résumé des
billets en fonction des premières lignes du billet complet. Mais il faudrait
que je revoie ça autrement. Mais au moins, je suis certain de toujours avoir un
résumé (ou plutôt une accroche) que je peux utiliser pour définir la balise
&lt;description&gt; de la page dans laquelle est publiée le billet.

Après m'être occupé de mes besoins, je me suis consacré à ceux des
visiteurs. Pour commencer (et pour me faire un peu plaisir), j'ai mis en place
le format [hAtom](http://microformats.org/wiki/hatom-fr) pour publier les billets du blog.

```
<div class="hentry" id="post-23">
  <h3 class="entry-title">
    <a href="/blog/2009/10/2eme-festival-soupes-pays-ardeche-meridionale.aspx" rel="bookmark">2ème Festival des Soupes du Pays de l'Ardèche Méridionale</a>
  </h3>
  <p class="published" title="2009-10-17T14:25:32">Publié le samedi 17 octobre 2009, 14:25.</p>
  <div class="entry-content">
    ...
  </div>
</div>
```

Puis j'ai travaillé à la navigation. Jusqu'à présent, on pouvait consulter
le contenu d'un billet mais une fois là, il fallait savoir se débrouiller pour
poursuivre la consultation du blog ou du site. C'est maintenant de l'histoire
ancienne puisque j'ai ajouté des liens vers le billet précédent et vers le
billet suivant ainsi qu'un lien qui permet de revenir à l'index des billets du
blog.

Et en ce qui concerne cette page principale du blog, comme elle commençait à
atteindre une certaine longueur, je lui ai ajouté un système de pagination pour
présenter une dizaine de billets dans chaque page. Et puis finalement, j'ai
préféré faire apparaitre les billets complets dans les pages d'archives comme
c'est le cas avec Dotclear. Par conséquent, j'ai dû réviser le nombre de
billets par page à la baisse et pour l'instant j'en fait apparaitre cinq par
page.

Et pour finir, j'ai ajouté un fil Atom des billets du blog. J'ai fait ça un
peu à la barbare (à coup de StringBuilder) et pour compenser, j'ai utilisé
FeedBurner pour le publier : <http://feeds.feedburner.com/07-ardeche>. Après ça, je n'ai eu qu'à
ajouter la ligne suivante à mon template pour activer la découverte automatique
de mon nouveau fil Atom :

```
<link rel="alternate" type="application/atom+xml" title="Atom 1.0" href="http://feeds.feedburner.com/07-ardeche" />
```
