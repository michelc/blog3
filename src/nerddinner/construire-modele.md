---
date: 2009-11-25 08:33:00
layout: page
permalink: nerddinner/construire-modele/
redirect_from: "pages/NerdDinner/Construire-Modele"
title: "NerdDinner(fr) : Construire le modèle"
---

Dans le cas d'un framework Model-View-Controller, le terme "Modèle" fait
référence aux objets qui représentent les données de l'application, ainsi qu'à
la logique du domaine correspondant qui comprend la validation des données et
les règles métiers associées. A bien des égards, le modèle est le "cœur" d'une
application MVC, et comme nous le verrons plus tard détermine sa façon de
fonctionner.

Le framework ASP.NET MVC prend en charge toutes les techniques d'accès aux
données, et les développeurs peuvent mettre en œuvre leur modèle à partir d'un
large éventail de solutions : LINQ to Entities, LINQ to SQL, NHibernate, LLBLGen
Pro, SubSonic, WilsonORM, ou tout simplement des DataReader ou des DataSet.

Pour notre application NerdDinner nous utiliserons LINQ to SQL pour créer un
simple modèle de domaine qui correspond d'assez près au modèle physique de
notre base de données et ajoute une dose de logique de validation et de règles
métiers. Nous réaliserons aussi une classe Repository qui nous permettra de
bien séparer la gestion de la persistance des données du reste de l'application
et simplifiera la réalisation de tests unitaires.

## LINQ to SQL

LINQ to SQL est un ORM (un mapping objet-relationnel) qui fait parti de
ASP.NET 3.5.

LINQ to SQL fournit une méthode simple pour représenter les tables de la
base de données sous forme de classes .NET que nous pouvons utiliser pour
coder. Dans le cas de notre application NerdDinner, nous allons l'utiliser pour
faire correspondre les tables Dinners et RSVP de notre base de données avec des
classes Dinner et RSVP. Les colonnes des tables Dinners et RSVP correspondront
aux propriétés des classes Dinner et RSVP. Chaque objet Dinner ou RSVP
représentera une ligne distincte dans les tables Dinners ou RSVP de la base de
données.

LINQ to SQL nous permet d'éviter d'avoir à écrire des requêtes SQL à la main
pour retrouver et initialiser les objets Dinner et RSVP à partir des données de
la base de données. Au lieu de cela, nous définissons les classes Dinner et
RSVP, la façon dont elles correspondent avec la base de données, et les
relations entre elles. Au moment de l'exécution, LINQ to SQL se charge de
générer les requêtes SQL nécessaires lorsque nous utilisons les classes Dinner
et RSVP.

Nous pouvons écrire des requêtes LINQ en VB ou C# pour retrouver les objets
Dinner et RSVP. Cela diminue la quantité de code spécifique aux données que
nous devons écrire, ce qui nous permet de construire des applications de
meilleure qualité.

## Ajout des classes LINQ to SQL à notre projet

On commence par un clic droit sur le dossier "Models" de notre projet avant
de sélectionner la commande **Add -&gt; New Item** :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image041.png)

Cela fait apparaître la boite de dialogue "Add New Item" dans laquelle nous
choisissons la catégorie "Data" puis le modèle "LINK to SQL Classes" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image042.png)

On donne le nom "NerdDinner" à notre classe puis on clique sur le bouton
"Add". Visual Studio ajoute alors un fichier NedrDinner.dbml dans le dossier
\Models puis ouvre celui-ci dans le Concepteur Objet/Relationnel LINQ to
SQL :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image043.png)

## Création de classes de modèle de données avec LINQ to SQL

LINQ to SQL permet de créer rapidement des classes de données à partir du
schéma d'une base de données existante. Pour cela, nous ouvrons la base de
données NerdDinner dans l'explorateur de serveur pour y sélectionner les tables
que nous voulons y voir figurer :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image044.png)

On fait alors glisser nos deux tables vers le concepteur LINQ to SQL. En
faisant cela, LINQ to SQL crée automatiquement les classes Dinner et RSVP en se
basant sur la structure des tables Dinners et RSVP (en reprenant comme
propriété de chaque classe les colonnes de la table correspondante) :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image045.png)

