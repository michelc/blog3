---
date: 2007-09-19 12:23:00
layout: post
redirect_from: "post/2007/09/19/Altrr-Press-fait-de-lanti-spam"
tags: ap
title: "Altrr-Press fait de l'anti-spam"
---

Pour l'instant, on ne peut pas vraiment dire que les sites réalisés avec
Altrr-Press croulent sous le spam. Et une fois n'est pas coutumes, ce n'est
vraiment dû à la qualité de son code mais au simple fait qu'aucun d'entre eux
ne reçoit tant de visites que ça.

Malgré tout, j'ai quand même réussi à récolter quelques spammes :

* un site bar an se ren en ".com" souhaitait au fil de ses urls m'offrir des
fleurs, des cadeaux ou des cartes de voeux,
* un autre cumulait le "free", le "linux" et le "forum" en .info pour mieux
me proposer tout un arsenal de ouaib-cames libres ou pas,
* etc...

Mais quoiqu'il en soit, rien de catastrophique. Donc avant de sortir la
grosse artillerie et de chercher à implémenter Askimet en C#, il y a
certainement moyen de faire simple, vite et bien.

C'est même très facile parce que j'avais repéré il y a quelques temps un
article de Joe Tan qui expliquait comment il avait réalisé un [filtre anti-spam simple
pour WordPress](http://tantannoodles.com/toolkit/spam-filter/).

Son principe est vraiment tout simple. L'auteur a constaté que 90 % du spam
dont il souffrait obéissait à l'une des 3 règles suivantes :

* il y a au minimum 5 liens vers des sites internet,
* il y a des liens en [bbcode](http://en.wikipedia.org/wiki/BBCode) (style
[url=http://www.example.com]example[/url]),
* on y retrouve fréquemment certains mots clés comme v-ag-a, c-alis...

La solution qu'il a mis au point consiste donc à tester ces 3 particularités
et à suspecter le message d'être un spam dès lors que l'une d'entre elle
s'applique.

Après quelques tests à base d'indexOf puis l'assistance de Philippe pour
régixfier tout ça, la boite de Feedback d'Altrr-Press dispose maintenant d'une
fonction IsSpam() qui le cas échéant permet de préfixer le sujet du message
d'un "SPAM" accusateur.

```
public static bool isSpam (string content) {
        // http://tantannoodles.com/toolkit/spam-filter/
        content = content.ToLower();
        bool isInvalid = false;
        if (content.IndexOf(@"[url]http://") != -1) {
                // [url]http://www.example.com[/url] style links => spam
                isInvalid = true;
        } else if (content.IndexOf(@"[url=http://") != -1) {
                // [url=http://www.example.com]example[/url] style links => spam
                isInvalid = true;
        } else {
                // remove internal link
                content = content.Replace(Common.websiteUrl, "");
                // 5 or more links to external sites => spam
                if (Regex.Matches(content, @"http://").Count >= 5) {
                        isInvalid = true;
                }
        }
        if (isInvalid == false) {
                // potential spam words => spam
                string bads = @"cialis|ebony|nude|porn|porno|pussy|upskirt|ringtones|phentermine|viagra";
                if (Regex.IsMatch(content, bads) == true) {
                        isInvalid = true;
                }
        }
        return isInvalid;
}
```

Et pour le jour où ça ne suffira plus, j'ai aussi un [pôt de miel](http://haacked.com/archive/2007/09/11/honeypot-captcha.aspx)
en réserve (à mon avis encore améliorable avec un attribut maxlength à
zéro).
