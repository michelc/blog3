---
date: 2009-12-02 10:12:00
layout: page
permalink: nerddinner/formulaires-crud/
redirect_from: "pages/NerdDinner/Formulaires-CRUD"
title: "NerdDinner(fr) : Formulaires CRUD"
---

Nous avons jusqu'ici abordé les contrôleurs et les vues et présenté la façon
de les utiliser pour mettre en place une interface utilisateur de type liste /
détails. Notre prochaine étape ira un cran plus loin en intégrant l'ajout, la
modification et la suppression de dîners à notre classe DinnersController.

## Les URLs prises en compte par DinnersController

Nous avons déjà ajouté à DinnersController les méthodes d'action pour gérer
deux types d'URLs : /Dinners et /Dinners/Details/[id].

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Verbe</th>
      <th>Objectifs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>/Dinners/</td>
      <td>GET</td>
      <td>Affiche une liste HTML des dîners à venir</td>
    </tr>
    <tr>
      <td>/Dinners/Details/[id]</td>
      <td>GET</td>
      <td>Affiche le détail d'un dîner particulier</td>
    </tr>
  </tbody>
</table>

Nous allons maintenant ajouter à DinnersController les méthodes d'action
pour gérer trois types d'URLs supplémentaires : /Dinners/Edit/[id],
/Dinners/Create et /Dinners/Delete/[id]. Ces URLs nous permettront de modifier
un dîner existant, de créer de nouveaux dîners et de supprimer un dîner.

Pour ces nouvelles méthodes, nous supporteront à la fois les méthodes http
GET et http POST. Une requête http GET vers ces URLs renverra une première vue
HTML des données (un formulaire pré-rempli avec les informations du dîner dans
le cas d'un "Edit", un formulaire vide dans le cas d'un "Create" et un écran de
confirmation dans le cas du "Delete"). Les requêtes http POST vers ces URLs se
chargeront de sauvegarder / modifier / supprimer les données du dîner de la
classe DinnerRepository (et de là de la base de données).

<table>
  <thead>
    <tr>
      <th>URL</th>
      <th>Verbe</th>
      <th>Objectifs</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td rowspan="2">/Dinners/Edit/[id]</td>
      <td>GET</td>
      <td>Affiche un formulaire pour modifier les informations d'un dîner
      particulier</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>Enregistre dans la base de données les modifications apportées
      à un dîner</td>
    </tr>
    <tr>
      <td rowspan="2">/Dinners/Edit/[id]</td>
      <td>GET</td>
      <td>Affiche un formulaire vide pour saisir un nouveau dîner</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>Crée un nouveau dîner puis l'enregistre dans la base de
      données</td>
    </tr>
    <tr>
      <td rowspan="2">/Dinners/Edit/[id]</td>
      <td>GET</td>
      <td>Affiche un écran pour que l'utilisateur confirme qu'il veut
      supprimer le dîner sélectionné</td>
    </tr>
    <tr>
      <td>POST</td>
      <td>Supprime le dîner spécifié de la base de données</td>
    </tr>
  </tbody>
</table>

Commençons donc par nous intéresser au scénario "Edit".

## Mettre en œuvre l'action Edit en mode GET

Nous allons commencer par programmer la fonctionnalité http GET de la
méthode d'action Edit. Cette méthode sera exécutée quand l'URL
"/Dinners/Edit/[id]" sera demandée :

```
//
// GET: /Dinners/Edit/2
public ActionResult Edit(int id) {
   Dinner dinner = dinnerRepository.GetDinner(id);
   return View(dinner);
}
```

Le code ci-dessus utilise l'objet dinnerRepository pour retrouver un objet
Dinner. Nous utilisons la méthode View() sans lui donner explicitement le nom
de la vue à employer. Elle s'appuie donc sur les conventions de nommage pour
déterminer l'emplacement et le nom de la vue à envoyer :
/Views/Dinners/Edit.aspx.

Nous allons maintenant créer cette vue en faisant un clic-droit à
l'intérieur de l'action Edit() puis en sélectionnant la commande "Add View"
dans le menu contextuel qui apparait :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image078.png)

Nous obtenons alors la boite de dialogue "Add View" dans laquelle nous
pouvons indiquer que nous souhaitons créer une vue fortement typée basée sur un
objet Dinner et construite à partir du modèle "Edit".

