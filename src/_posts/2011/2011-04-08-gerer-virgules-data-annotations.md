---
date: 2011-04-08 13:43:00
layout: post
redirect_from: "post/2011/04/08/gerer-virgules-avec-data-annotations"
tags: jquery, mvc
title: "Gérer les virgules avec les Data Annotations"
---

Après avoir "réparé" mon [Visual Studio 2010]({% post_url 2011-03-30-vs-2010-sql-server-2008-express-windows-7-64-bits %}), j'ai pu me remettre à la version 2 du
tutoriel [MVC Music
Store](http://mvcmusicstore.codeplex.com/) pour me confronter aux dernières (pour moi) technologies ASP.NET MVC
3 et entre autre Razor et les Data Annotations.

Et justement, j'ai été un peu embarrassé par le fonctionnement de la
[validation via les Data Annotations](http://www.asp.net/mvc/tutorials/mvc-music-store-part-6) dès lors qu'on n'est pas des
yankees pure souche.

Par exemple, si je veux passer le prix d'un album de 8,99 à 8,90 j'obtiens
l'erreur "The field Prix must be a number." de la part du [plugin jQuery Validation](http://bassistance.de/jquery-plugins/jquery-plugin-validation/).

Et si j'essaie de contourner en saisissant 8.90 (avec un point au lieu de la
virgule), c'est l'erreur "The value '8.90' is not valid for Prix." qui prend le
relai. Mais dans ce cas, cette erreur n'est pas renvoyée par jQuery Validation
mais par la méthode TryUpdateModel() dans le contrôleur : mon PC étant en
français, le .NET exige une virgule comme séparateur décimal.

Zut ! Déjà les messages en anglais c'est pas tip-top. Mais que ça
m'affiche des valeurs numériques avec des virgules et que ça me gueule dessus
quand j'essaie de saisir c'est un peu pénible quand même.

Jusqu'à présent, plutôt que de chercher à gérer le problème virgule, je me
contentais de bidouiller la section `globalization` dans le fichier web.config
pour que ASP.NET prenne lui aussi le "." comme séparateur décimal :

```
<configuration>
   <system.web>
      <globalization culture="en-US" />
   </system.web>
</configuration>
```

Mais cette fois-ci, je me suis dit que j'allai creuser un peu plus sinon ça
enlève pas mal d'intérêt aux Data Annotations.

## Localiser les messages du plugin jQuery Validation

Déjà, quand on fait des recherches sur la localisation de jQuery Validation,
on se rend compte que c'est un problème général qui semble avoir été un peu
laissé de côté...

Par contre, si on regarde dans le repository du plugin, il existe un
répertoire localization qui contient un fichier [messages_fr.js](https://github.com/jzaefferer/jquery-validation/blob/master/localization/messages_fr.js) avec les messages d'erreur en français.

Super ! Mais ça ne sert pas à grand chose parce que les messages
d'erreurs sont déjà initialisés directement par ASP.NET MVC :(

```
<input data-val="true"
       data-val-number="The field Prix must be a number."
       data-val-range="Le champ Prix doit &amp;#234;tre compris entre 0,01 et 100."
       data-val-range-max="100"
       data-val-range-min="0.01"
       data-val-required="Le champ Prix est requis."
       id="Price" name="Price" type="text" value="8,99" />
```

C'est malin ça de définir les messages d'erreur alors que le plugin jQuery
Validation les initialise déjà de son côté. Et c'est encore plus rigolo d'en
mettre certains en français et d'autres en anglais :)

## Localiser "The field Xxxxx must be a number."

Première méthode pour traduire ce message : supprimer l'attribut
"data-val-number" de toutes les zones de saisie et inclure le fichier
messages_fr.js (attention, l'ordre des scripts est important) :

```
<script type="text/javascript">
    $(document).ready(function () {
        $(":input[data-val-number]").attr("data-val-number", "");
    });
</script>

<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>

<script type="text/javascript">

    /* ----- messages_fr.js ----- */
    /*
    * Translated default messages for the jQuery validation plugin.
    * Locale: FR
    */
    jQuery.extend(jQuery.validator.messages, {
        required: "Ce champ est requis.",
        remote: "Veuillez remplir ce champ pour continuer.",
        email: "Veuillez entrer une adresse email valide.",
        url: "Veuillez entrer une URL valide.",
        date: "Veuillez entrer une date valide.",
        dateISO: "Veuillez entrer une date valide (ISO).",
        number: "Veuillez entrer un nombre valide.",
...
```

Après ça, la saisie d'une valeur incorrecte dans la zone prix n'affiche plus
l'erreur "The field Prix must be a number." mais "Veuillez entrer un nombre
valide.".

Deuxième méthode : si on veut continuer à indiquer le nom du champ qui
pose problème dans le message d'erreur, il faut sortir l'artillerie lourde et
utiliser les expressions régulières (l'ordre des scripts est toujours
important) :

```
<script type="text/javascript">
    $(document).ready(function () {
        var reg_us = /The field (.+) must be a number\./gi;
        var msg_fr = "Le champ $1 doit être un nombre.";
        $(":input[data-val-number]").each(function () {
            var message = $(this).attr("data-val-number");
            message = message.replace(reg_us, msg_fr);
            $(this).attr("data-val-number", message);
        });
    });
</script>

<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>

<script type="text/javascript">

    /* ----- messages_fr.js ----- */
    /*
    * Translated default messages for the jQuery validation plugin.
    * Locale: FR
    */
    jQuery.extend(jQuery.validator.messages, {
        required: "Ce champ est requis.",
...
```

Dans ce cas, la saisie d'une valeur incorrecte dans le prix affiche le
message "Le champ Prix doit être un nombre.".

## Faire accepter les nombres à virgule à jQuery Validation

C'est bien beau de parler à l'utilisateur en français, mais c'est quand même
plus important de lui permettre de pouvoir saisir le prix qu'il veut sans avoir
à abandonner les valeurs décimales.

Et là, le plugin jQuery Validation a tout prévu puisque le répertoire
localisation contient également des fichiers methods_de.js, methods_nl.js et
methods_pt.js. Mais malheureusement pour moi, pas de methods_fr.js en vue
:(

En y regardant de plus près, le fichier [methods_de.js](https://github.com/jzaefferer/jquery-validation/blob/master/localization/methods_de.js) devrait faire l'affaire. Ce qui se confirme sur
le forum [developpez.com](http://www.developpez.net/forums/d1049394/dotnet/developpement-web/asp-net-mvc/asp-net-mvc-3-probleme-decimal-jquery/#post5832403).

Ni une, ni deux, il suffit de compléter les scripts de la façon suivante
(l'ordre des scripts est important) :

```
<script src="@Url.Content("~/Scripts/jquery.validate.min.js")" type="text/javascript"></script>
<script src="@Url.Content("~/Scripts/jquery.validate.unobtrusive.min.js")" type="text/javascript"></script>

<script type="text/javascript">
jQuery.extend(jQuery.validator.methods, {
    date: function(value, element) {
        return this.optional(element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
    },
    number: function(value, element) {
        return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
    }
});
</script>
```

Et maintenant si je change mon prix en 8,90, je n'ai plus le message "Le
champ Prix doit être un nombre.". Non. Maintenant ça me dit que "Le champ Prix
doit être compris entre 0,01 et 100.".

C'est des coriaces !

## Gérer les virgules dans jQuery Validation

Si c'est ça, je regarde dans le source de [jquery.validate.js](https://github.com/jzaefferer/jquery-validation/blob/master/jquery.validate.js). Ah ben bien sûr, y'a un problème avec le
"range" :

```
range: function( value, element, param ) {
    return this.optional(element) || ( value >= param[0] && value <= param[1] );
},
```

Il compare `value` (le 8,90 que j'ai saisi) avec
`param[0]` (la valeur minimum de 0.01) et `param[1]` (la
valeur maximum de 100). Personne lui a jamais dit qu'on ne peut pas comparer
les points et les virgules ?

Et le pire, c'est qu'il fait pareil avec les fonctions "min" et max" le
bougre ! Ca va pas se passer comme ça :

```
/* ----- methods_fr.js ----- */
/*
* Localized default methods for the jQuery validation plugin.
* Locale: FR
*/
jQuery.extend(jQuery.validator.methods, {
    min: function (value, element, param) {
        return this.optional(element) || replaceComma(value) >= replaceComma(param);
    },
    max: function (value, element, param) {
        return this.optional(element) || replaceComma(value) <= replaceComma(param);
    },
    range: function (value, element, param) {
        value = replaceComma(value);
        return this.optional(element) || (value >= replaceComma(param[0]) && value <= replaceComma(param[1]));
    },
    date: function (value, element) {
        return this.optional(element) || /^\d\d?\.\d\d?\.\d\d\d?\d?$/.test(value);
    },
    number: function (value, element) {
        return this.optional(element) || /^-?(?:\d+|\d{1,3}(?:\.\d{3})+)(?:,\d+)?$/.test(value);
    }
});

function replaceComma(value) {
    // Quick & Dirty replace "," by "." as decimal separators
    return value.replace(",", ".");
}
```

Et après ça, 8,90 passe enfin alors que 100,01 est bien refusé !

Ouf ! Ca devrait faire l'affaire jusqu'à la sortie de [jQuery Validation 2.0](https://github.com/jzaefferer/jquery-validation/issues#issue/55).

Mise à jour : si j'avais cherché mieux, j'aurais pu
trouver le billet [Using MVC 3 with non-English Locales](http://blogs.msdn.com/b/rickandy/archive/2011/02/17/using-mvc-3-with-non-english-locales.aspx) de Rick Anderson, le
co-auteur du tutoriel [Getting Started With MVC3](http://www.asp.net/mvc/tutorials/getting-started-with-mvc3-part1-cs).
