---
date: 2010-01-27 09:25:00
layout: page
permalink: nerddinner/utiliser-ajax/
redirect_from: "pages/NerdDinner/Utiliser-Ajax"
title: "NerdDinner(fr) : Utiliser Ajax pour les inscriptions"
---

Nous allons maintenant ajouter une fonctionnalité qui permettra aux
utilisateurs connectés de s'inscrire à un dîner. Nous ferons cela en ajoutant
un traitement en Ajax au niveau de la page détail d'un dîner.

## Indiquer si le visiteur est inscrit au dîner

Les utilisateurs peuvent accéder à une URL /Dinners/Details/[id] pour
consulter les informations sur un dîner particulier :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image121.png)

La méthode d'action Details() est implémentée de la façon suivante :

```
// GET: /Dinners/Details/2
public ActionResult Details(int id) {

   Dinner dinner = dinnerRepository.GetDinner(id);
   if (dinner == null)
     return View("NotFound");
   else
     return View(dinner);
}
```

Notre point de départ pour gérer l'inscription aux dîner va consister à
ajouter une méthode helper "IsUserRegistered(username)" au niveau de la classe
partielle Dinners.cs créée un peu plus tôt. Cette méthode helper renvoie "vrai"
ou "faux" selon que l'utilisateur est actuellement inscrit au dîner ou non :

```
public partial class Dinner {

   public bool IsUserRegistered(string userName) {

     return RSVPs.Any(r => r.AttendeeName.Equals(userName,
                               StringComparison.InvariantCultureIgnoreCase));
   }
}
```

Nous pouvons alors ajouter le code suivant à la vue Details.aspx pour
afficher un message d'information indiquant si l'utilisateur est inscrit ou non
au dîner :

```
<% if (Request.IsAuthenticated) { %>

   <% if (Model.IsUserRegistered(Context.User.Identity.Name)) { %>
     <p>You are registered for this event!</p>
   <% } else { %>
     <p>You are not registered for this event</p>
   <% } %>

<% } else { %>

   <a href="/Account/Logon">Logon</a> to RSVP for this event.

<% } %>
```

Et désormais, quand un utilisateur consulte un dîner auquel il est inscrit
il peut voir ce message :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image122.png)

Et quand il s'agit d'un dîner auquel il ne s'est pas inscrit, il obtient un
autre message :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image123.png)

## Réaliser l'action Register

Nous allons maintenant écrire le code nécessaire pour permettre aux
utilisateurs de s'inscrire à un dîner à partir de la page détail dans laquelle
il s'affiche.

Pour réaliser cela, nous ajoutons une classe "RSVPController" en faisant un
clic-droit dans le répertoire \Controllers et en sélectionnant le menu
Add-&gt;Controller.

Une fois cette nouvelle classe RSVPController créée, nous y insérons une
méthode d'action "Register". Cette action attend un argument id représentant un
dîner, retrouve l'objet Dinner correspondant, vérifie si l'utilisateur connecté
fait parti des personnes inscrites au dîner et si ce n'est pas le cas, insère
un objet RSVP pour cet utilisateur :

```
public class RSVPController : Controller {

DinnerRepository dinnerRepository = new DinnerRepository();

//
// AJAX: /Dinners/RSVPForEvent/1
[Authorize, AcceptVerbs(HttpVerbs.Post)]
public ActionResult Register(int id) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   if (!dinner.IsUserRegistered(User.Identity.Name)) {
     RSVP rsvp = new RSVP();

     rsvp.AttendeeName = User.Identity.Name;

     dinner.RSVPs.Add(rsvp);
     dinnerRepository.Save();
   }

   return Content("Thanks - we'll see you there!");
   }
}
```

Vous pouvoir ci-dessus que nous renvoyons une simple chaîne comme résultat
de notre méthode d'action Register. Nous aurions pu englober ce message dans
une vue, mais étant donné qu'il est si petit, nous nous contentons d'utiliser
la méthode helper Content() disponible au niveau de la classe Controller.

## Appeler l'action Register en Ajax

Nous allons utiliser Ajax pour appeler la méthode d'action Register à partir
de la vue Details. Cette fonctionnalité est assez simple à réaliser. Pour
commencer, nous devons faire référence à deux librairies JavaScript :

```
<script src="/Scripts/MicrosoftAjax.js" type="text/javascript"></script>
<script src="/Scripts/MicrosoftMvcAjax.js" type="text/javascript"></script>
```