![](http://nerddinnerbook.s3.amazonaws.com/Images/image079.png)

Quand on clique sur le bouton "Add", Visual Studio ajoute un nouveau fichier
"Edit.aspx" dans le répertoire "\Views\Dinners". Celui-ci est automatiquement
chargé dans l'éditeur de code avec un code source auto-généré pour implémenter
le formulaire de mise à jour.

![](http://nerddinnerbook.s3.amazonaws.com/Images/image080.png)

Nous allons apporter quelques modifications au code généré par défaut pour
en faire disparaitre quelques propriétés que nous ne voulons pas voir
apparaitre dans le formulaire. La vue contient désormais  le code
suivant :

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   Edit: <%=Html.Encode(Model.Title) %>
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">

   <h2>Edit Dinner</h2>

   <%= Html.ValidationSummary("Please correct the errors and try again.") %>

   <% using (Html.BeginForm()) { %>

     <fieldset>
        <p>
           <label for="Title">Dinner Title:</label>
           <%= Html.TextBox("Title") %>
           <%= Html.ValidationMessage("Title", "*") %>
        </p>
        <p>
           <label for="EventDate">Event Date:</label>
           <%= Html.TextBox("EventDate", String.Format("{0:g}",
                                                      Model.EventDate)) %>
           <%= Html.ValidationMessage("EventDate", "*") %>
        </p>
        <p>
           <label for="Description">Description:</label>
           <%= Html.TextArea("Description") %>
           <%= Html.ValidationMessage("Description", "*")%>
        </p>
        <p>
           <label for="Address">Address:</label>
           <%= Html.TextBox("Address") %>
           <%= Html.ValidationMessage("Address", "*") %>
        </p>
        <p>
           <label for="Country">Country:</label>
           <%= Html.TextBox("Country") %>
           <%= Html.ValidationMessage("Country", "*") %>
        </p>
        <p>
           <label for="ContactPhone">Contact Phone #:</label>
           <%= Html.TextBox("ContactPhone") %>
           <%= Html.ValidationMessage("ContactPhone", "*") %>
        </p>
        <p>
           <label for="Latitude">Latitude:</label>
           <%= Html.TextBox("Latitude") %>
           <%= Html.ValidationMessage("Latitude", "*") %>
        </p>
        <p>
           <label for="Longitude">Longitude:</label>
           <%= Html.TextBox("Longitude") %>
           <%= Html.ValidationMessage("Longitude", "*") %>
        </p>
        <p>
           <input type="submit" value="Save" />
        </p>
     </fieldset>
   <% } %>
</asp:Content>
```

Quand on lance l'application et que l'on demande l'URL "/Dinners/Edit/1",
nous obtenons l'écran suivant :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image081.png)

Les balises HTML générées correspondent au code visible ci-dessous. Il
s'agit de HTML tout à fait standard - avec une balise &lt;form&gt; qui effectue
un POST vers l'URL "/Dinners/Edit/1" quand le bouton "Save" &lt;input
type="submit" /&gt; est cliqué. Et pour chaque propriété modifiable, une balise
HTML &lt;input type="text" /&gt; a été générée :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image082.png)

## Les helpers Html.BeginForm() et Html.TextBox()

Notre vue "Edit.aspx" utilise plusieurs méthodes "Html.Helper" :
Html.ValidationSummary(), Html.BeginForm(), Html.TextBox(), et
Html.ValidationMessage(). En plus de générer le balisage HTML pour nous, ces
méthodes helper assurent automatiquement la gestion des erreurs et la
validation des données.

### Le helper Html.BeginForm()

La méthode Html.BeginForm() sert à générer la balise HTML &lt;form&gt;. Vous
remarquerez que dans notre vue Edit.aspx, nous utilisons la commande C# "using"
quand nous employons ce helper. L'accolade ouvrante marque le début du contenu
de notre &lt;form&gt; et l'accolade fermante signale la fin du formulaire par
un &lt;/form&gt; :

```
<% using (Html.BeginForm()) { %>
   <fieldset>
     <!-- Fields Omitted for Brevity -->
     <p>
        <input type="submit" value="Save" />
     </p>
   </fieldset>
<% } %>
```

Toutefois, si vous trouvez l'approche "using" pas très naturelle pour ce
genre de besoin, vous pouvez combiner Html.BeginForm() et Html.EndForm(), ce
qui revient exactement au même :

```
<% Html.BeginForm(); %>
   <fieldset>
     <!-- Fields Omitted for Brevity -->
     <p>
        <input type="submit" value="Save" />
     </p>
   </fieldset>
<% Html.EndForm(); %>
```

Utiliser Html.BeginForm() sans paramètre fait qu'il génère une balise
&lt;form&gt; qui fait un POST vers l'URL de la page en cours. C'est pour cela
que notre vue Edit.aspx produit un élément &lt;form action="/Dinners/Edit/1"
method="post"&gt;. Si nous voulons poster vers une autre URL, il est cependant
possible de passer explicitement les paramètres nécessaires à
Html.BeginForm().

### Le helper Html.TextBox()

La vue Edit.aspx utilise la méthode helper Html.TextBox() pour générer les
balises &lt;input type="text"/&gt; :

```
<%= Html.TextBox("Title") %>
```

La méthode Html.TextBox() ci-dessus prend un seul paramètre qui lui sert à
la fois pour définir les attributs id et name de la balise &lt;input
type="text" /&gt; et pour savoir avec quelle propriété de l'objet modèle
pré-remplir la zone de saisie textbox. Dans notre exemple, l'objet Dinner que
nous avons passé à la vue Edit a une propriété "Title" qui contient la valeur
".NET Futures" et par conséquent, la méthode Html.TextBox("Title") génère le
HTML suivant : &lt;input id="Title" name="Title" type="text" value=".NET
Futures" /&gt;.

Une autre façon de faire est d'utiliser le premier paramètre de
Html.TextBox() pour initialiser les attributs id et name de la balise et un
second paramètre pour définir explicitement la valeur à utiliser :

```
<%= Html.TextBox("Title", Model.Title) %>
```

Nous avons souvent besoin d'appliquer un formatage spécial à la valeur qui
est affichée. La méthode statique String.Format() du framework .NET est très
pratique dans ce genre de scénario. Nous pouvons l'utiliser dans notre vue pour
formater la valeur EventDate (qui est de type DateTime) afin de ne pas faire
apparaitre les secondes :

```
<%= Html.TextBox("EventDate", String.Format("{0:g}", Model.EventDate)) %>
```

On peut aussi renseigner un troisième paramètre pour renvoyer des attributs
HTML supplémentaires. Le bout de code ci-dessous montre comment ajouter des
attributs size="30" et class="mycssclass" à la balise &lt;input type="text"
/&gt;. Etant donné que "class" est un mot clé du C#, on utilise le caractère
"@" devant comme séquence d'échappement pour pouvoir l'utiliser comme nom
d'attribut :

```
<%= Html.TextBox("Title", Model.Title, new { size=30, @class="myclass" } )%>
```

## Implémenter le mode POST de l'action Edit

Nous avons pour l'instant réalisé la version http GET de notre action
Edit(). Quand un utilisateur demande l'URL "/Dinners/Edit/1", il obtient une
page HTML qui se présente comme celle-ci :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image081.png)

Le fait de cliquer sur le bouton "Save" a pour effet de publier le
formulaire vers l'URL "/Dinners/Edit/1" et de lui envoyer les valeurs des
&lt;input&gt; via la méthode http POST. Nous allons maintenant programmer la
fonctionnalité POST de notre méthode d'action Edit() afin de gérer
l'enregistrement du dîner.

Pour cela, nous ajoutons une méthode "Edit" surchargée à notre classe
DinnersController en lui associant un attribut "AcceptVerbs" pour indiquer
qu'elle est chargée de répondre aux requêtes de type POST :

```
//
// POST: /Dinners/Edit/2
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(int id, FormCollection formValues) {
   ...
}
```

Lorsque l'attribut [AcceptVerbs] est appliqué sur des méthodes actions
surchargées, ASP.NET MVC gère automatiquement la répartition des requêtes vers
l'action appropriée en fonction du type de requête HTTP. Les requêtes de type
HTTP POST vers /Dinners/Edit/[id] iront vers la méthode Edit ci-dessus alors
que tous les autres types de requêtes vers l'URL /Dinners/Edit/[id] seront
dirigées vers la première méthode Edit mise en place (celle qui n'a pas
d'attribut [AcceptVerbs]).

### Remarque : Pourquoi se baser sur le type HTTP ?

Pourquoi utiliser la même URL dans les deux cas et dépendre du type HTTP
pour savoir quelle action effectuer ? Est-ce qu'il ne serait pas plus pratique
d'avoir deux URLs différentes pour ? Par exemple, on pourrait utiliser
/Dinners/Edit/[id] pour afficher le formulaire initial et /Dinners/Save/[id]
pour gérer l'enregistrement des données saisies via le formulaire.

L'inconvénient d'avoir deux URLs distinctes apparait quand on poste vers
/Dinners/Save/[id] et qu'il est nécessaire de réafficher le formulaire HTML
parce qu'il y a des erreurs de saisie. L'utilisateur final se retrouve alors
avec l'URL /Dinners/Save/[id] dans la barre d'adresse de son navigateur
(puisque c'est vers cette URL que le formulaire a été posté). Si jamais il met
ce formulaire dans ses favoris, ou qu'il envoie cette URL à quelqu'un, il se
retrouve alors avec une URL qui ne fonctionnera pas à l'avenir, étant donné
qu'elle attend des données en provenance du formulaire pour fonctionner.

Alors qu'en proposant une URL unique (telle que /Dinners/Edit/[id]) et en
déterminant  son traitement en fonction du type HTTP, cela ne pose pas de
problème si cette URL est ajoutée aux favoris ou communiquée à d'autres
utilisateurs.

### Récupérer les valeurs du formulaire

Il existe de nombreuses façons de faire pour que l'action "Edit" en mode
POST accède aux données envoyées via le formulaire. La méthode la plus simple
est d'utiliser la propriété Request de la classe Controller pour accéder à la
collection formulaire et obtenir directement les valeurs transmises :

```
//
// POST: /Dinners/Edit/2

[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(int id, FormCollection formValues) {

   // Retrieve existing dinner
   Dinner dinner = dinnerRepository.GetDinner(id);

   // Update dinner with form posted values
   dinner.Title = Request.Form["Title"];
   dinner.Description = Request.Form["Description"];
   dinner.EventDate = DateTime.Parse(Request.Form["EventDate"]);
   dinner.Address = Request.Form["Address"];
   dinner.Country = Request.Form["Country"];
   dinner.ContactPhone = Request.Form["ContactPhone"];
   dinnerRepository.Save();

   // Perform HTTP redirect to details page for the saved Dinner
   return RedirectToAction("Details", new { id = dinner.DinnerID });
}
```

Cette approche est malgré tout un peu lourde, surtout que nous devons encore
lui ajouter le code nécessaire pour la gestion des erreurs.

Pour ce genre de besoin, il est préférable de s'en remettre à la méthode
helper UpdateModel() de la classe Controller. Celle-ci se charge de la mise à
jour des propriétés de l'objet que nous lui passons en utilisant les données
transmises par le formulaire. Grâce à la réflexion, elle obtient le nom des
différentes propriétés de l'objet et leur assigne les valeurs du formulaire en
effectuant les conversions nécessaires.

Le code ci-dessous montre l'emploi de UpdateModel() dans l'action Edit en
mode POST :

```
//
// POST: /Dinners/Edit/2

[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(int id, FormCollection formValues) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   UpdateModel(dinner);

   dinnerRepository.Save();

   return RedirectToAction("Details", new { id = dinner.DinnerID });
}
```

Ceci fait, nous pouvons alors accéder à l'URL /Dinners/Edit/1 et changer le
titre du dîner :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image083.png)

Quand nous cliquons sur le bouton "Save", cela publie le formulaire vers
notre action Edit et les valeurs mises à jour sont enregistrées dans la base de
données. Puis nous sommes redirigé vers l'URL de l'action Details correspondant
au dîner que nous venons de modifier afin de le réafficher avec ses nouvelles
informations :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image084.png)

## Gestion des erreurs de saisie

La façon dont nous avons géré le POST est tout à fait satisfaisante, sauf en
cas d'erreur.

Si un utilisateur commet une erreur en saisissant le formulaire, il faut
pouvoir réafficher le formulaire avec un message d'erreur qui lui explique
comment corriger sa saisie. Cela concerne aussi bien le cas où l'utilisateur
entre une valeur incorrecte (par exemple une date mal saisie) que le cas où le
format de saisie est correct mais ne respecte pas les règles de validation
métier. Si des erreurs se produisent, le formulaire doit conserver les données
déjà saisies par l'utilisateur afin qu'il n'ait pas à ressaisir leurs données à
la main. Et il faut répéter tout cela tant que le formulaire n'a pas été rempli
correctement.

ASP.NET MVC fournit un ensemble de fonctionnalités qui facilitent la gestion
des erreurs et le réaffichage du formulaire. Pour avoir un exemple concret de
celles-ci, nous allons modifier le code de notre action Edit de la façon
suivante :

```
//
// POST: /Dinners/Edit/2

[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(int id, FormCollection formValues) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   try {

     UpdateModel(dinner);

     dinnerRepository.Save();

     return RedirectToAction("Details", new { id=dinner.DinnerID });
   }
   catch {

     foreach (var issue in dinner.GetRuleViolations()) {
        ModelState.AddModelError(issue.PropertyName, issue.ErrorMessage);
     }

     return View(dinner);
   }
}
```

Le code ci-dessus est similaire au code que nous avions auparavant - sauf
que celui-ci est désormais entouré d'un try / catch pour gérer les erreurs. Si
une exception se produit lors de l'appel de UpdateModel() ou lors de la
sauvegarde du DinnerRepository (qui déclenchera une exception si l'objet Dinner
que nous essayons d'enregistrer ne respecte pas les règles de validation), la
partie catch du bloc de gestion d'erreurs va s'exécuter. Celle-ci boucle sur la
liste des violations aux règles de validation de l'objet Dinner et les ajoute à
l'objet ModelState (nous en reparlerons) avant de réafficher la vue.

Pour tester ça, nous relançons l'application et modifions un dîner en
effaçant son titre, en saisissant "BOGUS" comme EventDate et un numéro de
téléphone anglais après avoir défini le pays à USA. Quand nous cliquons sur le
bouton "Save", la partie POST de méthode Edit ne sera pas en mesure de
sauvegarder le dîner (à cause de toutes nos erreurs) et réaffichera le
formulaire suivant :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image085.png)

Notre application dispose désormais d'une gestion d'erreur tout à fait
correcte. Les zones de texte avec des données incorrectes sont surlignées en
rouge, et les messages d'erreur correspondant apparaissent à l'écran. Par
ailleurs, le formulaire a conservé les données saisies par l'utilisateur, lui
évitant d'avoir à tout devoir ressaisir.

Vous vous demandez peut-être comment tout cela se produit ? Par quel miracle
les zones Title, EventDate et ContactPhone virent au rouge tout en ayant la
bonne idée de réafficher ce qu'on y avait entré ? Et comment diable est-ce que
les messages d'erreurs se sont retrouvés listées en haut de l'écran ? La bonne
nouvelle, c'est qu'il n'y a rien de sorcier là-dessous. Tout cela vient
simplement du fait que nous avons utilisé certaines des fonctions d'ASP.NET MVC
prévues pour faciliter la validation des données et la gestion des erreurs.

## Présentation du ModelState et des helpers de validation

Les classes Controller disposent d'une collection "ModelState" qui sert à
indiquer que le modèle d'objet passé à la vue contient des erreurs. Chaque
élément de cette collection identifie la propriété de l'objet qui pose problème
(par exemple "Title", "EventDate" ou "ContactPhone") et donne la possibilité de
fournir un message d'erreur convivial ("Title is required" par exemple).

La méthode helper UpdateModel() remplit automatiquement cette collection
ModelState quand elle rencontre des erreurs en essayant d'affecter des
informations du formulaire aux propriétés de l'objet. Par exemple, la propriété
EventDate de notre objet Dinner est de type DateTime. Dans notre cas, lorsque
la méthode UpdateModel() ne réussi pas à remplir cette propriété avec la valeur
"BOGUS", elle ajoute un élément à la collection ModelState pour indiquer qu'une
erreur d'affectation a eu lieu avec la propriété EventDate.

Les développeurs ont aussi la possibilité d'écrire du code pour ajouter
explicitement des éléments à la collection ModelState, comme nous l'avons fait
dans le code de notre action Edit pour lui ajouter les erreurs liées aux règles
de validation de l'objet Dinner.

```
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(int id, FormCollection formValues) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   try {
     UpdateModel(dinner);
     dinnerRepository.Save();
     return RedirectToAction("Details", new { id=dinner.DinnerID });
   }
   catch {
     foreach (var issue in dinner.GetRuleViolations()) {
        ModelState.AddModelError(issue.PropertyName, issue.ErrorMessage);
     }
     return View(dinner);
   }
}
```

### Prise en compte du ModelState par les helpers HTML

Les helpers HTML - tels que Html.TextBox() - inspectent la collection
ModelState quand ils génèrent leur rendu html. S'il existe une erreur pour
l'élément traité, ils renvoient la valeur saisie par l'utilisateur en lui
ajoutant une classe CSS spéciale pour mettre en évidence l'erreur.

Par exemple, dans notre vue "Edit", nous utilisons le helper Html.TextBox()
pour afficher la propriété EventDate de notre objet Dinner :

```
<%= Html.TextBox("EventDate", String.Format("{0:g}", Model.EventDate)) %>
```

Lorsque la vue est renvoyée suite à une erreur, le helper Html.TextBox()
contrôle dans la collection ModelState s'il existe des erreurs pour la
propriété "EventDate" de l'objet Dinner. Etant donné qu'il y a eu une erreur,
il renvoie la saisie de l'utilisateur ("BOGUS") comme valeur de la balise
&lt;input type="textbox" /&gt; et lui ajoute une classe CSS pour indiquer
l'erreur :

```
<input class="input-validation-error" id="EventDate" name="EventDate"
type="text" value="BOGUS" />
```

Vous pouvez personnaliser l'apparence de la classe d'erreur CSS à votre
guise. La présentation par défaut de la classe "input-validation-error" sont
définis dans la feuille de style \content\site.css avec les styles
suivants :

```
.input-validation-error
{
   border: 1px solid #ff0000;
   background-color: #ffeeee;
}
```

C'est grâce à cette règle CSS que les saisies incorrectes sont mises en
évidence de la façon suivante :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image086.png)

### Le helper Html.ValidationMessage()

Le helper Html.ValidationMessage() peut s'utiliser pour afficher le message
d'erreur du ModelState correspondant à une propriété donnée :

```
<%= Html.ValidationMessage("EventDate") %>
```

Le code ci-dessus génère le html suivant :

```
<span class="field-validation-error">The value 'BOGUS' is invalid</span>
```

Le helper Html.ValidationMessage() accepte aussi un second paramètre qui
permet de modifier le message d'erreur à afficher :

```
<%= Html.ValidationMessage("EventDate", "*") %>
```

L'exemple ci-dessus génère &lt;span
class="field-validation-error"&gt;*&lt;/span&gt; au lieu du message d'erreur
par défaut lorsque une erreur existe au niveau de la propriété EventDate.

### Le helper Html.ValidationSummary()

Le helper Html.ValidationSummary() s'utilise pour afficher un message
d'erreur récapitulatif, accompagné par une liste &lt;ul&gt; &lt;li/&gt;
&lt;/ul&gt; reprenant tous les messages d'erreurs présents dans la collection
ModelState :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image087.png)

Le helper Html.ValidationSummary() accepte un paramètre optionnel de type
chaîne qui permet de définir le message d'erreur à faire figurer au-dessus de
la liste détaillée des erreurs :

```
<%= Html.ValidationSummary("Please correct the errors and try again.") %>
```

Il est possible de personnaliser la présentation de la liste des erreurs
grâce aux CSS.

## Utiliser un helper AddRuleViolation

Le bloc catch de la première version de notre action Edit en mode HTTP POST
utilisait une boucle  foreach sur la liste des violations des règles de
validation de l'objet Dinner pour les ajouter à la collection ModelState du
contrôleur :

```
catch {
   foreach (var issue in dinner.GetRuleViolations()) {
     ModelState.AddModelError(issue.PropertyName, issue.ErrorMessage);
   }

   return View(dinner);
}
```

Nous pouvons rendre ce code un peu plus propre en ajoutant une classe
"ControllerHelpers" au projet NerdDinner dans laquelle nous créerons une
méthode d'extension "AddRuleViolation" qui nous permettra d'ajouter une méthode
helper à la classe ModelStateDictionary de ASP.NET MVC. Cette méthode
d'extension encapsulera la logique nécessaire pour remplir le
ModelStateDictionary avec la liste des erreurs RuleViolation :

```
public static class ControllerHelpers {

   public static void AddRuleViolations(this ModelStateDictionary modelState,
                                           IEnumerable<RuleViolation> errors) {

      foreach (RuleViolation issue in errors) {
        modelState.AddModelError(issue.PropertyName, issue.ErrorMessage);
     }
   }
}
```

Nous pouvons ensuite mettre à jour notre action HTTP POST Edit pour utiliser
cette méthode d'extension afin d'alimenter la collection ModelState.

## Le code complet pour l'action Edit

Voici tout le code nécessaire pour réaliser la partie contrôleur de la mise
à jour des dîners :

```
//
// GET: /Dinners/Edit/2
public ActionResult Edit(int id) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   return View(dinner);
}

//
// POST: /Dinners/Edit/2
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(int id, FormCollection formValues) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   try {
     UpdateModel(dinner);

     dinnerRepository.Save();

     return RedirectToAction("Details", new { id=dinner.DinnerID });
   }
   catch {
     ModelState.AddRuleViolations(dinner.GetRuleViolations());

     return View(dinner);
   }
}
```

Le plus beau dans cette façon de faire, c'est que ni le contrôleur, ni la
vue n'ont à connaitre quoi que ce soit des règles de validation et des règles
métiers définies par l'objet Dinner. Si à l'avenir on ajoute d'autres règles à
notre modèle il n'y aura aucune modification à faire au niveau du contrôleur ou
de la vue pour qu'elles soient prises en compte. Cela procure une très grande
souplesse pour faire évoluer facilement notre application avec un minimum de
modifications dans le code.

## Implémenter l'action HTTP GET Create

Nous avons terminé la réalisation de la fonctionnalité "Edit" de notre
classe DinnersController. Passons maintenant à la gestion du "Create" qui
permettra à nos utilisateurs d'ajouter de nouveaux dîners.

Nous allons commencer par implémenter le côté HTTP GET de notre méthode
d'action Create. Cette méthode sera appelée quand quelqu'un visitera l'URL
"/Dinners/Create". Pour cela, nous écrivons le code suivant :

```
//
// GET: /Dinners/Create
public ActionResult Create() {

   Dinner dinner = new Dinner() {
     EventDate = DateTime.Now.AddDays(7)
   };

   return View(dinner);
}
```

Le code ci-dessus crée un nouvel objet Dinner et initialise sa propriété
EventDate à J + 7. Il renvoie ensuite une vue basée sur ce nouvel objet Dinner.
Etant donné que nous n'avons pas explicitement passé de nom à la méthode
View(), celle-ci va se baser sur les conventions de nommage pour retrouver
l'emplacement et le nom de la vue à utiliser : /Views/Dinners/Create.aspx.

Il nous faut alors créer cette vue. Pour cela, nous sélectionnons la
commande "Add View" dans le menu contextuel qui apparait après avoir fait un
clic-droit dans le source de la méthode Create. Dans la boite de dialogue "Add
View" nous indiquons que l'on va passer un objet Dinner à la vue et nous
choisissons de générer automatiquement une vue de type Create :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image088.png)

Quand nous cliquons sur le bouton "Add", Visual Studio enregistre une
nouvelle vue "Create.aspx" auto-générée dans le répertoire "\Views\Dinners" et
l'ouvre dans l'éditeur de code :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image089.png)

Nous allons apporter quelques changements au code qui a été généré et le
modifier pour qu'il ressemble au source suivant :

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   Host a Dinner
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">

   <h2>Host a Dinner</h2>

   <%= Html.ValidationSummary("Please correct the errors and try again.") %>

   <% using (Html.BeginForm()) { %>

     <fieldset>
        <p>
           <label for="Title">Title:</label>
           <%= Html.TextBox("Title") %>
           <%= Html.ValidationMessage("Title", "*") %>
        </p>
        <p>
           <label for="EventDate">Event Date:</label>
           <%= Html.TextBox("EventDate") %>
           <%= Html.ValidationMessage("EventDate", "*") %>
        </p>
        <p>
           <label for="Description">Description:</label>
           <%= Html.TextArea("Description") %>
           <%= Html.ValidationMessage("Description", "*") %>
        </p>
        <p>
           <label for="Address">Address:</label>
           <%= Html.TextBox("Address") %>
           <%= Html.ValidationMessage("Address", "*") %>
        </p>
        <p>
           <label for="Country">Country:</label>
           <%= Html.TextBox("Country") %>
           <%= Html.ValidationMessage("Country", "*") %>
        </p>
        <p>
           <label for="ContactPhone">ContactPhone:</label>
           <%= Html.TextBox("ContactPhone") %>
           <%= Html.ValidationMessage("ContactPhone", "*") %>
        </p>
        <p>
           <label for="Latitude">Latitude:</label>
           <%= Html.TextBox("Latitude") %>
           <%= Html.ValidationMessage("Latitude", "*") %>
        </p>
        <p>
           <label for="Longitude">Longitude:</label>
           <%= Html.TextBox("Longitude") %>
           <%= Html.ValidationMessage("Longitude", "*") %>
        </p>
        <p>
           <input type="submit" value="Save" />
        </p>
     </fieldset>

   <% } %>

</asp:Content>
```