Par défaut, le concepteur LINQ to SQL met automatiquement au singulier les
noms des tables et des colonnes lorsqu'il crée des classes à partir d'un schéma
de base de données. Dans notre cas, la table "Dinners" de l'exemple ci-dessus
donne lieu à la classe "Dinner". Cette méthode de nommage permet de rester
compatible avec les conventions de nommage de .NET et je trouve assez pratique
que le concepteur LINQ to SQL fonctionne comme cela (particulièrement lorsque
je dois ajouter un grand nombre de tables). Toutefois, si vous n'aimez pas le
nom généré pour une table ou une colonne, vous pouvez toujours revenir dessus
et le remplacer par le nom que vous voulez. Cela est possible soit en modifiant
le nom de l'entité / propriété dans le concepteur, soit en passant par la
grille des propriétés.

Par défaut, le concepteur LINQ to SQL inspecte également les relations clé
primaire / clé étrangère des tables et à partir de celles-ci génère
automatiquement des "associations relationnelles" entre les différentes classes
qu'il a créé. Par exemple, lorsque nous avons fait glisser les tables Dinners
et RSVP vers le concepteur LINQ to SQL, le fait que la table RSVP possède une
clé étrangère vers la table Dinners lui a permis d'en déduire une relation
un-à-plusieurs entre les deux (qui est représentée par la flèche dans le
concepteur) :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image046.png)

L'association ci-dessus va faire que LINQ to SQL ajoute une propriété
"Dinner" fortement typée à la classe RSVP que les développeurs pourront
employer pour accéder à l'entité "Dinner" associée à un objet RSVP donné. Cela
a  également pour effet d'ajouter une propriété collection "RSVPs"
fortement typée à la classe Dinner qui là aussi permettra aux développeurs de
retrouver et de mettre à jour les objets RSVP associés à ce dîner.

Ci-dessous vous pouvez voir un exemple d'IntelliSense dans Visual Studio
lorsque nous créons un nouvel objet RSVP et que nous l'ajoutons à la collection
RSVPs d'un objet Dinner :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image047.png)

Vous pouvez voir que LINQ to SQL a créé une collection "RSVPs" pour l'objet
Dinner. Nous pouvons l'employer pour associer une relation de clé étrangère
entre une ligne Dinner et une ligne RSVP dans notre base de données :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image048.png)

Si vous n'aimez pas la façon dont le concepteur a modélisé ou nommé une
association de table, vous pouvez aussi revenir dessus. Il suffit de cliquer
sur la flèche représentant l'association dans le concepteur et d'accéder à ses
propriétés via la grille de propriétés pour la renommer, la supprimer ou la
modifier. Mais dans le cas de notre application NerdDinner les règles
d'association par défaut fonctionnent bien par rapport au modèle de données de
classes que nous réalisons et nous pouvons donc conserver le comportement par
défaut.

## La classe NerdDinnerDataContext

Visual Studio génère automatiquement des classes .NET qui représentent le
modèle et les relations de la base de données définie avec le concepteur LINQ
to SQL. Une classe DataContext est également générée pour chaque fichier LINQ
to SQL ajouté à la solution. Etant donné que notre classe LINQ to SQL s'appelle
"NerdDinner", la classe DataContext créée se nomme "NerdDinnerDataContext".
Cette classe NerdDinnerDataContext va constituer la méthode principale pour
interagir avec la base de données.

Dans notre cas, la classe NerdDinnerDataContext expose deux propriétés
"Dinners" et "RSVPs" qui représentent les deux tables que nous avons modélisées
dans notre base de données. Nous pouvons utiliser le langage C# pour écrire des
requêtes LINQ utilisant ces deux propriétés pour sélectionner et retrouver des
objets Dinner et RSVP à partir de la base de données.

Le code suivant montre comment instancier un objet NerdDinnerDataContext et
effectuer une requête LINQ sur celui-ci pour retrouver les dîners qui vont
bientôt se dérouler :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image049.png)

Un objet NerdDinnerDataContext garde la trace de toutes les modifications
apportées aux objets Dinner et RSVP récupérés par son intermédiaire et
simplifie leur enregistrement dans la base de données. Le code ci-dessous
illustre la façon dont on peut utiliser une requête LINQ pour obtenir  un
objet Dinner particulier de la base de données, mettre à jour deux de ses
propriétés, puis enregistrer ces modifications dans la base de données :

```
NerdDinnerDataContext db = new NerdDinnerDataContext();

// Retrieve Dinner object that reprents row with DinnerID of 1
Dinner dinner = db.Dinners.Single(d => d.DinnerID == 1);

// Update two properties on Dinner
dinner.Title = "Changed Title";
dinner.Description = "This dinner will be fun";

// Persist changes to database
db.SubmitChanges();
```

