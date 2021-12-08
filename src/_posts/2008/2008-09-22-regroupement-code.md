---
date: 2008-09-22 10:29:00
layout: post
redirect_from: "post/2008/09/22/Regroupement-de-code"
tags: ap, code-killer
title: "Regroupement de code"
---

Ces derniers temps (mais pas que finalement), j'avais ajouté vite fait des
morceaux de code par ci et par là et petit morceau par petit morceau j'ai fini
par me retrouver avec des fonctions qui font un peu peur à voir.

C'est comme ça que la fonction SiteMenu() était devenu un véritable
fourre-tout qui servait pour générer beaucoup de choses :

* les menus : ça ça parait normal
* le plan du site : une espèce de menu général
* le sitemap pour Google : un menu général mais généré pas pareil

A l'origine, cette fonction parcourait la liste des écrans et représentait
le menu d'une page sous forme de blocs ul / li en tenant compte des
autorisations définies.

A côté de ça, il y avait aussi 3 autres procédures qui parcouraient la liste
des écrans pour proposer une liste de liens possibles, sauf qu'on y gérait un
peu moins bien les autorisations :

* dans le contrôle SelectLink utilisé dans certaines boites
* lors de l'initialisation de l'éditeur wysiwyg
* pour l'interface Ajax de l'éditeur wysiwyg

Au lieu de tout ça, il y a maintenant une nouvelle classe Browse qui est
utilisée partout, ce qui permet :

* de parcourir les écrans de la même façon dans tous les cas,
* de diminuer la quantité de code (1 procédure au lieu de 4),
* de dissocier la génération de menu de celle du plan du site et de celle du
sitemap XML,
* de corriger un bug dans l'imbrication des écrans.

Dans le même genre, il y avait aussi plusieurs procédures destinées à
parcourir les répertoires et à proposer une liste de fichiers
existants :

* dans les contrôles SelectFile et SelectLink utilisés dans certaines
boites
* pour la liste des images et des documents de l'éditeur wysiwyg
* pour l'interface Ajax de l'éditeur wysiwyg

Et là aussi, c'était pas géré tout à fait pareil dans chacun des cas.

Même problème => même solution : la classe Browse a été complétée
pour permettre aussi de parcourir les fichiers et ainsi remplacer les
différentes procédures par une seule façon de faire.

A final, au lieu de plusieurs morceaux de codes dispersés un peu partout,
tout est rassemblé dans la classe Browse où on n'a plus que :

* ArrayList Browse.ScreenList () : liste des écrans filtrés en fonction
des autorisations
* StringBuilder Browse.HtmlSitemap () : génère un plan du site à base de
blocs ul /li
* StringBuilder Browse.XmlSitemap () : génère un sitemap XML pour les
moteurs de recherche
* void Browse.ScreenToList () : initialise les listes d'écrans attendues
par les contrôles de saisie
* void Browse.FileToList () : initialise les listes de fichiers
attendues par les contrôles de saisie

Et pour être tout à fait complet, il resterait à fignoler la mise au propre
de la fonction SiteMenu() et pourquoi pas l'intégrer directement à la classe
Browse.
