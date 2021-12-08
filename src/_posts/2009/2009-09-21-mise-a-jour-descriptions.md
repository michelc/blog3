---
date: 2009-09-21 13:38:00
layout: post
redirect_from: "post/2009/09/21/Mise-%C3%A0-jour-des-descriptions"
tags: ap, referencement
title: "Mise à jour des descriptions"
---

J'ai terminé l'ajout des balises descriptions aux pages des tags de
l'annuaire dans les délais que j'avais envisagés. Et j'ai même trouvé le temps
compléter les descriptions de quelques pages isolées : séances cinéma de
l'été, formulaire de contact, plan du site...

Cela m'a d'ailleurs donné l'occasion d'améliorer Altrr-Press pour supprimer
les guillemets lors de la saisie des champs description et mots clés dans le
formulaire de mise à jour d'un écran. Cela évite de générer ensuite des balises
description ou keywords avec des guillemets inopportun.

Pour les pages de l'annuaire contenant les liens, j'ai d'abord regardé
comment fonctionnent les autres annuaires et j'ai fait à peu près pareil. Dans
ce cas, le consensus semble être de reproduire le début du texte décrivant le
site internet lié dans la balise description. L'avantage de cette méthode,
c'est que c'est rien que de la programmation et que c'est donc assez rapide à
mettre en oeuvre.

Pour suivant sur ma lancée, j'ai aussi commencé à insérer des descriptions
pour les pages consacrées aux communes de l'Ardèche. Pour l'instant, je n'en ai
fait qu'une bonne soixantaine. Mais en attendant d'avoir traité l'ensemble des
339 communes, j'ai codé un truc pour générer automatiquement une balise
description contenant un texte du type "*Informations, plan et liens sur la
commune de Xxxxxxx en Ardèche*".

Après ça, il ne me restera plus qu'à régler le cas du [répertoire
des offices de tourisme ardéchois](http://07-ardeche.com/annuaire/office-tourisme.aspx) pour qu'en théorie chaque page du site
ait une balise description différente. Mais dans ce cas, il faudra que je
profite de ces modifications pour revoir le contenu de ces pages, et notamment
les coordonnées des offices de tourisme.
