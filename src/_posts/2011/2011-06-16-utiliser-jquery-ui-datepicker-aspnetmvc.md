---
date: 2011-06-16 19:56:00
layout: post
redirect_from: "post/2011/06/16/utiliser-jquery-ui-datepicker-avec-asp-net-mvc"
tags: jquery, mvc
title: "Utiliser jQuery UI Datepicker avec ASP.NET MVC"
---

Normalement, je n'aime pas trop proposer un calendrier pour permettre la
saisie de dates dans un formulaire. Mais comme le [widget Datepicker de
jQuery UI](http://jqueryui.com/demos/datepicker/) n'est pas trop envahissant ou irritant, j'ai malgré tout décidé
de lui laisser une chance. Et surtout, je vois ça comme un bon moyen d'aborder
les templates Editor et Display de ASP.NET MVC et d'étudier un peu plus
correctement comment les utiliser.

## Un projet MVC juste pour tester

Pour commencer, j'ai échafaudé vite fait une application de gestion de
livres à partir de la classe suivante :

```
public class Livre
{
    public int ID { get; set; }
    public string Titre { get; set; }
    public DateTime Edition { get; set; }
}
```

Pour faire vite, j'ai simplement aménagé l'exemple [EF Code First and Data Scaffolding with the ASP.NET MVC 3 Tools
Update](http://weblogs.asp.net/scottgu/archive/2011/05/05/ef-code-first-and-data-scaffolding-with-the-asp-net-mvc-3-tools-update.aspx) de Scott Guthrie. Après avoir bricolé un lien vers l'action "Index"
de mon nouveau contrôleur "Livres" dans le fichier "_Layout.cshtml", j'ai pu
accéder à mon écran de création d'un nouveau livre :

![](/public/2011/jquery-datepicker-mvc-01.jpg)

## Deux templates DateTime.cshtml

J'ai alors pu passer à l'exemple [Create user friendly date fields with ASP.NET MVC EditorTemplates
&amp; jQueryUI](http://rachelappel.com/create-user-friendly-date-fields-with-asp.net-mvc-editortemplates-amp-jqueryui) donné par Rachel Appel pour créer les deux templates
"DateTime.cshtml" dans les sous-répertoires "DisplayTemplates" et
"EditorTemplates".

**\Views\Shared\DisplayTemplates\DateTime.cshtml**

```
@model DateTime
@String.Format("{0:d}", Model.Date)
```

**\Views\Shared\EditorTemplates\DateTime.cshtml**

```
@model DateTime
@Html.TextBox("", String.Format("{0:d}", Model.Date.ToShortDateString()))
```

Ce qui m'a permi d'avoir des dates "propres" (sans avoir l'heure à 00:00:00)
que ce soit en affichage ou en saisie :

![](/public/2011/jquery-datepicker-mvc-02.jpg)

L'avantage, c'est que maintenant je n'ai rien d'autre à faire pour que
toutes les zones de dates existantes ou à venir dans mon application Livres
bénéficient de la même présentation.

## Ajout de jQuery UI Datepicker

Je continue pas à pas le tutoriel de Rachel Appel en référençant la
librairie jQuery UI (et sa CSS) dans mon fichier "_Layout.cshtml" :

```
<link href="@Url.Content("~/Content/themes/base/jquery.ui.all.css")" rel="stylesheet" type="text/css" />
<script src="@Url.Content("~/Scripts/jquery-ui-1.8.11.min.js")" type="text/javascript"></script>
```

Puis je fais évoluer mon EditorTemplate pour ajouter une classe CSS afin que
jQuery puisse identifier les zones de saisie de date :

```
@model DateTime
@Html.TextBox("", String.Format("{0:d}", Model.Date.ToShortDateString()), new { @class = "datefield" })
```

Et je n'ai plus qu'à utiliser la fonction jQuery ready pour indiquer que
tous les éléments qui ont la classe CSS "datefield" doivent être complété d'un
calendrier :

```
<script type="text/javascript">
$(function () {
    $(".datefield").datepicker();
});
</script>
```

Personnellement, j'ai placé ce script dans mon fichier "_Layout.cshtml"
plutôt que dans le template "DateTime.cshtml" pour éviter qu'il soit répété (et
donc ré-exécuté) autant de fois qu'il y a de date dans mon formulaire de
saisie.

Et maintenant, quand je suis en saisie d'une date, j'ai le calendrier de
jQuery UI qui apparait :

![](/public/2011/jquery-datepicker-mvc-03.jpg)

## Un calendrier en français

C'est pas mal, mais c'est tout en anglais :) Heureusement, il y a moyen
d'avoir une version traduite en français très facilement. Il suffit de
récupérer le fichier "jquery.ui.datepicker-fr.js" dans le référentiel Git de
jQuery UI : <https://github.com/jquery/jquery-ui/blob/master/ui/i18n/> puis de
l'enregistrer dans le répertoire "Scripts" de la solution (et de penser à
l'inclure dans le projet).

Il ne reste alors plus qu'à référencer ce script (après le script pour
jQuery UI ?) dans le layout :

```
<script src="@Url.Content("~/Scripts/jquery.ui.datepicker-fr.js")" type="text/javascript"></script>
```

Et cerise sur le gâteau, le calendrier est maintenant en mesure de
reconnaitre la date en cours et de s'y positionner correctement :

![](/public/2011/jquery-datepicker-mvc-04.jpg)

## Le cas des dates nullables

En creusant un peu sur différents exemples d'utilisation du Datepicker de
jQuery UI avec ASP.NET MVC, je suis tombé sur des démos qui allaient un peu
plus loin et qui prenaient en compte le cas où la date était nulle.

Dans ce cas là, il faut que les templates "Datetime.cshtml" héritent de
l'objet `DateTime?` et plus de l'objet `DateTime`. Et
donc modifier le code pour gérer le fait qu'on a à faire à un objet nullable,
ce qui au final donne les templates suivants :

**\Views\Shared\DisplayTemplates\DateTime.cshtml**

```
@model System.DateTime?
@(Model.HasValue ? Model.Value.Date.ToShortDateString() : string.Empty)
```

**\Views\Shared\EditorTemplates\DateTime.cshtml**

```
@model System.DateTime?
@Html.TextBox("", Model.HasValue ? Model.Value.Date.ToShortDateString() : string.Empty, new { @class = "datefield" })
```

Pour tester que ça marchait, j'ai dû ajouter un seul "?" à ma classe
"Livre" :

```
public class Livre
{
    public int ID { get; set; }
    public string Titre { get; set; }
    public DateTime? Edition { get; set; }
}
```

Et après ça j'ai dû supprimer ma base de données (le fichier
App_Data\Livres.sdf dans mon cas) puis qu'elle avait changé. Chercher "Changing
our Model and Database Schema" sur le billet [VS 2010 SP1 and SQL CE](http://weblogs.asp.net/scottgu/archive/2011/01/11/vs-2010-sp1-and-sql-ce.aspx) de Scott Guthrie pour plus
d'explications.

