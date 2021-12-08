---
date: 2010-02-01 18:33:00
layout: page
permalink: nerddinner/ajouter-carte-ajax/
redirect_from: "pages/NerdDinner/Ajouter-une-carte-Ajax"
title: "NerdDinner(fr) : Ajouter une carte en Ajax"
---

Nous allons maintenant rendre notre application encore un peu plus sexy en
utilisant à nouveau un traitement en Ajax pour afficher une carte. Grâce à
celle-ci, la personne qui veut créer un dîner, le modifier ou simplement le
consulter aura la possibilité de visualiser graphiquement l'endroit où celui-ci
va avoir lieu.

## Créer une vue partielle Map.ascx

Nous utiliserons ce système de carte dans plusieurs parties de notre
application. Pour que notre code reste fidèle au principe DRY, nous allons
regrouper les fonctionnalités communes de cette carte dans une vue partielle
unique que nous pourrons réutiliser à partir de plusieurs actions et vues. Nous
allons donc créer une vue partielle nommée "Map.ascx" dans le répertoire
\Views\Dinners.

Pour cela, nous devons faire un clic-droit dans le dossier \Views\Dinners et
sélectionner la commande Add-&gt;View dans le menu qui apparait. Il faut
ensuite saisir le nom "Map.ascx", cocher pour créer une vue partielle et
indiquer que nous voulons créer une vue basée sur la classe "Dinners" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image127.png)

La vue partielle est créée après avoir cliqué sur le bouton "Add". Il nous
suffit alors de modifier le contenu du fichier Map.ascx généré pour y reprendre
le code suivant :

```
<script src="http://dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2"
type="text/javascript"></script>

<script src="/Scripts/Map.js" type="text/javascript"></script>

<div id="theMap">
</div>

<script type="text/javascript">

   $(document).ready(function() {
     var latitude = <%= Model.Latitude %>;
     var longitude = <%= Model.Longitude %>;
     if ((latitude == 0) || (longitude == 0))
        LoadMap();
     else
        LoadMap(latitude, longitude, mapLoaded);
   });

   function mapLoaded() {
     var title = "<%= Html.Encode(Model.Title) %>";
     var address = "<%= Html.Encode(Model.Address) %>";
     LoadPin(center, title, address);
     map.SetZoomLevel(14);
   }
</script>
```

Le premier &lt;script&gt; fait référence à la librairie JavaScript de
Microsoft Virtual Earth 6.2. Le second &lt;script&gt; sert à charger un fichier
"Map.js" que nous allons créer par la suite pour regrouper tous les traitements
nécessaires à la réalisation de notre carte. L'élément &lt;div id="theMap"&gt;
va servir pour contenir la carte générée par Virtual Earth.

Nous avons ensuite un bloc &lt;script&gt; qui contient deux fonctions
JavaScript écrites spécialement pour notre vue partielle. La première de ces
fonctions utilise jQuery pour définir un traitement qui s'exécutera dès que le
chargement de la page sera terminé. Elle appelle une fonction LoadMap() que
nous programmerons bientôt dans le fichier Map.js pour charger une carte
Virtual Earth. La seconde fonction est une fonction callback qui sert pour
afficher une punaise sur le plan afin de marquer l'emplacement d'un dîner.

Vous pouvez voir que nous avons utilisé des blocs de code serveur &lt;%=
%&gt; à l'intérieur du JavaScript côté client pour indiquer la latitude et la
longitude du dîner que nous voulons faire apparaitre sur la carte. C'est une
technique très pratique pour générer des valeurs dynamiques dont nous avons
besoin au niveau des scripts clients (sans pour cela nécessiter une requête
Ajax supplémentaire pour récupérer ces valeurs, ce qui serait plus lent). Les
blocs &lt;%= %&gt; s'exécutent lorsque la vue est générée par le serveur - et
par conséquent le HTML final contient bien les valeurs attendues par le
JavaScript (par exemple : var latitude = 47.64312).

