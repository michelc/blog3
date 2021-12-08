---
date: 2008-07-17 11:11:00
layout: post
redirect_from: "post/2008/07/17/Verifier-la-version-du-NET-installee"
tags: .net, code-snippets
title: "Vérifier la version du .NET installée"
---

```
<%@ Page Language="C#" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<script runat="server">
    protected void Page_Load(object sender, EventArgs e)
    {
        lblVersion.Text = System.Environment.Version.ToString();
    }
</script>
<html xmlns="http://www.w3.org/1999/xhtml" >
<head runat="server">
    <title>ASP.NET Version Checker</title>
</head>
<body>
    <form id="form1" runat="server">
    <div>     
        <p>.NET CLR Version: 
        <strong><asp:Label ID="lblVersion" runat="server" /></strong></p>
    </div>
    </form>
</body>
</html>
```
