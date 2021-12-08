---
date: 2019-11-25 12:16:55+200
layout: post
tags: javascript
title: "De l'inconvénient d'utiliser aveuglément la dernière version de Node"
image: "/public/2019/le-corniaud.jpg"
excerpt: "Jusqu'à présent, j'utilise toujours la dernière version de Node. D'habitude ça marche mais ce coup-ci j'ai dû revenir en arrière."
---

Depuis que j'ai commencé à faire quelques trucs avec Node, j'ai toujours
travaillé avec la toute dernière version de Node. Pour cela, j'ai l'habitude de
faire des `choco upgrade -y nodejs` assez régulièrement.

<figure>
  <img src="{{ page.image }}" alt="le-corniaud" />
  <figcaption>
    <a href="https://fr.wikipedia.org/wiki/Le_Corniaud">Elle va marcher beaucoup moins bien... - Le Corniaud</a>
  </figcaption>
</figure>

Cela me permet de tester les dernières nouveautés de JavaScript sans passer par
Babel ou TypeScript. Ca marche parce que je ne fais que des bouts d'essais et
que je code et j'exécute tout en local. Sans doute que le jour où je voudrai
mettre en production et déployer mon code, j'aurai à revoir ce mode de
fonctionnement.

Mais je n'avais jamais eu le moindre problème jusqu'à présent (et pourtant je
travaille sous Windows). J'étais donc passé de la version 12.13.0 de Node à la
version 13.0.0 puis 13.1.0 sans m'inquiéter, d'autant plus que je faisais un
petit break côté Node.

Et quand j'ai voulu me remettre à mes essais avec le module "express-validator",
j'ai eu la désagréable surprise de constater que plus rien ne fonctionnait...

```
E:\Code\AppTestAA>npm start

> AppTest2@1.0.0 start E:\Code\AppTestAA
> node index

internal/modules/cjs/loader.js:803
    throw err;
    ^

Error: Cannot find module 'sqlite3'
Require stack:
- E:\Code\AppTestAA\index.js
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:800:15)
    at Function.Module._load (internal/modules/cjs/loader.js:693:27)
    at Module.require (internal/modules/cjs/loader.js:864:19)
    at require (internal/modules/cjs/helpers.js:74:18)
    at Object.<anonymous> (E:\Code\AppTestAA\index.js:4:17)
    at Module._compile (internal/modules/cjs/loader.js:971:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1011:10)
    at Module.load (internal/modules/cjs/loader.js:822:32)
    at Function.Module._load (internal/modules/cjs/loader.js:730:14)
    at Function.Module.runMain (internal/modules/cjs/loader.js:1051:12) {
  code: 'MODULE_NOT_FOUND',
  requireStack: [ 'E:\\Code\\AppTestAA\\index.js' ]
}
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! AppTest2@1.0.0 start: `node index`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the AppTest2@1.0.0 start script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\michel\AppData\Roaming\npm-cache\_logs\2019-11-20T14_43_27_840Z-debug.log

E:\Code\AppTestAA>
```

J'ai d'abord pensé avoir tout cassé avec mes derniers essais et je suis reparti
d'une version "propre" du projet. Mais quand j'ai voulu la lancer avant de
modifier quoique ce soit, rebelote !

Après avoir regardé vite fait les messages d'erreurs, je me suis dit que j'avais
peut-être une incompatibilité de version et j'ai essayé de réinstaller tous les
packages du projet :