**Note du traducteur :** Cette méthode présente un problème au
niveau du séparateur décimal sur les systèmes en français : JavaScript attend un
"." quelle que soit la culture du système alors que ASP.NET génère une "," dans
le cadre des instructions &lt;%= Model.Latitude %&gt; et &lt;%= Model.Longitude
%&gt;. La solution la plus simple est de modifier la section `globalization`
dans le fichier web.config :

```
<configuration>
   <system.web>
      <globalization culture="en-US" />
   </system.web>
</configuration>
```

(Source : <http://nerddinner.codeplex.com/Thread/View.aspx?ThreadId=54102>)

## Créer un script Map.js

Nous allons maintenant créer le fichier Map.js qui va nous servir à
regrouper toutes les fonctionnalités JavaScript de notre système de carte
(entre autre les fonctions LoadMap() et LoadPin() vues plus haut). Pour cela,
il suffit de faire un clic-droit dans le répertoire \Scripts depuis
l'explorateur de projet puis de choisir la commande "Add-&gt;New Item". Nous
pouvons alors sélectionner le type de fichier "JScript" puis lui donner le nom
"Map.js".

Nous ajoutons ensuite le code JavaScript ci-dessous à ce fichier Map.js afin
d'interagir avec Virtual Earth pour afficher notre carte et pouvoir placer des
punaises sur celle-ci pour repérer les dîners :

```
var map = null;
var points = [];
var shapes = [];
var center = null;

function LoadMap(latitude, longitude, onMapLoaded) {
   map = new VEMap('theMap');
   options = new VEMapOptions();
   options.EnableBirdseye = false;

   // Makes the control bar less obtrusize.
   map.SetDashboardSize(VEDashboardSize.Small);

   if (onMapLoaded != null)
     map.onLoadMap = onMapLoaded;

   if (latitude != null && longitude != null) {
     center = new VELatLong(latitude, longitude);
   }

   map.LoadMap(center, null, null, null, null, null, null, options);
}

function LoadPin(LL, name, description) {
   var shape = new VEShape(VEShapeType.Pushpin, LL);

   //Make a nice Pushpin shape with a title and description
   shape.SetTitle("<span class=\"pinTitle\"> " + escape(name) + "</span>");
   if (description !== undefined) {
     shape.SetDescription("<p class=\"pinDetails\">" +
     escape(description) + "</p>");
   }
   map.AddShape(shape);
   points.push(LL);
   shapes.push(shape);
}

function FindAddressOnMap(where) {
   var numberOfResults = 20;
   var setBestMapView = true;
   var showResults = true;

   map.Find("", where, null, null, null,
                numberOfResults, showResults, true, true,
                setBestMapView, callbackForLocation);
}

function callbackForLocation(layer, resultsArray, places,
                                 hasMore, VEErrorMessage) {
   clearMap();

   if (places == null)
     return;

   //Make a pushpin for each place we find
   $.each(places, function(i, item) {
     description = "";
     if (item.Description !== undefined) {
        description = item.Description;
     }
     var LL = new VELatLong(item.LatLong.Latitude, item.LatLong.Longitude);
     LoadPin(LL, item.Name, description);
   });

   //Make sure all pushpins are visible
   if (points.length > 1) {
     map.SetMapView(points);
   }

   //If we've found exactly one place, that's our address.
   if (points.length === 1) {
     $("#Latitude").val(points[0].Latitude);
     $("#Longitude").val(points[0].Longitude);
   }
}

function clearMap() {
   map.Clear();
   points = [];
   shapes = [];
}
```

## Afficher la carte dans les formulaires Edit et Create

Nous allons maintenant faire apparaitre une carte lors de la création et de
la modification des dîners. La bonne nouvelle, c'est que ce n'est vraiment pas
compliqué à faire et que nous n'avons pas besoin de toucher au code de notre
contrôleur. L'interface utilisateur du formulaire de saisie des dîners est
commune aux vues Create et Edit étant donné qu'elles emploient toutes les deux
la vue partielle "DinnerForm". Nous allons donc pouvoir ajouter notre carte à
un seul endroit et celle-ci sera prise en compte dans les deux scénarios Edit
et Create.

Tout ce que nous avons besoin de faire, c'est d'ouvrir la vue partielle
\Views\Dinners\DinnerForm.ascx et à la mettre à jour pour lui ajouter la vue
partielle "Map.ascx". Vous pouvez voir ci-dessous à quoi ressemble le code de
DinnerForm une fois que la carte a été insérée (les éléments du formulaire
n'apparaissant pas pour rester suffisamment clair) :

```
<%= Html.ValidationSummary() %>

<% using (Html.BeginForm()) { %>

   <fieldset>

     <div id="dinnerDiv">
        <p>
          [HTML Form Elements Removed for Brevity]
        </p>
        <p>
           <input type="submit" value="Save" />
        </p>
     </div>

     <div id="mapDiv">
        <% Html.RenderPartial("Map", Model.Dinner); %>
     </div>

   </fieldset>

   <script type="text/javascript">
     $(document).ready(function() {
        $("#Address").blur(function(evt) {
           $("#Latitude").val("");
           $("#Longitude").val("");

              var address = jQuery.trim($("#Address").val());
           if (address.length < 1)
                return;

              FindAddressOnMap(address);
        });
     });

   </script>

<% } %>
```

La vue partielle DinnerForm ci-dessus est basée sur un objet de type
"DinnerFormViewModel" (puisqu'elle a besoin à la fois d'un objet Dinner et
d'une SelectList pour remplir la liste des pays) alors que la vue partielle Map
a seulement besoin d'un objet de type "Dinner". Par conséquent, nous nous
contentons de lui passer la propriété Dinner de l'objet DinnerFormViewModel
pour faire le rendu de la vue Map :

```
<% Html.RenderPartial("Map", Model.Dinner); %>
```

La fonction JavaScript que nous avons ajoutée à la vue partielle utilise
jQuery pour attacher un évènement "blur" à la zone de saisie "Address". Vous
avez probablement déjà entendu parler des évènements "focus" qui se produisent
lorsque l'utilisateur clique ou arrive sur une textbox. A l'opposé, l'évènement
"blur" se déclenche quand l'utilisateur sort de la textbox. Le gestionnaire
d'évènement ci-dessus efface le contenu des champs latitude et longitude
lorsque cela se produit puis indique le nouvel emplacement correspondant à
l'adresse sur le plan. Le gestionnaire d'évènement callback qui a été défini
dans le fichier Map.js va alors se charger de mettre à jour les champs latitude
et longitude de notre formulaire en utilisant pour cela les valeurs renvoyées
par Virtual Earth en fonction de l'adresse que nous lui avons transmise.

Et maintenant, quand nous relançons notre application, un clic sur l'onglet
"Host Dinner" affiche la carte par défaut en plus des champs de saisie
habituels d'un dîner :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image128.png)

Quand nous saisissons une adresse, puis que nous passons à la zone de saisie
suivante, la carte se met à jour de façon dynamique pour afficher l'emplacement
du dîner et notre gestionnaire d'évènement copie les coordonnées GPS du dîner
dans les zones latitude et longitude :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image129.png)

Si nous enregistrons ce nouveau dîner puis que nous revenons dessus pour le
mettre à jour, nous pouvons voir que l'emplacement du dîner est affiché sur la
carte au chargement de la page :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image130.png)

Chaque fois que nous modifions le contenu du champ adresse, la carte et les
deux zones latitude et longitude sont aussitôt mises à jour.

Maintenant que notre carte affiche l'emplacement du dîner, il n'est plus
nécessaire que les zones de saisie latitude et longitude soient visibles et
nous pouvons les transformer en champs cachés puisqu'elles seront mises à jour
automatiquement à chaque fois que l'adresse change. Pour cela, nous remplaçons
simplement le helper Html.TextBox() par le helper Html.Hidden() :

```
<p>
   <%= Html.Hidden("Latitude", Model.Dinner.Latitude)%>
   <%= Html.Hidden("Longitude", Model.Dinner.Longitude)%>
</p>
```

Cela rend nos formulaires un peu plus conviviaux puisque nous n'y faisons
plus apparaitre des informations purement techniques (tout en continuant à les
stocker dans la base de données) :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image131.png)

