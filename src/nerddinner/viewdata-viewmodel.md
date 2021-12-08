---
date: 2009-12-17 11:42:00
layout: page
permalink: nerddinner/viewdata-viewmodel/
redirect_from: "pages/NerdDinner/ViewData-et-ViewModel"
title: "NerdDinner(fr) : ViewData et ViewModel"
---

Nous avons jusqu'à présent réalisé plusieurs types de formulaires et abordé
la façon de les utiliser pour créer, modifier et supprimer des données (CRUD).
Nous allons maintenant faire passer notre application au niveau supérieur et
mettre en œuvre des formulaires encore plus sophistiqués. Cela nous permettra
d'étudier les deux approches envisageables pour faire passer des informations
des contrôleurs vers les vues : ViewData et ViewModel.

## Transmettre des données des contrôleurs vers les vues

Une des caractéristiques du modèle MVC est qu'il incite à pratiquer une
stricte "séparation des préoccupations" entre les différents composants de
l'application. Les modèles, les contrôleurs et les vues ont tous des fonctions
et des responsabilités bien définies, et ils communiquent les uns avec les
autres via des méthodes également bien définies. Cette séparation favorise la
testabilité et la réutilisation du code.

Quand un contrôleur décide de renvoyer une réponse HTML, c'est lui qui est
responsable de transmettre précisément à la vue toutes les informations qui lui
sont nécessaires pour produire cette réponse. Les vues &lt;u&gt;ne devraient
jamais&lt;/u&gt; avoir à interroger la base de données ou à réaliser des
traitements logiques. Elles devraient uniquement se consacrer à générer le code
résultant des données qui lui ont été fournies par le contrôleur.

Pour l'instant, les modèles de données que notre contrôleur
DinnersController fait passer aux différentes vues sont plutôt simples et
directs : une liste d'objets Dinners pour l'action Index() et un simple objet
Dinner dans le cas des actions Details(), Edit(), Create() et Delete(). Si nous
voulons enrichir l'interface utilisateur de notre application, nous aurons
généralement besoin de faire passer plus que ces objets basiques pour que les
vues puissent générer les réponses HTML. Par exemple, nous pourrions changer la
zone "Country" dans les vues Edit et Create pour qu'elle utilise une liste
déroulante au lieu d'une simple saisie de texte. Plutôt que de coder en dur le
contenu de cette liste déroulante dans nos différentes vues, nous pouvons
construire ce contenu dynamiquement en récupérant la liste des pays acceptés
par l'application. Par conséquent, nous aurons besoin de trouver un système
pour que le contrôleur fasse passer cette liste des pays en plus de l'objet
Dinner aux vues Edit et Create.

Nous allons maintenant examiner deux méthodes différentes pour faire
cela.

## Utiliser le dictionnaire ViewData

La classe de base du contrôleur expose une propriété ViewData de type
dictionnaire. Celle-ci peut s'employer pour faire passer des données
supplémentaires des contrôleurs vers les vues.

Dans notre exemple, pour remplacer la zone de texte "Country" par une liste
déroulante dans la vue Edit, nous pouvons mettre à jour le code de l'action
Edit() pour qu'en plus de l'objet Dinner elle fasse passer un objet SelectList
qui pourra être utilisé pour le contenu de la liste déroulante.

```
//
// GET: /Dinners/Edit/5
public ActionResult Edit(int id) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   ViewData["Countries"] = new SelectList(PhoneValidator.Countries,
                                              dinner.Country);

   return View(dinner);
}
```

Le constructeur de l'objet SelectList prend deux paramètres : une liste de
pays pour remplir la liste déroulante ainsi que le code du pays actuellement
sélectionné.

Nous pouvons alors mettre à jour la vue Edit.aspx pour remplacer le Helper
Html.TextBox() que nous utilisions jusqu'alors par le helper
Html.DropDownlist() :

```
<%= Html.DropDownList("Country", ViewData["Countries"] as SelectList) %>
```

Le helper Html.DropDownList() attend deux paramètres. Le premier contient le
nom de l'élément du formulaire à générer. Le second est l'objet SelectList que
nous avons fait passer via le dictionnaire ViewData. Pour ce second paramètre,
nous utilisons le mot clé C# "as" pour que l'élément du dictionnaire soit
converti en SelectList.

