---
date: 2006-01-16 14:59:00 +02:00
redirect_from: "post/2006/01/16/Atom-to-Html-conversion"
tags: [ code-snippets, html, xml ]
title: "Atom to Html conversion"
---

Ce fichier permet de transformer un fil atom en code html afin de pouvoir
l'intégrer à une page web.

```
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:dc="http://purl.org/dc/elements/1.1/">
    <xsl:output method="html"/>
    <xsl:template match="/">
    <xsl:apply-templates select="/atom:feed/atom:head"/>
        <xsl:apply-templates select="/atom:feed"/>
    </xsl:template>
    <xsl:template match="atom:feed/atom:head">
        <h3><xsl:value-of select="atom:title"/></h3>
        <xsl:if test="atom:tagline"><p><xsl:value-of select="atom:tagline"/></p></xsl:if>
        <xsl:if test="atom:subtitle"><p><xsl:value-of select="atom:subtitle"/></p></xsl:if>
    </xsl:template>
    <xsl:template match="/atom:feed">
        <h3><xsl:value-of select="atom:title"/></h3>
        <xsl:if test="atom:tagline"><p><xsl:value-of select="atom:tagline"/></p></xsl:if>
        <xsl:if test="atom:subtitle"><p><xsl:value-of select="atom:subtitle"/></p></xsl:if>
        <ul>
            <xsl:apply-templates select="atom:entry"/>
        </ul>
    </xsl:template>
    <xsl:template match="atom:entry">
        <li>
            <a href="{atom:link[@rel='related']/@href}" title="{substring(atom:published, 0, 11)}"><xsl:value-of select="atom:title"/></a>
            <xsl:choose>
                <xsl:when test="atom:content != ''">
                    <p><xsl:value-of select="atom:content" disable-output-escaping="yes" /></p>
                </xsl:when>
                <xsl:otherwise>
                    <p><xsl:value-of select="atom:summary" disable-output-escaping="yes" /></p>
                </xsl:otherwise>
            </xsl:choose>
        </li>
    </xsl:template>
</xsl:stylesheet>
```
