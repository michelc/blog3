---
date: 2021-12-23 12:50:32 +02:00
tags: [ csharp, .net, mvc, htmx ]
title: "Utiliser HTMX avec ASP.NET Core MVC"
cover:
  image: /public/2021/htmx-asp-net-core-mvc.jpg
  link: https://docs.microsoft.com/en-us/aspnet/core/mvc/overview
  text: HTMX + ASP.NET Core MVC
excerpt: Comment développer une application CRUD avec HTMX + ASP.NET Core MVC. Essentiellemet pour éviter de recharger / afficher intégralement les pages pour gérer les fonctions CRUD.
---

Comme j'ai trouvé le temps de mettre au propre mes essais avec [HTMX](https://htmx.org/), je peux enfin noter comment j'ai développé une application CRUD toute simple avec HTMX et ASP.NET Core MVC. Dans un premier temps, mon but n'est pas de faire des zip, shebam, pow, blop, wizz... mais d'éviter de recharger / afficher intégralement des pages pour gérer les fonctions CRUD de base.


## Point de départ

Je crée vite fait une application ASP.NET Core MVC pour gérer une table Movies dans une base de données SQLite. J'ai donc un contrôleur "MoviesController" avec les méthodes suivantes :

```csharp
// GET: Movies
public async Task<IActionResult> Index() { ... }

// GET: Movies/Details/5
public async Task<IActionResult> Details(int? id) { ... }

// GET: Movies/Create
public IActionResult Create() { ... }

// POST: Movies/Create
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Create(MovieEditorViewModel model) { ... }

// GET: Movies/Edit/5
public async Task<IActionResult> Edit(int? id) { ... }

// POST: Movies/Edit/5
[HttpPost]
[ValidateAntiForgeryToken]
public async Task<IActionResult> Edit(int id, MovieEditorViewModel model) { ... }

// GET: Movies/Delete/5
public async Task<IActionResult> Delete(int? id) { ... }

// POST: Movies/Delete/5
[HttpPost, ActionName("Delete")]
[ValidateAntiForgeryToken]
public async Task<IActionResult> DeleteConfirmed(int id) { ... }
```

Et les 5 vues qui correspondent à ces 5 actions : "Index.cshtml", "Details.cshtml", "Create.cshtml", "Edit.cshtml" et "Delete.cshtml" (plus 2 vues partielles "_Display.cshtml" et "_Editor.cshtml" pour éviter de répéter du code).

