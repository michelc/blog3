---
date: 2009-12-01 14:12:00
layout: post
redirect_from: "post/2009/12/01/Test-T4MVC-avec-Contact-Manager"
tags: mvc
title: "Test de T4MVC avec le projet Contact Manager"
---

Finalement, j'ai un peu délaissé l'application NerdDinner pour revenir au
projet ContactManager et faire quelques tentatives avec [T4MVC](http://aspnet.codeplex.com/wikipage?title=T4MVC "A T4 template for ASP.NET MVC") (j'ai quand même fini de publier la
traduction de la [
5° partie du tutoriel NerdDinner](/nerddinner/controleurs-vues/ "Utiliser les contrôleurs et les vues pour réaliser une interface liste / détail")).

Première remarque : si on veut utiliser T4MVC il vaut mieux penser à le
faire dès le départ, parce qu'après c'est pas la chose la plus passionnante à
faire. Sans compter que Contact Manager est un tout petit projet... Ce qui est
dommage, c'est que Visual Studio n'est vraiment pas très pratique pour faire ça
à coup de rechercher / remplacer :

* dès qu'on modifie le code trouvé à la main, ça devient assez bizarre quand
on lance la suite de la recherche. J'ai l'impression que ça repart du début du
fichier modifié ou peut être que ça repart en marche arrière... J'ai pas trop
compris comment ça marche et pour être bien certain d'êre passé partout
* la recherche s'applique aussi aux fichiers .designer.cs générés par les
différents concepteurs (et y compris par T4MVC.tt !) alors qu'on en a rien à
faire et qu'il ne faut surtout pas les modifier. Et le pire c'est qu'il n'y a
rien à faire et que [c'est pas
demain la veille que ça va changer](http://connect.microsoft.com/VisualStudio/feedback/ViewFeedback.aspx?FeedbackID=476884 "Find option to exclude designer generated code") !

J'ai malgré tout réussi à venir à bout des différentes mises à jour
nécessaires pour que le source de Contact Manager soit beau comme un sou neuf
en traitant successivement les éléments suivants :

* Html.RenderPartial()
* return View()
* Html.ActionLink()
* Url.Action()
* return RedirectToAction)
* Html.BeginForm()

Je n'ai pas eu à m'occuper des `Ajax.ActionLink()` puisque pour
ma part, j'ai totalement laissé tombé Ajax.NET au profit de [jQuery]({% post_url 2009-11-03-gestion-contacts-aspnetmvc-jquery %} "Gestion de contacts avec ASP.NET MVC et jQuery").

Je ne me suis pas non plus occupé des `routes.MapRoute()` dans le
Global.asax parce qu'il contient seulement la route par défaut et qu'en plus je
ne savais pas trop quoi y faire :

```
routes.MapRoute(
    "Default",                                        // Route name
    "{controller}/{action}/{id}",                     // URL with parameters
    new { controller = "Contact", action = "Index", id = "" } // Parameter defaults
);
```

Mais rien qu'avec ces premiers essais, ça marche plutôt pas mal. Le seul
petit bémol est du côté des vues. Quand on veut utiliser les objets T4MVC à
l'intérieur des balises HTML, Visual Studio n'est pas capable de proposer
l'intellisense et il faut tout taper de tête :

```
<a href="<%= Url.Action(MVC.Contact.Edit(item.Id)) %>">
    <img src="<%= Links.Content.Edit_png %>" alt="Edit" />
</a>
```

Pour contourner ça, il faut procéder en deux étapes et saisir le code à
l'extérieur de la balise puis le couper / coller à l'intérieur de la
balise :

```
<%= Url.Action(MVC.Contact.Edit(item.Id)) %>
<%= Links.Content.Edit_png %>
<a href="">
    <img src="" alt="Edit" />
</a>
```

C'est moyen, mais pas insupportable. Là où c'est plus ennuyeux, c'est que
dans ce cas, s'il y a des erreurs, elles n'apparaissent pas immédiatement lors
de la compilation mais seulement au moment de l'exécution.

Un autre truc qui pourrait s'avérer gênant, c'est que [
T4MVC modifie (très légèrement) le code source](http://blogs.msdn.com/davidebb/archive/2009/06/26/the-mvc-t4-template-is-now-up-on-codeplex-and-it-does-change-your-code-a-bit.aspx "The MVC T4 template is now up on CodePlex, and it does change your code a bit") et qu'il
transforme :

* les classes en `partial`
* les méthodes actions en `virtual`

Je me demande si ça ne pourrait pas être un peu compliqué à gérer par
rapport au contrôle de sources sous Subversion ? Mais là aussi, si on
utilise T4MVC dès le départ, il me semble que cela ne devrait pas poser de
problème (à vérifier).
