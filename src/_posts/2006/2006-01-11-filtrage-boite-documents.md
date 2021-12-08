---
date: 2006-01-11 13:13:00
layout: post
redirect_from: "post/2006/01/11/Filtrage-de-la-boite-Documents"
tags: qc
title: "Filtrage de la boite Documents"
---

Modifications du fonctionnement de la boite Documents pour permettre de
"contextualiser" la liste des documents en fonction d'un argument présent dans
l'url :

* définition du nom du paramètre dans l'écran de configuration,
* utilisation de la valeur attribuée au paramètre lors de l'ajout d'un
nouveau document (la valeur est enregistrée dans le champ catégorie),
* prise en compte de la valeur attribuée à ce paramètre pour filtrer la liste
des documents présentés dans la liste.

Exemple : si le nom du paramètre a été configuré à "folder", le fait
d'appeler la page contenant la boite Documents avec une url de la forme
"http://www.monsite.com/downloads.asxp?folder=sources" permettra de n'afficher
que les documents pour lesquels le champ categorie contient la valeur
"sources". Et les fichiers ajoutés seront automatiquement enregistrés avec la
catégorie "sources".

Lorsque le paramètre n'est pas présent dans l'url, les boutons de mise à
jour des documents (ajout et modification) ne sont pas disponibles.

Important : dans le cas où cette fonctionnalité est
utilisée, il est obligatoire de définir la durée du cache à 0 !