## Intégrer la carte à la vue Details

Après avoir réussi à faire apparaitre la carte lorsque nous somme en
création ou en modification d'un dîner, nous allons aussi l'afficher lors de la
consultation d'un dîner. Tout ce que nous avons à faire c'est d'appeler &lt;%
Html.RenderPartial("map"); %&gt; dans la vue Details :

Une fois la carte ajoutée, le code source complet de la vue Details sera le
suivant :

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   <%= Html.Encode(Model.Title) %>
</asp:Content>

<asp:Content ID="details" ContentPlaceHolderID="MainContent" runat="server">

   <div id="dinnerDiv">

     <h2><%= Html.Encode(Model.Title) %></h2>
     <p>
        <strong>When:</strong>
        <%= Model.EventDate.ToShortDateString() %>
        <strong>@</strong>
        <%= Model.EventDate.ToShortTimeString() %>
     </p>
     <p>
        <strong>Where:</strong>
        <%= Html.Encode(Model.Address) %>,
        <%= Html.Encode(Model.Country) %>
     </p>
     <p>
        <strong>Description:</strong>
        <%= Html.Encode(Model.Description) %>
     </p>
     <p>
        <strong>Organizer:</strong>
        <%= Html.Encode(Model.HostedBy) %>
        (<%= Html.Encode(Model.ContactPhone) %>)
     </p>

     <% Html.RenderPartial("RSVPStatus"); %>
     <% Html.RenderPartial("EditAndDeleteLinks"); %>

   </div>

   <div id="mapDiv">
     <% Html.RenderPartial("map"); %>
   </div>

