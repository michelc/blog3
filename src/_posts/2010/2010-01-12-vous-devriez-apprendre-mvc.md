---
date: 2010-01-12 15:00:00
layout: post
redirect_from: "post/2010/01/12/Vous-devriez-apprendre-MVC"
tags: mvc
title: "Je peux le dire : Vous devriez apprendre MVC"
---

{:.encart}
Ceci est la traduction du billet [I Spose I'll Just Say It: You Should Learn MVC](http://blog.wekeroad.com/2009/04/22/i-spose-ill-just-say-it-you-should-learn-mvc) de Rob
Conery.

## Le Gros Mensonge

Les WebForms sont des menteurs. C'est une abstraction roulée dans la farine
et nappée de boniments le tout présenté à grand coups de passe-passe sur un
plateau tape à l'œil. Quoique vous fassiez avec les WebForms, ça n'aura jamais
rien à voir avec du web - vous les laissez faire ce qu'ils veulent.

Ceci mes amis pose un gros problème (en tout cas pour moi) : Vous vivez
dans le mensonge. Le web n'a pas de ViewState, il marche avec ce truc qu'on
appelle HTML et qu'on envoie à travers des tuyaux en utilisant un autre truc
qu'on appelle HTTP. Vous devez savoir ça, aimer ça, et vivre ça avec vos
tripes. Je suppose qu'arrivé là certains d'entre vous sont entrain de s'agiter
sur leur chaise - allez-y, continuez à vous trémousser (j'attends).

![La Terre](http://blog.wekeroad.com/wp-content/uploads/2009/04/world-thumb.jpg)

Si vous êtes toujours en train de vous trémousser, c'est peut être que le
développement web n'est pas fait pour vous (avec tout le respect qui vous est
dû et sans vouloir être acerbifiant). Je dis ça parce que vous n'avez pas à
travailler dans une usine de saucisses si vous êtes allergique au porc, au bœuf
ou à la viande. Ni à mettre une perruque sur la tête de votre chat pour espérer
qu'il se mette à chanter comme [Susan Boyle](http://www.youtube.com/watch?v=RxPZh4AnWyk).

Tout ça, c'est rien d'autre que des emplâtres sur une jambe de bois et ça
n'a jamais guéri personne. Si vous croyez que vous n'avez pas à connaitre
quoique ce soit de HTML ou de HTTP pour faire du web... Hé, c'est que vous êtes
du genre têtu ! Merci de retourner 2 phrases en arrière.

Vous le croyez encore ? Votre chat a besoin d'une nouvelle
perruque.

## MVC est snob ?

Je devine que les gens qui font des  WebForms se disent que je commence
à les emm... J'aimerai m'adresser à eux. Le titre de ce billet est "Vous
devriez apprendre MVC", et pas que vous devez l'utiliser (bien que je souhaite
que vous le fassiez : c'est que du bonheur). C'est tout ce que je vous
demande : que vous appreniez MVC. Je n'ai jamais dit que vous étiez idiot
de ne pas l'utiliser (juste que votre chat portait une perruque).

## MVC est un gros plein de soupe ?

[Je vais me répéter](http://blog.wekeroad.com/blog/asp-net-mvc-avoiding-tag-soup/), mais que je vous dise : si vous
cuisinez des spaghettis, vous mangerez  des spaghettis. Comme tout bon
geek qui se respecte, je n'ai pas envie d'avoir des if et des for en pagaille
dans mes vues. Mais ça, mes amis, c'est votre affaire ! Pas celle de la
plateforme ! Ouvrez vos oreilles : les balises, c'est vous, comme
tout le reste en MVC. Eh oui, c'est pas du drag and drop - mais y'a pas de drag
and drop dans la vrai vie ! C'est nouveau, c'est différent - c'est fini
1999, rien que parce que de nos jours C# est autrement plus puissant que
VBScript.

Je n'ai pas peur du HTML - et vous ne devriez pas non plus. Pensez à lui
quand vous codez vos pages. Et restez sobre. On peut y arriver si on s'y met
tous ensemble. Et vous pouvez amener votre chat si vous voulez.

## 7 raisons d'arrêter de me prendre pour un crétin

Espérons que vous êtes encore là et croisons les doigts pour que vous vous
disiez "Assez de tout ce blabla. Donnes-moi quelque chose à me mettre sous la
dent". C'est parti :

**1 - Testabilité**. Je ne parle pas de TDD, juste des tests en
général. Si vous n'êtes pas du genre "testeur", c'est pas grave - le reste du
monde de l'informatique a accepté l'idée que "Tester ce que l'on produit n'est
pas une si mauvaise idée". Vous ne voulez quand même pas que vos clients
tombent sur ce stupide "*InvalidCastException*" ? Il y a des TAS de raisons
pour vouloir tester - je ne parle toujours pas de TDD - juste les bons vieux
tests unitaires ! C'est simple comme bonjour avec MVC et rien que ça
devrait vous donner envie d'y jeter un coup d'œil - sans compter que ça peut
vous faire [gagner
du temps et de l'argent](http://blog.wekeroad.com/kona/kona-2/).

**2 - Contrôle du HTML**. Je suis certain que vous en avez déjà
entendu parler : les ID inutilisables, le HTML invalide, etc... Pourquoi
est-ce que c'est important ? Parce qu'un jour vous pourriez avoir besoin
de faire de la programmation côté client ! Je ne vais pas faire durer le
plaisir, mais c'est pas seulement pour faire joli quand on clique "Afficher la
source". Vous parlez à des bestiaux ultra-pointilleux (les navigateurs) qui
adorent discutailler : un développeur capable de fignoler son code HTML ne
peut pas être foncièrement mauvais.

**3 - Extensibilité.** Avec MVC, tout est littéralement
redéfinissable - et dans les 3 dernières applications que j'ai développé
(Storefront, NerdDinner et SubSonic MVC Starter), j'ai utilisé mon propre
ViewEngine pour économiser du temps et des efforts et j'ai fabriqué mon propre
ControllerFactory afin de pouvoir [faire de
l'IoC](http://www.asp.net/learn/mvc-videos/video-366.aspx) (c'est trop génial !). Une fois que vous avez compris ça, vous êtes
le roi du pétrole ! Est-ce que vous avez déjà pété un plomb à tenter
d'utiliser Page_PreRender pour qu'il charge quelque chose correctement dans le
ControlTree afin qu'il s'affiche quand on a besoin de lui ? MVC ne vous
enferme jamais dans quoi que ce soit - vous êtes libre de faire ce que vous
voulez.

**4 - Ca vous fait réfléchir...** C'est un truc que je n'ai
jamais aimé avec les WebForms - je n'avais jamais l'impression de réfléchir –
juste d'exécuter. Vous trouvez peut-être que je cherche à couper es cheveux en
quatre, mais pas moi. On cherche un peu l'inspiration et on essaie de
deviner : "Hum ? Qu'est-ce qu'il faut faire pour que la page
s'affiche comme ça ?" MVC est tout le contraire - tout le contrôle est entre
vos mains et vous n'avez qu'à en tirer parti. Vous devez utiliser votre
cervelle ! Ouah !

**5 - ... autrement : Javascript c'est bon** !
jQuery, Dojo, ExtJS - ou ce que vous voulez.  Ces frameworks rendent le
développement client si facile que ça en devient amusant. Phil et moi nous en
sommes récemment donnés à cœur joie avec jQuery (lui plus que moi) et j'ai très
nettement eu la sensation que j'étais passé à côté de quelque chose. Quelque
chose que les autres plateformes avaient depuis des années - la faculté de
rendre l'utilisation d'internet amusante et magique (pour l'utilisateur) grâce
à la programmation côté client. Vous pensez autrement une fois que vous avez
pigé le truc - et votre code serveur s'allège très vite de façon spectaculaire
au profit d'un code client clair et net (grâce à ces frameworks) qui procurent
une expérience incroyable. Et les chats aussi aiment le jQuery.

C'est un peu tordu de dire ça, mais les développeurs aiment bien apprendre
un nouveau langage tous les 2 ou 3 ans, alors pourquoi pas Javascript cette
année ? Vous pensez sans doute que vous le connaissez déjà, mais
certainement pas aussi bien que C# ou VB. Essayez - vous ne développerez plus
jamais comme avant.

**6 - Apprendre de nouvelles techniques.** Il y en a plein et
certains vont jusqu'à [se battre pour elles](http://stephenwalther.com/blog/archive/2009/04/08/test-after-development-is-not-test-driven-development.aspx). On ne devrait pas tant se prendre la
tête, mais d'une certaine manière c'est comme ça qu'on apprend le mieux !
Quoiqu'il en soit, faite l'effort d'apprendre autre chose. Les WebForms c'est
un petit nid douillet où vous finissez par vous assoupir. C'est arrivé à
beaucoup d'entre nous (à moi aussi). On arrive à peine à rattraper le niveau
des autres frameworks employés pour créer tous ces sites brillants et
irrésistibles de ces dernières années. Démarrez votre cerveau !
Réveillez-vous et cherchez à savoir ce qui rend ces sites si
extraordinaires ! Apprenez ces petits trucs qui donne du génie à votre
code - vous pourrez au moins donner un avis de connaisseur.

**7 - C'est marrant.** Pour moi, c'est la raison numéro 1. Je
trouve que MVC est amusant parce que je peux faire ce que je veux, quand je
veux, comme je veux. J'ai la possibilité de créer quelque chose qui correspond
à ce que j'ai envie de faire, et je ne suis pas empêtré par un Gros Mensonge et
un chat tout bizarre avec sa perruque sur la tête.

## Conclusion

Je suis à nouveaux heureux de programmer et c'est quelque chose de très
motivant, du moins pour moi et mes chats. Allez ! Encore un parallèle,
mais avec un peu de chance un peu plus réaliste. Vous n'avez absolument aucune
raison de ne pas apprendre MVC - et j'admets  que vous ayez une ou deux
raisons de rester fidèles aux WebForms.

J'imagine que beaucoup de monde pourrait penser que je parle pour tout
Microsoft. Etonnant non ? Je ne suis pas objectif et plus important, j'ai
toujours mon propre cerveau à moi capable d'avoir ses propres idées !
J'adore MVC et je pense que vous l'aimerez aussi - alors s'il vous plait,
essayez le avant de vous forger votre propre opinion.

{:.encart}
Ceci est la traduction du billet [I Spose I'll Just Say It: You Should Learn MVC](http://blog.wekeroad.com/2009/04/22/i-spose-ill-just-say-it-you-should-learn-mvc) de Rob
Conery.
