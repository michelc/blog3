---
date: 2004-11-22 11:59:00
layout: post
redirect_from: "post/2004/11/22/Wdevs-A-DataGrid-for-my-Contacts-box"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) A DataGrid for my Contacts box"
---

Again, this new module is intended to be a very simple one. I will work
later on a more sophisticated contact module, based on the vcard datas. As with
the Links box, the Contacts box will contain a list of items. Consequently, the
majority of its code can be write with copy and paste.

The SQL database table has an AUTO_INCREMENT / IDENTITY id, like in the
qc_Links table.

```
CREATE TABLE qc_Contacts (
    idContact int AUTO_INCREMENT NOT NULL,
    idBox VARCHAR(20) NOT NULL,
    name VARCHAR(50) NOT NULL,
    role VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    phone1 VARCHAR(50),
    phone2 VARCHAR(50),
    CONSTRAINT PK_qc_Contacts PRIMARY KEY (idContact)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
```

In the Links box, I had been able to avoid DataGrid because I wanted to
render a semantic list with ul and li tags. But in this case, I really need an
html table tag to render the content as records. So my ascx uses a
DataGrid.

```
<%@ Control Language="c#" AutoEventWireup="false" Codebehind="listContacts.ascx.cs" Inherits="qc.Classic.Contacts.listContacts" TargetSchema="http://schemas.microsoft.com/intellisense/ie5"%>
<asp:datagrid
  id="boxDatagrid"
  AutoGenerateColumns="false"
  EnableViewState="false"
  CssClass="dg_table"
  ItemStyle-CssClass="dg_odd"
  AlternatingItemStyle-CssClass="dg_even"
  HeaderStyle-CssClass="dg_header"
  runat="server">
  <Columns>
    <asp:BoundColumn HeaderText="Name" DataField="name" />
    <asp:BoundColumn HeaderText="Role" DataField="role" DataFormatString="{0:d}" />
    <asp:HyperLinkColumn HeaderText="Email" DataTextField="email" DataNavigateUrlField="email" DataNavigateUrlFormatString="mailto:{0}" />
    <asp:BoundColumn HeaderText="Phone 1" DataField="phone1" DataFormatString="{0:N0}" />
    <asp:BoundColumn HeaderText="Phone 2" DataField="phone2" DataFormatString="{0:N0}" />
  </Columns>
</asp:datagrid>
```

There is nothing extraordinary compared to the IBuySpy version, except that
at least all presentations informations are based on css styles rather than
in-asp.net attributes. Yet, ASP.NET adds specials html attributes.

* with FireFox : `<table class="dg_table" cellspacing="0" rules="all"
border="1" id="_ctl0_boxDatagrid">`
* with IE6 : `<table class="dg_table" cellspacing="0" rules="all"
border="1" id="_ctl0_boxDatagrid" style="border-collapse:collapse;">`

And of course, this stupid datagrid control don't accept `CellSpacing=""` or
don't remove html attributes when I add `rules=""`, `border=""`, `BorderStyle="None"`
or `style=""`.

However, I succeeded in defining a pretty css style for my table, but it
depends on the fact that I add a CellSpacing="2" attribute for the DataGrid
control server. So I try another way to remove useless attributes by overriding
the Render method.

```
protected override void Render(HtmlTextWriter writer) {
  StringBuilder stringBuilder = new StringBuilder();
  StringWriter stringWriter = new StringWriter(stringBuilder);
  HtmlTextWriter htmlWriter = new HtmlTextWriter(stringWriter);
  base.Render(htmlWriter);
  string html = stringBuilder.ToString();
  html = html.Replace(" cellspacing=\"0\"", "");
  html = html.Replace(" rules=\"all\"", "");
  html = html.Replace(" border=\"1\"", "");
  html = html.Replace(" style=\"border-collapse:collapse;\"", "");
  writer.Write(html);
}
```

In order to explore all the possible solutions, I made another attempt with
a simple Repeater. This method avoids the override hack and allows a more
semantical html table, which uses thead, tbody and th tags. It's less practical
to implement, but it's a better method if I choose to build a [pure CSS scrollable table
with fixed header](http://www.imaputz.com/cssStuff/bigFourVersion.html).

And for the fun, I highlight the table row where mouse is over with the
:hover property for Firefox or a [
very old htc](http://msdn.microsoft.com/library/default.asp?url=/library/en-us/dndude/html/dude07232001.asp) for IE.

I will try to put on line this evening with some other modules of the
week-end.