Le code de cette application de départ est visible sur [GitHub](https://github.com/michelc/MvcHtmx/tree/1-sans-htmx).

Pour tester l'application, il faut cliquer sur le menu "Films" pour obtenir la liste des films qui servent de jeux d'essai.

![](/public/2021/htmx-essai-1.jpg)

Depuis cette page d'index, on peut constater que quand on clique sur les liens "Créer", "Modifier", "Consulter" ou "Supprimer", la page est rechargée en totalité. En effet, la date et l'heure dans le pied de page sont mis à jour à chaque fois.

De même, quand on est dans une page de détail, le lien "Annuler" pour revenir à la liste recharge complètement la page d'index. Et de la même façon, la validation des formulaires (pour créer, modifier ou supprimer des données) provoque un retour à la page d'index et le rechargement complet de la page.

![](/public/2021/htmx-essai-2.jpg)

A partir de maintenant, je vais ajouter HTMX à cette application puis lui apporter quelques modifications pour en tirer parti et ne plus recharger l'intégralité des pages à chaque fois.


## Etape 1 - Référencer HTMX

Il y a plusieurs façon d'[installer HTMX](https://htmx.org/docs/#installing), mais pour faire vite, j'ajoute simplement la ligne `<script src="https://unpkg.com/htmx.org@1.6.1"></script>` dans mon fichier "/Views/Shared/_Layout.cshtml" :

```html
        ...
        <div class="container">
            &copy; 2021 - MvcHtmx - @DateTime.Now.ToLongTimeString()
        </div>
    </footer>

    <script src="~/lib/jquery/dist/jquery.min.js"></script>
    <script src="~/js/site.js" asp-append-version="true"></script>
    <script src="https://unpkg.com/htmx.org@1.6.1"></script>
    @await RenderSectionAsync("Scripts", required: false)
</body>
</html>
```

## Etape 2 - Modifier la vue "Index.cshtml"

La vue "Index.cshtml" contient un lien `<a asp-action="Create">Créer</a>` dans l'en-tête de la table pour permettre de créer un nouveau film.

C'est un TagHelper classique qui génère le code HTML suivant : `<a href="/movies/create/">Créer</a>`. Lorsque l'utilisateur clique sur ce lien, le navigateur contacte le serveur web via une requête HTTP GET et ASP.NET Core exécute l'action "Create" du contrôleur "MoviesController" qui renvoie une nouvelle page au navigateur.

Comme mon application utilise un "layout", la majeure partie de la nouvelle page correspond mot pour mot au contenu de la page d'index... En fait, ce qui change c'est ce qui est généré par la méthode Razor `@RenderBody()`. Et d'un point de vue HTML, ce qui change, c'est le contenu de la balise `<main>`.

```html
    </header>

    <div class="container">
        <main role="main" class="pb-3">
            @RenderBody()
        </main>
    </div>

    <footer class="border-top footer text-muted">
```

C'est là que HTMX entre en jeu puisqu'il va permettre de ne renvoyer que le nouveau contenu pour la balise `<main>`.

Pour cela, il faut ajouter quelques informations à notre lien, pour que HTMX puisse faire son oeuvre.

* un attribut "[hx-get](https://htmx.org/attributes/hx-get/)" : `hx-get="/movies/create/"` pour indiquer à HTMX qu'il devra faire une requête HTTP GET sur l'URL "/movies/create/" qui correspond à l'action "Create" du contrôleur "MoviesController".
* un attribut "[hx-target](https://htmx.org/attributes/hx-target/)" : `hx-target="main"` pour cibler où HTMX va devoir insérer le contenu renvoyé par l'action (à la place du contenu en cours de la balise `<main>`).
* un attribut `hx-push-url="true"` pour que la barre d'adresse du navigateur soit mise à jour. 

L'attribut "[hx-push-url](https://htmx.org/attributes/hx-push-url/)" est intéressant à plus d'un titre :

1. Sans lui, la barre d'adresse ne changerait pas et contiendrait toujours "https://localhost/movies/" qui est l'URL de la page d'index.
1. Avec lui, la barre d'adresse affichera bien l'URL de la page permettant de créer un film, à savoir "https://localhost/movies/create/".
1. Ce qui est mieux si jamais l'utilisateur enregistre cette URL ou la communique à quelqu'un.
1. Et surtout, ça permet que le système de routes de ASP.NET Core s'y retrouve correctement, sans rien avoir à changer.

*Note : Une modification ultérieure me permettra cependant de m'en passer, sans perdre aucun de ces 4 avantages.*

Avec ces 3 nouveaux attributs, le TagHelper est maintenant :

```html
<td>
  <a asp-action="Create" hx-target="main" hx-push-url="true" hx-get="/movies/create/">Créer</a>
</td>
```

Ce qui génère le code HTML suivant :

```html
<td>
  <a href="/movies/create/" hx-target="main" hx-push-url="true" hx-get="/movies/create/">Créer</a>
</td>
```

*Note : J'ai testé et HTMX ne permet d'avoir `<a href="/movies/create/" hx-target="main" hx-push-url="true">Créer</a>` pour éviter que les attributs "href" et "hx-get" fassent doublon.*

De la même façon, je peux modifier les liens "Modifier", "Consulter" et "Supprimer" en leur ajoutant les 3 attributs spécifiques à HTMX :

```html
<td>
  <a asp-action="Edit" asp-route-id="@item.Movie_ID"
     hx-target="main" hx-push-url="true" hx-get="/movies/edit/@item.Movie_ID/">Modifier</a> |
  <a asp-action="Details" asp-route-id="@item.Movie_ID"
     hx-target="main" hx-push-url="true" hx-get="/movies/details/@item.Movie_ID/">Consulter</a> |
  <a asp-action="Delete" asp-route-id="@item.Movie_ID"
     hx-target="main" hx-push-url="true" hx-get="/movies/delete/@item.Movie_ID/">Supprimer</a>
</td>
```

## Etape 3 - Modifier les autres vues

Les vues "Details.cshtml", "Create.cshtml", "Edit.cshtml" et "Delete.cshtml" contiennent toutes un lien `<a href="/movies/">Annuler</a>` pour quitter la page et revenir à la liste des films. Ce lien est généré via le TagHelper suivant :

```html
<a asp-action="Index">Annuler</a>
```

Que je remplace en :

```html
<a asp-action="Index" hx-target="main" hx-push-url="true" hx-get="/movies/">Annuler</a>
```

La vue "Details.cshtml" qui sert à consulter un film contient également un lien qui renvoie vers la page pour modifier le film en cours. Sa modification avec 3 attributs "hx-*" supplémentaires est désormais classique :

```html
<a asp-action="Edit" asp-route-id="@Model.Movie_ID" class="btn btn-secondary"
   hx-target="main" hx-push-url="true" hx-get="/movies/edit/@Model.Movie_ID/">Modifier</a>
```

Ensuite, la vue "Create.cshtml" contient un formulaire HTML pour envoyer les données saisies au serveur web afin qu'il s'occupe d'insérer un nouveau film dans la base de données.

```html
<form asp-action="Create" method="post" class="form-horizontal">
  ...
</form>
```

Personnellement, j'ai enlevé le `asp-action="Create"` parce que je fais en sorte de toujours poster un formulaire sur la même URL que celle qui affiche ce formulaire. C'est beaucoup mieux si jamais il y a des erreurs de saisie détectées après coup côté serveur.

```html
<form method="post" class="form-horizontal">
  ...
</form>
```

Je complète le TagHelper pour qu'il soit pris en compte par HTMX :

```html
<form method="post" class="form-horizontal" hx-post="/movies/create/">
  ...
</form>
```

Dans ce cas, l'attribut "hx-get" est remplacé par "[hx-post](https://htmx.org/attributes/hx-post/)" puisque le formulaire effectue une requête HTTP POST et pas une requête HTTP GET. Par ailleurs, les 2 attributs "hx-target" et "hx-push-url" n'ayant pas d'effet (quand j'ai testé), je ne les ajoute pas.