```
PS E:\Code\AppTestAA> rd node_modules /s /q
PS E:\Code\AppTestAA> npm install

> sqlite3@4.1.0 install E:\Code\AppTestAA\node_modules\sqlite3
> node-pre-gyp install --fallback-to-build

node-pre-gyp WARN Using request for node-pre-gyp https download
node-pre-gyp WARN Tried to download(403): https://mapbox-node-binary.s3.amazonaws.com/sqlite3/v4.1.0/node-v79-win32-x64.tar.gz
node-pre-gyp WARN Pre-built binaries not found for sqlite3@4.1.0 and node@13.0.1 (node-v79 ABI, unknown) (falling back to source compile with node-gyp)
Génération des projets individuellement dans cette solution. Pour activer la génération en parallèle, ajoutez le commutateur "/m".
  unpack_sqlite_dep
TRACKER : error TRK0005: échec de localisation de : "CL.exe". Le fichier spécifié est introuvable. [E:\Code\AppTestAA\node_modules\sqlite3\build\deps\sqlite3.vcxproj]

gyp ERR! build error
gyp ERR! stack Error: `C:\Program Files (x86)\MSBuild\14.0\bin\MSBuild.exe` failed with exit code: 1
gyp ERR! stack     at ChildProcess.onExit (C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\lib\build.js:194:23)
gyp ERR! stack     at ChildProcess.emit (events.js:210:5)
gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:272:12)
gyp ERR! System Windows_NT 6.1.7601
gyp ERR! command "C:\\Program Files\\nodejs\\node.exe" "C:\\Program Files\\nodejs\\node_modules\\npm\\node_modules\\node-gyp\\bin\\node-gyp.js" "build" "--fallback-to-build" "--module=E:\\Code\\AppTestAA\\node_modules\\sqlite3\\lib\\binding\\node-v79-win32-x64\\node_sqlite3.node" "--module_name=node_sqlite3" "--module_path=E:\\Code\\AppTestAA\\node_modules\\sqlite3\\lib\\binding\\node-v79-win32-x64" "--napi_version=5" "--node_abi_napi=napi" "--napi_build_version=0" "--node_napi_label=node-v79"
gyp ERR! cwd E:\Code\AppTestAA\node_modules\sqlite3
gyp ERR! node -v v13.0.1
gyp ERR! node-gyp -v v5.0.5
gyp ERR! not ok
node-pre-gyp ERR! build error
node-pre-gyp ERR! stack Error: Failed to execute 'C:\Program Files\nodejs\node.exe C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\bin\node-gyp.js build --fallback-to-build --module=E:\Code\AppTestAA\node_modules\sqlite3\lib\binding\node-v79-win32-x64\node_sqlite3.node --module_name=node_sqlite3 --module_path=E:\Code\AppTestAA\node_modules\sqlite3\lib\binding\node-v79-win32-x64 --napi_version=5 --node_abi_napi=napi --napi_build_version=0 --node_napi_label=node-v79' (1)
node-pre-gyp ERR! stack     at ChildProcess.<anonymous> (E:\Code\AppTestAA\node_modules\node-pre-gyp\lib\util\compile.js:83:29)
node-pre-gyp ERR! stack     at ChildProcess.emit (events.js:210:5)
node-pre-gyp ERR! stack     at maybeClose (internal/child_process.js:1028:16)
node-pre-gyp ERR! stack     at Process.ChildProcess._handle.onexit (internal/child_process.js:283:5)
node-pre-gyp ERR! System Windows_NT 6.1.7601
node-pre-gyp ERR! command "C:\\Program Files\\nodejs\\node.exe" "E:\\Code\\AppTestAA\\node_modules\\node-pre-gyp\\bin\\node-pre-gyp" "install" "--fallback-to-build"
node-pre-gyp ERR! cwd E:\Code\AppTestAA\node_modules\sqlite3
node-pre-gyp ERR! node -v v13.0.1
node-pre-gyp ERR! node-pre-gyp -v v0.11.0
node-pre-gyp ERR! not ok
Failed to execute 'C:\Program Files\nodejs\node.exe C:\Program Files\nodejs\node_modules\npm\node_modules\node-gyp\bin\node-gyp.js build --fallback-to-build --module=E:\Code\AppTestAA\node_modules\sqlite3\lib\binding\node-v79-win32-x64\node_sqlite3.node --module_name=node_sqlite3 --module_path=E:\Code\AppTestAA\node_modules\sqlite3\lib\binding\node-v79-win32-x64 --napi_version=5 --node_abi_napi=napi --napi_build_version=0 --node_napi_label=node-v79' (1)
npm WARN AppTest2@1.0.0 No repository field.

npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! sqlite3@4.1.0 install: `node-pre-gyp install --fallback-to-build`
npm ERR! Exit status 1
npm ERR!
npm ERR! Failed at the sqlite3@4.1.0 install script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     C:\Users\michel\AppData\Roaming\npm-cache\_logs\2019-11-20T14_45_17_020Z-debug.log
```

Encore pire ! J'étudie alors un peu mieux les messages d'erreurs et il
semblerait donc que c'est le module "SQlite3" qui pose problème. En creusant, il
s'avère que le "binding" n'est pas à jour et qu'il n'existe pas encore pour la
version 13 de Node JS. Et je ne dois pas voir les bons trucs pour que NPM soit
capable de le builder à partir des sources...

Tant pis ! Je n'ai plus qu'à désinstaller Node 13.1.0 puis à réinstaller la
version 12.13.0 :

```
E:\Code\AppTestAA>choco uninstall -y nodejs
    (et répondre Y pour désinstaller nodejs.install aussi)
E:\Code\AppTestAA>choco install -y nodejs --version=12.13.0

E:\Code\AppTestAA>npm install

> sqlite3@4.1.0 install E:\Code\AppTestAA\node_modules\sqlite3
> node-pre-gyp install --fallback-to-build

node-pre-gyp WARN Using request for node-pre-gyp https download
[sqlite3] Success: "E:\Code\AppTestAA\node_modules\sqlite3\lib\binding\node-v72-win32-x64\node_sqlite3.node" is installed via remote
npm WARN AppTest2@1.0.0 No repository field.

added 174 packages from 135 contributors and audited 303 packages in 4.332s
found 0 vulnerabilities
```

Et ce coup-ci, `npm start` réussi à lancer correctement l'application.

Conclusion : il faudrait qu'à l'avenir je fasse un peu plus attention à ce que
j'utilise et aux problèmes de compatibilité que cela peut causer. Mais d'un
autre côté, c'est la première fois que je rencontre un tel problème...

{:.encart}
English version: [The problem with blindly using the latest Node]({% post_url 2019-11-26-problem-using-latest-nodejs %}){:hreflang="en"}.