Dans le code ci-dessus, l'objet NerdDinnerDataContext conserve
automatiquement la trace des modifications apportées à l'objet Dinner qu'il
nous a permis de retrouver. Quand nous appelons la méthode "SubmitChanges()",
elle exécute la commande SQL "UPDATE" qui va bien pour sauvegarder les
modifications dans la base de données.

## Création d'une classe DinnerRepository

Pour de petites applications, ce n'est pas bien gênant que les contrôleurs
attaquent directement les classes DataContext de LINQ to SQL et que les
requêtes LINQ soient codées directement à l'intérieur des contrôleurs. Mais
lorsque les applications grossissent, cela commence à devenir de plus en plus
difficile à maintenir et à tester. Et cela peut nous amener à répéter les mêmes
requêtes LINQ à plusieurs endroits dans l'application.

L'utilisation du modèle de conception (pattern) "Repository" rend les
applications plus faciles à maintenir et à tester. Une classe repository permet
d'encapsuler la recherche et l'enregistrement des données et par conséquent de
masquer complètement la façon de mettre en œuvre tout ce qui touche à la
persistance des données. En plus d'avoir un code plus propre, le fait
d'implémenter le pattern repository nous rend plus autonomes par rapport à la
façon dont sont stockées nos données. Et cela peut aussi simplifier les tests
unitaires de l'application en évitant l'utilisation d'une vraie base de
données.

Pour notre application, nous allons définir une classe DinnerRepository avec
la signature suivante :

```
public class DinnerRepository {

   // Query Methods
   public IQueryable<Dinner> FindAllDinners();
   public IQueryable<Dinner> FindUpcomingDinners();
   public Dinner GetDinner(int id);

   // Insert/Delete
   public void Add(Dinner dinner);
   public void Delete(Dinner dinner);

   // Persistence
   public void Save();

}
```

''Note : plus loin dans ce chapitre, nous génèrerons une interface
IDinnerRepository à partir de cette classe pour adopter l'injection de
dépendance dans nos contrôleurs. Mais pour l'instant, nous allons au plus
simple en travaillant directement avec la classe DinnerRepository.''

Pour implémenter cette classe, on fait un clic-droit sur le dossier "Models"
et on choisi la commande **Add -&gt; New Item**. Dans la boite de
dialogue "Add New Item", nous sélectionnons le modèle "Class" et donnons le nom
de "DinnerRepository.cs" à notre fichier :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image050.png)

Nous pouvons créer notre classe DinnerRespository en recopiant le code
ci-dessous :

```
public class DinnerRepository {

   private NerdDinnerDataContext db = new NerdDinnerDataContext();

   //
   // Query Methods
   public IQueryable<Dinner> FindAllDinners() {
     return db.Dinners;
   }

   public IQueryable<Dinner> FindUpcomingDinners() {
     return from dinner in db.Dinners
             where dinner.EventDate > DateTime.Now
             orderby dinner.EventDate
             select dinner;
   }

   public Dinner GetDinner(int id) {
     return db.Dinners.SingleOrDefault(d => d.DinnerID == id);
   }

   //
   // Insert/Delete Methods
   public void Add(Dinner dinner) {
     db.Dinners.InsertOnSubmit(dinner);
   }

   public void Delete(Dinner dinner) {
     db.RSVPs.DeleteAllOnSubmit(dinner.RSVPs);
     db.Dinners.DeleteOnSubmit(dinner);
   }

   //
   // Persistence
   public void Save() {
     db.SubmitChanges();
   }
}
```

## Utilisation de la classe DinnerRepository

Maintenant que nous avons créé notre classe DinnerRepository, jetons un coup
d'œil à quelques exemples de code pour comprendre à quoi elle va pouvoir nous
servir :

### Exemple de recherche

Le code ci-dessous retrouve un dîner particulier à partir de la valeur de
DinnerID :

```
DinnerRepository dinnerRepository = new DinnerRepository();

// Retrieve specific dinner by its DinnerID
Dinner dinner = dinnerRepository.GetDinner(5);
```

Le code ci-dessous retrouve tous les dîners à venir puis fait une boucle sur
ceux-ci :

```
DinnerRepository dinnerRepository = new DinnerRepository();

// Retrieve all upcoming Dinners
var upcomingDinners = dinnerRepository.FindUpcomingDinners();

// Loop over each upcoming Dinner
foreach (Dinner dinner in upcomingDinners) {

}
```

### Exemples d'insertion et de modification