Et maintenant, quand nous lançons l'application pour accéder à l'URL
/Dinners/Edit/1, nous pouvons constater que l'interface utilisateur a bien été
modifiée pour afficher une liste déroulante au lieu de la zone de texte :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image097.png)

Etant donné que nous renvoyons aussi la vue Edit dans le cas où l'action
Edit() est appelée en mode HTTP GET (dans le cas où une erreur s'est produite),
nous devons faire en sorte que la SelectList soit également ajoutée au
dictionnaire ViewData avant que la vue soit appelée :

```
//
// POST: /Dinners/Edit/5
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(int id, FormCollection collection) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   try {
     UpdateModel(dinner);

     dinnerRepository.Save();

     return RedirectToAction("Details", new { id=dinner.DinnerID });
   }
   catch {
     ModelState.AddModelErrors(dinner.GetRuleViolations());

     ViewData["countries"] = new SelectList(PhoneValidator.AllCountries,
                                                 dinner.Country);

     return View(dinner);
   }
}
```

Une fois cela terminé, l'action Edit() du contrôleur DinnersController prend
désormais en charge une liste déroulante.

## Utiliser une classe ViewModel

L'avantage du dictionnaire ViewData est d'être simple et rapide à mettre en
œuvre. Cependant, certains développeurs n'aiment pas trop cette approche basée
sur des chaines "magiques", étant donné qu'en cas d'erreurs de frappe,
celles-ci ne seront pas détectées à la compilation mais seulement au moment de
l'exécution. De plus, le dictionnaire ViewData n'étant pas typé, cela nous
contraint à utiliser l'opérateur "as" pour l'utiliser avec un langage fortement
typé tel que C# dans les vues.

Pour remédier à ces imperfections, il est possible d'utiliser une autre
approche basée sur la technique de la ViewModel. Cette pratique consiste à
créer des classes fortement typées que l'on construit en fonction de ce que
l'on a besoin de faire dans nos vues. Ces classes exposent donc les propriétés
correspondant au contenu et aux valeurs dynamiques nécessaires dans les vues.
Notre classe contrôleur va donc initialiser ces classes puis les transmettre
aux vues qui les utiliseront. Cette technique apporte plusieurs avantages : la
sécurité du typage de données, la vérification à la compilation et la
disponibilité de l'IntelliSense dans l'éditeur de vues.

Par exemple, pour gérer des situations où nous voulons la mise à jour des
dîners, nous pouvons créer une classe "DinnerFormViewModel" qui expose deux
propriétés fortement typées : un objet Dinner et un objet SelectList pour
remplir la liste déroulante des pays :

```
public class DinnerFormViewModel {

   // Properties
   public Dinner Dinner { get; private set; }
   public SelectList Countries { get; private set; }

   // Constructor
   public DinnerFormViewModel(Dinner dinner) {

     Dinner = dinner;
     Countries = new SelectList(PhoneValidator.Countries,
                                      dinner.Country);
   }
}
```

Nous pouvons ensuite mettre à jour l'action Edit() pour qu'elle crée un
objet DinnerFormViewModel à partir de l'objet Dinner issu du repository, puis
qu'elle le fasse passer à la vue :

```
// GET: /Dinners/Edit/5
public ActionResult Edit(int id) {

   Dinner dinner = dinnerRepository.GetDinner(id);
   return View(new DinnerFormViewModel(dinner));
}
```

Il ne nous reste plus qu'à mettre à jour notre vue pour qu'elle attende
désormais un objet "DinnerFormViewModel" au lieu d'un objet "Dinner" en
changeant l'attribut "inherits" qui apparait sur la première ligne du fichier
Edit.aspx :

```
Inherits="System.Web.Mvc.ViewPage<NerdDinner.Controllers.DinnerFormViewModel>
```

Une fois que nous avons fait cela, l'IntelliSense disponible au sein de la
vue est mise à jour pour refléter le type "DinnerFormViewModel" de l'objet
Model que nous lui passons :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image098.png)

