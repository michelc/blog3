---
date: 2022-01-05 13:50:37 +02:00
tags: [ csharp, .net, mvc ]
title: Générer des fichiers pour le "M" de MVC avec Tada !
cover:
  image: /public/2022/tada.jpg
  link: https://www.gocomics.com/calvinandhobbes
  text: Calvin and Hobbes - Bill Watterson
excerpt: Ces derniers temps, j'ai développé pour moi un petit programme qui permet de générer vite fait quelques un des fichiers pour la partie "M" d'une application ASP.NET Core MVC. Cela me servira surtout pour développer des applications pour tester quelques trucs...
---

## Un "problème" --uneenvie

En ce moment, je (re)fais quelques tests pour savoir comment créer et organiser au plus simple
une application ASP.NET Core MVC. J'ai déjà plus ou moins trouvé comment faire en ligne de commande avec "dotnet", l'interface de ligne de commande (CLI) de .NET Core, pour :

* Créer une solution pour la nouvelle application ASP.NET Core
* Créer et ajouter un projet MVC à cette application
* Installer et référencer Entity Framework Core pour SQL Server et SQLite
* Faire un `dotnet build` pour vérifier que tout est ok

Puis vient le moment où il faut ajouter un modèle de données. Actuellement, je passe sous Visual Studio pour y coder les entités nécessaires puis j'ajoute un `DbContext`. Je trouve quand même que c'est un peu lourd de devoir faire ça à chaque fois que je veux tester vite fait un truc (comme pour l'application destinée à essayer [HTMX avec ASP.NET Core MVC]({% post_url "2021-12-23-utiliser-htmx-avec-asp-net-core-mvc" %}) par exemple).

Je suppose qu'il existe déjà des outils .NET Core ou des extensions Visual Studio tout prêts qui font plus ou moins ça, mais j'ai quand même eu envie de tenter ça à ma façon.


## Une solution --pascompliquée

Après quelques jours, j'ai finalement obtenu une application console qui correspond assez bien à ce que je souhaitais faire et qui accepte 3 commandes :

* `tada model NomEntite ...` pour générer un fichier Models/NomEntite.cs
* `tada enum NomEnum ...` pour générer un fichier Models/NomEnum.cs
* `tada context ...` pour générer un fichier Models/ModelContext.cs

Pourquoi "tada" ? Parce que c'est destiné à générer des fichiers liés au modèle de données. Et que "Donnée" = "Data" => "Da-Ta" => Tada !

Pourquoi "enum" en plus de "model" et "context" ? Parce que généralement mon modèle "Movie" contient une propriété "Rating" de type `Enum`.


## tada --help

Je me suis fait un peu plaisir et quand on lance `tada --help` ou `tada` sans autre paramètre, on tombe sur l'aide du programme.

```
Tada Command-Line Tools (0.0.1)

Utilisation : tada [options] [commande] [arguments]

Options :
  -h|--help                  Affiche l'aide de la ligne de commande
  -p|--project <PROJET>      Nom du projet pour définir le namespace
  --version                  Affiche la version utilisée

Commandes :
  model                      Génère une classe Models/NomEntite.cs
  enum                       Génère une classe Models/NomEnum.cs
  context                    Génère une classe Models/ProjetContext.cs

Pour plus d'informations sur une commande, lancer 'tada [commande] --help'.
```

*Note : Je gère les arguments de la ligne de commande à la main. Comparer les différentes solutions existantes et trouver celle qui (me) convient le plus me semble beaucoup trop de travail par rapport au temps que je souhaite consacrer à ce projet.*

Si jamais la commande est lancée sans préciser l'option "project" ou sans être dans un dossier contenant un fichier "*.csproj", on obtient un message d'erreur.

```
Tada Command-Line Tools (0.0.1)

Projet introuvable :
- L'option --project <PROJET> n'est pas définie
- Il n'existe pas de fichier PROJET.csproj dans le dossier en cours
```

{% include "_adsense.njk" %}


## tada model --help

De la même façon, j'ai pas mal travaillé sur l'aide de la commande `tada model`. Cela m'a permis à la fois de mettre au point mais aussi de documenter la syntaxe particulière qui me sert à décrire le modèle de données en un minimum d'information.

```
Tada Command-Line Tools (0.0.1) - Génère une classe Models/NomEntite.cs

Utilisation : tada model [options] [arguments]

Options :
  -h|--help                  Affiche l'aide de la ligne de commande
  -p|--project <PROJET>      Nom du projet pour définir le namespace
                             (obtenu depuis PROJET.csproj sinon)

Arguments : Nom de l'entité suivi de la description de ses propriétés (sous la forme Nom:{+}Type)

Exemples :
  tada model Genre Genre_ID:int Title:+string(30) --project MvcMovie
  tada model Genre Genre_ID:int Title:+string(30)

Exemple de code généré :
  Movie_ID:int               [Key]       // première propriété avec un nom terminé par "_ID"
                             public int Movie_ID { get; set; }
  Title:+string(60)          [Required]  // le type est précédé par "+"
                             [StringLength(60)]
                             public string Title { get; set; }
  ReleaseDate:DateTime       public DateTime ReleaseDate { get; set; }
  Genre:Genre                public int Genre_ID { get; set; }
                             [ForeignKey("Genre_ID")]
                             public virtual Genre Genre { get; set; }
  Price:decimal(18,2)        [Column(TypeName = "decimal(18, 2)")]
                             public decimal Price { get; set; }
  Rating:+RatingEnum         [Required]
                             public RatingEnum Rating { get; set; }
  Directors:Director[]       public ICollection<Director> Directors { get; set; }
```

C'est un peu compact, mais c'est suffisament clair pour moi. Peut-être parce que c'est encore tout frais dans mon esprit... Pour récapituler (et ne pas oublier), chaque propriété du modèle est décrite sous la forme "Nom:{+}Type"

* La partie "Nom" (avant les deux points) sert à définir le nom de la propriété
* Lorsque les deux points sont suivis d'un "+", cela signifie que la propriété est obligatoire (ce qui correspond au fait d'ajouter une attribut `[Required]`)
* La partie "Type" (après les deux points ou après ":+") indique quel est le type de la propriété
* Certain types de propriété peuvent être complétés par une ou deux valeurs entre parenthèses, pour définir :
  * leur longueur maximum dans le cas des chaines : `string(60)`
  * leur précision dans le cas des nombres : `decimal(18,2)`