Et maintenant, quand nous lançons l'application et accédons à l'URL
"/Dinners/Create" dans le navigateur, cette implémentation de l'action Create
nous renvoie l'écran ci-dessous :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image090.png)

## Implémenter l'action HTTP POST Create

Nous venons de réaliser le côté HTTP GET de la méthode d'action Create.
Quand un utilisateur clique sur le bouton "Save" cela publie le formulaire vers
l'URL /Dinners/Create et envoie le contenu des balises &lt;input&gt; du
formulaire en utilisant l'opération HTTP POST.

Il nous faut donc implémenter le côté HTTP POST de notre méthode d'action
Create. Nous commencerons par ajouter une méthode "Create" surchargée dans le
contrôleur DinnersController en la faisant précéder d'un attribut "AcceptVerbs"
pour indiquer qu'elle traite les demandes POST :

```
//
// POST: /Dinners/Create
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Create() {
   ...
}
```

Nous avons plusieurs alternatives pour accéder aux éléments du formulaire
transmis par POST à notre action "Create".

Une première approche est de créer un nouvel objet Dinner puis d'utiliser le
helper UpdateModel() pour l'initialiser avec les données publiés par le
formulaire (comme nous l'avons fait pour l'action Edit). Il suffit ensuite de
l'ajouter à notre DinnerRepository, de l'enregistrer dans la base de données
puis de rediriger l'utilisateur vers notre action Details pour lui présenter le
dîner qu'il vient de créer :

