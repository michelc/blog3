---
date: 2010-09-08 17:23:00
layout: post
redirect_from: "post/2010/09/08/asp-net-mvc-2-nouvelle-syntaxe-pour-encoder-la-sortie-html"
tags: mvc
title: "ASP.NET MVC 2 : Nouvelle syntaxe ‹%: %› pour encoder la sortie HTML"
---

{:.encart}
Ceci est la traduction du billet "[New &lt;%: %&gt; Syntax for HTML Encoding Output in ASP.NET 4
(and ASP.NET MVC 2)](http://weblogs.asp.net/scottgu/archive/2010/04/06/new-lt-gt-syntax-for-html-encoding-output-in-asp-net-4-and-asp-net-mvc-2.aspx)" de Scott Guthrie.

Le billet d'aujourd'hui va couvrir une petite (mais malgré tout très utile)
nouveauté syntaxique qui est apparue avec ASP.NET 4. Il s'agit de la
possibilité d'encoder automatiquement le code HTML inséré à l'intérieur des
pages. Cela contribue à protéger vos applications et vos sites contre le
Cross-site scripting (XSS) et les attaques par injection HTML, et cela grâce à
une nouvelle syntaxe à la fois élégante et concise.

## Encoder le HTML

Le Cross-site scripting (XSS) et les attaques par injection HTML
représentent deux des principales failles de sécurité qui gangrènent les sites
internet et les applications. Elles surviennent lorsque des hackers découvrent
un moyen pour injecter un script côté client ou du code HTML dans des pages web
qui seront ensuite consultées par d'autres visiteurs du site. Cela peut aussi
bien servir à vandaliser le site qu'à permettre aux hackers de lancer des
scripts côté client pour voler les informations des cookies ou bien usurper
l'identité d'un utilisateur sur le site pour réaliser des actions
malveillantes.

Une des solutions pour parvenir à réduire ce risque est de s'efforcer à ce
que le contenu HTML renvoyé au navigateur client soit toujours encodé. Cela
permet de s'assurer que toute information qui aurait pû être créée ou modifiée
par un utilisateur final ne pourra jamais être renvoyée vers une page côté
client en contenant des balises telles que &lt;script&gt; ou &lt;img&gt;.

### Comment encodait-on le HTML jusqu'à présent ?

Les applications ASP.NET (et en particulier celles qui utilisent ASP.NET
MVC) s'appuient très souvent sur la syntaxe &lt;%= %&gt; pour générer certains
éléments. Actuellement, les développeurs peuvent utiliser les méthodes
Server.HtmlEncode() ou HttpUtility.Encode() à l'intérieur de ce bloc pour y
encoder le HTML avant qu'il ne soit renvoyé côté client. C'est ce qui est fait
avec un code tel que celui-ci :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_60287742.png)

Bien que cela fonctionne parfaitement, cela présente deux
inconvénients :

* C'est assez verbeux
* Les développeurs oublient souvent d'appeler la méthode Server.HtmlEncode()
– et il n'existe pas de moyen facile pour vérifier qu'elle est bien utilisée
tout au long de l'application.

## Encoder avec la nouvelle syntaxe &lt;%: %&gt;

Avec ASP.NET 4, nous avons introduit une nouvelle syntaxe &lt;%: %&gt; pour
générer des éléments comme le fait un bloc &lt;%= %&gt;, mais qui en plus
l'encode automatiquement avant de le générer. Cela évite d'avoir à convertir
explicitement le contenu HTML comme nous l'avons fait dans l'exemple ci-dessus.
Au lieu de ça, vous pouvez maintenant vous contenter d'écrire le code
ci-dessous pour faire exactement la même chose :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_79B2F220.png)

Nous avons opté pour la syntaxe &lt;%: %&gt; afin qu'il soit facile et
rapide de remplacer les morceaux de code &lt;%= %&gt; existants. Cela vous
permet également de rechercher facilement les éléments &lt;%= %&gt; dans votre
code et de contrôler les cas où vous n'utilisez pas l'encodage HTML dans votre
application pour vous assurer que c'est bien ce que vous souhaitiez faire.

## Eviter le double encodage

Bien que l'encodage HTML soit souvent une bonne pratique, il existe quelques
cas où le contenu que vous renvoyez doit être du HTML ou qu'il est déjà encodé,
auquel cas vous ne souhaitez pas l'encoder à nouveau.

