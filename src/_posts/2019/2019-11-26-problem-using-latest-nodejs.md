---
date: 2019-11-26 12:28:44+200
layout: post
tags: javascript
lang: en-US
title: "The problem with blindly using the latest Node"
image: "/public/2019/le-corniaud.jpg"
excerpt: "Until a few days ago, I've always used the latest version of Node. Usually it works well, but this time I had to go back."
---

Since I started doing some testing with Node, I've always worked with the latest version of Node. And that's why I am used to do `choco upgrade -y nodejs` quite regularly.

<figure>
  <img src="{{ page.image }}" alt="le-corniaud" />
  <figcaption>
    <a href="https://en.wikipedia.org/wiki/The_Sucker">It will not work as well... - Le Corniaud</a>
  </figcaption>
</figure>

This allows me to use the latest JavaScript features without going through Babel or TypeScript. It works because I only do test runs and code and execute everything locally. No doubt that the day I want to put my code into production and deploy it, I will have to review this mode of operation.

But I had never had any problems until now (and yet I work under Windows). So I went from version 12.13.0 of Node to version 13.0.0.0 and then 13.1.0 without worrying, especially since I was taking a little break on the Node side.

And when I wanted to get back to my tests with the "express-validator" module, I was surprised to find that nothing was working anymore...

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

At first I thought I had broken everything with my last attempts. So I start again from a "clean" version of the project. I tried to launch this clean code, and here it comes again!

After a quick look at the error messages, I found I might have a version mismatch and tried to reinstall all the packages:

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

Even worse! I read the error messages a little better and it seems that the "SQlite3" module is the problem. While digging, it turns out that the binding isn't up to date and that it doesn't yet exist for Node 13. And that my configuration can't build it from sources...

Never mind! All I have to do is uninstall Node 13 and then reinstall version 12.13.0:

```
E:\Code\AppTestAA>choco uninstall -y nodejs
    (and answer Y to uninstall nodejs.install too)
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

And this time, `npm start` successfully launched the application.

Conclusion: I should pay a little more attention in the future to what I use and the compatibility problems it can cause. But on the other hand, it's the first time I've encountered such a problem...

{:.encart}
Version en français : [De l'inconvénient d'utiliser aveuglément la dernière version de Node]({% post_url 2019-11-25-inconvenient-derniere-version-node-js %}){:hreflang="fr"}.
