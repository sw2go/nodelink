initial project setup process
-----------------------------
npm install @angular/cli@1      ... Angular 5 CLI
npm install @angular/cli@6      ... Angular 6 CLI
npm install @angular/cli@7      ... Angular 7 CLI



create new repo "nodelink" on github
cd C:\@github\sw2go             ... go to where you locally want your repo to be created
git clone https://github.com/sw2go/nodelink.git
cd C:\@github\sw2go\nodelink    ... go to the git working-tree 

npm install @angular/cli        ... install the angular version you need for the project
ng --version                    ... check angular/cli version
ng new nlclient                 ... create the project, use --style=scss --routing
rmdir node_modules /s           ... remove the previously installed cli again
del package-lock.json               and the lock

cd nlclient                     ... go to the created project
npm install                     ... ensure  
ng serve                        ... test 

git add -A                      ... stage
git commit -m "initial setup"   ... commit but got 'origin/master', but the upstream is gone. (use "git branch --unset-upstream" to fixup)
git branch --unset-upstream     ... an then 
git push -u origin master       ... did the trick   ( -u sets upstream )


copy projects folder from C:\@githubsw2go\ngx-graph\projects to nlclient
add the "@swimlane/ngx-graph" section to projects in angular.json
add import { version } and version to environment.ts
add allowSyntheticDefaultImports and following to tsconfig.json
add "@swimlane/ngx-charts": "^10.0.0" to dependencies in package.json
add "d3-dispatch" and following to dependencies in package.json
add  "@angular/cdk": "~7.2.0" to dependencies in package.json

add BrowserAnimationsModule to app.module.ts
add NgxGraphModule to app.module.ts



npm install @swimlane/ngx-graph --save
npm install @angular/cdk@6 --save
npm install d3 --save


Later Update:
-------------
1. on github ngx-graph updated to latest swimlane version
2. all files from projects in ngx-graph copied to nodelink projects
3. Apply fixes to graph.component.ts

Fix 1: for Firefox issues:
--------------------------
[WDS] Disconnected! in sockjs.js / zone.js
Hack! in angular.json at "architect", "serve", "options" set "disableHostCheck": true

ReferenceError: TouchEvent is not defined
./projects/swimlane/ngx-graph/src/lib/graph/graph.component.ts:958:22

Hack Solution in graph.component.ts! 
-> comment out the @HostListener('document:touchmove', ['$event']) 

Fix 2: Link-Labels are not updated ...
--------------------------------------
- reason was that this._oldLinks contains old links ( with old labels ) 
- they were taken as basis for the newLink ( without considering new values in this.graph.edges

Hack Solution in graph.component.ts! 
-> find const normKey = edgeLabelId.replace(/[^\w-]*/g, '');
-> add to the if (!oldLink) { } the following "else"
   else {   // solution for "link-labels were not updated ..."
     let edge = this.graph.edges.find(nl => `${nl.source}${nl.target}` === normKey) || edgeLabel;
     if (edge)
     oldLink.label = edge.label;   // maybe add others if they need to be displayed in graph
   }

Fix 3: svg href in textPath works in Chrome but fails in Firefox
----------------------------------------------------------------
- [attr.href]="'#' + link.id" 
- Sample: with url="/"    the href='#L33' works in Chrome and Firefox
          with url="xyz"  the href='#L33' works in Chrome but fails in Firefox

Fix 4: Exception when before Destroying compoment
-------------------------------------------------
-> in graph.component.ts 
-> fix in applyNodeDimensions() to avoid null-ref exceptions
   find "const node = this.graph.nodes.find(n => n.id === nativeElement.id);"
   add  "if (!node) return;"


General Tips:
Check Source-Code of graph.component.ts and other classes in the projects folder.

Debugging:
----------
- Important, always open VSCode at the project-folder location, otherwise Debugging won't work
- the folder .vscode (containing the launch.json file) must be on same level as the package.json
- then ng serve and VSCode "Debug"
- set port in launch.json to same as the one used by "ng serve"