```
//
// POST: /Dinners/Create
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Create() {

   Dinner dinner = new Dinner();

   try {
     UpdateModel(dinner);

     dinnerRepository.Add(dinner);
     dinnerRepository.Save();

     return RedirectToAction("Details", new {id=dinner.DinnerID});
   }
   catch {
     ModelState.AddRuleViolations(dinner.GetRuleViolations());

     return View(dinner);
   }
}
```

Ou alors, nous pouvons suivre une autre approche dans laquelle notre action
Create() utilise un objet Dinner comme paramètre. Dans ce cas, ASP.NET MVC
instancie automatiquement un objet Dinner pour nous, initialise ses propriétés
en utilisant les données du formulaire puis le fait passer à notre méthode
d'action :

```
//
// POST: /Dinners/Create
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Create(Dinner dinner) {

   if (ModelState.IsValid) {

     try {
        dinner.HostedBy = "SomeUser";

        dinnerRepository.Add(dinner);
        dinnerRepository.Save();

        return RedirectToAction("Details", new {id = dinner.DinnerID });
     }
     catch {
        ModelState.AddRuleViolations(dinner.GetRuleViolations());
     }
   }

   return View(dinner);
}
```

La méthode action présenté ci-dessus vérifie que l'objet Dinner a été
correctement initialisé à partir des valeurs du formulaire en testant la
propriété ModelState.IsValid. Celle-ci renvoie false s'il y a eu des problèmes
de conversion (par exemple une chaîne "BOGUS" pour la propriété EventDate) et
si c'est le cas, notre méthode d'action réaffiche le formulaire.

