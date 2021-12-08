---
date: 2004-11-16 09:16:00
layout: post
redirect_from: "post/2004/11/16/Wdevs-Connecting-to-MySQL-or-Access"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) Connecting to MySQL or Access"
---

I make some revisions to the scripts which create tables in order to use
more standard and generic SQL syntax. After several tests, I finally get a
|full
script|http://web.archive.org/web/20041215050806/http://michel.monoforge.com/sources/dbscript.sql.txt]
which almost functions on MySQL and Access.

I have to add a web form to my project to run this script with somes last
improvements specific to the database server.

```
// Get SQL script
string sqlScript = txtScript.Text.Trim();
// Remove comments
Regex oReg;
oReg = new Regex(@"\/\*<a href=\"/s/S\" title=\"\s\S\">\s\S</a>*?\*\/");
sqlScript = oReg.Replace(sqlScript, "");
// Subdivide script based on GO keyword
string<a href=\"\"></a> sqlCommands = Regex.Split(sqlScript, "\
GO;", RegexOptions.IgnoreCase);
// Run script
IDbConnection db = Utils.Data.GetConnection();
db.Open();
string strResults = "<ul>";
foreach (string sqlString in sqlCommands) {
  string sqlExecute = sqlString.Trim();
  if (sqlExecute != "") {
    sqlExecute = sqlExecute.Replace("?", "?");
    if (dbConfig == "Forge") {
      // MySQL on monoForge rejects DEFAULT CHARSET=utf8
      sqlExecute = sqlExecute.Replace(" DEFAULT CHARSET=utf8", "");
    }
    if (dbConfig == "Access") {
      sqlExecute = sqlExecute.Replace("DROP TABLE IF EXISTS ", "DROP TABLE ");
      if (sqlExecute.StartsWith("CREATE TABLE ") == true) {
        sqlExecute = sqlExecute.Replace("AUTO_INCREMENT", "IDENTITY (1, 1)");
        sqlExecute = sqlExecute.Replace("VARCHAR(2000)", "MEMO");
        sqlExecute = sqlExecute.Replace("VARCHAR", "TEXT");
        sqlExecute = sqlExecute.Replace("LONGTEXT", "MEMO");
        sqlExecute = sqlExecute.Replace("INT(5)", "INT");
        sqlExecute = sqlExecute.Replace(" ENGINE=InnoDB", "");
        sqlExecute = sqlExecute.Replace(" DEFAULT CHARSET=utf8", "");
      }
    }
    strResults += "<li>" + sqlExecute;
    int result = Utils.Data.ExecuteNonQuery(sqlExecute, db);
    if (Utils.Data.LastError != "") {
      strResults += "<br /><strong>Error:" + Utils.Data.LastError + "</strong>";
    } else if (Utils.Data.LastWarning != "") {
      strResults += "<br /><em>Warning: " + Utils.Data.LastWarning + "</em>";
    }
    strResults += "</li>";
  }
}
strResults += "</ul>";
db.Close();
```

I have no real problem with classes used to handle various tables. They
manage Access with no updates since they were build to use only very basic SQL
commands. So that remains to confirm when I will start the admin part.

I made some modifications in my sources to select between several connection
string in the web.config:

* CnxString_Local : MySQL database on my desktop when running on
http://localhost/,
* CnxString_Forge : MySQL database on monoForge when running on
http://michel.monoforge.com/,
* CnxString_Local : another MySQL database when running on
http://localhost:8088/ with XSP,
* CnxString_Access : for local tests with Access database.

Now I can build a tiny "portal" which run on Windows or Linux (tested) and
connect to MySQL or Access (at least on my desktop).

Next steps : build more boxes (I already make prototypes this
week-end).
