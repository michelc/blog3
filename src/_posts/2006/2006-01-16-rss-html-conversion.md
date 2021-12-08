---
date: 2006-01-16 15:03:00
layout: post
redirect_from: "post/2006/01/16/RSS-to-Html-conversion"
tags: code-snippets, html, xml
title: "RSS to Html conversion"
---

Ce fichier permet de transformer un fil RSS (version 0.9x ou 2.0) en code
html afin de pouvoir l'intégrer à une page web.

```
<?xml version="1.0"?>
<xsl:stylesheet version="1.0"
 xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
 xmlns:wfw="http://wellformedweb.org/CommentAPI/">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <xsl:apply-templates select="/rss/channel"/>
    </xsl:template>
    <xsl:template match="/rss/channel">
        <h3><xsl:value-of select="title"/></h3>
        <p><xsl:value-of select="description"/></p>
        <ul>
            <xsl:apply-templates select="item"/>
        </ul>
    </xsl:template>
    <xsl:template match="/rss/channel/item">
        <li>
            <a href="{link}" title="{substring(pubDate, 0, 11)}"><xsl:value-of select="title"/></a>
            <p><xsl:value-of select="description" disable-output-escaping="yes" /></p>
        </li>
    </xsl:template>
</xsl:stylesheet>
```
