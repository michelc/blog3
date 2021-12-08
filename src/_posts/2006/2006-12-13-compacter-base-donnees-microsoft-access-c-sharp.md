---
date: 2006-12-13 19:42:00
layout: post
redirect_from: "post/2006/12/13/Compacter-une-base-de-donnees-Microsoft-Access-a-laide-de-C"
tags: code-snippets, csharp
title: "Compacter une base de données Microsoft Access à l'aide de C#"
---

Adaptation de la [KB306287](http://support.microsoft.com/kb/306287/) :

* Ouverture d'une nouvelle application de console C#.
* Dans la fenêtre Explorateur de solutions, cliquez avec le bouton droit sur
le nœud Références, puis sélectionnez Ajouter une référence.
* Dans la boîte de dialogue Ajouter une référence, cliquez sur l'onglet COM,
puis sélectionnez Microsoft Jet and Replication Objects 2.6 Library. Cliquez
sur Sélectionner pour l'ajouter à la liste Composants sélectionnés. Cliquez sur
OK.
* Un avertissement s'affiche si aucun wrapper ne figure dans la bibliothèque
sélectionnée. Cliquez sur Oui pour générer un wrapper. La bibliothèque
Microsoft ActiveX Data Objects (ADODB) et les références JRO s'ajoutent aux
références du projet.
* Dans la fenêtre de l'Explorateur de solutions, cliquez avec le bouton droit
sur Class1.cs, puis cliquez sur Afficher le code.
* Supprimez tout le code de la fenêtre.
* Copiez le code suivant et collez-le dans la fenêtre de code :

```
using System;
using System.IO;

namespace CompactMDB {
  class Class1 {
    [STAThread]
    static void Main(string[] args) {
      // http://support.microsoft.com/kb/306287/
      if (args.Length != 1) {
        Console.WriteLine(@"CompactMDB D:\path\database.mdb");
      } else {
        string dbName = args[0].Trim();
        string dbTemp = dbName + "_pak";
        string provider = "Provider=Microsoft.Jet.OLEDB.4.0;Data Source=";
        try {
          JRO.JetEngine jet = new JRO.JetEngine();
          jet.CompactDatabase(provider + dbName, provider + dbTemp);
        } catch (Exception ex) {
          Console.WriteLine(ex.Message);
          dbName = "";
        }
        if (dbName != "") {
          try {
            FileInfo fi = new FileInfo(dbName);
            string result = dbName + " : " + fi.Length.ToString();
            File.Delete(dbName);
            File.Move(dbTemp, dbName);
            fi.Refresh();
            result += " -> " + fi.Length.ToString();
            Console.WriteLine(result);
          } catch (Exception ex) {
            Console.WriteLine(ex.Message);
          }
        }
      }
    }
  }
}
```

* Régénérez la solution.

Le programme s'exécute ensuite à partir d'une Invite de commande, en tapant
: CompactMDB D:\path\database.mdb.
