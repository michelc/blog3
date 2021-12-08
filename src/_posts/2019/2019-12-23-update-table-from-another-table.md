---
date: 2019-12-23 14:36:42+200
layout: post
tags: sql
lang: en
title: "Updating a table from another table"
image: "/public/2019/sql-database.jpg"
---

{:.encart}
It's the end of the year, so I'm just going to translate an old post from 2007
that I still refer to once in a while : [Mise à jour d'une table à partir d'une
autre]({% post_url 2007-05-30-mise-a-jour-table-partir-autre %}){:hreflang="fr"}.

<figure>
  <img src="{{ page.image }}" alt="sql-database" />
  <figcaption>
    <a href="https://dbdiagram.io/">dbdiagram.io</a>
  </figcaption>
</figure>

To update a column in a table from the equivalent column of another table, MS
Access easily accepts two table names for the UPDATE command, but not SQL
Server.

Example: after updating the VAT rates in the products table, you have to copy
these revisions in the invoice details table.

With Access:

```sql
UPDATE InvoiceDetails, Products
SET    InvoiceDetails.VatRate = Products.VatRate
WHERE  InvoiceDetails.Product_ID = Products.Product_ID
```

With SQL Server:

```sql
UPDATE InvoiceDetails
SET    InvoiceDetails.VatRate = Products.VatRate
FROM   InvoiceDetails
INNER JOIN Products ON Products.Product_ID = InvoiceDetails.Product_ID
```

With Oracle:

```sql
UPDATE InvoiceDetails
SET    InvoiceDetails.VatRate = (SELECT Products.VatRate
                                 FROM   Products
                                 WHERE  Products.Product_ID = InvoiceDetails.Product_ID)
```
