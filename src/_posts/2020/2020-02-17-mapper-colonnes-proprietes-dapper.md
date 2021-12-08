---
date: 2020-02-17 21:28:02 +02:00
tags: [ sql, csharp ]
title: "Comment mapper colonnes et propriétés avec Dapper"
cover:
  image: /public/2020/operatrice.jpg
  link: https://fr.wikipedia.org/wiki/Demoiselle_du_téléphone
  text: Demoiselle du téléphone
excerpt: Voyons voir si Dapper permet de mapper les colonnes d'une table avec les propriétés d'une classe un peu comme EF ou Nhibernate ?
---

La semaine dernière, j'ai utilisé [Dapper](https://stackexchange.github.io/Dapper/) plutôt que [NHibernate](https://nhibernate.info/) pour réaliser un traitement simple sur une table de notre base de données Oracle. Comme il s'agit d'une vieille table, les noms des colonnes sont "à l'ancienne" et je ne veux pas me retrouver avec des noms de propriétés tarabiscotés, même si ce n'est que pour une moulinette ponctuelle.

Supposons que la table ait la structure suivante :

```sql
Contact_Clients
---------------
Contact_Cli_ID          Number
Clt_ID                  Number
Contact_Cli_Nom         Varchar2(40)
Contact_Cli_Prenom      Varchar2(40)
Contact_Tel_Fixe        Varchar2(24)
Contact_Cli_Fax         Varchar2(24)
Contact_Cli_Mail        Varchar2(127)
Contact_Portable        Varchar2(24)
...
```

Cela m'oblige à définir la classe C# ci-dessous :

```csharp
public class Contact
{
  public int Contact_Cli_ID { get; set; }
  public int Clt_ID { get; set; }
  public string Contact_Cli_Nom { get; set; }
  public string Contact_Cli_Prenom { get; set; }
  public string Contact_Tel_Fixe { get; set; }
  public string Contact_Cli_Fax { get; set; }
  public string Contact_Cli_Mail { get; set; }
  public string Contact_Portable { get; set; }
}
```

Alors que je voudrais utiliser de plus jolis noms pour ses propriétés :

```csharp
public class Contact
{
  public int Contact_ID { get; set; }
  public int Client_ID { get; set; }
  public string Nom { get; set; }
  public string Prenom { get; set; }
  public string Telephone { get; set; }
  public string Telecopie { get; set; }
  public string Mail { get; set; }
  public string Portable { get; set; }
}
```

Habituellement, j'utilise des alias SQL pour contourner ce problème. Et donc, au lieu de faire un simple `SELECT * FROM Contact_Clients ...`, je me retrouve à écrire :

```csharp
var sql = "SELECT Contact_Cli_ID AS Contact_ID,
                  Clt_ID AS Client_ID,
                  Contact_Cli_Nom AS Nom,
                  Contact_Cli_Prenom AS Prenom,
                  Contact_Tel_Fixe AS Telephone,
                  Contact_Cli_Fax AS Telecopie,
                  Contact_Cli_Mail AS Mail,
                  Contact_Portable AS Portable
           FROM   Contact_Clients
           ...";
```

L'avantage, c'est que je peux me limiter aux colonnes réellement utiles, même si dans ce cas précis presque toutes les colonnes sont nécessaires.

Mais comme cela fait quelques années que j'utilise Dapper, j'ai profité de l'occasion pour voir s'il n'y aurait pas eu des évolutions pour permettre de redéfinir le nom des colonnes.

C'est un sujet un peu sensible et sans doute pas vraiment prioritaire. Il existe cependant une discussion pour réfléchir à la bonne façon de faire ça, par configuration ou via des attributs : [[Column] and [Table] Attributes ](https://github.com/StackExchange/Dapper/issues/722).

En attendant mieux, une question sur Stack Overflow ([Manually map column names with class properties](https://stackoverflow.com/a/34856158)) m'a permis de trouver une solution assez simple à implémenter. Basée sur du code tiré de [Dapper Tests](https://github.com/StackExchange/Dapper/blob/master/Dapper.Tests/TypeHandlerTests.cs) (et donc testée :), elle utilise l'attribut l'attribut `[Description]` de `System.ComponentModel`.

Grâce à cet article, j'ai pu écrire le code suivant :

```csharp
using System.ComponentModel;
...

class Program
{

  static void Main(string[] args)
  {
    var cnx_string = @"Data Source=XXXX;User ID=YYYY;Password=ZZZZ";
    var db = new OracleConnection(cnx_string);
    db.Open();

    var map = new CustomPropertyTypeMap(typeof(Contact), (type, columnName)
      => type.GetProperties().FirstOrDefault(prop => GetDescriptionFromAttribute(prop) == columnName.ToLower()));
    Dapper.SqlMapper.SetTypeMap(typeof(Contact), map);

    var sql = "SELECT * FROM Contact_Clients WHERE Contact_Cli_ID = 1234";
    var c = db.QueryFirst<Contact>(sql);
    Console.WriteLine(c.Nom + " " + c.Prenom);

    db.Close();
    Console.ReadLine();
  }

  static string GetDescriptionFromAttribute(MemberInfo member)
  {
    if (member == null) return null;

    var attrib = (DescriptionAttribute)Attribute.GetCustomAttribute(member, typeof(DescriptionAttribute), false);
    return (attrib?.Description ?? member.Name).ToLower();
  }

}

public class Contact
{
  [Description("Contact_Cli_ID")]
  public int Contact_ID { get; set; }
  [Description("Clt_ID")]
  public int Client_ID { get; set; }
  [Description("Contact_Cli_Nom")]
  public string Nom { get; set; }
  [Description("Contact_Cli_Prenom")]
  public string Prenom { get; set; }
  [Description("Contact_Tel_Fixe")]
  public string Telephone { get; set; }
  [Description("Contact_Portable")]
  public string Portable { get; set; }
  [Description("Contact_Cli_Mail")]
  public string Mail { get; set; }
}
```
À bien y réfléchir, c'est pas sûr que ce soit vraiment plus "propre" que les alias SQL... Mais c'est nouveau !

<div class="encart">

English version: {% goto_en "How to map column names to class properties with Dapper", "2020-02-18-map-columns-properties-dapper" %}.

</div>