Puis je fais pareil avec la vue "Edit.cshtml" qui sert à modifier un film :

```html
<form method="post" class="form-horizontal" hx-post="/movies/edit/@Model.Movie_ID/">
  ...
</form>
```

Et dans la vue "Delete.cshtml" qui sert pour supprimer un film :

```html
<form method="post" class="form-horizontal" hx-post="/movies/delete/@Model.Movie_ID/">
  ...
</form>
```

Au passage, comme il s'agit d'une application MVC et pas d'une API, je n'utilise pas les méthodes HTTP PUT ou HTTP DELETE. Je respecte le système de routes "traditionnel" de ASP.NET MVC pour faire le lien entre les URLs et les actions d'un contrôleur :

* GET /movies/ => action "Index" pour afficher la liste des films
* GET /movies/details/99/ => action "Details" pour afficher le détail d'un film
* GET /movies/create/ => action "Create" pour afficher le formulaire de création d'un film
* POST /movies/create/ => action "Create" pour créer un nouveau film
* GET /movies/edit/99/ => action "Edit" pour afficher le formulaire de modification d'un film
* POST /movies/edit/99/ => action "Edit" pour modifier un film
* GET /movies/delete/99/ => action "Delete" pour afficher le formulaire de suppression d'un film
* POST /movies/delete/99/ => action "Delete" pour supprimer un film

*Note : Les "/" en fin d'URL ne sont pas "standards", c'est moi qui préfère comme ça.*


## Etape 4 - Renvoyer une vue partielle depuis le contrôleur

Comme je n'ai pas encore touché au code du contrôleur, celui-ci n'est au courant de rien et ne sait pas qu'il y a un nouvel HTMX. Par conséquent, ses différentes actions vont continuer à renvoyer des pages complètes au navigateur. La première modification indispensable, c'est donc de faire en sorte que celles-ci ne renvoient plus que ce qui est spécifique et plus rien du tout pour la partie "layout".

Etant donné que par défaut les applications ASP.NET Core MVC utilisent un "layout" pour éviter de répéter du code HTML, ça va être assez "facile". 

Actuellement, les actions se terminent généralement en renvoyant une vue à laquelle elles passent un modèle : `return View(data)`. Le système de vues de ASP.NET Core combine alors les informations de ce modèle, le code Razor de la vue et le code Razor du layout pour générer une page HTML complète qu'il renvoie au navigateur.

Plutôt que de faire un `return View(data)`, on peut aussi faire un `return PartialView(data)` et dans ce cas le layout n'est pas pris en compte. 

