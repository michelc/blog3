---
date: 2010-01-20 21:56:00
layout: page
permalink: nerddinner/authentification-autorisation/
redirect_from: "pages/NerdDinner/Authentification-Autorisation"
title: "NerdDinner(fr) : Authentification et Autorisation"
---

Pour l'instant, l'application NerdDinner laisse à toutes les personnes
venant sur le site la possibilité de créer ou de mettre à jour les informations
d'un dîner. L'évolution que nous allons réaliser va consister à obliger les
utilisateurs à s'enregistrer et à se connecter pour pouvoir créer un nouveau
dîner et à ajouter une vérification pour que seul l'utilisateur qui a créé un
dîner puisse le modifier par la suite.

Pour réaliser cela, nous allons utiliser les mécanismes d'authentification
et d'autorisation qui vont nous permettre de sécuriser notre application.

## Comprendre l'authentification et l'autorisation

L'authentification correspond au processus d'identification et de validation
de l'identité de la personne qui accède à une application. Pour être plus
simple, cela consiste à identifier "qui" est l'utilisateur final quand il vient
sur un site internet.

ASP.NET offre plusieurs méthodes pour authentifier les visiteurs d'un site.
Pour les applications internet, l'approche la plus courante est
"l'authentification par formulaire". Ce mode d'authentification consiste pour
le développeur à réaliser un formulaire HTML de connexion dans son application
puis à vérifier le code utilisateur et le mot de passe saisis par le visiteur
par rapport à une base de données d'utilisateurs ou toute autre source de
contrôle. Dans le cas où la combinaison utilisateur / mot de passe est
correcte, le développeur peut alors demander à ASP.NET de générer un cookie
encrypté pour pouvoir identifier cet utilisateur lors de ses futures requêtes.
C'est ce système d'authentification par formulaire que nous allons employer
dans l'application NerdDinner.

L'autorisation consiste quant à elle à déterminer si un utilisateur
authentifié a le droit d'accéder à une URL ou une ressource donnée et
d'accomplir telle ou telle action. Dans le cas de notre application NerdDinner,
nous souhaitons par exemple que seuls les utilisateurs qui se sont connectés
aient la permission d'accéder à l'URL /Dinners/Create pour créer de nouveaux
dîners. Nous voulons aussi ajouter un test pour autoriser uniquement
l'utilisateur qui a organisé un dîner à mettre à jour son contenu et en
interdire la modification par qui que ce soit d'autre.

## AccountController et l'authentification par formulaire

Lors de la création d'une nouvelle application ASP.NET MVC, Visual Studio
part d'un modèle de projet par défaut qui sélectionne automatiquement
l'authentification par formulaire. Et celui-ci fourni également un formulaire
de connexion ce qui facilite énormément l'intégration d'un mécanisme de
sécurité dans un site web.

La page maitre Site.Master affiche un lien "Log On" dans le coin supérieur
droit des pages lorsque l'utilisateur qui y accède n'est pas authentifié :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image113.png)

Un clic sur ce lien "Log On" conduit l'utilisateur vers l'URL
/Account/LogOn :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image114.png)

Les visiteurs qui ne sont pas encore enregistrés peuvent le faire en
cliquant sur le lien "Register" qui les conduit vers l'URL /Account/Register et
leur permet de saisir les informations de leur compte :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image115.png)

En cliquant sur le bouton "Register", le nouvel utilisateur est créé dans le
système d'utilisateurs d'ASP.NET puis authentifié via l'authentification par
formulaire.

Lorsqu'un utilisateur est connecté, le fichier Site.master remplace le lien
"Log On" en haut de l'écran par un message "Welcome [username]!" et un lien
"Log Off". Le fait de cliquer sur le lien "Log Off" a pour effet de déconnecter
l'utilisateur :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image116.png)

Toutes les fonctionnalités de connexion, de déconnexion et d'enregistrement
décrites ci-dessus sont réalisées au niveau de la classe AccountControllers qui
Visual studio a ajoutée au projet lors de sa création. Toute la partie
interface utilisateur qui correspond à ce contrôleur AccountController est
quant à elle implémentée sous forme de vues dans le répertoire
\Views\Account :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image117.png)