![](http://nerddinnerbook.s3.amazonaws.com/Images/image099.png)

Nous pouvons alors mettre à jour le code de notre vue pour en tirer parti.
Comme vous le remarquez ci-dessous, nous ne modifions pas les noms des zones de
saisies que nous créons : les différents éléments du formulaire s'appellent
toujours "Title", "Country"… Par contre, nous avons mis à jour les méthodes
Helper pour retrouver leurs valeurs depuis la classe "DinnerFormViewModel" :

```
<p>
   <label for="Title">Dinner Title:</label>
   <%= Html.TextBox("Title", Model.Dinner.Title) %>
   <%= Html.ValidationMessage("Title", "*") %>
</p>
...
<p>
   <label for="Country">Country:</label>
   <%= Html.DropDownList("Country", Model.Countries) %>
   <%= Html.ValidationMessage("Country", "*") %>
</p>
...
```

Puis nous mettons à jour la partie HTTP POST de l'action Edit() pour
utiliser également la classe DinnerFormViewModel dans le cas où nous avons
besoin de gérer les erreurs de saisie :

```
//
// POST: /Dinners/Edit/5
[AcceptVerbs(HttpVerbs.Post)]
public ActionResult Edit(int id, FormCollection collection) {

   Dinner dinner = dinnerRepository.GetDinner(id);

   try {
     UpdateModel(dinner);

     dinnerRepository.Save();

     return RedirectToAction("Details", new { id=dinner.DinnerID });
   }
   catch {
     ModelState.AddModelErrors(dinner.GetRuleViolations());

     return View(new DinnerFormViewModel(dinner));
   }
}
```

Nous pouvons aussi utiliser cette classe DinnerFormViewModel au niveau des
méthodes d'action Create() afin qu'elles utilisent la même liste déroulante des
pays. Ce qui donne le code suivant pour la partie HTTP GET de l'action
Create() :

```
//
// GET: /Dinners/Create
public ActionResult Create() {

   Dinner dinner = new Dinner() {
     EventDate = DateTime.Now.AddDays(7)
   };

   return View(new DinnerFormViewModel(dinner));
}
```

Et pour la partie HTTP POST de l'action Create() :

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

        return RedirectToAction("Details", new { id=dinner.DinnerID });
     }
     catch {
        ModelState.AddModelErrors(dinnerToCreate.GetRuleViolations());
     }
   }

   return View(new DinnerFormViewModel(dinnerToCreate));
}
```

Après quoi nos formulaires de création et de modification offrent tous les
deux une liste déroulante pour sélectionner le pays où va se dérouler le
dîner.

## Utiliser une classe ViewModel personnalisée

Dans notre exemple, la classe DinnerFormViewModel expose directement une
propriété de type Dinner et une autre de type SelectList. Cette formule est
bien adaptée dans le cas où l'interface utilisateur que nous voulons créer
repose assez fidèlement sur les objets de notre modèle de données.

Pour les scénarios où cela ne suffirait pas, une solution qui s'offre à vous
est de créer une classe ViewModel totalement spécifique dont le contenu
correspond exactement à ce dont la vue a besoin, quitte à ce que cette classe
ViewModel soit totalement différente des objets du modèle de données. Par
exemple, il est tout à fait possible qu'elle propose des propriétés sous des
noms différents ou qu'elle contienne des propriétés issues de plusieurs objets
du modèle de données.

Ces classes ViewModel personnalisées peuvent aussi bien servir pour faire
passer des données depuis les contrôleurs vers les vues que pour traiter les
informations remontées des formulaires vers les méthodes d'action des
contrôleurs. Dans ce cas, la méthode action peut dans un premier temps utiliser
les données du formulaire pour mettre à jour un objet ViewModel. Puis elle part
de cet objet ViewModel pour retrouver et modifier un objet du modèle de
données.

Les classes ViewModel personnalisées offrent une très grande souplesse. Cela
vaut le coup d'y penser dès que vous trouvez que le code de vos vues ou les
actions de vos contrôleurs commencent à devenir trop compliqués à suivre. C'est
souvent le signal que votre modèle ne correspond pas vraiment à l'interface
utilisateur que vous essayez de développer et qu'une classe ViewModel
personnalisée ne ferait pas de mal.

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Master page et Vues partielles](/nerddinner/master-page-vues-partielles/)
