---
date: 2006-01-24 13:13:00
layout: post
redirect_from: "post/2006/01/24/HTTP-301-Moved-Permanently"
tags: .net, code-snippets, referencement
title: "HTTP 301 - Moved Permanently"
---

```
<script runat="server">
private void Page_Load(object sender, System.EventArgs e) {
  Response.Status = "301 Moved Permanently";
  Response.AddHeader("Location", "http://www.new-url.com");
}
</script>
```
