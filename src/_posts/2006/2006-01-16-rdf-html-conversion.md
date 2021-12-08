---
date: 2006-01-16 15:04:00
layout: post
redirect_from: "post/2006/01/16/RDF-to-Html-conversion"
tags: code-snippets, html, xml
title: "RDF to Html conversion"
---

Ce fichier permet de transformer un fil RDF en code html afin de pouvoir
l'intégrer à une page web.

```
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
  xmlns:dc="http://purl.org/dc/elements/1.1/"
  xmlns:foo="http://purl.org/rss/1.0/">
    <xsl:output method="html"/>
    <xsl:template match="/">
        <xsl:apply-templates select="/rdf:RDF/foo:channel"/>
    </xsl:template>
    <xsl:template match="/rdf:RDF/foo:channel">
        <h3><xsl:value-of select="foo:title"/></h3>
        <p><xsl:value-of select="foo:description"/></p>
        <ul>
            <xsl:apply-templates select="/rdf:RDF/foo:item"/>
        </ul>
    </xsl:template>
    <xsl:template match="/rdf:RDF/foo:item">
        <li>
            <a href="{foo:link}" title="{substring(dc:date, 0, 11)}"><xsl:value-of select="foo:title"/></a>
            <p><xsl:value-of select="foo:description" disable-output-escaping="yes" /></p>
        </li>
    </xsl:template>
</xsl:stylesheet>
```
