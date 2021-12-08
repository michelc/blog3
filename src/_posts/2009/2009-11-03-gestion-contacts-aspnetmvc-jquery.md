---
date: 2009-11-03 16:15:00
layout: post
redirect_from: "post/2009/11/03/Gestion-de-contacts-avec-ASP.NET-MVC-et-jQuery"
tags: jquery, mvc
title: "Gestion de contacts avec ASP.NET MVC et jQuery"
---

La dernière étape du tutoriel [Développer une application de gestion de contacts avec ASP.NET
MVC]({% post_url 2009-11-02-utiliser-ajax-aspnetmvc %}) consistait à ajouter de l'Ajax dans l'application pour la rendre plus
performante et plus moderne. Pour parvenir à cela, le tutoriel utilisait
Ajax.NET pour les requêtes Ajax et jQuery pour les animations.

De mon côté, j'ai préféré faire entièrement confiance à la librairie
[jQuery](http://jquery.com/ "The Write Less, Do More, JavaScript Library") : à la fois pour
les animations et pour les fonctionnalités Ajax.

## Utilisation d'une vue partielle via jQuery

Il suffit de remplacer les 3 fonctions Javascript beginContactList(),
successContactList() et failureContactList() par le tout petit script
suivant :

```
<script type="text/javascript">

    $(document).ready(function() {

        // Ajax Loading
        $("#leftColumn li a").click(function() {

            $("#leftColumn li").removeClass('selected');
            $(this).parent().addClass('selected');

            var url = $(this).attr("href");

            $("#divContactList")
                .fadeOut()
                .load(url, function() {
                    $(this).fadeIn();
                });

            return false;

        });

    });

</script>
```

Explication de code :

* `$("#leftColumn li a")` pour toutes les balises
`<a>` comprises dans un élément `<li>`
apparaissant dans la balise ayant l'identifiant `leftColumn`
* `.click(function()` on associe une fonction à l'évènement
"click" de ces balises
* `$("#leftColumn li").removeClass('selected');` supprime la
classe "selected" de tous les éléments `<li>`
* `$(this).parent().addClass('selected');` ajoute la classe
"selected" au parent du lien `<a>` qui a été cliqué
* `var url = $(this).attr("href");` retrouve l'url correspondant
au lien `<a>` qui a été cliqué
* `$("#divContactList")` sélectionne l'élément ayant l'identifiant
`divContactList`
* `.fadeOut()` fait disparaitre progressivement l'élément
sélectionné
* `.load(url, function() {` charge un contenu externe pointé par
url dans l'élément sélectionné puis appelle une fonction lorsque le chargement
est terminé
* `$(this).fadeIn();` fait apparaitre progressivement l'élément
sélectionné
* `return false;` annule l'action en cours, c'est à dire le clic
sur un lien => le navigateur ne vas pas charger la page dont l'url est
définie dans la propriété `href` de la balise
`<a>`

L'avantage avec cette solution, c'est que du point de vue du développeur, on
doit connaitre uniquement jQuery et pas jQuery (pour les animations destinées à
rassurer l'utilisateur) + Ajax.NET.

D'autre part, on continue à utiliser la fonction Html.ActionLink() au lieu
de la fonction Ajax.ActionLink() au niveau de la vue Index.aspx :

```
    <ul id="leftColumn">
    <% foreach (var item in Model.Groups) { %>
        <li<%= Html.Selected(item.Id, Model.SelectedGroup.Id) %>>
            <%= Html.ActionLink(item.Name, "Index", new { id = item.Id }) %>
        </li>
    <% } %>
    </ul>
```

Ce qui en HTML donne le code suivant :

```
    <ul id="leftColumn">
        <li class="selected">
            <a href="/Contact/Index/1">Business</a>
        </li>
        <li>
            <a href="/Contact/Index/2">Friends</a>
        </li>
    </ul>
```

On a bien une balise `<a>` toute simple (`<a
href="/Contact/Index/1">Business</a>`) qui est parfaite pour
être sélectionnée en jQuery avec l'expression `$("#leftColumn li
a")`.

Pour mémoire, utiliser Ajax.NET et sa méthode Ajax.ActionLink(), c'est pas
l'horrible soupe des WebForms, mais ça commence quand même à faire
peur :

```
    <ul id="leftColumn">
        <li class="selected">
                <a groupid="1" href="/Contact/Index/1" onclick="Sys.Mvc.AsyncHyperlink.handleClick(this, new Sys.UI.DomEvent(event), { insertionMode: Sys.Mvc.InsertionMode.replace, updateTargetId: 'divContactList', onBegin: Function.createDelegate(this, beginContactList), onFailure: Function.createDelegate(this, failureContactList), onSuccess: Function.createDelegate(this, successContactList) });">Business</a>
        </li>
        <li>
                <a groupid="2" href="/Contact/Index/2" onclick="Sys.Mvc.AsyncHyperlink.handleClick(this, new Sys.UI.DomEvent(event), { insertionMode: Sys.Mvc.InsertionMode.replace, updateTargetId: 'divContactList', onBegin: Function.createDelegate(this, beginContactList), onFailure: Function.createDelegate(this, failureContactList), onSuccess: Function.createDelegate(this, successContactList) });">Friends</a>
        </li>
    </ul>
```

## Faire les suppressions via jQuery

Là aussi, c'est un jeu d'enfant que de se débarrasser de Ajax.NET :

```
<script type="text/javascript">

    $(document).ready(function() {

        // Ajax Loading
        ...

        // Ajax Deletes
        $(".delete a").click(function() {
            var answer = confirm('Delete contact?');
            if (answer == true) {
                var url = $(this).attr("href");
                $("#divContactList")
                    .fadeOut()
                    .html($.ajax({
                        type: "DELETE",
                        url: url,
                        cache: false,
                        async: false
                    }).responseText)
                    .fadeIn();
            }
            return false;
        });

    });

</script>
```

On associe une fonction à tous les liens compris dans une classe "delete"
(ce qui se dit `$(".delete a").click(function() { ... })` en
jQuery). Cette fonction commence par demander à l'utilisateur de confirmer
qu'il veut bien supprimer le contact (ce qui se dit "Delete Contact?" en
anglais). Si l'utilisateur répond par l'affirmative (`answer ==
true`), on fait disparaitre la balise contenant la liste des contacts, on
remplace son contenu par le résultat d'une requête Ajax puis on la fait
ré-apparaitre.

Et pour finir, on fait un `return false;` pour éviter que le
navigateur suive le lien cliqué et atterrisse sur le formulaire de suppression
qu'on a laissé là pour les navigateurs qui ne supportent pas le Javascript.

Pour information, j'ai utilisé le paramètre `async: false` pour
attendre que la requête Ajax soit terminée côté serveur. En effet, ce n'est
qu'à la fin de l'action AjaxDelete() que le contrôleur nous renvoie la liste
des contacts mis à jour. Sans ce paramètre, le navigateur lancerait la requête
Ajax puis mettrait immédiatement à jour le contenu de la divContactList, ce qui
ne marcherait pas puisque la requête Ajax n'aurait encore rien renvoyé.

## Mise à jour (12/11/2009)

Cette méthode présente un tout petit défaut. La fonction jQuery chargée
d'ajaxifier les liens pour la suppression s'exécute une fois que la page a été
chargée (c'est le propre de la méthode `$(document).ready( ...
)`).

Le problème, c'est que lorsque on change de groupe, on remplace
dynamiquement une partie du contenu de la page sans la recharger
entièrement ! Et c'est là que le bât blesse. Les liens suppression du
nouveau contenu ne sont donc pas ajaxifiés et se comportent de façon
classique :

* lien vers la vue destinée à faire confirmer la suppression du contrat
* post vers l'action Delete du contrôleur Contact en cas de confirmation

Heureusement, ce n'est pas trop compliqué à corriger. Il suffit de penser à
relancer le bout de code jQuery `$(".delete a").click( ... )` une
fois le contenu mis à jour.

Au final, cela donne donc le source javascript suivant :

```
<script type="text/javascript">

    $(document).ready(function() {

        // Ajax Loading
        $("#leftColumn li a").click(function() {
            $("#leftColumn li").removeClass('selected');
            $(this).parent().addClass('selected');
            var url = $(this).attr("href");
            $("#divContactList")
                .fadeOut()
                .load(url, function() {
                    $(this).fadeIn();
                    BindDelete();
                });
            return false;
        });

        // Ajax Deletes on page loading
        BindDelete();

    });

    function BindDelete() {
        // Ajax Deletes
        $(".delete a").click(function() {
            var answer = confirm('Delete contact?');
            if (answer == true) {
                var url = $(this).attr("href");
                $("#divContactList")
                    .fadeOut()
                    .html($.ajax({
                        type: "DELETE",
                        url: url,
                        cache: false,
                        async: false
                    }).responseText)
                    .fadeIn();
                    BindDetete();
            }
            return false;
        });
    }

</script>
```

---
Billet suivant dans la série : [Portage du tutoriel Contact Manager sous LINQ to SQL]({% post_url 2009-11-13-portage-tutoriel-contact-manager-linq-to-sql %})