Note : j'ai vu des exemples qui initialisent une valeur par
défaut lorsque la date est nulle (genre `Model.HasValue ?
Model.Value.Date.To...() : DateTime.Today.To...()`). Mais selon moi,
ce n'est pas quelque chose qui doit être décidé et accompli au niveau d'un
template. Il est préférable de prévoir ce genre d'initialisation dans une
classe ViewModel.

## Moderniser le code HTML

Le déclenchement du calendrier est basé sur la présence de la classe CSS
"datefield" (ce que fait `$(".datefield").datepicker();`). Mais
c'est quasiment la préhistoire du [Javascript non
intrusif](http://fr.wikipedia.org/wiki/Javascript_discret). Je pense qu'actuellement, il vaut bien mieux se baser sur
l'attribut `type` qui est justement prévu pour définir une [saisie de date en
HTML5](http://diveintohtml5.org/forms.html#type-date).

Et donc, plutôt que d'ajouter une classe CSS "datefield", le template Editor
va directement ajouter un attribut `type="date"` :

```
@model System.DateTime?
@Html.TextBox("", Model.HasValue ? Model.Value.Date.ToShortDateString() : string.Empty, new { @type = "date" })
```

Il faut alors revoir la fonction jQuery ready pour que désormais elle prenne
en compte les éléments ayant ce type :

```
<script type="text/javascript">
$(function () {
    $("input[type=date]").datepicker();
});
</script>
```

Et on va même plus loin en utilisant la librairie Modernizr promue par
ASP.NET MVC pour appliquer le calendrier de jQuery UI uniquement lorsque le
navigateur ne prend pas en charge la saisie des dates :

```
<script type="text/javascript">
$(function () {
    if (!Modernizr.inputtypes.date) {
        $("input[type=date]").datepicker();
    }
});
</script>
```

## Conclusion

Finalement, c'est pas hyper compliqué de faire des templates. Et en y
réfléchissant un peu mieux, je pense que c'est une solution qui devrait me
plaire parce qu'elle est totalement "discrète" :

* côté client, le calendrier est appliqué de façon non intrusive : le
code de la balise input n'a pas été affublé d'un `onclick` pour lui
attacher un calendrier.
* côté serveur, le calendrier est généré de façon non intrusive : le
formulaire a conservé `@Html.EditorFor(model => model.Edition)`
sans qu'on ait à le défigurer avec un helper spécifique genre
`@Html.DateTimeFor(model => model.Edition)`.
