---
date: 2010-09-01 14:21:00
layout: post
redirect_from: "post/2010/09/01/departements-limitrophes"
tags: code-snippets, csharp
title: "Départements limitrophes"
---

Une fonction C# très vite faite qui renvoie la liste des départements
limitrophes d'un département donné

```
public static string Limitrophes(string Departement) {
    string limitrophes = string.Empty;
    switch (Departement)
    {
        case "01": limitrophes = "38,39,69,71,73,74"; break;
        case "02": limitrophes = "08,51,59,60,77,80"; break;
        case "03": limitrophes = "18,23,42,58,63,71"; break;
        case "04": limitrophes = "05,06,26,83,84"; break;
        case "05": limitrophes = "04,26,38,73"; break;
        case "06": limitrophes = "04,83"; break;
        case "07": limitrophes = "26,30,38,42,43,48,84"; break;
        case "08": limitrophes = "02,51,55"; break;
        case "09": limitrophes = "11,31,66"; break;
        case "10": limitrophes = "21,51,52,77,89"; break;
        case "11": limitrophes = "09,31,34,66,81"; break;
        case "12": limitrophes = "15,30,34,46,48,81,82"; break;
        case "13": limitrophes = "30,83,84"; break;
        case "14": limitrophes = "27,50,61,76"; break;
        case "15": limitrophes = "12,19,43,46,48,63"; break;
        case "16": limitrophes = "17,24,79,86,87"; break;
        case "17": limitrophes = "16,24,33,79,85"; break;
        case "18": limitrophes = "03,36,41,45,58"; break;
        case "19": limitrophes = "15,23,24,46,63,87"; break;
        case "20": limitrophes = ""; break;
        case "2A": limitrophes = "2B"; break;
        case "2B": limitrophes = "2A"; break;
        case "21": limitrophes = "10,39,52,58,70,71,89"; break;
        case "22": limitrophes = "29,35,56"; break;
        case "23": limitrophes = "03,19,36,63,87"; break;
        case "24": limitrophes = "16,17,19,33,46,47,87"; break;
        case "25": limitrophes = "39,70,90"; break;
        case "26": limitrophes = "04,05,07,38,84"; break;
        case "27": limitrophes = "14,28,60,61,76,78,95"; break;
        case "28": limitrophes = "27,41,45,61,72,78,91"; break;
        case "29": limitrophes = "22,56"; break;
        case "30": limitrophes = "07,12,13,34,48,84"; break;
        case "31": limitrophes = "09,11,32,65,81,82"; break;
        case "32": limitrophes = "31,40,47,64,65,82"; break;
        case "33": limitrophes = "17,24,40,47"; break;
        case "34": limitrophes = "11,12,30,81"; break;
        case "35": limitrophes = "22,44,49,50,53,56"; break;
        case "36": limitrophes = "03,18,23,37,41,86,87"; break;
        case "37": limitrophes = "36,41,49,72,86"; break;
        case "38": limitrophes = "01,05,07,26,42,69,73"; break;
        case "39": limitrophes = "01,21,25,70,71"; break;
        case "40": limitrophes = "32,33,47,64"; break;
        case "41": limitrophes = "18,28,36,37,45,72"; break;
        case "42": limitrophes = "03,07,38,43,63,69,71"; break;
        case "43": limitrophes = "07,15,42,48,63"; break;
        case "44": limitrophes = "35,49,56,85"; break;
        case "45": limitrophes = "18,28,41,58,77,89,91"; break;
        case "46": limitrophes = "12,15,19,24,47,82"; break;
        case "47": limitrophes = "24,32,33,40,46,82"; break;
        case "48": limitrophes = "07,12,15,30,43"; break;
        case "49": limitrophes = "35,37,44,53,72,79,85,86"; break;
        case "50": limitrophes = "14,35,53,61"; break;
        case "51": limitrophes = "02,08,10,52,55,77"; break;
        case "52": limitrophes = "10,21,51,55,70,88"; break;
        case "53": limitrophes = "35,49,50,61,72"; break;
        case "54": limitrophes = "55,57,88"; break;
        case "55": limitrophes = "08,51,52,54,88"; break;
        case "56": limitrophes = "22,29,35,44"; break;
        case "57": limitrophes = "54,67"; break;
        case "58": limitrophes = "03,18,21,45,71,89"; break;
        case "59": limitrophes = "02,80,62"; break;
        case "60": limitrophes = "02,27,76,77,80,95"; break;
        case "61": limitrophes = "14,27,28,50,53,72"; break;
        case "62": limitrophes = "59,80"; break;
        case "63": limitrophes = "03,15,19,23,42,43"; break;
        case "64": limitrophes = "32,40,65"; break;
        case "65": limitrophes = "31,32,64"; break;
        case "66": limitrophes = "09,11"; break;
        case "67": limitrophes = "57,68,88"; break;
        case "68": limitrophes = "67,88,90"; break;
        case "69": limitrophes = "01,38,42,71"; break;
        case "70": limitrophes = "21,25,52,88,90"; break;
        case "71": limitrophes = "01,03,21,39,42,58,69"; break;
        case "72": limitrophes = "28,37,41,49,53,61"; break;
        case "73": limitrophes = "01,05,38,74"; break;
        case "74": limitrophes = "01,73"; break;
        case "75": limitrophes = "92,93,94"; break;
        case "76": limitrophes = "14,27,60,80"; break;
        case "77": limitrophes = "02,10,45,51,60,89,91,93,94,95"; break;
        case "78": limitrophes = "27,28,91,92,95"; break;
        case "79": limitrophes = "16,17,49,85,86"; break;
        case "80": limitrophes = "02,60,62,76"; break;
        case "81": limitrophes = "11,12,31,34,82"; break;
        case "82": limitrophes = "12,31,32,46,47,81"; break;
        case "83": limitrophes = "04,06,13,84"; break;
        case "84": limitrophes = "04,07,13,26,30,83"; break;
        case "85": limitrophes = "17,44,49,79"; break;
        case "86": limitrophes = "16,27,36,49,79,87"; break;
        case "87": limitrophes = "16,19,23,24,36,86"; break;
        case "88": limitrophes = "52,54,55,67,68,70"; break;
        case "89": limitrophes = "10,21,45,58,77"; break;
        case "90": limitrophes = "25,68,70"; break;
        case "91": limitrophes = "28,45,77,78,92,94"; break;
        case "92": limitrophes = "75,78,91,95,94"; break;
        case "93": limitrophes = "75,77,92,94,95"; break;
        case "94": limitrophes = "75,77,91,92,93"; break;
        case "95": limitrophes = "27,60,77,78,92,93"; break;
    }
    return limitrophes;
}
```

En vrai, tout le boulot ingrat pour retrouver les bons départements avait
été fait par [Sunfox](http://sunfox.org/blog/2007/03/21/liste-de-departements-limitrophes-francais/).
