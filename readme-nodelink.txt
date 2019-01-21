initial project setup process
-----------------------------

create new repo "nodelink" on github
cd C:\@github\sw2go             ... go to where you locally want your repo to be created
git clone https://github.com/sw2go/nodelink.git
cd C:\@github\sw2go\nodelink    ... go to the git working-tree 

npm install @angular/cli        ... install the angular version you need for the project
ng --version                    ... check angular/cli version
ng new nlclient                 ... create the project 
rmdir node_modules /s           ... remove the previously installed cli again

cd nlclient                     ... go to the created project
npm install                     ... ensure  
ng serve                        ... test 

git add -A
git commit -m "initial setup"   ... got 'origin/master', but the upstream is gone. (use "git branch --unset-upstream" to fixup)
git branch --unset-upstream     ... an then 
git push -u origin master       ... did the trick

