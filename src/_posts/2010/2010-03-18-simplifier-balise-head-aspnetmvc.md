---
date: 2010-03-18 21:09:00
layout: post
redirect_from: "post/2010/03/18/simplifier-la-balise-head-pour-asp-net-mvc"
tags: html, mvc
title: "Simplifier la balise head pour ASP.NET MVC"
---

Dernièrement, j'ai souhaité remplacer le PlaceHolder qui sert à définir le
titre de la page et qui est généré par l'application ASP.NET MVC créée par
défaut par Visual Studio 2008 :

```
<head runat="server">
    <link href="../../Content/style.css" rel="stylesheet" type="text/css" />
    <title><asp:ContentPlaceHolder ID="TitleContent" runat="server" /></title>
...
</head>
```

Pour moi, plutôt que d'avoir un PlaceHolder qui se contente de gérer le
contenu de la balise &lt;title&gt;, je préfère avoir un PlaceHolder un peu plus
"générique" pour pouvoir m'en servir pour insérer plus de contenu dans la
partie &lt;head&gt; de la page :

```
<head runat="server">
    <link href="../../Content/style.css" rel="stylesheet" type="text/css" />
    <asp:ContentPlaceHolder ID="HeadContent" runat="server" />
...
</head>
```

Puis, dans mes vues, j'ai remplacé la partie consacrée au PlaceHolder
TitleContent :

```
<asp:Content ID="indexTitle" ContentPlaceHolderID="TitleContent" runat="server">
    Home Page
</asp:Content>
```

Par du code qui s'adresse au PlaceHolder HeadContent :

```
<asp:Content ID="indexHead" ContentPlaceHolderID="HeadContent" runat="server">
    <title>Home Page</title>
</asp:Content>
```

Ca marchait bien, mais à l'occasion d'un affichage du source HTML, je me
suis rendu compte qu'il y avait comme un défaut :

```
<head><link href="Content/style.css" rel="stylesheet" type="text/css" />
    <title>Home Page</title>
<title>
 
</title></head>
```

Y'a DEUX balises &lt;title&gt; ! Mais c'est normal ! C'est parce
que ASP.NET ne se rend pas compte que qu'il y a déjà une balise &lt;title&gt;
alors il en insère une parce qu'il sait qu'un &lt;head&gt; sans &lt;title&gt;
c'est pas des choses à faire. mais pourquoi donc est-ce que ASP.NET se mêle de
ça ? C'est parce que la balise &lt;head&gt; contient une attribut
`runat="server"`. Ben qu'est-ce qu'il fait là celui-là ?

Je sais pas mais y'a qu'à demander : [TipJar: Title Tags and Master Pages](http://haacked.com/archive/2009/04/03/tipjar-title-tags-and-master-pages.aspx).

Et donc, le fait d'avoir `<head runat="server">` semble
avoir deux avantages / effets.

En un, cela permet à ASP.NET de vérifier la validité du code html composant
la section &lt;head&gt; de la page HTML. En particulier, si ASP.NET s'aperçoit
que la page ne contient pas de balise &lt;title&gt;, il en insère une
automatiquement (avec un titre vide d'accord, mais au moins la validité est
sauve).

En deux, cela permet de gérer correctement les adresses des fichiers à
incorporer. Par exemple, il est possible de référencer les feuilles de styles
CSS ou les fichiers de scripts Javascripts en utilisant un tilde dans leur
adresse :

* &lt;link rel="stylesheet" type="text/css" href="~/Content/style.css"
/&gt;
* &lt;script type="text/javascript"
src="~/Scripts/jquery.js"&gt;&lt;/script&gt;

C'est pas totalement idiot parce que c'est quand même beaucoup plus simple
que de s'essayer avec des href="../../Content/style.css" ou
href="../Content/style.css" jusqu'à ce qu'on tombe sur la bonne
combinaison.

Malgré tout, est-ce que ça serait [si grave que ça](http://xkcd.com/292/) que j'enlève le `runat="server"` de ma
balise &lt;head&gt; ?

* Je perd le contrôle de la validation pour le &lt;title&gt; mais dans mon
cas c'est plus un problème qu'un avantage.
* Et en ce qui concerne la simplification des adresses href ou src, ça serait
bien le diable si c'était si indispensable que ça. Outre le fait que jusqu'ici
je me dé...brouille tout le temps pour m'en passer, il devrait être possible de
faire autrement.

Et c'est même tout à fait possible puisqu'il y a déjà quelqu'un qui s'est
occupé de faire ça : [Refactoring the ASP.NET MVC project template](http://www.ilude.com/2009/01/28/refactoring-the-aspnet-mvc-project-template-part-4/). Mais pour
l'instant, je ne vais pas aller aussi loin que lui et me mettre à créer des
helpers spécifiques pour insérer des fichiers CSS ou Javascript.

Dans un premier temps, je vais me contenter d'utiliser tout simplement la
méthode Url.Content() :

```
<head>
    <link href="<%= Url.Content("~/Content/style.css") %>" rel="stylesheet" type="text/css" />
    <script src="<%= Url.Content("~/Scripts/jquery-1.3.2.js") %>" type="text/javascript"></script>
    <asp:ContentPlaceHolder ID="Htmlhead" runat="server" />
</head>
```

C'est beau, on dirait du HTML.