Le code ci-dessous illustre la façon d'ajouter deux nouveaux dîners. Les
ajouts et les modifications dans le repository ne sont pas répercutés dans la
base de données tant que la méthode "Save()" n'est pas appelée. LINQ to SQL
englobe automatiquement toutes les modifications de la base de données dans une
transaction. Ainsi, lorsque le repository est sauvegardé, soit toutes les mises
à jour sont effectuées, soit aucune :

```
DinnerRepository dinnerRepository = new DinnerRepository();

// Create First Dinner
Dinner newDinner1 = new Dinner();
newDinner1.Title = "Dinner with Scott";
newDinner1.HostedBy = "ScotGu";
newDinner1.ContactPhone = "425-703-8072";

// Create Second Dinner
Dinner newDinner2 = new Dinner();
newDinner2.Title = "Dinner with Bill";
newDinner2.HostedBy = "BillG";
newDinner2.ContactPhone = "425-555-5151";

// Add Dinners to Repository
dinnerRepository.Add(newDinner1);
dinnerRepository.Add(newDinner2);

// Persist Changes
dinnerRepository.Save();
```

Le code ci-dessous extrait un objet Dinner puis modifie deux de ses
propriétés. Les changements apportées sont répercutés dans la base de données
lorsque la méthode "Save()" du repository est appelée :

```
DinnerRepository dinnerRepository = new DinnerRepository();

// Retrieve specific dinner by its DinnerID
Dinner dinner = dinnerRepository.GetDinner(5);

// Update Dinner properties
dinner.Title = "Update Title";
dinner.HostedBy = "New Owner";

// Persist changes
dinnerRepository.Save();
```

Le code ci-dessous charge un dîner puis lui ajoute une réponse RSVP. Ceci
est réalisé en utilisant la collection RSVPs de l'objet Dinner que LINQ to SQL
a créé pour nous (grâce à la relation clé primaire / clé étrangère qui existe
dans la base de données). Cette modification est sauvegardée dans la base de
données sous la forme d'une nouvelle ligne dans la table RSVP quand on appelle
la méthode "Save()" de notre repository :

```
DinnerRepository dinnerRepository = new DinnerRepository();

// Retrieve specific dinner by its DinnerID
Dinner dinner = dinnerRepository.GetDinner(5);

// Create a new RSVP object
RSVP myRSVP = new RSVP();
myRSVP.AttendeeName = "ScottGu";

// Add RSVP to Dinner's RSVP Collection
dinner.RSVPs.Add(myRSVP);

// Persist changes
dinnerRepository.Save();
```

### Exemple de suppression

Le code ci-dessous retrouve un objet Dinner particulier puis le supprime du
repository. Par la suite, lorsque la méthode "Save()" est appelée, la
suppression devient effective au niveau de la base de données :

```
DinnerRepository dinnerRepository = new DinnerRepository();

// Retrieve specific dinner by its DinnerID
Dinner dinner = dinnerRepository.GetDinner(5);

// Mark dinner to be deleted
dinnerRepository.Delete(dinner);

// Persist changes
dinnerRepository.Save();
```

## Ajout du contrôle des données et de règles métiers à nos classes

Le fait de valider les données et d'appliquer des règles métiers est un
aspect essentiel dès lors que l'on développe des applications qui traitent des
données.

### Validation du schéma

Lorsque le concepteur LINQ to SQL a généré les classes modèles, il a calqué
le type de données des propriétés de ces classes sur celui des colonnes de la
base de données. Par exemple, si la colonne "EventDate" de la table "Dinners"
est de type "DateTime", alors la propriété générée par LINQ to SQL sera de type
"DateTime" (qui est un type de données prédéfini du .NET framework). Cela
signifie que vous obtiendrez une erreur de compilation si vous écrivez du code
qui lui affecte directement un entier ou un booléen. De même, vous provoquerez
une erreur d'exécution si vous tentez de lui assigner une chaîne de type
incorrect au moment de l'exécution.

LINQ toSQL se charge également de gérer l'échappement des valeurs SQL
lorsque vous manipulez des chaînes, ce qui fait que vous n'avez pas à vous
préoccuper des risques d'attaque par injection SQL lorsque vous passez par
lui.

### Validation des données et règles métiers

