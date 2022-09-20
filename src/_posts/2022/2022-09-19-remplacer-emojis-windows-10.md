---
date: 2022-09-19 13:07:24 +02:00
tags: [ javascript, twitter ]
title: "Remplacer les émojis de Windows 10"
cover:
  image: /public/2022/emoji-beebee.png
excerpt: Il s'avère que ce n'est pas si simple que ça de remplacer les émojis à l'ancienne de Windows 10 par quelque chose d'un peu plus moderne et joyeux...
---

Ces derniers temps, je me suis remis sur le développement d'une sorte d'application / client Twitter pour me faciliter le suivi des interactions autour de mon jeu de [Wordle en français](https://www.solitaire-play.com/lemot/) (et des 3 autres que j'ai développés depuis).

Ce week-end, pour me changer un peu les idées, j'ai décidé d'améliorer le rendu des émojis.

Au départ, comme il s'agit d'une application web, ils sont affichés avec la police par défaut de Windows 10 pour les émojis, ce qui n'est pas super génial :

<figure>
  <img src="/public/2022/emoji-defaut.png" alt="" />
  <figcaption>Les émojis de base pour Windows 10</figcaption>
</figure>


## 1er essai : "Segoe UI Emoji" de Windows 11

Pour faire au plus simple, j'ai essayé d'installer la dernière version de la police "Segoe UI Emoji" de Windows 11 et de voir ce que ça donnait... Pas grand chose en fait !

<figure>
  <img src="/public/2022/emoji-defaut.png" alt="" />
  <figcaption>Toujours les émojis de la police "Segoe UI Emoji" d'origine de Windows 10 :(</figcaption>
</figure>

J'ai maintenant deux polices "Segoe UI Emoji" sur mon PC qui ne semble pas très chaud pour utiliser la plus récente par défaut.

Malgré tout, Firefox s'est montré plus malin :

<figure>
  <img src="/public/2022/emoji-firefox.png" alt="" />
  <figcaption>Les nouveaux émojis de la police "Segoe UI Emoji" de Windows 11 :)</figcaption>
</figure>


## 2ème essai : "Noto Color Emoji" de Google

Puis j'ai vu passer une nouvelle police de chez Google : "Noto Color Emoji" ([https://fonts.google.com/noto/specimen/Noto+Color+Emoji](https://fonts.google.com/noto/specimen/Noto+Color+Emoji)).

Après l'avoir téléchargée, je pouvais essayer de l'utiliser comme police "système" pour les émojis... Mais il n'y avait pas de raison qu'elle se débrouille mieux que la "Segoe UI Emoji" de Microsoft himself.

Et il n'existe rien au niveau HTML / CSS pour indiquer qu'il faut afficher les émojis en utilisant une police particulière. Si on veut y arriver, le plus simple est d'englober les émojis à afficher dans une balise `<span>` avec une classe particulière pour pouvoir définir sa police. Quelque chose comme `<span class="font-emoji">🥳</span>` par exemple...

Alors j'ai bricolé vite fait un truc pour que les émojis soient affichés en utilisant cette police. Pour cela, j'ai encadré tous les émojis dans une "pseudo" balise `<e>` grâce à la fonction suivante :

```
private string MakePrettyEmojis(string content)
{
    var pretty = "";
    var runes = content.EnumerateRunes();
    foreach (var r in runes)
    {
        var one = r.ToString();
        if (one == "\u2b1c")
            pretty += "<e>" + one + "</e>";
        else if (one == "\u26aa")
            pretty += "<e>" + one + "</e>";
        else if (r.IsBmp == false)
            pretty += "<e>" + one + "</e>";
        else
            pretty += r.ToString();
    }
    pretty = pretty.Replace("</e><e>", "");
    return pretty;
}
```

*Note : Comme tous les émojis ne sont apparemment pas logés à la même enseigne, il faudra me creuser un peu plus les méninges pour réussir à gérer correctement tous les émojis existants (quelque chose dans le genre `Regex` certainement).*

