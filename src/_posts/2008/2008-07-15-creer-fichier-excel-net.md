---
date: 2008-07-15 11:38:00
layout: post
redirect_from: "post/2008/07/15/Creer-un-fichier-Excel-en-NET"
tags: boulot, csharp
title: "Créer un fichier Excel en .NET"
---

Mon voisin de bureau avait la désagréable mission de devoir réaliser une
interface (lui aussi!) pour exporter des données au format Excel. Sinon
y'aurait des têtes qui allaient tomber !

Comme la vie dans un openspace bondé exige une bonne dose de civilité et
pour éviter les éclaboussures j'ai fait comme les autres et j'ai donc essayé de
le sortir de ce mauvais pas.

## Générer de l'Excel

Habituellement, on répond à ce genre de besoin en générant un bête fichier
CSV (en tout cas moi c'est ce que je fais à chaque fois) ou dans les cas les
plus extrêmes certains d'entre nous utilisent la librairie [ExcelXmlWriter](http://www.carlosag.net/Tools/ExcelXmlWriter/Default.aspx)
pour produire un fichier Excel au format XML.

Mais dans le cas présent, il était nécessaire de fournir un authentique
fichier Excel parce que l'application en face s'attendait à lire un "vrai"
format Excel bien binaire comme dans le temps, estampillé "Made in Microsoft"
(pour un programme en PHP c'est d'ailleurs assez rigolo).

Il ne restait donc que 3 solutions possibles :

* installer Excel sur le serveur IIS et y aller à coup d'objets COM :
sur un serveur de prod! ça va pas la tête ?
* trouver une librairie qui sache créer de "vrais" fichiers Excel : et
pourquoi pas avoir à l'acheter en plus ?
* vérifier une fois pour toute si le provider OleDb permet aussi d'écrire
dans un fichier Excel : ah ouaih ça c'est marrant !

## Lire depuis un fichier Excel

Pour commencer, créer vite fait un petit fichier Excel pour se rappeler
comment on fait pour lire ce genre de truc :

* 3 colonnes : Code, Libellé, Date
* 1° ligne : 1, Un, 01/01/2008
* 2° ligne : 2, Deux, 02/02/2008
* 3° ligne : 3, Trois, 03/03/2008

Enregistrer tout ça dans un fichier que l'on nommera Classeur1.xls

Fouiller un peu dans sa mémoire et pas mal sur le disque dur pour retrouver
comment coder un petit programme qui va lire le contenu de ce
fichier :

```
using System;
using System.Data.OleDb;

namespace OleDbExcel {

  class Class1 {

    [STAThread]
    static void Main(string[] args) {

      // Défini la chaine de connexion au fichier Excel
      string cnstr = @"Provider=Microsoft.Jet.OLEDB.4.0;Extended Properties=""Excel 8.0;HDR=YES;""";
      cnstr += @";Data Source=D:\Altrr\OleDbExcel\Classeur1.xls";

      // Connexion au fichier Excel
      OleDbConnection cn = new OleDbConnection(cnstr);
      cn.Open();

      // Affiche le contenu
      OleDbCommand cm = cn.CreateCommand();
      cm.CommandText = "SELECT * FROM [Feuil1$]";
      OleDbDataReader dr = cm.ExecuteReader();
      while (dr.Read() == true) {
        Console.WriteLine("{0} : {1}\t{2}", dr[0], dr[1], dr[2]);
      }
      dr.Close();

      // Ferme la connexion
      cn.Close();

      // Fin du test
      Console.WriteLine();
      Console.Write("(Entrée) pour terminer...");
      Console.ReadLine();

    }
  }
}
```

F5 => ça marche => au suivant!

(une parenthèse pour info : Feuil1 c'est le nom de la 1° feuille dans
le classeur Excel et pour l'utiliser en tant que table il faut ajouter un $ au
bout et mettre le tout entre crochets)

## Ecrire dans un fichier Excel

Et maintenant, le saut dans l'inconnu, à savoir tenter d'écrire dans un
fichier Excel via une connexion OleDb (de l'inédit pour moi) :

```
using System;
using System.Data.OleDb;

namespace OleDbExcel {

  class Class1 {
  [STAThread]

    static void Main(string[] args) {

      // Défini la chaine de connexion au fichier Excel
      string cnstr = @"Provider=Microsoft.Jet.OLEDB.4.0;Extended Properties=""Excel 8.0;HDR=YES;""";
      cnstr += @";Data Source=D:\Altrr\OleDbExcel\Classeur1.xls";

      // Connexion au fichier Excel
      OleDbConnection cn = new OleDbConnection(cnstr);
      cn.Open();

      // Création d'un objet OleDbCommand
      OleDbCommand cm = cn.CreateCommand();

      // Insère une 4° ligne dans le fichier Excel
      cm.CommandText = "INSERT INTO [Feuil1$] ([Code], [Libellé], [Date]) VALUES (4, 'Quatre', '04/04/2008')";
      cm.ExecuteNonQuery();

      // Insère une 5° ligne dans le fichier Excel
      cm.CommandText = "INSERT INTO [Feuil1$] ([Code], [Libellé], [Date]) VALUES (5, 'Cinq', '05/05/2008')";
      cm.ExecuteNonQuery();

      // Affiche le contenu
      cm.CommandText = "SELECT * FROM [Feuil1$]";
      OleDbDataReader dr = cm.ExecuteReader();
      while (dr.Read() == true) {
        Console.WriteLine("{0} : {1}\t{2}", dr[0], dr[1], dr[2]);
      }
      dr.Close();

      // Ferme la connexion
      cn.Close();

      // Fin du test
      Console.WriteLine();
      Console.Write("(Entrée) pour terminer...");
      Console.ReadLine();
    }
  }
}
```

F5 => ça marche aussi !

On tente la même chose sur le serveur (de prod ! quand y'a des têtes en
jeux on a vraiment plus peur de rien) et ça marche encore !!!

## Que demander de plus ?

On peut même utiliser des paramètres au lieu de commandes SQL en "dur"

```
using System;
using System.Data.OleDb;

namespace OleDbExcel {

  class Class1 {

    [STAThread]
    static void Main(string[] args) {

      // Défini la chaine de connexion au fichier Excel
      string cnstr = @"Provider=Microsoft.Jet.OLEDB.4.0;Extended Properties=""Excel 8.0;HDR=YES;""";
      cnstr += @";Data Source=D:\Altrr\OleDbExcel\Classeur1.xls";

      // Connexion au fichier Excel
      OleDbConnection cn = new OleDbConnection(cnstr);
      cn.Open();

      // Création d'un objet OleDbCommand
      OleDbCommand cm = cn.CreateCommand();

      // Insère une 6° ligne dans le fichier Excel
      cm.CommandText = "INSERT INTO [Feuil1$] ([Code], [Libellé], [Date]) VALUES (@Code, @Libelle, @Date)";
      cm.Parameters.Add("@Code", 6);
      cm.Parameters.Add("@Libelle", "Six");
      cm.Parameters.Add("@Date", new DateTime(2008, 6, 6));
      cm.ExecuteNonQuery();

      // Affiche le contenu
      cm.CommandText = "SELECT * FROM [Feuil1$]";
      OleDbDataReader dr = cm.ExecuteReader();
      while (dr.Read() == true) {
        Console.WriteLine("{0} : {1}\t{2}", dr[0], dr[1], dr[2]);
      }
      dr.Close();

      // Ferme la connexion
      cn.Close();

      // Fin du test
      Console.WriteLine();
      Console.Write("(Entrée) pour terminer...");
      Console.ReadLine();
    }
  }
}
```

On ne peut pas faire un `DELETE FROM [Feuil1$]` pour vider le
fichier avant d'y insérer de nouvelles données : pas très utile donc pas
très grave.

Ce qui est un peu plus embêtant, c'est qu'il ne semble pas possible de
partir d'un fichier Excel vide et d'y "créer" dynamiquement les colonnes que
l'on veut :

* Faire un 1° "`INSERT INTO [Feuil1$] ([Code], [Caption], [Date]) VALUES
('Code', 'Libellé', 'Date')`" plante
* Commencer par un "`CREATE TABLE [Feuil1$] ...`" plante
aussi

## Fin de la récréation

C'est ennuyeux, mais comme cela n'a strictement aucune importante dans le
cas qui nous occupait au départ, on ne va pas y passer plus que la pause de
midi.

## Post-Scriptum

Super astuce : même si on ne peut pas créer un fichier Excel
directement, on peut :

* Passer par une base de données Access (elle aussi accessible via le
provider "Microsoft.Jet.OLEDB.4.0")
* Y créer une table avec les colonnes souhaitées
* Exporter cette table vers Excel par un `SELECT   - INTO...`

```
static void Main(string[] args) {

  // Défini la chaine de connexion au fichier Access
  string mdb = @"D:\Altrr\OleDbExcel\Bd1.mdb";
  string cnstr = @"Provider=Microsoft.Jet.OLEDB.4.0;Data Source=" + mdb;

  // Connexion au fichier Access
  OleDbConnection cn = new OleDbConnection(cnstr);
  cn.Open();

  // Création d'un objet OleDbCommand
  OleDbCommand cm = cn.CreateCommand();

  // Insère une 1° ligne dans le fichier Excel
  cm.CommandText = "CREATE TABLE [Feuil1] ([Code] INT, [Libellé] TEXT(20), [Notes] TEXT(100), [Montant] DOUBLE, [Date] DATETIME)";
  cm.ExecuteNonQuery();

  // Insère une 1° ligne dans le fichier Excel
  cm.CommandText = "INSERT INTO [Feuil1] ([Code], [Libellé], [Notes], [Montant], [Date]) VALUES (1, 'Un', 'Premier', 1.1, '01/01/2008')";
  cm.ExecuteNonQuery();

  // Insère une 2° ligne dans le fichier Excel
  cm.CommandText = "INSERT INTO [Feuil1] ([Code], [Libellé], [Notes], [Montant], [Date]) VALUES (2, 'Deux', 'Deuxième', 2.2, '02/02/2008')";
  cm.ExecuteNonQuery();

  // Insère 5 nouvelles lines
  cm.CommandText = "INSERT INTO [Feuil1] ([Code], [Libellé], [Notes], [Montant], [Date]) VALUES (@Code, @Libelle, @Note, @Montant, @Date)";
  for (int i = 3; i < 8; i++) {
    DateTime d = DateTime.Now.Date.AddDays(i);
    cm.Parameters.Add("@Code", i);
    cm.Parameters.Add("@Libelle", d.ToString("dddd"));
    cm.Parameters.Add("@Note", d.ToLongDateString());
    cm.Parameters.Add("@Montant", (double) 1.1 * i);
    cm.Parameters.Add("@Date", d);
    cm.ExecuteNonQuery();
    cm.Parameters.Clear();
  }

  // Affiche le contenu
  cm.CommandText = "SELECT * FROM [Feuil1]";
  OleDbDataReader dr = cm.ExecuteReader();
  while (dr.Read() == true) {
    Console.WriteLine("{0} : {1}\t{2}\t{3}\t{4}", dr[0], dr[1], dr[2], dr[3], dr[4]);
  }
  dr.Close();

  // Un peu de Magie
  string xls = @"D:\Altrr\OleDbExcel\Test1.xls";
  cm.CommandText = "SELECT * INTO [Excel 8.0;Database=" + xls + "].[Sheet1] FROM [Feuil1]";
  cm.ExecuteNonQuery();

  // Ferme la connexion
  cn.Close();

  // Fin du test
  Console.Write(" pour terminer...");
  Console.ReadLine();
}
```