Cependant, lors du premier affichage de la page d'index des films, il faut que l'action "Index" renvoie une page complète. Il faut aussi renvoyer une page complète si jamais on arrive sur une des pages via un favori du navigateur ou via un lien qu'on nous a donné.

Heureusement, HTMX a tout prévu et il est facile de savoir dans quelle condition l'action est appelée grâce à l'[en-tête HTTP "HX-Request"](https://htmx.org/docs/#request-header) présent dans la requête HTTP :

```csharp
if (Request.Headers.ContainsKey("HX-Request"))
{
  // Cas où on vient depuis HTMX
  return PartialView(model);
}

return View(model); // Cas où on n'est pas passé par HTMX
```

Et si je mets ce bout de code dans une fonction "HtmxView()", je peux faire un rechercher / remplacer de "return View(" par "return HtmxView(" et ça fait la rue Michel.


## Etape 5 - Gérer les RedirectToAction()

Quelques essais dans tous les sens et ça fonctionne plutôt bien...

Par contre, quand on valide le formulaire des vues "Create.cshtml", "Edit.cshtml" ou "Delete.cshtml", la barre d'adresse du navigateur reste sur l'URL en cours au moment du POST alors qu'il faudrait qu'elle revienne à "https://localhost/movies/".

![](/public/2021/htmx-essai-3.jpg)

Le problème doit venir du fait qu'il n'est pas possible d'utiliser les attributs "hx-target" et "hx-push-url" avec un "hx-post" (ou que je n'ai pas réussi). Ou alors que ASP.NET Core s'y perd un peu à la suite du RedirectToAction() qui vient conclure les POST réussis (pattern Post/Redirect/Get).

Mais je peux contourner ça en ajoutant l'[en-tête HTTP "HX-Push"](https://htmx.org/docs/#response-header) à la réponse au moment de renvoyer la vue. Celui-ci indique à HTMX de définir une nouvelle URL dans la barre d'adresse du navigateur.

```csharp
private IActionResult HtmxView(object model)
{
  if (Request.Headers.ContainsKey("HX-Request"))
  {
    Response.Headers.Add("HX-Push", Request.Path.ToString());
    return PartialView(model);
  }

  return View(model);
}
```

*Note : Bien évidemment, cette méthode mériterait d'être dans un fichier "BaseController.cs"...*

**Cerise sur le gateau !**  Comme je n'ai pas fait dans la dentelle et que je renvoie l'en-tête HTTP "HX-Push" avec toutes les vues partielles, je n'ai plus besoin des `hx-push-url="true"` que j'avais ajouté au niveau de chaque lien `<a>`. Je peux donc les supprimer sans perdre en fonctionnalités.


## Récapitulatif

Une fois qu'on sait ce qu'il faut faire, ça va vite :

1. Ajouter `<script src="https://unpkg.com/htmx.org@1.6.1"></script>` dans le layout.
1. Remplacer les liens `<a asp-action="Toto">Tutu</a>` par `<a asp-action="Toto" hx-target="main" hx-get="/movies/toto/">Tutu</a>`
1. Ajouter `hx-target="main" hx-get="/movies/toto/@Un_ID/"` aux liens `<a asp-action="Toto" asp-route-id="@Un_ID">Tutu</a>`
1. Transformer les `<form method="post" ...` en `<form method="post" hx-post="/movies/toto/xxx" ...`
1. Remplacer les `return View(model);` par des `return HtmxView(model);`
1. Ajouter la méthode `private IActionResult HtmxView(object model) { ... }` au contrôleur

Pour bien visualiser et comprendre les différentes modifications apportées, leur détail est visible sous forme de diff au niveau du commit "[Ajout HTMX le plus simplement possible](https://github.com/michelc/MvcHtmx/commit/a1a321ea16abf36ae39f5440db7936caa003985f)" de la branche "2-ajout-htmx-basique" sur GitHub.


## Prochain épisode

La prochaine fois, j'expliquerai comme créer 2 nouveaux TagHelper `<a-htmx>` et `<form-htmx>` pour que toutes ces modifications soient moins tarabiscotées (et pour éviter les doublons entre "href" et "hx-get"). 

Divulgachage : on passera de `<a asp-action="Toto">Tutu</a>` à `<a-htmx asp-action="Toto">Tutu</a-htmx>` !

<div class="encart">

English version: {% goto_en "Use HTMX with ASP.NET Core MVC", "2021-12-24-use-htmx-with-asp-net-core-mvc" %}.

</div>