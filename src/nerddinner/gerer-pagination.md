---
date: 2010-01-19 21:35:00
layout: page
permalink: nerddinner/gerer-pagination/
redirect_from: "pages/NerdDinner/Gerer-pagination"
title: "NerdDinner(fr) : Gérer la pagination"
---

Si notre site a du succès, il contiendra des milliers de dîners. Nous devons
donc faire en sorte que notre interface utilisateur s'adapte pour gérer tous
ces dîners potentiels et qu'elle permette aux utilisateurs de les consulter.
Pour cela, nous allons gérer la pagination au niveau de l'URL /Dinners afin
d'éviter d'afficher 1000 dîners en une seule fois. Nous afficherons seulement
10 dîners à la fois et donnerons à l'utilisateur la possibilité de changer de
page en utilisant une méthode qui optimise le référencement.

## Rappel sur l'action Index()

La méthode d'action Index() de notre classe DinnersController ressemble
actuellement à ceci :

```
//
// GET: /Dinners/
public ActionResult Index() {

   var dinners = dinnerRepository.FindUpcomingDinners().ToList();

   return View(dinners);
}
```

Quand on fait une requête vers l'URL /Dinners, ce code retrouve la liste des
dîners à venir et les présente sous forme de liste :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image107.png)

## Comprendre IQuerable&lt;T&gt;

IQueryable &lt;T&gt; est une interface qui est apparue dans .NET 3.5 avec
LINQ. Elle permet une exécution différée qui va nous permettre de mettre en
œuvre la pagination de notre liste.

Dans le DinnerRepository ci-dessous, la méthode FindUpcomingDinners()
renvoie une séquence &lt;Dinner&gt;IQueryable :

```
public class DinnerRepository {

   private NerdDinnerDataContext db = new NerdDinnerDataContext();

   //
   // Query Methods
   public IQueryable<Dinner> FindUpcomingDinners() {

     return from dinner in db.Dinners
                where dinner.EventDate > DateTime.Now
                orderby dinner.EventDate
                select dinner;
   }
```

L'objet IQueryable&lt;Dinner&gt; renvoyé par la méthode
FindUpcomingDinners() incorpore une requête pour retrouver les objets Dinner
dans la base de données en utilisant LINQ to SQL. Point important, la requête
ne va s'exécuter en base de données qu'au moment où nous accèderons ou
bouclerons sur les données, ou dès que nous utiliserons la méthode ToList(). Le
code qui appelle la méthode FindUpcomingDinners() a la possibilité d'ajouter
des opérations ou des filtres à l'objet IQueryable&lt;Dinner&gt; avant
d'exécuter la requête. LINQ to SQL est alors suffisamment malin pour exécuter
uniquement la requête finale lorsqu'on accède aux données.

Pour programmer le traitement de pagination, nous allons modifier notre
action Index() afin d'appliquer les opérations "Skip" et "Take" à la séquence
IQueryable&lt;Dinner&gt; obtenue avant d'appeler la méthode ToList() :

```
//
// GET: /Dinners/
public ActionResult Index() {

   var upcomingDinners = dinnerRepository.FindUpcomingDinners();
   var paginatedDinners = upcomingDinners.Skip(10).Take(20).ToList();

   return View(paginatedDinners);
}
```

Le code ci-dessus passe les 10 premiers dîners enregistrés dans la base de
données puis renvoie les 20 dîners suivants. LINQ to SQL est alors capable de
construire une requête SQL optimisée qui effectue cette sélection au niveau de
la base de données et pas au niveau du framework .NET. Par conséquent, même si
la base de données contenait des millions de dîners, seuls les 10 demandés
seraient renvoyé par cette requête SQL (ce qui la rend à la fois performante et
évolutive).

## Gérer un numéro de page dans l'URL

Au lieu de coder en dur la page souhaitée, nous allons ajouter un paramètre
"page" dans l'URL pour indiquer quelle fourchette de dîners afficher.

### Utiliser la QueryString

Le code suivant montre comment modifier notre action Index() pour gérer le
paramètre "page" sous forme de Querystring et prendre en compte des URLs sous
la forme /Dinners?page=2 :

```
//
// GET: /Dinners/
// /Dinners?page=2
public ActionResult Index(int? page) {

   const int pageSize = 10;

   var upcomingDinners = dinnerRepository.FindUpcomingDinners();
   var paginatedDinners = upcomingDinners.Skip((page ?? 0) * pageSize)
                                              .Take(pageSize)
                                              .ToList();

   return View(paginatedDinners);
}
```

La méthode Index() ci-dessus attend un paramètre "page". Ce paramètre est
déclaré en tant qu'entier nullable. Ainsi, l'URL /Dinners?page=2 attribuera la
valeur de "2" au paramètre alors que l'URL /Dinners (sans Querystring) lui
attribuera une valeur nulle.

