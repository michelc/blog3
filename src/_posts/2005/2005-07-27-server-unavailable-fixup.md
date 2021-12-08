---
date: 2005-07-27 17:25:00
layout: post
redirect_from: "post/2005/07/27/Server-unavailable-fixup"
tags: code-snippets
title: "Server unavailable fixup"
---

Quand IIS fait boum! (généralement lorsqu'on a tué le processus
aspnet_wp.exe alors qu'on était en plein débugage), y'a plus qu'à :

```
REM This batch file addresses "Server unavailable" error
@echo off

REM "Changing to the Framework install directory"
cd /d C:\WINDOWS\Microsoft.NET\Framework\v1.1.4322

echo "Stopping IIS"
iisreset /stop
echo "———————-"

echo "Stopping the ASP.NET state service if it is running"
net stop aspnet_state
echo "———————-"

echo "Re-registering ASP.NET"
aspnet_regiis -i
echo "———————-"

echo "Restarting IIS"
iisreset /start
echo "———————-"
```

(Publié à l'origine sur )