* Lorsque le "Nom" et le "Type" sont identiques, cela sert à définir une clé étrangère vers une autre entité
* Lorsque le "Type" est suivi de "[]", cela indique qu'il s'agit d'une propriété de navigation de type collection

Dans le cas d'un modèle simple style `tada model Genre Genre_ID:int Title:+string(30) Movies:Movie[]`, on obtient le code source suivant (à condition de le lancer depuis le dossier du projet "MvcMovie") :

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MvcMovie.Models
{
  public class Genre
  {
    [Key]
    public int Genre_ID { get; set; }

    [Required, StringLength(30)]
    public string Title { get; set; }

    public ICollection<Movie> Movies { get; set; }
  }
}
```

Avec le modèle "Movie" un peu plus compliqué, la commande est un peu plus verbeuse.

```
c:\Code\MvcMovie\MvcMovie> tada model Movie Movie_ID:int Title:+string(60) ReleaseDate:DateTime Genre:Genre Price:decimal(18,2) Rating:+RatingEnum Directors:Director[]
```

Et elle génère une classe avec d'autant plus de code :

```csharp
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MvcMovie.Models
{
  public class Movie
  {
    [Key]
    public int Movie_ID { get; set; }

    [Required, StringLength(60)]
    public string Title { get; set; }

    public DateTime ReleaseDate { get; set; }

    [ForeignKey("Genre_ID")]
    public virtual Genre Genre { get; set; }
    public int Genre_ID { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal Price { get; set; }

    [Required]
    public RatingEnum Rating { get; set; }

    public ICollection<Director> Directors { get; set; }
  }
}
```


## tada enum --help

A tant qu'à faire, autant tout documenter.

```
Tada Command-Line Tools (0.0.1) - Génère une classe Models/NomEnum.cs

Utilisation : tada enum [options] [arguments]

Options :
  -h|--help                  Affiche l'aide de la ligne de commande
  -p|--project <PROJET>      Nom du projet pour définir le namespace
                             (obtenu depuis PROJET.csproj sinon)

Arguments : Nom de l'enum suivi de ses valeurs

Exemples :
  tada enum Rating Enfants Interdit_moins_13_ans Interdit_mineurs Tout_public --project MvcMovie
  tada enum Rating Enfants Interdit_moins_13_ans Interdit_mineurs Tout_public
  tada enum -p MvcFacture Tva Normal Intermédiaire Réduit Particulier Zéro
```

Par exemple, la commande `enum Rating Enfants Interdit_moins_13_ans Interdit_mineurs Tout_public` lancée depuis le dossier du projet "MvcMovie" afficher le code suivant :

```csharp
namespace MvcMovie.Models
{
  public enum Rating
  {
    Enfants,
    Interdit_moins_13_ans,
    Interdit_mineurs,
    Tout_public
  }
}
```


## tada context --help

Là aussi, c'est une syntaxe assez simple.

```
Tada Command-Line Tools (0.0.1) - Génère une classe Models/ProjetContext.cs

Utilisation : tada context [options] [arguments]

Options :
  -h|--help                Affiche l'aide de la ligne de commande
  -p|--project <PROJET>    Nom du projet pour définir le namespace
                           (obtenu depuis PROJET.csproj sinon)

Arguments : Liste des entités du DbContext.

Exemples :
  tada context Movie Genre Director --project MvcMovie
  tada context Movie Genre Director
  tada -p MvcBlog context Blog Post Comment
  tada context -p MvcFacture Client Article Facture Ligne
```

Et donc, la commande `tada context Movie Genre Director` lancée depuis le dossier du projet "MvcMovie" va afficher :

```csharp
using System.Collections.Generic;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace MvcMovie.Models
{
  public class MvcMovieContext : DbContext
  {
    public MvcMovieContext(DbContextOptions<MvcMovieContext> options) : base(options) { }

    public DbSet<Movie> Movies { get; set; }
    public DbSet<Genre> Genres { get; set; }
    public DbSet<Director> Directors { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder) { }
  }
}
```


## Conclusion --àsuivre

Le code source de la première "version" de mon application est disponible sur [GitHub](https://github.com/michelc/Tada). Comme pour l'instant, je suis en phase de mise au point et de tests, les fichiers générés ne sont pas réellement écrits sur le disque, mais seulement affichés à l'écran. Cela fait donc parti des évolutions à venir, avec quelques petits trucs que j'ai en tête pour mettre au propre ou simplifier le code actuel.

Comme un peu paresseusement je ne codais jusqu'à présent que des applications console avec .NET Framework, j'ai découvert au passage que ce n'était pas si évident que ça d'obtenir un "vrai" fichier ".EXE" avec .NET Core. J'ai réussi à trouver comment faire, mais je vais essayer de creuser un peu plus et peut-être bien rédiger un autre billet pour expliquer comment cela fonctionne...

Je compte aussi regarder comment créer un "[.NET Core global tools
](https://docs.microsoft.com/fr-fr/dotnet/core/tools/global-tools)" (pour pouvoir lancer via un `dotnet tada ...`), mais je ne suis pas certain que cela en vaille la peine pour une utilisation personnelle.