</asp:Content>
```

Et maintenant, lorsqu'un visiteur arrive sur une URL /Dinners/Details/[id],
il peut voir les informations concernant le dîner, l'emplacement du dîner sur
la carte (représenté par une punaise rouge qui permet d'afficher le titre du
dîner et son adresse lorsque la souris passe au-dessus) et il dispose d'un lien
Ajax pour s'inscrire à ce dîner :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image132.png)

## Ajouter la recherche d'emplacement dans la base et dans le repository

Pour finaliser cette cartographie Ajax, nous allons ajouter une dernière
carte sur la page d'accueil de notre application. Celle-ci servira aux
visiteurs pour rechercher de façon graphique les dîners qui vont avoir lieu
dans leur région :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image133.png)

Pour implémenter au mieux cette recherche de dîners basée sur des
coordonnées géographiques, nous allons commencer par ajouter les fonctions
nécessaires au niveau de la base de données et de la couche repository de notre
application. Nous aurions pu utiliser les nouvelles fonctionnalités
géospatiales de SQL Server 2008 (<http://www.microsoft.com/sqlserver/2008/en/us/spatial-data.aspx>), mais
nous allons employer la fonction SQL présentée par Gary Dryden dans l'article
<http://www.codeproject.com/KB/cs/distancebetweenlocations.aspx> que Rob
Conery a implémentée en utilisant LINQ to SQL (<http://blog.wekeroad.com/2007/08/30/linq-andgeocoding/>).

Pour mettre en œuvre cette méthode, nous devons ouvrir l'explorateur de
serveurs dans Visual Studio, y sélectionner la base de données NerdDinner,
faire un clic-droit sur sa branche "Functions" et demander à créer une nouvelle
"Fonction scalaire" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image134.png)

Nous pouvons alors y coller la fonction DistanceBetween suivante :

```
CREATE FUNCTION [dbo].[DistanceBetween] (@Lat1 as real,
                   @Long1 as real, @Lat2 as real, @Long2 as real)
RETURNS real
AS
BEGIN