Le numéro de page est alors multiplié par la taille de la page (10 lignes en
l'occurrence) pour déterminer le nombre de dîners à passer. Nous avons utilisé
l'opérateur ?? du C# qui est très pratique pour gérer les types nullables. Dans
l'exemple ci-dessus, il nous permet d'employer la valeur 0 lorsque le paramètre
"page" est null.

### Modifier l'URL

Plutôt que d'utiliser un paramètre en Querystring, il est aussi possible de
faire apparaitre le numéro de page directement dans l'URL, ce qui pourrait
donner : /Dinners/Page/2 ou /Dinners/2. ASP.NET MVC dispose d'un moteur de
routage d'URLs très puissant qui facilite ce genre d'opération.

Nous pouvons ajouter des règles de routage personnalisées à n'importe quelle
URL ou format d'URL pour les faire pointer vers le contrôleur ou l'action de
notre choix. La seule chose à faire est d'ouvrir le fichier Global.asax de
notre projet :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image108.png)

Nous pouvons alors y enregistrer une nouvelle règle de routage en utilisant
la méthode MapRoute() comme cela a été fait pour le premier appel à
routes.MapRoute() dans l'exemple ci-dessous :

```
public void RegisterRoutes(RouteCollection routes) {

   routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

   routes.MapRoute(
     "UpcomingDinners",
     "Dinners/Page/{page}",
     new { controller = "Dinners", action = "Index" }
   );

   routes.MapRoute(
     "Default", // Route name
     "{controller}/{action}/{id}", // URL with params
     new { controller="Home", action="Index", id="" } // Param defaults
   );
}

void Application_Start() {
   RegisterRoutes(RouteTable.Routes);
}
```

Nous avons ainsi enregistré une nouvelle règle de routage appelée
"UpcomingDinners". Nous avons indiqué que celle-ci correspond aux URLs de la
forme "Dinners/Page/{page}" ({page} étant le numéro de page inséré dans l'URL).
Le troisième paramètre de la méthode MapRoute() indique que les URLs qui
correspondent à ce format doivent être rattachées à l'action Index() du
contrôleur DinnersController.

Nous pouvons continuer à utiliser le même code que dans le cas précédent
avec la Querystring. La seule différence est que désormais le paramètre "page"
provient de l'URL elle-même alors qu'avant il provenait de la Querystring :

```
//
// GET: /Dinners/
// /Dinners/Page/2
public ActionResult Index(int? page) {

   const int pageSize = 10;

   var upcomingDinners = dinnerRepository.FindUpcomingDinners();
   var paginatedDinners = upcomingDinners.Skip((page ?? 0) * pageSize)
                                              .Take(pageSize)
                                              .ToList();
   return View(paginatedDinners);
}
```

Et maintenant, quand nous lançons l'application et demandons l'URL /Dinners,
nous voyons uniquement les 10 premiers dîners :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image109.png)

Et si nous allons à l'URL /Dinners/Page/1, nous obtenons les 10 dîners
suivants :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image110.png)

## Gérer la navigation entre les pages

La dernière étape pour finaliser notre système de pagination est d'ajouter
des boutons de navigation "suivant" et "précédent" dans notre vue pour que les
utilisateurs puissent se déplacer facilement parmi les dîners.

Pour réaliser cela de façon correcte, nous avons besoin de connaitre le
nombre total de dîners enregistrés dans la base de données ainsi que le nombre
de pages que cela représente. Nous avons ensuite besoin de déterminer si la
page actuellement demandée est la première ou la dernière pour selon le cas
cacher le bouton "suivant" ou "précédent". Nous pourrions programmer tout ça au
niveau de la méthode Index(). Ou alors, nous pouvons ajouter une classe helper
à notre projet pour mettre en œuvre ce traitement d'une façon plus
réutilisable.

Le code ci-dessous représente une classe helper "PaginatedList" simple qui
dérive de la collection List&lt;T&gt; présente dans le framework .NET. Elle
implémente une classe collection réutilisable qui pourra servir pour la
pagination toute séquence de données IQueryable. Dans le cas de notre
application NerdDinner, nous l'appliquerons sur les résultats de
IQueryable&lt;Dinner&gt; mais il pourrait tout aussi bien s'agir des résultats
d'un IQueryable&lt;Product&gt; ou IQueryable&lt;Customer&gt;.

```
public class PaginatedList<T> : List<T> {

   public int PageIndex { get; private set; }
   public int PageSize { get; private set; }
   public int TotalCount { get; private set; }
   public int TotalPages { get; private set; }

   public PaginatedList(IQueryable<T> source, int pageIndex, int pageSize) {
     PageIndex = pageIndex;
     PageSize = pageSize;
     TotalCount = source.Count();
     TotalPages = (int) Math.Ceiling(TotalCount / (double)PageSize);

     this.AddRange(source.Skip(PageIndex * PageSize).Take(PageSize));
   }

   public bool HasPreviousPage {
     get {
        return (PageIndex > 0);
     }
   }

   public bool HasNextPage {
     get {
        return (PageIndex+1 < TotalPages);
     }
   }
}
```

