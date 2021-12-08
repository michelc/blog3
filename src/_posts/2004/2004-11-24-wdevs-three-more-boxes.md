---
date: 2004-11-24 08:47:00
layout: post
redirect_from: "post/2004/11/24/Wdevs-Three-more-boxes"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) Three more boxes"
---

The Documents box has nothing special. It uses the same DataGrid method than
the Contacts box (including the override method). This box will be more
interesting when I'll work on back-office part and have to store files in a
MySQL database. Amazingly, `DataFormatString="{0:d}"` don't work with the MySQL
table but is ok with the Access one. I'll see this later...

For my Announcements box, I choose to group two modules from IBuySpy:
announcements and events.

```
CREATE TABLE qc_Announcements (
    idAnnouncement INT AUTO_INCREMENT NOT NULL,
    idBox VARCHAR(20) NOT NULL,
    title VARCHAR(100) NOT NULL,
    summary VARCHAR(255) NOT NULL,
    content VARCHAR(2000) NOT NULL,
    link VARCHAR(255) NOT NULL,
    author VARCHAR(50) NOT NULL,
    published DATETIME,
    expired DATETIME,
    CONSTRAINT PK_qc_Announcements PRIMARY KEY (idAnnouncement)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

The "summary" field can be use as a subtitle or for location, like the
"WhereWhen" field in the Events table for IBuySpy.

Concerning the presentation layer, I don't use a DataGrid as announcements
or events are more successive information block than tabular data. So I render
each record in a div structure:

```
<div class="entry">
  <h4> ... title ... </h4>
  <p class="summary"> ... summary ... </p>
  <div class="content"> ... content ... </p>
  <p class="link"> ... link ... </p>
  <p class="foot">
    <span class="published"> ... published ... </span>
    <span class="author"> ... author ... </span>
  </p>
</div>
```

With the CSS part, I can position each field as I want: the "read more" link
can appear after the publishing date and the author name.

My third box is the classic Xml/Xsl module from IBuySpy. For that, I have to
create a qc_BoxSettings table to handle general settings of the boxes, like the
ModuleSettings table does in IBuySpy.

```
CREATE TABLE qc_BoxSettings (
    idBox VARCHAR(20) NOT NULL,
    itemKey VARCHAR(50) NOT NULL,
    itemValue VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

Then I use this table to store paths to the xml and xsl files. And a
BoxSettings class to handle this new table and retrieve the two properties.

```
private void Page_Load(object sender, System.EventArgs e) {
  string srcXml = this.box.boxSettings["srcXml"];
  if (srcXml != "") {
    if (File.Exists(Server.MapPath(srcXml)) == true) {
      boxXml.DocumentSource = srcXml;
      string srcXslt = this.box.boxSettings["srcXslt"];
      if (srcXslt != "") {
        boxXml.TransformSource = srcXslt;
      }
    } else {
      srcXml = "";
    }
  }
}
```

In the future, may be I will update the Image box to use the qc_BoxSettings
table like in IBuySpy, rather than a specific qc_Images table.

Unfortunately, I don't know exactly what I did, but my dll doesntt function
any more on [monoForge](http://web.archive.org/web/20041215050806/http://www.monoforge.com/).