La classe AccountController utilise le système d'authentification par
formulaire d'ASP.NET pour générer des cookies d'authentification cryptés et
l'API Membership de ASP.NET pour valider et stocker les codes utilisateurs et
les mots de passe. L'API Membership est extensible et accepte n'importe quelle
source pour enregistrer les mots de passes. ASP.NET est livré avec un
fournisseur d'authentification par défaut qui enregistre les données code
utilisateur / mot de passe dans une base de données SQL ou dans l'Active
Directory.

Il est possible de configurer quel fournisseur utiliser pour stocker ces
informations dans le cadre de l'application NerdDinner. Pour cela, il faut
ouvrir le fichier web.config dans la racine du projet et d'y chercher la
section &lt;membership&gt;. Dans le fichier web.config généré par défaut lors
de la création du projet, c'est le fournisseur SQL qui est sélectionné. Et il
est configuré de façon à utiliser la chaîne de connexion nommée
"ApplicationServices" pour définir l'accès à la base de données.

Par défaut, la chaine de connexion "ApplicationServices" (qui se trouve dans
la partie &lt;connectionString&gt; du web.config) est définie de façon à
utiliser SQL Express. Elle pointe vers une base de données SQL Express nommée
ASPNETDB.MDF située dans le répertoire "App_Data" de l'application. Si cette
base de données n'existe pas lors de la première utilisation de l'API
Membership, elle sera créée automatiquement par ASP.NET avec toute la structure
de base de données nécessaire pour cela :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image118.png)

Si nous préférions utiliser une véritable instance SQL Server (ou nous
connecter à une base de données distante) au lieu d'utiliser SQL Express, tout
ce que nous aurions à faire, c'est de modifier la chaîne de connexion
"ApplicationServices" dans le fichier web.config et de nous assurer que la base
de données vers laquelle elle pointe dispose des tables nécessaires pour l'API
Membership. Il est possible de lancer l'utilitaire "aspnet_regsql.exe" présent
dans le répertoire \Windows\Microsoft.NET\Framework\v2.0.50727\ pour ajouter
ces éléments et ceux d'autres services pour ASP.NET à une base de données.

## Utiliser le filtre [Authorize] pour l'URL /Dinners/Create

Nous n'avons pas eu à écrire la moindre ligne de code pour que l'application
NerdDinner dispose d'un système d'authentification sécurisé et d'une gestion
des utilisateurs. Les utilisateurs peuvent créer un compte dans notre
application et se connecter au site ou s'en déconnecter. A partir de
maintenant, nous allons pouvoir mettre en place une gestion des droits et nous
appuyer sur l'état connecté ou non des visiteurs et sur leur identifiant pour
déterminer ce qu'ils peuvent faire ou pas dans l'application.

Nous allons commencer par ajouter un contrôle des autorisations à la méthode
d'action "Create" de la classe DinnersController. Concrètement, nous allons
imposer que les utilisateurs qui accèdent à l'URL /Dinners/Create soient
connectés. Si ce n'est pas le cas, nous les redirigerons vers la page de
connexion afin qu'ils puissent s'identifier.

La mise en place de ce contrôle est assez simple. Tout ce que nous avons
besoin de faire, c'est d'ajouter un filtre [Authorize] aux deux méthodes
d'action Create() en procédant comme ci-dessous :

```
//
// GET: /Dinners/Create
[Authorize]
public ActionResult Create() {
   ...
}

//
// POST: /Dinners/Create
[AcceptVerbs(HttpVerbs.Post), Authorize]
public ActionResult Create(Dinner dinnerToCreate) {
   ...
}
```

ASP.NET MVC offre la possibilité de créer des "filtres d'action". Ceux-ci
servent à implémenter des traitements réutilisables et à les appliquer sous
forme d'attribut aux méthodes d'action. Le filtre [Authorize] est l'un des
filtres d'action fourni de base par ASP.NET MVC. Il permet aux développeurs de
déclarer des autorisations pour qu'elles s'appliquent aux actions d'un
contrôleur ou à tout le contrôleur.