La première ligne fait référence à la partie cliente de la librairie ASP.NET
AJAX. La taille de ce fichier est d'environ 24 ko (en version compressée) et
contient les fonctionnalités Ajax de base pour le côté client. La seconde
librairie contient des fonctions utilitaires qui font le pendant aux méthodes
helper pour l'Ajax de ASP.NET MVC que nous n'allons pas tarder à utiliser.

Nous pouvons ensuite mettre à jour le code de la vue Details pour qu'au lieu
d'afficher un simple message "You are not registered for this event", elle
renvoie un lien qui génère une requête Ajax pour appeler la méthode d'action
Register du contrôleur RSVPController afin d'inscrire l'utilisateur :

```
<div id="rsvpmsg">

   <% if (Request.IsAuthenticated) { %>

     <% if (Model.IsUserRegistered(Context.User.Identity.Name)) { %>
        <p>You are registered for this event!</p>
     <% } else { %>
        <%= Ajax.ActionLink( "RSVP for this event",
                                 "Register", "RSVP"
                                 new { id=Model.DinnerID },
                                 new AjaxOptions { UpdateTargetId="rsvpmsg" }) %>
     <% } %>

   <% } else { %>

     <a href="/Account/Logon">Logon</a> to RSVP for this event.

   <% } %>

</div>
```

Le code ci-dessus utilise la méthode helper Ajax.ActionLink() disponible de
base avec ASP.NET MVC. Cette méthode est similaire à la méthode helper
Html.ActionLink() si ce n'est qu'au lieu de générer un lien de navigation
classique vers une action, elle génère un lien qui fait une requête Ajax sur
cette action. Dans notre cas, cela appellera l'action "Register" du contrôleur
RSVPController en lui passant la valeur DinnerID comme paramètre "id". Le
dernier paramètre AjaxOptions qui lui est transmis sert à indiquer que nous
voulons que le contenu renvoyé par la méthode action soit affiché dans la
balise &lt;div&gt; dont l'identifiant est "rsvpmsg".

Et maintenant, quand un visiteur consulte un dîner auquel il n'est pas
encore inscrit, il dispose désormais d'un lien pour pouvoir s'inscrire à
celui-ci :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image124.png)

En cliquant sur le lien "RSVP for this event", cela provoque une requête
Ajax vers l'action Register du contrôleur RSVPController, et une fois que
celle-ci est terminée, le lien est mis à jour pour afficher une confirmation
d'inscription :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image125.png)

La charge réseau et la bande passante nécessaires pour réaliser cette
requête Ajax sont extrêmement légères. Quand l'utilisateur clique sur le lien
"RSVP for this event", seule une mini-requête HTTP POST est exécutée à travers
le réseau vers l'URL /Dinners/Register/[id] :

```
POST /Dinners/Register/49 HTTP/1.1
X-Requested-With: XMLHttpRequest
Content-Type: application/x-www-form-urlencoded; charset=utf-8
Referer: http://localhost:8080/Dinners/Details/49
```

Et en retour, la réponse de la part de la méthode d'action Register est tout
aussi simple :

```
HTTP/1.1 200 OK
Content-Type: text/html; charset=utf-8
Content-Length: 29
Thanks - we'll see you there!
```

Cet échange est donc très léger et donnera satisfaction même en cas de
lenteur du réseau.

## Ajouter une animation jQuery

La fonctionnalité Ajax que nous venons d'implémenter fonctionne vite et
bien. Si rapidement qu'il est possible que certains utilisateurs aient du mal à
remarquer que le lien servant à s'inscrire a été remplacé par un nouveau
message. Pour rendre cette information un peu plus visible, nous pourrions
essayer d'attirer l'attention sur ce message grâce à une petite animation.

Par défaut, les projets de type ASP.NET MVC intègrent la librairie
JavaScript jQuery - une librairie open source de très bonne qualité et
extrêmement populaire que Microsoft recommande. jQuery offre un grand nombre de
fonctionnalités, dont une très sympathique manipulation des éléments du DOM
HTML et une abondante bibliothèque d'effets.

Pour utiliser la librairie jQuery, nous devons commencer par ajouter une
référence à celle-ci. Etant donné que nous prévoyons de l'utiliser un grand
nombre de fois dans notre application, nous allons ajouter cette référence au
niveau du fichier Site.master pour que toutes les pages puissent en
profiter :