Si les valeurs saisies sont correctes, la méthode d'action essaie d'ajouter
le nouveau dîner au DinnerRepository puis de l'enregistrer. Ce traitement est
inséré à l'intérieur d'un bloc try/catch puis réaffiche le formulaire s'il n'y
a pas de violation des métiers (dans ce cas la méthode dinnerRepository.Save()
renverrait une exception).

Pour voir ce traitement d'erreur à l'œuvre, nous pouvons appeler l'URL
/Dinners/Create et saisir les informations pour un nouveau dîner. En cas de
saisie ou de valeurs incorrectes, le formulaire de création sera réaffiché et
présentera les erreurs commises :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image091.png)

Vous pouvez remarquer que notre formulaire de création respecte les mêmes
règles de validation métier que le formulaire de modification. C'est parce que
nos règles de validation et nos règles métiers ont été définies dans le modèle
et pas dans la vue ou dans le contrôleur. Cela signifie que plus tard nous
n'aurons qu'un endroit où modifier ou faire évoluer celles -ci et elles
s'appliqueront dans toute l'application. Il n'y aura absolument aucun code à
changer dans des actions Edit ou Create pour automatiquement tenir compte des
nouvelles règles ou des modifications apportées à celle-ci.

Si nous corrigeons notre saisie puis que nous cliquons sur le bouton "Save",
notre ajout au DinnerRepository va réussir et un nouveau dîner sera ajouté à la
base de données. Nous sommes alors redirigé vers l'URL /Dinners/Details/[id]
qui nous présente le détail du dîner que nous venons de créer :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image092.png)