Lorsqu'on l'utilise sans paramètre comme dans l'exemple précédent, le filtre
[Authorize] impose que l'utilisateur qui effectue la requête soit connecté -
sans quoi il est automatiquement redirigé vers le formulaire de connexion. Lors
de cette redirection, l'URL appelée au départ est passée en paramètre dans la
Querystring (/Account/LogOn?ReturnUrl=%2fDinners%2fCreate par exemple). Le
contrôleur AccountController pourra ainsi renvoyer l'utilisateur vers cette
page d'origine une fois qu'il sera connecté.

Si besoin, le filtre [Authorize] peut être complété à l'aide des propriétés
"Users" ou "Roles" qui s'emploient pour contrôler qu'en plus d'être connecté,
l'utilisateur fait parti d'une liste d'utilisateurs autorisés ou qu'il est
membre d'un rôle donné. Par exemple, dans le code ci-dessous, il n'y a que deux
utilisateurs particuliers - "scottgu" et "billg" - qui ont le droit d'accéder à
l'URL /Dinners/Create :

```
[Authorize(Users="scottgu,billg")]
public ActionResult Create() {
   ...
}
```

Malgré tout, le fait de définir ainsi des identifiants utilisateurs en dur
dans le code va rendre celui-ci beaucoup moins maintenable. Une meilleure
solution consiste donc à contrôler les droits par rapport à des "rôles" et à
associer les utilisateurs à ces rôles soit en passant par une base de données
soit par l'intermédiaire de l'Active Directory (la liste des utilisateurs
concernés étant ainsi définie à l'extérieur du code). ASP.NET propose une API
pour gérer des rôles et fourni également un ensemble de fournisseurs pour les
stocker (dont un pour SQL et un pour Active Directory), le tout permettant de
simplifier l'association entre utilisateurs et rôles. Avec cela, nous pourrions
adapter notre code pour autoriser uniquement les utilisateurs appartenant au
rôle "admin" à accéder à l'URL /Dinners/Create :

```
[Authorize(Roles="admin")]
public ActionResult Create() {
   ...
}
```

## Utiliser User.Identity.Name pour créer un dîner

Lors d'une requête, nous pouvons récupérer l'identifiant de l'utilisateur
actuellement connecté grâce à la propriété User.Identity.Name disponible via la
classe Controller de base.

Au début, quand nous avions programmé la partie HTTP POST de l'action
Create(), nous avions mis une chaîne en dur pour initialiser la valeur de la
propriété "HostedBy" dans la classe Dinner. Nous pouvons désormais mettre à
jour ce code pour employer la propriété User.Identity.Name à la place et en
profiter pour inscrire automatiquement le responsable du dîner au dîner qu'il
organise :

```
//
// POST: /Dinners/Create
[AcceptVerbs(HttpVerbs.Post), Authorize]
public ActionResult Create(Dinner dinner) {

   if (ModelState.IsValid) {
     try {
        dinner.HostedBy = User.Identity.Name;

        RSVP rsvp = new RSVP();
        rsvp.AttendeeName = User.Identity.Name;
        dinner.RSVPs.Add(rsvp);

        dinnerRepository.Add(dinner);
        dinnerRepository.Save();

        return RedirectToAction("Details", new { id=dinner.DinnerID });
     }
     catch {
        ModelState.AddModelErrors(dinner.GetRuleViolations());
     }
   }

   return View(new DinnerFormViewModel(dinner));
}
```

Etant donné que nous avons ajouté un attribut [Authorize] à la méthode
Create(), ASP.NET MVC va faire attention à ce que cette méthode d'action ne
s'exécute que si le visiteur arrivant sur l'URL /Dinner/Create est connecté au
site. Et si c'est le cas, la propriété User.Identity.Name contiendra
obligatoirement un nom d'utilisateur valide.

## Utiliser User.Identity.Name pour modifier un dîner

Nous allons maintenant ajouter un test pour gérer les autorisations des
utilisateurs et faire en sorte que seul le responsable d'un dîner ait le droit
de modifier celui-ci.

Pour parvenir à cela, nous allons commencer par ajouter une méthode
"IsHostedBy(username)" à l'objet Dinner (au niveau de la classe partielle
Dinners.cs que nous avons créée auparavant). Cette méthode renvoie "true" ou
"false" selon que l'identifiant de l'utilisateur passé en paramètre correspond
à la valeur de la propriété HostedBy de l'objet Dinner ou non. Tout le côté
destiné à effectuer une comparaison de chaîne sans tenir compte de la casse est
traité au niveau de cette méthode helper :

