---
date: 2008-09-25 19:34:00
layout: post
redirect_from: "post/2008/09/25/Lister-les-champs-d-un-formulaire-PDF"
tags: boulot, csharp
title: "Lister les champs d'un formulaire PDF"
---

Aujourd'hui, j'ai eu besoin de re-faire un état Crystal Report. Il s'agit
d'un document officiel dont le format a changé du jour au lendemain et qui doit
être en production pour le 1° février. Vu les délais et surtout étant donné que
maintenant plus personne ne maitrise Crystal Report chez nous, ça risquait
d'être un peu juste.

Mais heureusement, l'organisme qui demande ce nouvel état a eu la bonne idée
de le fournir sous forme de formulaire PDF prêt à remplir. Comme ce n'est
normalement pas un état trop demandé (ce qui fait qu'on n'a pas vraiment besoin
de la puissance de feu de Crystal Report), j'en ai profité pour tester s'il
était possible de remplir ce formulaire depuis ASP.NET.

Apparemment, la meilleure solution bon marché pour cela semble être [iTextSharp](http://itextsharp.sourceforge.net/). C'est gratuit et ça semble
vraiment très simple à utiliser. Sauf en ce qui concerne la mise à jour des
formulaires PDF où il m'a fallu beaucoup creuser pour réussir à trouver des
exemples concrets :

* Un article sur CodeProject : [Fill in PDF Form
Fields using the Open Source iTextSharp Dynamic Link Library](http://www.codeproject.com/KB/cs/FillFormFieldsOfPDFs.aspx)
* Des exemples en Java tirés du livre iText en Action : [Chapitre
16 : Filling and signing AcroForms](http://www.1t3xt.info/examples/browse/?page=example&amp;id=250)

Une fois tout ça trouvé, ça a de suite été plus facile de faire un premier
essai qui marche :

```
namespace Altrr.iText {

    using System;
    using System.Collections;
    using iTextSharp.text.pdf;

    /// <summary>
    /// Tests du composant iTextSharp
    /// </summary>
    public class Start {

        /// <summary>
        /// Point d'entrée principal de l'application.
        /// </summary>
        [STAThread]
        static void Main (string[] args) {

            string pdfSource = @"D:\Altrr\iText\register_form1.pdf";
            if (args.Length == 1) {
                pdfSource = args[0];
            }
            ListFieldNames(pdfSource);

        }

        /// <summary>
        /// Affiche la liste des champs d'un formulaire PDF
        /// </summary>
        static void ListFieldNames (string pdfSource) {

            // Création d'un objet PDF Reader basé sur le formulaire PDF
            Console.WriteLine(pdfSource + " :");
            PdfReader pdfReader = new PdfReader(pdfSource);
            AcroFields fields = pdfReader.AcroFields;

            // Boucle sur les différents champs du formulaire
            foreach (DictionaryEntry field in fields.Fields) {
                // nom du champ
                string key = field.Key.ToString();
                // type du champ (et selon le cas liste des valeurs possibles)
                string type = "";
                string data = "";
                switch (fields.GetFieldType(key)) {
                    case AcroFields.FIELD_TYPE_CHECKBOX:
                        type = "CheckBox";
                        data = String.Join(", ", fields.GetAppearanceStates(key));
                        break;
                    case AcroFields.FIELD_TYPE_COMBO:
                        type = "Combo";
                        data = String.Join(", ", fields.GetListOptionExport(key));
                        break;
                    case AcroFields.FIELD_TYPE_LIST:
                        type = "List";
                        data = String.Join(", ", fields.GetListOptionExport(key));
                        break;
                    case AcroFields.FIELD_TYPE_NONE:
                        type = "None";
                        break;
                    case AcroFields.FIELD_TYPE_PUSHBUTTON:
                        type = "PushButton";
                        break;
                    case AcroFields.FIELD_TYPE_RADIOBUTTON:
                        type = "RadioButton";
                        data = String.Join(", ", fields.GetAppearanceStates(key));
                        break;
                    case AcroFields.FIELD_TYPE_SIGNATURE:
                        type = "Signature";
                        break;
                    case AcroFields.FIELD_TYPE_TEXT:
                        type = "Text";
                        break;
                }
                Console.Write("- " + key + " : " + type);
                if (data != "") {
                    Console.WriteLine(" (valeurs possibles : " + data + ")");
                } else {
                    Console.WriteLine("");
                }
            }
        }

    }
}
```

Ce qui avec le fichier d'exemple me donne :

```
D:\Altrr\iText\register_form1.pdf :
- person.name : Text
- person.postal_code : Text
- person.knowledge.Dutch : CheckBox (valeurs possibles : Off, On)
- person.language : Combo (valeurs possibles : EN, FR, NL)
- person.knowledge.French : CheckBox (valeurs possibles : Off, On)
- person.programming : List (valeurs possibles : JAVA, C, CS, VB)
- person.email : Text
- person.address : Text
- person.preferred : RadioButton (valeurs possibles : Off, NL, EN, FR)
- person.knowledge.English : CheckBox (valeurs possibles : Off, On)
```

Il y a quand même un problème, parce qu'avec mon formulaire PDF, j'obtiens
une liste des champs totalement dans le désordre, c'est à dire ni dans l'ordre
de saisie, ni même dans l'ordre alphabétique. Et comme les noms des champs sont
moyennement clairs, c'est assez galère pour savoir à quoi correspond chaque
champ.

Ca vaudrait peut être le coup d'essayer la fonction
pdfReader.AcroFields.GetFieldPositions(key) qui renvoie la position du champ
pour essayer de trier cette liste de haut en bas et de gauche à droite. Ou
alors, simplement remplir chaque champ avec une valeur numérique croissante et
voir ce que ça donne.