## Implémenter l'action HTTP GET Delete

Ajoutons maintenant la prose en compte du Delete par notre classe
DinnersController.

Nous commençons par ajouter le traitement du HTTP GET de notre méthode
d'action Delete. Cette méthode est appelée quand quelqu'un arrive sur l'URL
"/Dinners/Delete/[id]" et correspond au code source suivant :

```
//
// HTTP GET: /Dinners/Delete/1
public ActionResult Delete(int id) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   if (dinner == null)
     return View("NotFound");
   else
     return View(dinner);
}
```

Cette méthode essaie d'abord de retrouver le dîner à supprimer. Si celui -ci
existe, elle renvoie une vue basée sur cet objet Dinner. Si le dîner n'existe
pas (ou qu'il a déjà été supprimés), elle renvoie la vue "NotFound" que nous
avons créé auparavant pour notre action "Details".

Nous pouvons créer la vue "Delete" en faisant un clic droit dans le corps de
l'action "Delete" et en sélectionnant la commande "Add View" dans le menu
contextuel qui apparaît. Ensuite, dans la boîte de dialogue "Add View" nous
indiquons que nous passons un objet Dinner à notre vue et choisissons de
générer une vue vide :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image093.png)

Quand nous cliquons sur le bouton "Add", Visual Studio ajoute nouveau
fichier "Delete.aspx" dans le répertoire "Views/Dinners". Nous devons alors
ajouter un peu de HTML et de code pour réaliser l'écran de confirmation
suivant :

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   <title>Delete Confirmation: <%=Html.Encode(Model.Title) %></title>
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">

   <h2>
     Delete Confirmation
   </h2>

   <div>
     <p>Please confirm you want to cancel the dinner titled :
     <i> <%=Html.Encode(Model.Title) %>? </i> </p>
   </div>

   <% using (Html.BeginForm()) { %>
     <input name="confirmButton" type="submit" value="Delete" />
   <% } %>

