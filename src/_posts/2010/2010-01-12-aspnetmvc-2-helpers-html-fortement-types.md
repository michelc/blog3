---
date: 2010-01-12 18:26:00
layout: post
redirect_from: "post/2010/01/12/asp-net-mvc-2-helpers-html_fortement-types"
tags: mvc
title: "ASP.NET MVC 2 : Des helpers HTML fortement typés"
---

{:.encart}
Ceci est la traduction du billet "[ASP.NET MVC 2: Strongly Typed Html Helpers](http://weblogs.asp.net/scottgu/archive/2010/01/10/asp-net-mvc-2-strongly-typed-html-helpers.aspx)" de Scott
Guthrie.

Ceci est le premier billet d'une série consacrée à la prochaine sortie de
ASP.NET MVC 2. Ce billet présente les nouveaux helpers fortement typés qui ont
fait leur apparition dans ASP.NET MVC 2.

## Les helpers HTML actuels

ASP.NET MVC 1 est fourni avec un certain nombre de helpers HTML que vous
pouvez utiliser dans les vues pour simplifier la génération de l'interface
utilisateur en HTML. Par exemple, pour afficher une textbox, vous pouvez
utiliser le helper Html.TextBox() de la façon suivante dans une de vos
vues :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_73A48C5E.png)

Le premier paramètre de la méthode helper ci-dessus fournit le nom et l'id
pour la textbox et le second paramètre défini la valeur qu'elle doit contenir.
Ce helper aura comme effet de produire le code HTML suivant :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_51D8B3CD.png)

## Les nouveaux helpers HTML fortement typés

Une des fonctionnalités qui nous a le plus été demandée était de gérer des
helpers HTML fortement typés basés sur des expressions lambda pour référencer
les objets Model ou ViewModel passés aux vues. Cela permet une meilleure
vérification des vues au moment de la compilation (et donc de découvrir les
bugs lors de la programmation et pas de l'exécution) et aussi la possibilité de
profiter de l'intellisense dans les vues.

Les nouveaux helpers HTML fortement typés font désormais parti de ASP.NET
MVC 2. Ces méthodes utilisent la convention de nommage "Html.HelperNameFor()",
comme par exemple : Html.TextBoxFor(), Html.CheckBoxFor(),
Html.TextAreaFor()... Ils autorisent l'utilisation d'une expression lambda pour
définir en une fois les attributs id/name et la valeur du contrôle à
générer.

Par exemple, avec ASP.NET MVC 2, nous pouvons maintenant utiliser le nouveau
helper Html.TextBoxFor() en plus du Html.TextBox() classique :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_6923B83E.png)

Vous remarquerez dans le code ci-dessus que nous n'avons plus besoin
d'utiliser la chaine "ProductName". Les expressions lambda sont suffisamment
souples pour permettre de retrouver le nom de la propriété ou du champ dans
notre modèle d'objets en plus de sa valeur.

Etant donné que les helpers HTML sont fortement typés, cela nous permet
d'avoir accès à l'intellisense de Visual Studio lorsque nous écrivons
l'expression lambda :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_4757DFAD.png)

Le code HTML généré est exactement le même que pour la version présentée
dans le premier exemple :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_51D8B3CD.png)

## Les helpers HTML fortement typés fournis avec ASP.NET MVC 2

ASP.NET MVC 2 intègre d'ores et déjà les helpers HTML fortement typés
suivants :

### Eléments HTML

* Html.TextBoxFor()
* Html.TextAreaFor()
* Html.DropDownListFor()
* Html.CheckboxFor()
* Html.RadioButtonFor()
* Html.ListBoxFor()
* Html.PasswordFor()
* Html.HiddenFor()
* Html.LabelFor()

### Autres helpers

* Html.EditorFor()
* Html.DisplayFor()
* Html.DisplayTextFor()
* Html.ValidationMessageFor()

Je reviendrai sur les nouvelles méthodes helpers Html.EditorFor() et
Html.DisplayFor() dans un autre billet de cette série quand j'aborderai les
évolutions apportées à la fonctionalité d'auto-scaffold en ASP.NET MVC 2. Nous
verrons aussi le helper Html.ValidationMessageFor() dans le prochain billet de
cette série qui présentera les nouveautés en matière de validation apportées
par ASP.NET MVC 2.

## Les helpers HTML fortement typés et le Scaffolding

VS 2008 et VS 2010 utilisent désormais tous les deux les nouveaux helpers
fortement typés pour auto-générer les vues fortement typées à partir de la
commande "Add View".

Par exemple, supposons que nous ayons une classe "ProductsController" toute
simple comme ci-dessous avec une action Edit() qui renvoie un formulaire de
modification pour un objet "Product" :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_76C64E79.png)

Dans Visual Studio, nous pouvons faire un clic-droit à l'intérieur de
l'action Edit() et choisir la commande "Add View" dans le menu contextul pour
créer une nouvelle vue. Nous choisirons de créer une vue selon le modèle "Edit"
qui sera basée sur un objet de type "Product" :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_5083F521.png)

Avec ASP.NET MVC 2, la vue qui a été créée par défaut utilise désormais les
nouveaux helpers HTML fortement typés pour faire référence à l'objet
Product :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_1815CE49.png)

## Conclusion

Les helpers HTML fortement typés intégrés avec ASP.NET MVC 2 fournissent une
méthode pratique pour obtenir un contrôle du type de données à l'intérieur de
nos vues. Ils permettent un meilleur contrôle de nos vues dès la compilation
(ce qui vous permet de détecter les erreurs à la compilation et pas à
l'utilisation) et ils offrent un support de l'intellisense plus puissant
lorsque vous codez vos vues depuis Visual Studio.

{:.encart}
Ceci est la traduction du billet "[ASP.NET MVC 2: Strongly Typed Html Helpers](http://weblogs.asp.net/scottgu/archive/2010/01/10/asp-net-mvc-2-strongly-typed-html-helpers.aspx)" de Scott
Guthrie.