Vous pouvez voir dans le code ci-dessus comment sont calculées puis exposées
les propriétés "PageIndex", "PageSize", "TotalCount" et "TotalPage". La classe
"PaginatedList" expose également deux autres propriétés "HasPreviousPage" et
"HasNextPage" qui indiquent s'il existe une page avant ou après la page en
cours. Le code ci-dessus génèrera l'exécution de deux requêtes SQL : la première
pour retrouver le nombre total d'objets Dinners (ce qui ne renverra pas tous
les objets mais exécutera un simple "SELECT COUNT" qui renvoie un entier comme
résultat) et la seconde pour récupérer uniquement les lignes de données dont
nous avons besoin pour afficher le contenu correspondant au numéro de page en
cours.

Nous pouvons alors mettre à jour l'action DinnersController.Index() pour
créer un objet PaginatedList&lt;Dinner&gt; à partir du résultat de la méthode
DinnerRepository.FindUpcomingDinners() et l'envoyer à la vue Index.aspx :

```
// GET: /Dinners/
// /Dinners/Page/2

public ActionResult Index(int? page) {

   const int pageSize = 10;

   var upcomingDinners = dinnerRepository.FindUpcomingDinners();
   var paginatedDinners = new PaginatedList<Dinner>(upcomingDinners,
                                                         page ?? 0,
                                                         pageSize);

   return View(paginatedDinners);
}
```

Il nous reste alors à modifier la vue \Views\Dinners\Index.aspx pour qu'elle
hérite désormais de
ViewPage&lt;NerdDinner.Helpers.PaginatedList&lt;Dinner&gt;&gt; au lieu de
&lt;ViewPage&lt;IEnumerable&lt;Dinner&gt;&gt; avant d'ajouter le code
ci-dessous à la fin de la vue pour gérer l'affichage et le masquage des boutons
de navigation :

```
<% if (Model.HasPreviousPage) { %>

   <%= Html.RouteLink("<<<",
                         "UpcomingDinners",
                         new { page=(Model.PageIndex-1) }) %>

<% } %>

<% if (Model.HasNextPage) { %>

   <%= Html.RouteLink(">>>",
                         "UpcomingDinners",
                         new { page = (Model.PageIndex + 1) })%>

<% } %>
```

Vous avez sans doute remarqué que nous avons utilisé le helper
Html.RouteLink() pour générer nos liens. Cette méthode est similaire au helper
Html.ActionLink() que nous avons utilisée jusqu'ici. Ce qui est différent,
c'est que nous générons l'URL en utilisant la règle de routage
"UpcomingDinners" déclarée tout à l'heure dans le fichier Global.asax. Cela
nous garantit que les URLs vers notre action Index() auront la forme
/Dinners/Page/{page}, où {page} représente la variable que nous définissons
ci-dessus à partir de la valeur actuelle de PageIndex.

Et maintenant, après avoir relancé l'application, l'affichage présente 10
dîners :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image111.png)

Et juste après la liste, des liens &lt;&lt;&lt; et

> &gt;&gt; sont apparus pour naviguer entre les pages et nous permettre
> d'avancer

ou de revenir en arrière parmi les dîners, en utilisant des URLs optimisées
pour le référencement par les moteurs de recherches :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image112.png)

## Remarque : Comprendre les conséquences de IQueryable&lt;T&gt;

IQueryable&lt;T&gt; est une fonctionnalité très puissante qui rend possible
un grand nombre de traitements d'exécution différée comme dans le cas de la
pagination. Mais comme pour toutes fonctionnalités très puissantes, vous devez
être attentif à la façon dont vous l'utilisez et prendre garde de ne pas en
abuser.

Vous devez bien comprendre que si votre repository renvoie un objet
IQueryable&lt;T&gt;, le code qui va l'appeler pourra lui appliquer des
opérations en chaîne et que celles-ci seront prises en compte lors de
l'exécution définitive. Si vous ne souhaitez pas que le code appelant puisse
faire ça, vous devez plutôt renvoyer un objet IList&lt;T&gt;, List&lt;T&gt; ou
IEnumerable&lt;T&gt; qui contiendra le résultat réel de la requête qui a été
exécutée.

Pour notre fonctionnalité de pagination, cela nous contraindrait à placer
les traitements liés à la pagination dans la méthode du repository à appeler.
Dans ce cas de figure, nous pourrions modifier la méthode FindUpcomingDinners()
pour qu'elle renvoie un objet PaginatedList :

```
PaginatedList<Dinner> FindUpcomingDinners(int pageIndex, int pageSize) { }
```

Ou qu'elle retourne une IList&lt;Dinner&gt; et définisse un paramètre
"totalCount" passé par référence pour renvoyer le nombre total d'objets
Dinners :

```
IList<Dinner> FindUpcomingDinners(int pageIndex, int pageSize, out int totalCount) { }
```

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Authentification et Autorisation](/nerddinner/authentification-autorisation/)