DECLARE @dLat1InRad as float(53);
SET @dLat1InRad = @Lat1 * (PI()/180.0);
DECLARE @dLong1InRad as float(53);
SET @dLong1InRad = @Long1 * (PI()/180.0);
DECLARE @dLat2InRad as float(53);
SET @dLat2InRad = @Lat2 * (PI()/180.0);
DECLARE @dLong2InRad as float(53);
SET @dLong2InRad = @Long2 * (PI()/180.0);

DECLARE @dLongitude as float(53);
SET @dLongitude = @dLong2InRad - @dLong1InRad;
DECLARE @dLatitude as float(53);
SET @dLatitude = @dLat2InRad - @dLat1InRad;
/* Intermediate result a. */
DECLARE @a as float(53);
SET @a = SQUARE (SIN (@dLatitude / 2.0)) + COS (@dLat1InRad)
                   * COS (@dLat2InRad)
                   * SQUARE(SIN (@dLongitude / 2.0));
/* Intermediate result c (great circle distance in Radians). */
DECLARE @c as real;
SET @c = 2.0 * ATN2 (SQRT (@a), SQRT (1.0 - @a));
DECLARE @kEarthRadius as real;
/* SET kEarthRadius = 3956.0 miles */
SET @kEarthRadius = 6376.5; /* kms */

DECLARE @dDistance as real;
SET @dDistance = @kEarthRadius * @c;
return (@dDistance);
END
```

Puis nous créons une nouvelle "Fonction table" dans SQL Server que nous
appellerons "NearestDinners" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image135.png)

Cette fonction table "NearestDinners" utilise la fonction helper
DistanceBetween pour renvoyer tous les dîners à moins de 100 miles des
coordonnées latitude / longitude que nous lui faisons passer :

```
CREATE FUNCTION [dbo].[NearestDinners]
     (
     @lat real,
     @long real
     )
RETURNS TABLE
AS
     RETURN
     SELECT Dinners.DinnerID
     FROM Dinners
     WHERE dbo.DistanceBetween(@lat, @long, Latitude, Longitude) <100
```

Pour appeler cette fonction, nous commençons par ouvrir le concepteur LINQ
to SQL en double-cliquant sur le fichier NerdDinner.dbml dans le répertoire
Models :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image136.png)

Puis nous déplaçons par drag and drop les fonctions NearestDinners et
DistanceBetween dans le concepteur LINQ to SQL ce qui a pour effet de les
ajouter en tant que méthode à la classe NerdDinnerDataContext générée par LINQ
to SQL :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image137.png)

Nous pouvons alors ajouter une méthode "FindByLocation" à notre classe
DinnerRepository qui va utiliser la fonction NearestDinner de la classe
NerdDinnerDataContext pour renvoyer les dîners à venir qui sont situés dans les
100 miles de l'emplacement spécifié :

```
public IQueryable<Dinner> FindByLocation(float latitude, float longitude) {

   var dinners = from dinner in FindUpcomingDinners()
                   join i in db.NearestDinners(latitude, longitude)
                   on dinner.DinnerID equals i.DinnerID
                   select dinner;

   return dinners;
}
```

## Ajouter une action Ajax qui renvoie des données JSON

Nous allons maintenant ajouter une nouvelle méthode d'action qui va
s'appuyer sur cette méthode FindByLocation() du repository pour renvoyer une
liste de données Dinner qui pourra être utilisée pour illustrer la carte. Nous
allons faire en sorte que cette méthode d'action renvoie les dîners au format
JSON (JavaScript Object Notation) afin qu'il soit facile de les manipuler en
JavaScript côté client.

Nous devons créer une nouvelle classe "SearchController" en faisant un
clic-droit dans le répertoire \Controllers et en choisissant la commende
Add-&gt;Controller. Puis nous pouvons ajouter une action "SearchByLocation"
dans ce contrôleur en y copiant le code ci-dessous :

```
public class JsonDinner {
   public int DinnerID { get; set; }
   public string Title { get; set; }
   public double Latitude { get; set; }
   public double Longitude { get; set; }
   public string Description { get; set; }
   public int RSVPCount { get; set; }
}