```
<script src="/Scripts/jQuery-1.3.2.js" type="text/javascript"></script>
```

Note : assurez-vous d'avoir installé le correctif de VS 2008
SP1 qui permet de mieux gérer l'intellisense dans les sources JavaScript (dont
ceux en jQuery). Vous pouvez le télécharger depuis l'URL :
http://tinyurl.com/vs2008javascripthotfix.

Avec jQuery, on utilise régulièrement la méthode globale "$()" qui sert à
sélectionner un ou plusieurs éléments HTML en donnant un sélecteur CSS. Par
exemple, $("#rsvpmsg") retrouve tous les éléments HTML dont l'identifiant est
"rsvpmsg", alors que $(".something") sélectionne tous les éléments avec une
classe CSS nommée "something". Vous pouvez également écrire des sélecteurs plus
élaborés comme par exemple $("input[@type=radio][@checked]") qui va renvoyer
toutes les zone de saisie de type bouton radio qui sont sélectionnées.

Une fois que vous avez sélectionné des éléments, vous pouvez appeler des
méthodes de jQuery pour leur appliquer des actions, comme par exemple les
masquer : $("#rsvpmsg").hide();.

Dans le cas de notre inscription en Ajax, nous allons définir une petite
fonction JavaScript que nous appellerons "AnimateRSVPMessage". Celle-ci va
sélectionner l'élément &lt;div&gt; "rsvpmsg" et va agrandir la taille du texte
qu'il contient. Le code ci-dessous démarre avec une police normale puis
augmente sa taille dans un intervalle de 400 millisecondes :

```
<script type="text/javascript">

   function AnimateRSVPMessage() {
     $("#rsvpmsg").animate({fontSize: "1.5em"}, 400);
   }

</script>
```

Nous pouvons maintenant utiliser cette fonction JavaScript pour qu'elle soit
appelée une fois que notre requête Ajax s'est terminée avec succès. Pour cela,
il suffit de passer le nom de cette fonction à la méthode helper
Ajax.ActionLink() au travers de la propriété d'évènement AjaxOptions :

```
<%= Ajax.ActionLink( "RSVP for this event",
                        "Register", "RSVP",
                        new { id=Model.DinnerID },
                        new AjaxOptions { UpdateTargetId="rsvpmsg",
                                           OnSuccess="AnimateRSVPMessage" }) %>
```

Et maintenant, quand on clique sur le lien "RSVP for this event" et que la
requête Ajax se termine correctement, le message de confirmation qui a été
renvoyé est mis en avant grâce à une petite animation jQuery :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image126.png)

En plus de l'évènement "OnSuccess", l'objet AjaxOptions propose également
les évènements "OnBegin", "OnFailure" et "OnComplete" que vous pouvez tous
utiliser (ainsi qu'un tas d'autres propriétés et options très utiles).

## Finitions : refactoriser la vue partielle RSVP

Notre vue Details commence à tirer en longueur, ce qui avec le temps risque
de la rendre un peu compliquée à comprendre. Pour améliorer la lisibilité de
notre code, nous allons finir en beauté avec une vue partielle -
RSVPStatus.ascx - qui externalisera tout le code lié à l'inscription qui est
actuellement présent dans la vue Details.

Pour créer cette vue partielle, il faut faire un clic-droit sur le dossier
\Dinners\Views puis sélectionner la commande Add-&gt;View. Indiquer ensuite que
la vue utilise un objet fortement typé Dinner. Puis terminer par un copier /
coller des morceaux de code nécessaires à partir de la vue Details.

Une fois que c'est fait, nous pouvons créer une seconde vue partielle -
EditAndDeleteLinks.ascx - qui englobe tout le code consacré aux liens Edit et
Delete. La création de cette vue est identique à celle de RSVPStatus.ascx. Mais
cette fois nous faisons un copier / coller du code de la vue Details qui se
rapporte aux deux liens Edit et Delete.

Et pour finir, il ne nous reste plus qu'à ajouter deux commandes
Html.RenderPartial() en haut de notre vue Details :

```
<% Html.RenderPartial("RSVPStatus"); %>
<% Html.RenderPartial("EditAndDeleteLinks"); %>
```

Ce qui a pour effet de rendre notre code beaucoup plus pratique à lire et à
maintenir.

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Ajouter une carte en Ajax](/nerddinner/ajouter-carte-ajax/)
