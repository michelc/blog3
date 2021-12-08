---
date: 2006-04-04 13:05:00
layout: post
redirect_from: "post/2006/04/04/Formulaires-personnalises"
tags: qc
title: "Formulaires personnalisés"
---

Il est possible d'utiliser une boite HtmlFile pour réaliser un formulaire
personnalisé dont le résultat sera envoyé par mél à une adresse donnée.

Il faut ensuite coder un formulaire en html en s'inspirant du modèle
ci-dessous :

```
<script type="text/javascript">
function MailFormSubmit() {
  // liste des id obligatoires
  var checks = new Array("mf_Societe", "mf_Email");
  // teste la saisie des champs obligatoires
  for (var i = 0; i < checks.length; i++) {
    var check = checks[i];
    var ctrl = document.getElementById(check);
    if (ctrl.value == "") {
      ctrl.focus();
      return;
    }
  }
  // saisie ok => poste vers le gestion de formulaires mails
  var mainForm = document.getElementById("dotnetForm");
  mainForm.action = '/qc/MailFormHandler.ashx';
  mainForm.submit();
}
</script>
<table id="WebForm">
  <tbody>
    </tr>
      <td colspan="2">
        L'astérisque (*) signale un champ obligatoire
      </td>
    <tr>
    <tr>
      <td>Nom</td>
      <td><input maxlength="100" size="50" name="Nom" /> </td>
    </tr>
    <tr>
      <td>Prénom</td>
      <td><input maxlength="100" size="50" name="Prenom" /></td>
    </tr>
    <tr>
      <td>Société *</td>
      <td><input maxlength="100" size="50" name="Societe" id="mf_Societe" /></td>
    </tr>
    <tr>
      <td>E-Mail *</td>
      <td><input maxlength="100" size="50" name="Email" id="mf_Email" /></td>
    </tr>
    </tr>
      <td colspan="2">
        Merci de répondre aux questions ci-dessous pour recevoir rapidement une réponse
      </td>
    <tr>
    <tr>
      <td>Souhaitez-vous recevoir notre catalogue ?</td>
      <td><input type="radio" checked="checked" name="Catalogue" value="Oui" />Oui
          <input type="radio" name="Catalogue" value="Non" />Non</td>
    </tr>
    <tr>
      <td>Quel sont vos projets ?</td>
      <td><input type="checkbox" name="Location" value="Oui" />Location<br />
        <input type="checkbox" name="Achat" value="Oui" />Achat<br />
        <input type="checkbox" name="Investissement" value="Oui" />Investissement<br />
    </tr>
    <tr>
      <td>Autres informations ?<br />
        <small>Surface, jardin, garage, prix...</small></td>
      <td><textarea rows="4" cols="40" name="Informations"></textarea></td>
    </tr>
    <tr>
      <td></td>
      <td><input type="button" name="_Envoyer" value="Envoyer" onclick="MailFormSubmit(); " /> 
        <input type="reset" name="_Effacer" value="Effacer" /></td>
    </tr>
    </tbody>
  </table>
<input type="hidden" name="_mailto" value="mailFormTo" />
<input type="hidden" name="_subject" value="Formulaire Web" />
```

Pour définir l'adresse mél du destinataire, il faut paramétrer le nom de la
clé dans le champ caché "_mailto" du formulaire :

```
<input type="hidden" name="_mailto" value="mailFormTo" />
```

Puis enregistrer l'adresse mél correspond à cette clé dans le web.config
:

```
<add key="mailFormTo" value="contact@example.com" />
```

Pour une configuration plus poussée des formulaires personnalisés, il est
également possible de définir 2 autres champs cachés :

* le sujet du mél : `<input type="hidden" name="_subject"
value="Formulaire contact" />`
* la page où rediriger le visiteur suite à son message : `<input
type="hidden" name="_redirect" value="~/merci.aspx" />`

Le corps du mél reçu se présente sous la forme suivante :

```
1 - Nom : Dupond
2 - Prenom : Pierre
3 - Societe : Immobil
4 - Email : pierre.dupond@immobil.com
5 - Catalogue : Oui
6 - Location : Oui
7 - Investissement : Oui
8 - Informations : Demande urgente SVP
```
