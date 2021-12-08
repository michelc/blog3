---
date: 2009-06-19 09:27:00
layout: post
redirect_from: "post/2009/06/19/Une-fonction-XSLT-avec-des-parametres"
tags: code-snippets, xml
title: "Une fonction XSLT avec des paramètres"
---

Jusque là, je connaissais déjà les "templates" qui me permettaient
grosso-modo de structurer mes traitements XSLT en séparant en quelque sorte le
"layout" de la page des traitements pour afficher les différents
contenus :

```
<!-- Disposition générale du document -->
...
<fo:table-row height="27mm" margin-top="15mm">
        <fo:table-cell>
                <!-- Logo client -->
                <xsl:call-template name="client-logo" />
        </fo:table-cell>
        <fo:table-cell>
                <!-- Adresse client -->
                <xsl:call-template name="client-adresse" />
        </fo:table-cell>
</fo:table-row>
...
<!-- Affichage du logo du client -->
<xsl:template name="client-logo">
        <fo:block>
                <fo:external-graphic src="url('logo_client.jpg')" />
        </fo:block>
</xsl:template>

<!-- Affichage de l'adresse du client -->
<xsl:template name="client-adresse">
        <fo:block>
                <xsl:value-of select="a:OrganizationName" />
        </fo:block>
        <xsl:for-each select="a:PostalAddress/a:DeliveryAddress/a:AddressLine">
                <fo:block>
                        <xsl:value-of select="." />
                </fo:block>
        </xsl:for-each>   
        <fo:block>
                <xsl:value-of select="a:PostalAddress/a:PostalCode" />
                &#32;<xsl:value-of select="a:PostalAddress/a:Municipality" />
        </fo:block>
</xsl:template>
```

Et hier soir, j'ai appris un nouveau truc. Comme j'avais besoin d'afficher
plusieurs fois des dates, je me suis retrouvé à faire du copier / coller du
morceau de code suivant :

```
<fo:block>
        <xsl:value-of select="concat(substring(a:DocumentInfo/a:DateRange/a:StartDate, 9, 2), 
                                '/', substring(a:DocumentInfo/a:DateRange/a:StartDate, 6, 2),
                                '/', substring(a:DocumentInfo/a:DateRange/a:StartDate, 1, 4))" />
</fo:block>
```

Puis à chaque fois je devais remplacer
"a:DocumentInfo/a:DateRange/a:StartDate" par
"a:DocumentInfo/a:DateRange/a:EndDate" ou
"a:DocumentInfo/a:PartialRange/a:ActualDate" ... Non seulement ce n'était pas
très intéressant à faire, mais c'était surtout la porte ouverte à toutes les
erreurs de frappe ou de copier / coller.

Heureusement pour moi, comme XSLT est quand même bien conçu, il est aussi
possible de définir des templates avec des variables paramètres :

```
<xsl:template name="format-date">
        <xsl:param name="d" select="0" />
        <xsl:value-of select="concat(substring($d, 9, 2), '/', substring($d, 6, 2), '/', substring($d, 1, 4))" />
</xsl:template>
```

Ensuite, on peut appeler cette "fonction" XSLT en lui passant le paramètre
de notre choix :

```
<xsl:call-template name="format-date">
        <xsl:with-param name="d" select="a:DocumentInfo/a:DateRange/a:StartDate" />
</xsl:call-template>
```

C'est vrai que ça ne fait pas économiser beaucoup de saisie, mais c'est
quand même un peu plus clair et beaucoup moins risqué.

D'autres exemples sur l'article [Programmer
avec XSLT](http://www.haypocalc.com/wiki/Programmer_avec_XSLT) de Victor Stinner.
