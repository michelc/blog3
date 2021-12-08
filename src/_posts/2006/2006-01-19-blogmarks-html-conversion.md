---
date: 2006-01-19 08:18:00
layout: post
redirect_from: "post/2006/01/19/Blogmarks-to-Html-conversion"
tags: code-snippets, html, xml
title: "Blogmarks to Html conversion"
---

Ce fichier permet de transformer le fil atom de Blogmarks (par exemple
http://api.blogmarks.net/user/ms_michel) en code html afin de pouvoir
l'intégrer à une page web.

```
<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" 
        xmlns:atom="http://www.w3.org/2005/Atom" 
        xmlns:xsl="http://www.w3.org/1999/XSL/Transform" 
        xmlns:dc="http://purl.org/dc/elements/1.1/">
  <xsl:output method="html" />
  <xsl:template match="/">
    <xsl:apply-templates select="/atom:feed/atom:head" mode="before" />
    <xsl:apply-templates select="/atom:feed/atom:entry" />
    <xsl:apply-templates select="/atom:feed/atom:head" mode="after" />
  </xsl:template>
  <xsl:template match="atom:feed/atom:head" mode="before" >
    <!-- <h3><xsl:value-of select="atom:title" /></h3> -->
  </xsl:template>
  <xsl:template match="atom:feed/atom:head" mode="after">
    <p><a href="{atom:link[@rel='alternate']/@href}"><img src="http://blogmarks.net/img/88x31_neg.png" alt="blogmarks.net" /></a></p>
  </xsl:template>
  <xsl:template match="atom:feed/atom:entry">
    <div>
      <xsl:choose>
        <xsl:when test="position() mod 2 = 1">
          <xsl:attribute name="class">bm_blogmarks bm_odd</xsl:attribute>
        </xsl:when>
        <xsl:otherwise>
          <xsl:attribute name="class">bm_blogmarks bm_even</xsl:attribute>
        </xsl:otherwise>
      </xsl:choose>
      <a href="{atom:link[@rel='related']/@href}"><img src="{atom:link[@rel='image']/@href}" alt="" /></a>
      <h4><a href="{atom:link[@rel='related']/@href}"><xsl:value-of select="atom:title" /></a></h4>
      <p><xsl:value-of select="atom:summary" disable-output-escaping="yes" /></p>
      <p class="blogmarks-tags">
        <xsl:value-of select="substring(atom:published, 0, 11)" />
        <xsl:if test="atom:category">
          <xsl:for-each select="atom:category">
            <xsl:text> - </xsl:text><a href="{@term}{@sheme}"><xsl:value-of select="@label" /></a>
          </xsl:for-each>
        </xsl:if>
      </p>
    </div>
  </xsl:template>
</xsl:stylesheet>
```

Le code html généré est inspiré par celui de Hot Links. Il peut ensuite être
présenté grâce à la feuille de style CSS suivante :

```
.bm_blogmarks {
  margin: 10px auto;
  padding: 1%;
  background-color: #f5f5f5;
  border: 1px solid #d9d9d9;
  width: 97%;
  overflow:auto;
}
.bm_even {
  background-color: #fcfcfc;
}
.bm_blogmarks h4 {
  margin-top: 0;
}
.bm_blogmarks p.bm_tags {
  margin-bottom: 0;
  display: block;
  clear: left;
}
.bm_blogmarks img {
  margin: 0 0px 5px 10px;
  float: right;
  border: 0;
  clear: none;
  width: 144px;
  height: 107px;
}
.bm_even img {
  margin: 0 10px 5px 0px;
  float: left;
}
```