</asp:Content>
```

Le code ci-dessus affiche le titre du dîner à supprimer et génère une balise
&lt;form&gt; qui effectue un POST vers l'URL "/Dinners/Delete/[id]" lorsque
l'utilisateur clique sur le bouton "Delete" qu'il contient.

Quand nous lançons l'application et appelant une URL "/Dinners/Delete/[id]"
correspondant à un objet Dinner existant, l'écran ci-dessous nous est
renvoyé :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image094.png)

## Remarque : Pourquoi faire un POST ?

Vous devez vous demander pourquoi se compliquer la vie et passer par un
formulaire dans notre écran de confirmation ? Pourquoi ne pas utiliser un simple
lien HTML vers notre méthode d'action pour réaliser la suppression ?

C'est parce que nous voulons être prudent et nous protéger des robots et des
moteurs de recherche qui peuvent découvrir nos URLs et provoquer des
suppressions en suivant les liens. Ceux-ci considèrent que les URLs basées sur
des opérations HTTP GET sont "sûres" et qu'ils peuvent les parcourir alors
qu'ils ne sont pas supposés suivre les URLs de type HTTP POST.

Une bonne habitude est de faire attention à toujours placer les traitements
de suppression ou de modification derrière des requêtes HTTP POST.

## Implémenter l'action HTTP POST Delete

Nous avons pour l'instant développé la partie HTTP GET de notre méthode
d'action Delete qui nous permet d'afficher un écran de confirmation. Lorsque un
utilisateur clique sur le bouton "Delete", cela publie le formulaire vers l'URL
/Dinners/Delete/[id].

Nous allons maintenant implémenter le côté HTTP POST de l'action Delete à
l'aide du code suivant :

```
//
// HTTP POST: /Dinners/Delete/1
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Delete(int id, string confirmButton) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   if (dinner == null)
     return View("NotFound");

   dinnerRepository.Delete(dinner);
   dinnerRepository.Save();

   return View("Deleted");
}
```

La partie HTTP POST de notre méthode d'action Delete essaie de retrouver
l'objet Dinner à supprimer. Quand elle  ne le trouve pas (parce qu'il a
déjà été supprimé), il renvoie notre vue "NotFound". Dans le cas où elle le
trouve, elle le supprime du DinnerRepository puis renvoie la vue "Deleted".

Pour ajouter  la vue "Deleted", nous faisons un clic droit dans notre
méthode d'action puis nous choisissons la commande "Add View". Nous appelons
notre vue "Deleted" et choisissons de ne pas créer une vue fortement typée. Une
fois générée, nous lui ajoutons le code HTML suivant :

```
<asp:Content ID="Title" ContentPlaceHolderID="TitleContent" runat="server">
   Dinner Deleted
</asp:Content>

<asp:Content ID="Main" ContentPlaceHolderID="MainContent" runat="server">

   <h2>Dinner Deleted</h2>

   <div>
     <p>Your dinner was successfully deleted.</p>
   </div>
   <div>
     <p><a href="/dinners">Click for Upcoming Dinners</a></p>
   </div>
</asp:Content>
```

Et maintenant, quand nous lançons l'application et que nous allons sur une
URL "/Dinners/Delete/[id]" correspondant à un dîner existant, l'écran pour
confirmer la suppression apparait :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image095.png)

Quand nous cliquons sur le bouton "Delete", une requête HTTP POST est faite
vers l'URL "/Dinners/Delete/[id]" qui supprime le dîner dans la base de données
puis affiche notre vue "Deleted" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image096.png)

## Sécuriser le binding formulaire / objet

Nous avons vu deux façons pour lier les saisies des formulaires aux objets.
La première consiste à employer UpdateModel () pour mettre à jour les
propriétés d'un objet existant, et la seconde à se servir de la possibilité
qu'offre ASP.NET MVC de passer des objets du modèle en tant que paramètres aux
méthodes d'action. Ces techniques sont toutes les deux très puissantes et
extrêmement pratiques.

Cette puissance implique plus de responsabilités. Une bonne dose de paranoïa
est indispensable quand on traite des informations saisies par les
utilisateurs. C'est aussi vrai pour tout ce qui touche à l'initialisation
automatique des objets à partir des champs d'un formulaire. Il faut toujours
encoder les valeurs entrées par l'utilisateur pour éviter les attaques par
injection HTML ou JavaScript, et toujours se méfier des attaques par injection
SQL (notre application utilise LINQ to SQL qui encode automatiquement les
paramètres pour prévenir ce type d'attaque). Vous ne devez jamais compter
uniquement sur la validation côté client mais toujours la compléter par une
validation côté serveur pour vous protéger  des pirates qui pourraient
essayer de vous envoyer de fausses valeurs.

Quand vous utilisez la liaison de données, vous devez aussi tenir compte de
la portée des objets que vous gérez. Vous devez toujours avoir à l'esprit
l'impact qu'aura sur la sécurité de votre application le fait de lier de telle
ou telle propriété au contenu d'un formulaire. Concrètement, vous devez faire
attention à ce que seules les propriétés qui ont besoin d'être mises à jour par
l'utilisateur final soient modifiables.

Par défaut, la méthode UpdateModel() va essayer de mettre à jour toutes les
propriétés de l'objet qui correspondent à des valeurs provenant du formulaire.
De même, toutes les propriétés des objets utilisés comme paramètres des
méthodes d'action sont définissables à partir des données du formulaire.

### Verrouiller le binding au cas par cas

Vous pouvez contrôler les règles de binding au cas par cas en spécifiant
explicitement la liste des propriétés qui peuvent être modifiées. Pour cela, il
suffit de passer un paramètre supplémentaire à la méthode UpdateModel() comme
dans l'exemple ci-dessous :

```
string[] allowedProperties = new[]{ "Title", "Description",
                                         "ContactPhone", "Address",
                                         "EventDate", "Latitude",
                                         "Longitude"};