ASP.NET 4 comporte une nouvelle interface IHtmlString (ainsi que son
implémentation concrète : HtmlString) que vous pouvez implémenter sur vos
types pour indiquer que leur valeur est déjà correctement encodée (ou tout au
moins contrôlée) pour pouvoir être affichée en tant que HTML, et que par
conséquent cette valeur ne doit pas être (ré)encodée. Le bloc &lt;%: %&gt;
teste la présence de cette interface IHtmlString dans les expressions qu'il
contient et le cas échéant ne vas pas faire d'encodage HTML pour les valeurs
qui implémentent cette interface. Cela évite aux développeurs d'avoir à se
poser la question au cas par cas pour savoir s'il faut utiliser la syntaxe
&lt;%: %&gt; ou non. Vous pouvez vous contenter de toujours utiliser des blocs
&lt;%: %&gt; et faire en sorte que toutes les propriétés ou types qui sont déja
encodées implémentent bien l'interface IHtmlString.

### Utiliser les helpers ASP.NET MVC avec &lt;%: %&gt;

Prenons le cas où vous utilisez des méthodes helpers en ASP.NET MVC pour
avoir un exemple concret qui montre dans quel cas ce mécanisme d'encodage HTML
s'avère utile. Les méthodes helper renvoient habituellement du HTML. A titre
d'exemple, la méthode helper Html.TextBox() renvoie une balise du style
`<input type="text"/>`. Avec ASP.NET MVC 2, ces méthodes
helper renvoient maintenant des types HtmlString par défaut, de façon à
indiquer que l'affichage du contenu renvoyé est sûr et qu'il n'a pas à être
encodé par le bloc &lt;%: %&gt;.

Cela vous permet d'utiliser ces méthodes aussi bien avec des blocs &lt;%=
%&gt; :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_31853644.png)

Qu'à l'intérieur des nouveaux blocs &lt;%: %&gt; :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_49A8A09F.png)

Dans les deux cas ci-dessus, le contenu HTML renvoyé par la méthode helper
sera envoyé vers le client en tant que HTML et le bloc &lt;%: %&gt; ne
cherchera pas à faire un double encodage.

Cela vous permet de toujours utiliser la syntaxe &lt;%: %&gt; par défaut
plutôt que des blocs &lt;%= %&gt; dans vos applications. Si vous êtes du genre
intraitable, vous pouvez même créer une règle de build dont le but sera de
traquer l'utilisation de blocs &lt;%= %&gt; dans votre application pour que
vous soyez certain que rien n'échappe à l'encodage HTML

## Génération des vues ASP.NET MVC 2

Lorsque vous utilisez VS 2010 (ou sa version gratuite Visual Web Developer
2010 Express) pour construire des applications ASP.NET MVC 2, vous pouvez voir
que les vues qui sont générées par l'intermédiaire de la boite de dialogue "Add
View" utilisent désormais des blocs &lt;%: %&gt; par défaut quand il s'agit de
renvoyer du contenu. Dans l'exemple ci-dessous, j'ai demandé à générer une
simple vue "Edit" pour un objet Article. Vous pouvez voir que la syntaxe &lt;%:
%&gt; est employée trois fois pour le label, la textbox et le message de
validation (tous trois obtenus grâce à des méthodes helper) :

![](http://weblogs.asp.net/blogs/scottgu/image_thumb_6812E188.png)

## Résumé

La nouvelle syntaxe &lt;%: %&gt; offre une méthode concise pour encoder
automatiquement le contenu puis le renvoyer vers la sortie. Cela vous permet de
rendre votre code un peu moins verbeux et d'assez facilement vérifier /
contrôler que vous faites toujours de l'encodage HTML dans tout votre site. Ce
qui participe à la protection de votre application contre les attaques de type
Cross-site scripting (XSS) et injection HTML.

{:.encart}
Ceci est la traduction du billet "[New &lt;%: %&gt; Syntax for HTML Encoding Output in ASP.NET 4
(and ASP.NET MVC 2)](http://weblogs.asp.net/scottgu/archive/2010/04/06/new-lt-gt-syntax-for-html-encoding-output-in-asp-net-4-and-asp-net-mvc-2.aspx)" de Scott Guthrie.
