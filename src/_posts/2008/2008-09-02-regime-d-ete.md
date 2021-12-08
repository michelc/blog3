---
date: 2008-09-02 11:29:00
layout: post
redirect_from: "post/2008/09/02/Regime-d-ete"
tags: ap, code-killer, xml
title: "Régime XML"
---

Cet été, j'ai eu envie d'un Altrr-Press tout beau, tout propre pour qu'il
soit encore plus simple à utiliser et aussi un peu plus prêt pour le grand jour
du passage sous .Net 2.0 (ou plus) : moins de code = moins de problèmes
lors de la conversion.

Pour commencer, je me suis enfin décidé à supprimer les sources d'un certain
nombre de boites devenues inutiles mais dont les codes sources avaient été
épargnés (voire un peu oubliés) en attendant que tous les sites existant soient
mis à jour.

* FlashFile : insérait une animation flash (remplacé par
IncludeFile)
* Image : insérait une image (remplacé par IncludeFile)
* Redirect : redirige le client vers une autre URL (remplacé par la
macro [%AP.Redirect:url%])
* Sitemap : insérait le plan du site (remplacé par la macro
[%AP.Site.Map%])
* Sitemenu : menu ou sous-menu de navigation (remplacé par la macro
[%AP.Site.Menu:level1-level2%])

Note : si vous connaissez des sites qui ont encore besoin de ces
boites, 20071029_update.sql et 20071030_update.sql sont vos amis.

Pour continuer sur ma lancée, j'ai aussi cherché comment éliminer la
[boite SqlRepeat]({% post_url 2006-01-29-boite-sqlrepeat %})
qui prend le résultat d'une requête sous forme de DataReader pour générer un
tableau HTML à l'aide d'un système de template très primaire.

D'abord, il y a le template d'en-tête :

```
<table class='repertoire'>
```

Puis le template pour le détail des lignes :

```
<tr>
  <td class='col1'>{0}<br /></td>
  <td class='col2'>{1} {3} {2}<br />{4}</td>
  <td class='col3'>Tél:&amp;nbsp; {7}<br />Fax: {8}</td>
</tr>
```

Et pour finir celui pour la fin du tableau :

```
</table>
```

Et côté code, en simplifiant ça donne à peu près ça :

```
StringBuilder html = new StringBuilder();
html.Append(templateHead);
DataReader dr = Data.Base.ExecuteReader(sqlQuery);
while (dr.Read()) {
  html.Append(ToHtmlRow(dr, templateLoop));
}
dr.Close();
html.Append(templateFoot);
```

Pour chaque ligne du DataReader, la fonction ToHtmlRow() génère une ligne en
remplaçant les marqueurs {#} par la colonne correspondante dans la ligne en
cours DataReader.

Le but étant de supprimer une boite, il faut donc trouver par quoi la
remplacer. Le plus simple est de passer par la boite à tout faire RawContent et
d'y coller le tableau HTML final. Etant donné que cette boite n'est utilisée
que sur le site de [Saint-Privat](http://saint-privat.au-quotidien.info/), cela semble une
solution raisonnable. Malgré tout, la boite RawContent est plutôt destinée aux
petits bouts de codes de quelques lignes et là les tableaux HTML dépassent la
toise.

Alors j'ai cherché s'il n'y aurait pas une autre méthode. Et TILT :
XML. Ah ben ZUT alors!

Normalement, je préfère éviter d'utiliser le XML (et surtout le XSLT) parce
que si c'est toujours assez facile quand on commence, on se retrouve vite avec
des sacs de noeuds pour faire trois fois rien. (Ou alors il faut recourir à un
collègue qui parle le XML couramment mais que quand il a fini j'ai pas toujours
compris.) Mais là, l'envie de me débarrasser d'une boite quasiment inutilisée
étant la plus forte, j'ai succombé. Et en fait, ça n'a pas été aussi compliqué
que ce que je craignais.

Un premier bon point, c'est qu'il existe déjà une boite XmlFile qui prend un
fichier XML pour générer du HTML en lui appliquant un fichier XSLT. C'est un
truc qui existe depuis toujours dans IBuySpy et que j'ai adapté dans
Altrr-Press. Dans la pratique, je ne m'en sers presque jamais, sauf de temps en
temps pour afficher des fils [RSS]({% post_url 2006-01-16-rss-html-conversion %}) ou
[Atom]({% post_url 2006-01-16-atom-html-conversion %}) ou
bien des liens enregistrés dans [Blogmarks]({% post_url 2006-01-19-blogmarks-html-conversion %}).

Dans le cas présent, il fallait donc que je me débrouille pour prendre le
résultat de ma requête comme source XML et surtout que je réussisse à créer un
fichier XSLT qui transforme ce résultat en tableau HTML.

Pour la source XML, c'était vraiment trop facile : quelques minutes à
passer dans l'aide et 2 lignes de codes ont suffit (merci le .Net) :

```
DataSet ds = Data.Base.ExecuteDataSet(sqlQuery);
string xml = ds.GetXml();
```

Ce qui donne :

```
<NewDataSet>
  <Table>
    <categories>Electricien</categories>
    <organization>Ets Martin</organization>
    <legalName />
    <givenName />
    <streetAddress>Le Pré-Vert</streetAddress>
    <postalCode>12345</postalCode>
    <placeName>Enville</placeName>
    <workPhone>01 02 03 04 05</workPhone>
    <faxPhone />
  </Table>
  ...
</NewDataSet>
```

Puis en partant de fichiers XSLT existants et après pas mal d'essais et de
messages d'erreurs, j'ai réussi à obtenir un fichier XSLT qui reproduisait le
résultat de mon futur ex-système de template :

```
<xsl:stylesheet version='1.0' xmlns:xsl='http://www.w3.org/1999/XSL/Transform'>
  <xsl:template match="/">
    <table class='repertoire'>
    <xsl:for-each select='NewDataSet/Table'>
      <tr>
        <td class='col1'>
          <xsl:value-of select='categories'/>
          <br />
        </td>
        <td class='col2'>
          <xsl:value-of select='organization'/>
          <xsl:if test="givenName != ''">
            <xsl:if test="organization != ''">
              <xsl:text> - </xsl:text>
            </xsl:if>
            <xsl:value-of select='givenName'/>
            <xsl:text> </xsl:text>
            <xsl:value-of select='legalName'/>
          </xsl:if>
          <br />
          <xsl:value-of select='streetAddress'/>
        </td>
        <td class='col3'>
          Tél: <xsl:value-of select='workPhone'/>
          <br />
          <xsl:if test="faxPhone != ''">Fax: <xsl:value-of select='faxPhone'/></xsl:if>
        </td>
      </tr>
    </xsl:for-each>
    </table>
  </xsl:template>
</xsl:stylesheet>
```

Et même que grâce à l'instruction `<xsl:if test="faxPhone !=
''"> ... </xsl:if>`, le résultat obtenu est encore mieux
que l'original. Si je ne me retenais pas, je passerais tout en XML.

Mais pour l'instant, je vais me contenter de supprimer la boite SqlRepeat et
ses 3 fichiers sources devenus inutiles. C'est toujours ça de pris (et au final
ça fait quand même 6 boites de moins !).