public class SearchController : Controller {

   DinnerRepository dinnerRepository = new DinnerRepository();

   //
   // AJAX: /Search/SearchByLocation
   [AcceptVerbs(HttpVerbs.Post)]
   public ActionResult SearchByLocation(float longitude, float latitude) {

     var dinners = dinnerRepository.FindByLocation(latitude, longitude);

     var jsonDinners = from dinner in dinners
                           select new JsonDinner {
                              DinnerID = dinner.DinnerID,
                              Latitude = dinner.Latitude,
                              Longitude = dinner.Longitude,
                              Title = dinner.Title,
                              Description = dinner.Description,
                              RSVPCount = dinner.RSVPs.Count
                           };

     return Json(jsonDinners.ToList());
   }
}
```

En interne, l'action SearchByLocation() du contrôleur SearchController fait
appel à la méthode FindByLocation() de la classe DinnerRepository pour obtenir
une liste des dîners prévu à proximité. Et au lieu de faire suivre directement
cette liste d'objets Dinner au client, elle lui renvoie plutôt des objets
JSonDinner. Cette classe JsonDinner reprend un sous-ensemble des propriétés de
la classe Dinner (et par exemple elle n'indique pas le nom des personnes
inscrites à un dîner pour des raisons de sécurité). Elle contient en plus une
propriété RSVPCount qui n'existe pas au niveau de l'objet Dinner - et qui est
calculée de façon dynamique en comptant le nombre d'objets RSVP rattachés à un
dîner donné.

Puis nous utilisons la méthode helper Json() disponible au niveau de la
classe Controller pour renvoyer une séquence de dîners en utilisant un format
JSON. JSON est un format texte standardisé qui sert à représenter des
structures de données simples. Vous pouvez voir ci-dessous à quoi ressemble une
liste JSON de deux objets JsonDinner, tels qu'ils sont renvoyés par la méthode
d'action SearchByLocation() :

```
 [{"DinnerID":53,"Title":"Dinner with the Family","Latitude":47.64312,"Longitude":-
122.130609,"Description":"Fun dinner","RSVPCount":2}, {"DinnerID":54,"Title":"Another
Dinner","Latitude":47.632546,"Longitude":-122.21201,"Description":"Dinner with
Friends","RSVPCount":3}]
```

## Appeler l'action Ajax qui renvoie des données JSON via jQuery

Nous sommes maintenant prêts à compléter la page d'accueil de l'application
NerdDinner pour exploiter la méthode d'action SearchByLocation du contrôleur
SearchController. Pour cela, nous allons ouvrir la vue /Views/Home/Index.aspx
et lui ajouter une zone de saisie, un bouton de recherche, notre carte et un
élément &lt;div&gt; nommé dinnerList :

```
<script src="http://dev.virtualearth.net/mapcontrol/mapcontrol.ashx?v=6.2"
type="text/javascript"></script>

<script src="/Scripts/Map.js" type="text/javascript"></script>

<h2>Find a Dinner</h2>

<div id="mapDivLeft">

   <div id="searchBox">
     Enter your location: <%= Html.TextBox("Location") %>
     <input id="search" type="submit" value="Search" />
   </div>

   <div id="theMap">
   </div>

</div>

<div id="mapDivRight">
   <div id="dinnerList"></div>
</div>
```

Nous ajoutons ensuite les deux fonctions JavaScript suivantes à notre
page :

```
<script type="text/javascript">

   $(document).ready(function() {
     LoadMap();
   });

   $("#search").click(function(evt) {
     var where = jQuery.trim($("#Location").val());

     if (where.length < 1)
        return;

     FindDinnersGivenLocation(where);
   });
</script>
```

La première fonction JavaScript charge la carte lors du premier chargement
de la page. La seconde fonction JavaScript défini un évènement "click" pour le
bouton de recherche. Quand ce bouton est pressé, cela appelle la fonction
JavaScript FindDinnersGivenLocation() que nous allons ajouter à notre fichier
Map.js :

```
function FindDinnersGivenLocation(where) {
   map.Find("", where, null, null, null, null, null, false,
                null, null, callbackUpdateMapDinners);
}
```

La fonction FindDinnersGivenLocation() appelle la fonction map.Find() du
contrôle Virtual Earth pour centrer la carte par rapport à l'emplacement qui a
été saisi. Une fois l'appel au service de carte de Virtual Earth terminé, la
méthode map.Find() invoque la fonction callbackUpdateMapDinners qui correspond
au dernier argument que nous lui avons passé.

C'est dans la méthode callbackUpdateMapDinners() que s'effectue en fait tout
le traitement. Elle emploie la méthode $.post() de jQuery pour réaliser un
appel Ajax vers la méthode d'action SearchByLocation() du contrôleur
SearchController - en lui faisant passer la latitude et la longitude qui
correspond à la carte. Elle défini une fonction inline qui sera appelée au
retour de la méthode $.post() en utilisant la variable "dinners" pour lui faire
passer la liste des dîners renvoyés au format JSON par la méthode d'action
SearchByLocation(). Elle fait ensuite une boucle foreach sur ces dîners afin
d'utiliser la latitude, la longitude et quelques autres informations de chaque
dîner pour placer une nouvelle punaise sur la carte. Ces dîners sont également
insérés dans une liste HTML des dîners qui apparait à droite de la carte. Pour
finir, elle déclare un évènement "hover" pour afficher des informations
complémentaires lorsqu'on passe la souris au-dessus des punaises ou de la liste
HTML :

```
function callbackUpdateMapDinners(layer, resultsArray,
                                      places, hasMore, VEErrorMessage) {
   $("#dinnerList").empty();
   clearMap();
   var center = map.GetCenter();

   $.post(
     "/Search/SearchByLocation",
     {
        latitude: center.Latitude,
        longitude: center.Longitude
     },
      function(dinners) {
         $.each(dinners, function(i, dinner) {

           var LL = new VELatLong(dinner.Latitude,
                                      dinner.Longitude, 0, null);

           var RsvpMessage = "";

           if (dinner.RSVPCount == 1)
               RsvpMessage = "" + dinner.RSVPCount + " RSVP";
           else
                RsvpMessage = "" + dinner.RSVPCount + " RSVPs";

           // Add Pin to Map
           LoadPin(LL, '<a href="/Dinners/Details/' + dinner.DinnerID + '">'
                            + dinner.Title + '</a>',
                           "<p>" + dinner.Description + "</p>" + RsvpMessage);

           //Add a dinner to the <ul> dinnerList on the right
           $('#dinnerList').append($('<li/>')
                              .attr("class", "dinnerItem")
                              .append($('<a/>').attr("href",
                                         "/Dinners/Details/" + dinner.DinnerID)
                               .html(dinner.Title)).append(" ("+RsvpMessage+")"));
        });

        // Adjust zoom to display all the pins we just added.
        if (points.length > 1) {
              map.SetMapView(points);
        }

        // Display the event's pin-bubble on hover.
         $(".dinnerItem").each(function(i, dinner) {
           $(dinner).hover(
                 function() { map.ShowInfoBox(shapes[i]); },
                function() { map.HideInfoBox(shapes[i]); }
           );
         });

     },
     "json");

}
```

Quand nous relançons l'application, la page d'accueil contient désormais une
carte. Et quand nous saisissons le nom d'une ville, cette carte affiche les
dîners prévus dans la région :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image133.png)

Il suffit alors de passer la souris sur l'un deux pour obtenir des
informations supplémentaires :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image138.png)

Nous pouvons cliquer sur le titre du dîner - aussi bien sur la carte que
dans la liste HTML latérale - pour consulter le détail d'un dîner, auquel nous
pouvons éventuellement nous inscrire :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image139.png)

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Réaliser des tests unitaires](/nerddinner/realiser-tests-unitaires/)