```
public partial class Dinner {

   public bool IsHostedBy(string userName) {

     return HostedBy.Equals(userName,
                                 StringComparison.InvariantCultureIgnoreCase);
   }
}
```

Puis nous allons ajouter un attribut [Authorize] aux méthodes d'action
Edit() de la classe DinnersController. Cela nous garanti que les visiteurs qui
accèdent à l'URL /Dinner/Edit/[id] sont bien des utilisateurs connectés.

Nous pouvons alors ajouter du code au niveau des méthodes Edit pour utiliser
la méthode helper Dinner.IsHostedBy(username) afin de vérifier que
l'utilisateur connecté correspond bien au responsable du dîner. Si ce n'est pas
le cas, nous afficherons une vue "InvalidOwner" pour terminer la requête. Le
code qui réalise tout cela est le suivant :

```
//
// GET: /Dinners/Edit/5

[Authorize]
public ActionResult Edit(int id) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   if (!dinner.IsHostedBy(User.Identity.Name))
     return View("InvalidOwner");

   return View(new DinnerFormViewModel(dinner));
}

//
// POST: /Dinners/Edit/5
[AcceptVerbs(HttpVerbs.Post), Authorize]
public ActionResult Edit(int id, FormCollection collection) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   if (!dinner.IsHostedBy(User.Identity.Name))
     return View("InvalidOwner");

   try {
     UpdateModel(dinner);

     dinnerRepository.Save();

     return RedirectToAction("Details", new {id = dinner.DinnerID});
   }
   catch {
     ModelState.AddModelErrors(dinnerToEdit.GetRuleViolations());

     return View(new DinnerFormViewModel(dinner));
   }
}
```

Il nous reste alors à faire un clic-droit dans le répertoire \View\Dinner et
à sélectionner la commande Add-&gt;View pour créer la nouvelle vue
"InvalidOwner" et à la remplir avec le message d'erreur ci-dessous :

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   <title>You Don't Own This Dinner</title>
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">
   <h2>Error Accessing Dinner</h2>

   <p>Sorry - but only the host of a Dinner can edit or delete it.</p>
</asp:Content>
```

Et maintenant, lorsqu'un utilisateur essaie de mettre à jour un dîner dont
il n'est pas responsable, il tombe sur un message d'erreur :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image119.png)

Avant de poursuivre, il faut répéter ces différentes étapes pour refaire la
même chose en ce qui concerne les méthodes d'action Delete() de façon à
contrôler la suppression d'un dîner et être sûr que seule la personne
responsable du dîner aura la permission de le supprimer.

## Afficher ou masquer les liens Edit et Delete

Notre page Details propose un lien vers les méthodes d'action Edit et Delete
de la classe DinnersController :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image120.png)

Pour le moment, nous affichons les liens pour les actions Edit et Delete
sans tenir compte du fait que le visiteur est le responsable du dîner ou non.
Nous allons améliorer ça pour que ces deux liens n'apparaissent que si le
visiteur est l'organisateur du dîner.

Pour l'instant, la méthode d'action Details() du contrôleur
DinnersController récupère un objet Dinner et le fait passer à la vue
Details :

```
//
// GET: /Dinners/Details/5
public ActionResult Details(int id) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   if (dinner == null)
     return View("NotFound");

   return View(dinner);
}
```

Nous pouvons donc mettre à jour cette vue afin qu'elle utilise désormais la
méthode helper Dinner.IsHostedBy() pour afficher ou pour masquer les liens Edit
et Delete en fonction du résultat de celle-ci :

```
<% if (Model.IsHostedBy(Context.User.Identity.Name)) { %>

   <%= Html.ActionLink("Edit Dinner", "Edit", new { id=Model.DinnerID })%> |
   <%= Html.ActionLink("Delete Dinner", "Delete", new {id=Model.DinnerID})%>

<% } %>
```

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Utiliser
Ajax pour saisir les inscriptions](/nerddinner/utiliser-ajax/)
