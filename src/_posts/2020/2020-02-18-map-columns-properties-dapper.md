---
date: 2020-02-18 19:12:28+200
layout: post
tags: sql, csharp
title: "How to map column names to class properties with Dapper"
image: "/public/2020/operatrice.jpg"
---

Last week, I used [Dapper](https://stackexchange.github.io/Dapper/) instead of [NHibernate](https://nhibernate.info/) to perform a simple processing on a table in our Oracle database. Since this is an ancient table, the column names are "old-fashioned" and I don't want to end up with overly convoluted property names, even if it's only for a one-shot process.

<figure>
  <img src="{{ page.image }}" alt="operatrice" />
  <figcaption>
    <a href="https://en.wikipedia.org/wiki/Switchboard_operator">Demoiselle du téléphone</a>
  </figcaption>
</figure>

Let's say my table has the following structure:

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

I have to define the C# class below:

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

But I'd prefer to use pretty names for its properties:

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

Usually I go with SQL aliases to work around this problem. So, instead of doing a regular `SELECT * FROM Contact_Clients ...`, I end up writing:

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

Pro: I can limit my code to only useful columns, although in this case almost all columns are necessary.

Con: I've been using Dapper for a few years now, it's time to search for some improvments to redefine the names of the columns.

It's a bit of a sensitive subject and probably not really a priority. However, there is a discussion about the right way to do this, by configuration or with attributes: [[Column] and [Table] Attributes ](https://github.com/StackExchange/Dapper/issues/722).

In the meantime, a Stack Overflow question ([Manually map column names with class properties](https://stackoverflow.com/a/34856158)) allowed me to find a quite simple solution to implement. Taken from the [Dapper Tests](https://github.com/StackExchange/Dapper/blob/master/Dapper.Tests/TypeHandlerTests.cs) code (and thus tested :), it uses the `[Description]` attribute from `System.ComponentModel`.

Thanks to this article, I can write the following code:

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

Thinking about it, I'm not sure it's more elegant than SQL aliases... But new!

{:.encart}
Version en français : [Comment mapper colonnes et propriétés avec Dapper]({% post_url 2020-02-17-mapper-colonnes-proprietes-dapper %}){:hreflang="fr"}.
