---
date: 2020-02-04 12:21:18+200
layout: post
tags: sql
title: "Optimize multiple INSERTs (for Oracle)"
image: "/public/2020/pumpkin-patch.jpg"
---

In order to check the integrity of some data, I had to copy the contents of a large customer table from a DB2 database into an Oracle database. I know SQL*Loader exists, but this is not the time I'm gonna learn how to use it.

<figure>
  <img src="{{ page.image }}" alt="pumpkins" />
  <figcaption>
    <a href="https://unsplash.com/photos/svIdk6Ai94w">Rusty old truck in a pumpkin patch - Priscilla Du Preez</a>
  </figcaption>
</figure>


## One INSERT command for each row to process

To begin with, I made tests with a subset of the data and tried to make it as simple as possible. So simple that I generated and executed one INSERT query per row to be inserted.

```sql
INSERT INTO MyTable (Column1, Column2, Column3) VALUES ('One_1', 'Two_1', 'Three_1');
then
INSERT INTO MyTable (Column1, Column2, Column3) VALUES ('One_2', 'Two_2', 'Three_2');
then
INSERT INTO MyTable (Column1, Column2, Column3) VALUES ('One_3', 'Two_3', 'Three_3');
etc...
```

=> 12.07 seconds to insert 4579 lines (i.e. 379 requests per second).


## INSERT commands inside one BEGIN / END

Rather than making a `connection.Execute()` for each line, I grouped the INSERT commands into a BEGIN ... INSERT expression (a bit like a stored procedure) so as to hit the server for only one `connection.Execute()`.


```sql
BEGIN
  INSERT INTO MyTable (Column1, Column2, Column3) VALUES ('One_1', 'Two_1', 'Three_1');
  INSERT INTO MyTable (Column1, Column2, Column3) VALUES ('One_2', 'Two_2', 'Three_2');
  INSERT INTO MyTable (Column1, Column2, Column3) VALUES ('One_3', 'Two_3', 'Three_3');
  etc...
END;
```

=> 6.37 seconds to insert 4579 lines => already twice as fast.

Note: with [Dapper](https://stackexchange.github.io/Dapper/) (and ADO.NET in general I suppose), Oracle doesn't support line breaks in the SQL command: I get an error `@@PLS-00103: Encountered the symbol "" when expecting one of the following@`.

To avoid this problem, just don't add a line break when generating the big query :

```sql
BEGIN INSERT INTO MyTable (...) VALUES (...); INTO MyTable (...) VALUES (...); ...; END;
```

## An INSERT command from several SELECTs

This time, instead of making 1 access to the server to still make several INSERTs, I optimized even more by sending a single INSERT request. To do this, I turned "INSERT ... VALUES ..." into "INSERT ... SELECT FROM ..." :)

```sql
INSERT INTO MyTable (Column1, Column2, Column3)
SELECT ('One_1', 'Two_1', 'Three_1') FROM DUAL
UNION SELECT ('One_2', 'Two_2', 'Three_2') FROM DUAL
UNION SELECT ('One_3', 'Two_3', 'Three_3') FROM DUAL
etc...
```

=> 2.84 seconds to insert 4579 lines (i.e. 1612 requests per second) => 4 times faster.


## Test results

![](/public/2012/tests-vitesse-insert.png)

It was useful to run a few tests, since it allows to go from 379 inserts in one second to more than 1600! And as I have nearly 300,000 lines to process, it will take 3 minutes and not 15 minutes.


## Implementation

Actually, I copy the entire data with block of 500 customers to avoid overloading memory:

```c#
public int SaveCustomers(IEnumerable<Customer> customers)
{
    var sql = @"UNION SELECT '{0}', '{1}', '{2}', '{3}', '{4}' FROM DUAL ";

    int count = 0;
    try
    {
        connexion.Open();
        var batch = new StringBuilder();
        foreach (var c in customers)
        {
            batch.Append(string.Format(sql, c.Agency, c.Code, c.Siret, c.Type));
            count++;
            if ((count % 500) == 0)
            {
                connexion.Execute(Sql_FromSelect(batch));
                batch = new StringBuilder();
            }
        }
        connexion.Execute(Sql_FromSelect(batch));
    }
    catch (Exception ex)
    {
        throw ex;
    }
    finally
    {
        connexion.Close();
    }

    return count;
}

private string Sql_FromSelect(StringBuilder batch)
{
    // Au départ :
    // "UNION SELECT '...', '...', '...', '...', '...' FROM DUAL UNION SELECT ... "

    batch.Remove(0, 5);
    // => " SELECT '...', '...', '...', '...', '...' FROM DUAL UNION SELECT ... "

    var start = @"BEGIN INSERT INTO Customers (Agency, Code, Siret, Type) ";
    batch.Insert(0, start);
    // => "BEGIN INSERT INTO Customers (...) SELECT '...', '...', ... "

    batch.Append("; END;");
    // => "BEGIN INSERT INTO Customers (...) SELECT ... FROM DUAL; END;"

    return batch.ToString();
}
```

{:.encart}
Version en français : [Optimiser les INSERT multiples (dans Oracle)]({% post_url 2012-03-08-optimiser-insert-multiples-oracle %}){:hreflang="fr"}.
