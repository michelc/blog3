---
date: 2008-09-26 10:09:00
layout: post
redirect_from: "post/2008/09/26/Remplir-les-champs-d-un-formulaire-PDF"
tags: boulot, csharp
title: "Remplir les champs d'un formulaire PDF"
---

Après avoir réussi à [lister les champs d'un
formulaire PDF]({% post_url 2008-09-25-lister-champs-formulaire-pdf %}), ce coup-ci je fais un premier essai pour mettre des données
dans mon formulaire. Pour commencer, je me contente d'y mettre un compteur
numérique, ce qui va me permettre de repérer chaque champ dans le
formulaire.

```
namespace Altrr.iText {

    using System;
    using System.Collections;
    using System.IO;
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
            FillFields(pdfSource);

        }

        /// <summary>
        /// Remplis les différents champs d'un formulaire PDF
        /// </summary>
        static void FillFields (string pdfSource) {

            // Création d'un objet PDF Reader basé sur le formulaire PDF
            Console.WriteLine(pdfSource + " :");
            PdfReader pdfReader = new PdfReader(pdfSource);

            // Création d'un objet PDF Stamper à partir du formulaire PDF
            string pdfRempli = pdfSource.Replace(".pdf", "_test.pdf");
            PdfStamper pdfStamper = new PdfStamper(pdfReader, new FileStream(pdfRempli, FileMode.Create));
            AcroFields fields = pdfStamper.AcroFields;

            // Boucle pour remplir les différents champs
            int i = 0;
            foreach (DictionaryEntry field in fields.Fields) {
                // nom du champ
                string key = field.Key.ToString();
                // type du champ (et selon le cas liste des valeurs possibles)
                string type = "";
                i++;
                string data = i.ToString();
                string[] list = null;
                switch (fields.GetFieldType(key)) {
                    case AcroFields.FIELD_TYPE_CHECKBOX:
                        type = "CheckBox";
                        list = fields.GetAppearanceStates(key);
                        break;
                    case AcroFields.FIELD_TYPE_COMBO:
                        type = "Combo";
                        list = fields.GetListOptionExport(key);
                        break;
                    case AcroFields.FIELD_TYPE_LIST:
                        type = "List";
                        list = fields.GetListOptionExport(key);
                        break;
                    case AcroFields.FIELD_TYPE_NONE:
                        type = "None";
                        break;
                    case AcroFields.FIELD_TYPE_PUSHBUTTON:
                        type = "PushButton";
                        break;
                    case AcroFields.FIELD_TYPE_RADIOBUTTON:
                        type = "RadioButton";
                        list = fields.GetAppearanceStates(key);
                        break;
                    case AcroFields.FIELD_TYPE_SIGNATURE:
                        type = "Signature";
                        break;
                    case AcroFields.FIELD_TYPE_TEXT:
                        type = "Text";
                        break;
                }
                if (list != null) {
                    data = list[list.Length - 1];
                }
                Console.WriteLine("- " + key + " : " + data);
                fields.SetField(key, data);
            }
            // Fermeture du formulaire PDF rempli
            pdfStamper.Close();
        }

    }
}
```

Maintenant, il me reste à trouver comment éviter de créer physiquement un
nouveau fichier à chaque fois. Etant donné que c'est destiné à être utilisé
dans une application ASP.NET, je préfèrerais trouver une méthode qui me
permette de renvoyer directement le résultat vers le poste client. Normalement,
c'est le genre de chose qui devrait se trouver facilement sur Google (à
condition que cela soit réalisable).

Et ce qui serait bien, c'est de voir s'il est possible à partir du
formulaire modèle de remplir plusieurs pages avec des données différentes
données. De cette façon, je pourrais gérer des impressions groupées de
plusieurs documents à la fois.
