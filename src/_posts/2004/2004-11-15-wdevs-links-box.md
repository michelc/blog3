---
date: 2004-11-15 17:30:00
layout: post
redirect_from: "post/2004/11/15/Wdevs-A-links-box"
tags: qc, wdevs
lang: en-US
title: "(Wdevs) A links box"
---

This time, I test a box which will contain a list of items. In fact, as I
currently don't work on the backoffice programming, there isn't so much
differences with htmltext or image box which display a single item.

So the only difference really occurs in the web control where I can't use a
simple PlaceHolder to display the content. Of course I don't put a DataList
like IBuySpy does, as I don't want to rely on html tables to ensure
visualization.

Rather I have to use a Repeater in the server side and again
`<ul>` and `<li>` tags to produce the list
effect and information on the client side.

```
<%@ Control Language="c#" AutoEventWireup="false" Codebehind="listLinks.ascx.cs" Inherits="qc.Classic.Links.listLinks" TargetSchema="http://schemas.microsoft.com/intellisense/ie5" %>
<ul>
 <asp:repeater ID="boxRepeater" EnableViewState="False" runat="server"><ItemTemplate><li>
   <% if (this.box.paneName != "paneMain") { %>
   <a href='<%# DataBinder.Eval(Container.DataItem, "url") %>' title='<%# DataBinder.Eval(Container.DataItem, "description") %>'><%# DataBinder.Eval(Container.DataItem, "title") %></a>
   <% } else { %>
   <a href='<%# DataBinder.Eval(Container.DataItem, "url") %>'><%# DataBinder.Eval(Container.DataItem, "title") %></a>
   <p><%# DataBinder.Eval(Container.DataItem, "description") %></p>
   <% }%>
 </li></ItemTemplate></asp:repeater>
</ul>
```

Note: I'm using the `<% if (this.box.paneName !=
"paneMain") { %>` to decide wether to display complete links with
descriptions or short links where description appears as a tooltip.

As there isn't so much work to produce this [
links box](http://web.archive.org/web/20041215050806/http://michel.monoforge.com/default.aspx?idScreen=links), I make some efforts with regard to the presentation. It's more
to show one can build an IBuySpy clone which uses CSS styles (including
[bullets](http://www.stylegala.com/features/bulletmadness/)) than to
present my web design skills.
