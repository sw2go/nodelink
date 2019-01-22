initial project setup process
-----------------------------
npm install @angular/cli@1      ... Angular 5 CLI
npm install @angular/cli@6      ... Angular 6 CLI
npm install @angular/cli@7      ... Angular 7 CLI



create new repo "nodelink" on github
cd C:\@github\sw2go             ... go to where you locally want your repo to be created
git clone https://github.com/sw2go/nodelink.git
cd C:\@github\sw2go\nodelink    ... go to the git working-tree 

npm install @angular/cli@6      ... install the angular version you need for the project
ng --version                    ... check angular/cli version
ng new nlclient                 ... create the project 
rmdir node_modules /s           ... remove the previously installed cli again

cd nlclient                     ... go to the created project
npm install                     ... ensure  
ng serve                        ... test 

git add -A                      ... stage
git commit -m "initial setup"   ... commit but got 'origin/master', but the upstream is gone. (use "git branch --unset-upstream" to fixup)
git branch --unset-upstream     ... an then 
git push -u origin master       ... did the trick   ( -u sets upstream )


npm install @swimlane/ngx-graph --save
npm install @angular/cdk@6 --save
npm install d3 --save