La balise `<e>` n'existe pas mais elle ne semble pas perturber les navigateurs. Et donc, `<e>🥳</e>` sera quand même plus "discret" qu'un long `<span class="font-emoji">🥳</span>` :)

Je complète mon fichier CSS pour y indiquer que les éléments `<e>` doivent être affichés avec la police "Noto Color Emoji" :

```
e {
    font-family: "Noto Color Emoji"
}
```

Et le résultat est enfin là, quelque soit le navigateur !

<figure>
  <img src="/public/2022/emoji-font-google.png" alt="" />
  <figcaption>Enfin de plus jolis émojis !!!</figcaption>
</figure>

Mais j'aime moyen ce petit effet 3D. On se croirait revenu au temps de Windows 3.1 :)


## 3ème essai : "Segoe UI Emoji" le retour

Bien entendu je tente le coup avec :

```
e {
    font-family: "Segoe UI Emoji"
}
```

Mais comme il y a 2 polices "Segoe UI Emoji" sur mon Windows, la nouvelle ne prend toujours pas le dessus sur l'ancienne... A moins qu'il existe un `font-version` quelque part...

<figure>
  <img src="/public/2022/emoji-defaut.png" alt="" />
  <figcaption>Retour à la case départ (à part Firefox)</figcaption>
</figure>


## 4ème essais : "Twitter Color Emoji SVGinOT Font" de ???

Je cherche s'il existe d'autre polices d'emojis et je tombe sur celle de Twitter, même si cela ressemble plus à du bricolage qu'à un truc officiel : [https://github.com/eosrei/twemoji-color-font](https://github.com/eosrei/twemoji-color-font).

Je télécharge, installe puis :

```
e {
    font-family: "Twitter Color Emoji"
}
```

Et oups...

<figure>
  <img src="/public/2022/emoji-font-twitter.png" alt="" />
  <figcaption>Tous les émojis sont gris clair...</figcaption>
</figure>


## 5ème essai : "Emoji for everyone" de Twitter !!!

Par contre, ça m'a conduit sur la page de "Twemoji" : [https://twemoji.twitter.com/](https://twemoji.twitter.com/).

> L'emoji open source de Twitter répond à tous les besoins de votre projet en
> matière d'emoji. Il prend en charge la dernière spécification Unicode des
> emojis et propose 3 245 emojis, le tout gratuitement.

Mais c'est génial !

Il semblerait bien que cela soit pile ce que je cherche ! Quelque chose de pas compliqué du tout qui remplace tous les émojis d'une page par l'image de l'émoji Twitter correspondant. Ca tombe bien, il me plaisent beaucoup les émojis de Twitter moi :)

Je vire ma fonction "MakePrettyEmojis" et mon bout de CSS pour revenir à la situation de départ.

J'ajoute un peu de JavaScript dans mon fichier "_Layout.cshtml" :

```
<script src="https://twemoji.maxcdn.com/v/latest/twemoji.min.js" crossorigin="anonymous"></script>

<script>
    window.onload = function () {
        // https://gist.github.com/Armster15/db063ab0dc5be699ae07a067a7333752
        // Parses the document body and
        // inserts <img> tags in place of Unicode Emojis
        twemoji.parse(document.body,
            { folder: 'svg', ext: '.svg' } // This is to specify to Twemoji to use SVGs and not PNGs
        );
    }
</script>
```

Et je dimensionne les émojis dans mon CSS :

```
.emoji {
    height: 1.2em;
    width: 1.2em;
    margin: 0 1px;
}
```

<figure>
  <img src="/public/2022/emoji-twitter.png" alt="" />
  <figcaption>Tada ! C'est parfaitement parfait.</figcaption>
</figure>


## Conclusion

Au départ, je comptais remplacer les émojis de Windows 10 pour en utiliser de plus modernes (et les derniers de Microsoft m'allaient très bien). Mais devant les difficultés et pour éviter d'avoir à "hacker" mon système, j'ai préféré me contenter de modifier mon application pour qu'elle affiche les jolis émojis de Twitter à la place.


<div class="encart">

English version: {% goto_en "Replace Windows 10's emoji", "2022-09-20-replace-windows-10-emoji" %}.

</div>