UpdateModel(dinner, allowedProperties);
```

Les objets passés en tant que paramètres aux méthodes d'actions acceptent
quand à eux un attribut [Bind] qui permet de spécifier la liste des propriétés
autorisées :

```
//
// POST: /Dinners/Create
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Create( [Bind(Include="Title,Address")] Dinner dinner ) {
   ...
}
```

### Verrouiller le binding au niveau du modèle

Les règles pour lier les propriétés d'un objet aux éléments d'un formulaire
peuvent aussi être spécifiées par rapport à l'objet lui-même. Ainsi, on ne les
défini qu'une seule fois et elles s'appliquent dans tous les cas (aussi bien
avec UpdateModel() que lorsque l'objet est passé en paramètre à la méthode
d'action) et quel que soit le contrôleur ou l'action.

Pour cela, on peut ajouter un attribut [Bind] directement dans la classe de
l'objet ou le registrer dans le fichier Global.asax (ce qui est pratique quand
on n'a pas accès aux sources). On peut alors employer les propriétés Include ou
Exclude de l'attribut Bind pour contrôler quelles sont les propriétés pour une
classe ou une interface donnée.

Nous allons utiliser cette technique pour la classe Dinner de notre
application NerdDinner et lui ajouter un attribut [Bind] afin de restreindre la
liste des propriétés pouvant être liées :

```
 [Bind(Include="Title,Description,EventDate,Address,Country,ContactPhone,Latitude,Longitude")]
public partial class Dinner {
   ...
}
```

Comme vous le voyez, nous n'avons pas autorisé le binding de la collection
RSVPs, ni celui des propriétés DinnerID ou HostedBy. Pour plus de sécurité, ses
éléments seront uniquement manipulés via du code écrit explicitement pour
cela.

## Petit récapitulatif

ASP.NET MVC offre un certain nombre de fonctionnalités dédiées pour
faciliter l'exploitation de formulaires de saisie. Nous avons utilisé plusieurs
d'entre elles pour réaliser l'interface utilisateur correspondant à notre
DinnerRepository.

Nous avons utilisé une approche basée sur le modèle pour développer notre
application. C'est pourquoi la partie validation et règles métier ont été
définies au niveau de la couche modèle plutôt que dans les contrôleurs ou les
vues. Ni notre classe contrôleurs, ni nos différentes vues, n'ont rien à savoir
en ce qui concerne les règles métiers découlant de notre classe Dinner.

Grace à cela, notre application a une architecture propre et facile à
tester. Si par la suite nous ajoutons d'autres règles métiers à notre couche
modèle, nous aurons absolument aucune modification à faire au code de nos
contrôleurs et de nos vues pour que celles-ci soient prises en compte. Nous
avons donc une très grande souplesse pour améliorer et faire évoluer notre
application à l'avenir.

Notre contrôleur gère désormais une présentation liste / détails ainsi que
la création, la modification et la suppression de dîners. Les pages suivantes
présentent le code source complet pour DinnersController.cs :

```
public class DinnersController : Controller {

   DinnerRepository dinnerRepository = new DinnerRepository();

   //
   // GET: /Dinners/
   public ActionResult Index() {

     var dinners = dinnerRepository.FindUpcomingDinners().ToList();
     return View(dinners);
   }

   //
   // GET: /Dinners/Details/2
   public ActionResult Details(int id) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   if (dinner == null)
     return View("NotFound");
   else
     return View(dinner);
   }

   //
   // GET: /Dinners/Edit/2
   public ActionResult Edit(int id) {

     Dinner dinner = dinnerRepository.GetDinner(id);
     return View(dinner);
   }

   //
   // POST: /Dinners/Edit/2
   [AcceptVerbs(HttpVerbs.Post)]
   public ActionResult Edit(int id, FormCollection formValues) {

     Dinner dinner = dinnerRepository.GetDinner(id);
     try {
        UpdateModel(dinner);
        dinnerRepository.Save();
        return RedirectToAction("Details", new { id = dinner.DinnerID });
     }
     catch {
        ModelState.AddRuleViolations(dinner.GetRuleViolations());
        return View(dinner);
     }
   }

   //
   // GET: /Dinners/Create
   public ActionResult Create() {

     Dinner dinner = new Dinner() {
        EventDate = DateTime.Now.AddDays(7)
     };
     return View(dinner);
   }

   //
   // POST: /Dinners/Create
   [AcceptVerbs(HttpVerbs.Post)]
   public ActionResult Create(Dinner dinner) {

     if (ModelState.IsValid) {

        try {
           dinner.HostedBy = "SomeUser";

           dinnerRepository.Add(dinner);
           dinnerRepository.Save();

           return RedirectToAction("Details", new{id=dinner.DinnerID});
        }
        catch {
           ModelState.AddRuleViolations(dinner.GetRuleViolations());
        }
     }

     return View(dinner);
   }

   //
   // HTTP GET: /Dinners/Delete/1
   public ActionResult Delete(int id) {

     Dinner dinner = dinnerRepository.GetDinner(id);

     if (dinner == null)
        return View("NotFound");
     else
        return View(dinner);
   }

   //
   // HTTP POST: /Dinners/Delete/1
   [AcceptVerbs(HttpVerbs.Post)]
   public ActionResult Delete(int id, string confirmButton) {

     Dinner dinner = dinnerRepository.GetDinner(id);

     if (dinner == null)
        return View("NotFound");

     dinnerRepository.Delete(dinner);
     dinnerRepository.Save();

     return View("Deleted");
   }
}
```

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [ViewData et ViewModel](/nerddinner/viewdata-viewmodel/)