La validation par rapport au type de données est déjà un bon début, mais
c'est rarement suffisant. Dans la vrai vie, il est nécessaire d'en passer par
des règles de validation plus poussées : pouvoir tenir compte de plusieurs
propriétés, exécuter un bout de code, savoir ce que l'on est en train de faire
(par exemple, est-ce qu'on est en mode création, modification ou suppression ou
bien dans un cas spécifique à l'application comme un archivage ?).

Il y a un grand nombre de frameworks et de modèles de conceptions différents
qui peuvent être employés pour définir et appliquer des règles de validation à
des classes modèles. Il en existe plusieurs pour le framework .NET et vous
pouvez quasiment utiliser n'importe lequel d'entre eux dans le cadre d'une
application ASP.NET MVC.

Pour les besoins de notre application NerdDinner, notre choix va se porter
sur un modèle de conception relativement simple et direct qui consiste à
ajouter une propriété IsValid et une méthode GetRuleViolations() à notre objet
Dinner. La propriété IsValid renvoie true ou false selon que les règles de
validation sont toutes vérifiées ou non. La méthode GetRuleViolations() renvoie
la liste de toutes les règles en erreur.

Nous allons ajouter une "classe partielle" à notre projet pour définir
IsValid et GetRuleViolations(). On peut utiliser les classes partielles pour
ajouter des méthodes, des propriétés ou des évènements à des classes gérées par
un concepteur de Visual Studio (c'est le cas de notre classe Dinner qui a été
générée par le concepteur LINQ to SQL) de façon à ne pas le perturber avec du
code saisi manuellement dans la classe d'origine.

Pour ajouter une nouvelle classe partielle au projet, nous faisons un
clic-droit sur le dossier \Models puis choisissons la commande "Add New Item"
pour faire apparaitre la boite de dialogue du même nom. Nous pouvons alors
sélectionner le modèle "Class" et saisir le nom "Dinner.cs" :

![](http://nerddinnerbook.s3.amazonaws.com/Images/image051.png)

En cliquant sur le bouton "Add", le fichier Dinner.cs est ajouté au projet
puis ouvert dans l'éditeur de code. Nous pouvons alors écrire un squelette de
règles et validations de base en y copiant le code ci-dessous :

```
public partial class Dinner {

   public bool IsValid {
     get { return (GetRuleViolations().Count() == 0); }
   }

   public IEnumerable<RuleViolation> GetRuleViolations() {
     yield break;
   }

   partial void OnValidate(ChangeAction action) {
     if (!IsValid)
        throw new ApplicationException("Rule violations prevent saving");
   }
}

public class RuleViolation {

   public string ErrorMessage { get; private set; }
   public string PropertyName { get; private set; }

   public RuleViolation(string errorMessage) {
     ErrorMessage = errorMessage;
   }

   public RuleViolation(string errorMessage, string propertyName) {
     ErrorMessage = errorMessage;
     PropertyName = propertyName;
   }
}
```

Quelques explications sur ce code :

* La classe Dinner est précédée du mot clé "partial", ce qui signifie que le
code qu'elle contient sera combiné avec celui de la classe générée / maintenue
par le concepteur LINQ to SQL avant d'être compilé en une seule classe
* L'invocation de la méthode GetRuleViolations() provoque la vérification de
nos règles de validation métier (qu'il nous reste à coder). La méthode
GetRuleViolations() renvoie une série d'objets RuleViolation qui détaillent
chaque erreur rencontrée.
* La propriété IsValid nous fourni une méthode simple pour savoir si l'objet
Dinner ne respecte pas certaines règles de validation. Elle peut être contrôlée
à tout moment à l'initiative du développeur (et ce sans renvoyer
d'exception).
* La méthode partielle OnValidate() nous permet d'être notifié par LINQ to
SQL chaque fois que l'objet Dinner est sur le point d'être sauvegardé dans la
base de données. Telle que nous l'avons programmée ci-dessus, notre méthode
OnValidate() s'assure que l'objet Dinner ne viole aucune règle avant qu'il soit
enregistré. Si c'est le cas, elle soulève une exception qui aura pour effet
d'annuler la transaction LINQ to SQL en cours.

Cette approche nous fourni un modèle dans lequel nous pouvons intégrer nos
contrôles de validité et nos règles métiers. Pour l'instant, nous allons
ajouter les règles suivantes à notre méthode GetRuleViolations() :

```
public IEnumerable<RuleViolation> GetRuleViolations() {

   if (String.IsNullOrEmpty(Title))
     yield return new RuleViolation("Title required", "Title");

   if (String.IsNullOrEmpty(Description))
     yield return new RuleViolation("Description required", "Description");

   if (String.IsNullOrEmpty(HostedBy))
     yield return new RuleViolation("HostedBy required", "HostedBy");

   if (String.IsNullOrEmpty(Address))
     yield return new RuleViolation("Address required", "Address");

   if (String.IsNullOrEmpty(Country))
     yield return new RuleViolation("Country required", "Address");

   if (String.IsNullOrEmpty(ContactPhone))
     yield return new RuleViolation("Phone# required", "ContactPhone");

   if (!PhoneValidator.IsValidNumber(ContactPhone, Country))
     yield return new RuleViolation("Phone# does not match country",
                                        "ContactPhone");
   yield break;
}
```

Nous utilisons la fonctionnalité "yield return" du C# pour pouvoir renvoyer
une série avec toutes les RuleViolations. Les six premières règles programmées
ci-dessus vérifient simplement que les propriétés de type chaînes de notre
objet Dinner ne sont pas vides ou nulles. La dernière règle est un peu plus
intéressante et fait appel à une méthode PhoneValidator.IsValidNumber() que
nous allons aussi ajouter à notre projet pour contrôler que le numéro de
téléphone ContactPhone respecte le format des numéros de téléphone du pays où
est organisé le dîner.

Nous allons utiliser les expressions régulières pour effectuer ce contrôle
de format. Nous pouvons ajouter le code ci-dessous à notre projet pour gérer
des règles de validation spécifique selon le pays :

```
public class PhoneValidator {

   static IDictionary<string, Regex> countryRegex =
                                           new Dictionary<string, Regex>() {
        { "USA", new Regex("^[2-9]\\d{2}-\\d{3}-\\d{4}$")},
        { "UK", new
Regex("(^1300\\d{6}$)|(^1800|1900|1902\\d{6}$)|(^0[2|3|7|8]{1}[0-
9]{8}$)|(^13\\d{4}$)|(^04\\d{2,3}\\d{6}$)")},
        { "Netherlands", new Regex(" (^\\+[0-9]{2}|^\\+[0-
9]{2}\\(0\\)|^\\(\\+[0-9]{2}\\)\\(0\\)|^00[0-9]{2}|^0)([0-9]{9}$|[0-9\\-
\\s]{10}$)")},
   };

   public static bool IsValidNumber(string phoneNumber, string country) {
     if (country != null && countryRegex.ContainsKey(country))
        return countryRegex[country].IsMatch(phoneNumber);
     else
        return false;
   }

   public static IEnumerable<string> Countries {
     get {
        return countryRegex.Keys;
     }
   }
}
```

Désormais, lorsque nous essayons de créer ou de mettre à jour un dîner, nos
règles de validation logiques sont appliquées automatiquement. Il nous est
possible de les vérifier de nous même et de récupérer la liste de toutes les
règles non respectées sans que cela soulève d'exception :

```
Dinner dinner = dinnerRepository.GetDinner(5);

dinner.Country = "USA";
dinner.ContactPhone = "425-555-BOGUS";

if (!dinner.IsValid) {

   var errors = dinner.GetRuleViolations();

   // do something to fix errors
}
```

Si nous faisons en sorte qu'un dîner ne soit pas valide, une exception est
levée lorsque nous appelons la méthode Save() de notre classe DinnerRepository.
Cela se produit parce que notre méthode partielle OnValidate() soulève une
exception dès lors qu'au moins une règle n'est pas respectée. Nous pouvons
intercepter cette exception pour récupérer une liste des problèmes à
corriger :

```
Dinner dinner = dinnerRepository.GetDinner(5);

try {
   dinner.Country = "USA";
   dinner.ContactPhone = "425-555-BOGUS";

   dinnerRepository.Save();
}
catch {

   var errors = dinner.GetRuleViolations();

   // do something to fix errors
}
```

Etant donné que nos contrôles de validité et nos règles métiers sont
programmés dans notre couche modèle, et pas dans la partie interface
utilisateur, ils sont appliqués et pris en compte dans tous les cas de figure.
Si par la suite nous modifions ou ajoutons certaines règles de validation, tout
le code qui travaille avec des objets Dinner en tiendra immédiatement compte.
Le fait d'avoir la possibilité de mettre à jour ces règles à un seul endroit,
sans avoir à les répercuter dans tous les sources de l'application et dans les
différents recoins de l'interface utilisateur, est la marque d'une application
bien conçue et c'est un point sur lequel le framework MVC nous aide à
progresser.

---
Index : [NerdDinner en français](http://tinyurl.com/NerdDinnerFR) - Suite : [Contrôleurs et Vues](/nerddinner/controleurs-vues/)
