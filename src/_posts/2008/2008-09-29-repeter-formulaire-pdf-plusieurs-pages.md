---
date: 2008-09-29 19:07:00
layout: post
redirect_from: "post/2008/09/29/Repeter-un-formulaire-PDF-sur-plusieurs-pages"
tags: boulot, csharp
title: "Répéter un formulaire PDF sur plusieurs pages"
---

Pour parvenir à faire un état sur plusieurs pages en remplissant plusieurs
fois le même formulaire PDF avec des données différentes, je n'ai finalement
pas eu trop à me creuser la tête. J'ai simplement interrogé le tout nouveau
site [Stack Overflow](http://stackoverflow.com/) qui m'a gentiment
expliqué [
How do I programmatically create a PDF in my .NET application](http://stackoverflow.com/questions/177/how-do-i-programmatically-create-a-pdf-in-my-net-application#4980)?

```
namespace Altrr.iText {

    using System;
    using System.Collections;
    using System.IO;
    using iTextSharp.text;
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

            string pdfRempli = pdfSource.Replace(".pdf", "_test.pdf");
            Document doc = new Document();
            PdfCopy copy = new PdfCopy(doc, new FileStream(pdfRempli, FileMode.Create));
            doc.Open();

            for (int i = 0; i < 10; i++) {

                PdfReader pdfReader = new PdfReader(pdfSource);

                MemoryStream temp = new MemoryStream();
                PdfStamper pdfStamper = new PdfStamper(pdfReader, temp);

                AcroFields fields = pdfStamper.AcroFields;
                fields.SetField("person.name", i.ToString() + "Laura Specimen");
                fields.SetField("person.address", i.ToString() + "Paulo Soares Way 1");
                fields.SetField("person.postal_code", "F00b4R", "FOOBAR");
                fields.SetField("person.email", i.ToString() + "laura@lowagie.com");
                fields.SetField("person.programming", "JAVA");
                fields.SetField("person.language", "FR");
                fields.SetField("person.preferred", "EN");
                fields.SetField("person.knowledge.English", "On");
                fields.SetField("person.knowledge.French", "On");
                fields.SetField("person.knowledge.Dutch", "Off");

                pdfStamper.FormFlattening = true;
                pdfStamper.Close();

                PdfReader tempReader = new PdfReader(temp.ToArray());

                copy.AddPage(copy.GetImportedPage(tempReader, pdfReader.NumberOfPages));
                copy.FreeReader(tempReader);
            }
            doc.Close();
        }

    }
}
```

Pour que ça marche, j'ai dû ajouter un `using iTextSharp.text;`
sans quoi le type 'Document' n'est pas référencé.

Et j'utilise aussi `pdfStamper.FormFlattening = true;` pour que
le formulaire PDF ne soit plus modifiable. En fait, cela fait que le fichier
PDF final redevient un simple PDF sans plus aucun champ saisissable.

Pour l'instant, je vais déjà utiliser ça comme ça parce que l'échéance pour
la mise à jour de l'état approche à grands pas. Puis quand j'aurais fini
j'essaierai de comprendre un peu mieux ce qui se passe et comment ça
marche.
