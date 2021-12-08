---
date: 2010-03-11 00:04:00
layout: post
redirect_from: "post/2010/03/11/faire-une-liste-html-radio-button"
tags: html, mvc
title: "Faire une liste Html.RadioButton"
---

Un bouton radio ne s'utilisant jamais seul, on doit donc coder plusieurs
helpers Html.RadioButton() quand on veut permettre à l'utilisateur de faire un
choix entre plusieurs options :

```
<% using (Html.BeginForm()) { %>
   <fieldset>
     <p>
        Couleur ?
        <%= Html.RadioButton("Couleur", "R", false) %>Rouge
        <%= Html.RadioButton("Couleur", "V", true) %>Vert
        <%= Html.RadioButton("Couleur", "B", false) %>Bleu
     </p>
     <p>
        <input type="submit" value="Save" />
     </p>
   </fieldset>
<% } %>
```

Ce code ASP.NET permet d'afficher la page ci-dessous :

![](/public/2010/radio-button-helper.jpg)

Si on consulte le code source de cette page, on trouve le code HTML
suivant :

```
<form action="/Home/Edit" method="post">
   <fieldset>
     <p>
        Couleur ?
        <input id="Couleur" name="Couleur" type="radio" value="R" />Rouge
        <input checked="checked" id="Couleur" name="Couleur" type="radio" value="V" />Vert
        <input id="Couleur" name="Couleur" type="radio" value="B" />Bleu
     </p>
     <p>
        <input type="submit" value="Save" />
     </p>
   </fieldset>
</form>
```

Il faut cliquer sur un des 3 boutons radio pour sélectionner une option. Une
fois qu'une option a été sélectionnée, le fait de cliquer sur un autre bouton
radio va sélectionner une nouvelle option et automatiquement dé-sélectionner
l'option qui était sélectionnée auparavant. Les 3 boutons radio sont liés entre
eux et on ne peut sélectionner qu'une seule option à la fois parce qu'au niveau
du code HTML, les 3 &lt;input type="radio" ...&gt; ont le même attribut
name.

Pour l'instant, si on veut sélectionner une option, il est obligatoire de
bien viser et de cliquer pile sur le petit rond du bouton radio. Dans la
pratique, il faudrait faire en sorte que quand on clique sur le libellé de
l'option, cela permette aussi de sélectionner cette option.

Pour faire ça, il faut associer le libellé au bouton radio. En HTML, on fait
ça en utilisant une balise "label" pour définir le libellé et on relie ce label
au bouton radio avec un attribut "for" qui pointe vers l'identifiant du bouton
radio :

```
<input id="Couleur" name="Couleur" type="radio" value="R" /><label for="Couleur">Rouge</label>
```

Avec le helper Html.RadioButton() de ASP.NET MVC, il suffit donc de faire
ça, mais le problème c'est que ça n'est pas si facile que ça...

Pour commencer, si on re-regarde le code HTML généré, on s'aperçoit que les
3 boutons radio ont le même identifiant ! Outre le fait que c'est pas
normal du tout, ça nous complique la vie pour associer chaque libellé au bon
bouton radio (puisque l'attribut "for" a besoin de l'identifiant du contrôle
associé). Il va donc falloir trouver un moyen pour définir un identifiant
unique pour chaque bouton radio. Heureusement, c'est prévu : le helper
Html.RadioButton() accepte un objet htmlAttributes qui va nous permettre de
faire ça.

```
Couleur ?
<%= Html.RadioButton("Couleur", "R", false, new { @id = "Red" })%><label for="Red">Rouge</label>
<%= Html.RadioButton("Couleur", "V", true, new { @id = "Green" })%><label for="Green">Vert</label>
<%= Html.RadioButton("Couleur", "B", false, new { @id = "Blue" })%><label for="Blue">Bleu</label>
```

Et ce coup-ci, on peut constater au niveau du code HTML généré que les 3
boutons radio n'ont plus à partager le même identifiant :

```
Couleur ?
<input id="Red" name="Couleur" type="radio" value="R" /><label for="Red">Rouge</label>
<input checked="checked" id="Green" name="Couleur" type="radio" value="V" /><label for="Green">Vert</label>
<input id="Blue" name="Couleur" type="radio" value="B" /><label for="Blue">Bleu</label>
 
```

Et maintenant, il est possible de cliquer sur le nom d'une couleur pour
automatiquement sélectionner le bouton radio qui lui est associé.
