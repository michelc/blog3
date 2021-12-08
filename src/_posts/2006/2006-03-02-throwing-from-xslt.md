---
date: 2006-03-02 07:27:00
layout: post
redirect_from: "post/2006/03/02/Throwing-from-XSLT"
tags: code-snippets, xml
lang: en-US
title: "Throwing from XSLT"
---

Vu sur
http://weblogs.asp.net/george_v_reilly/archive/2006/03/01/439402.aspx

> I (George V. Reilly, not me) needed to add some declarative error checking
> to some XSLT templates recently. Specifically, I wanted to throw an error if my
> selects yielded an empty string, indicating that the input XML was wrong.
>
> Unfortunately, there seems to be no easy way of doing this in XSLT, nor in
> XslTransform. The approved way is to validate against an XSD schema, but for
> various reasons, I didn't want to go to the hassle of creating one.
>
> I found a partial solution using xsl:message with the terminate="yes"
> attribute. Under XslTransform.Transform() the following code throws an
> exception if the XPath expression is empty.

```
<xsl:if test="not(/some/xpath/expression)">
     <xsl:message terminate="yes">Missing expression</xsl:message>
</xsl:if>
<xsl:value-of select="/some/xpath/expression" />
```

> It doesn't do anything, however, in XMLSpy.
>
> The downside, of course, is that you have to maintain the expression in two
> places, and the template becomes littered with those annoying tests.
