#!/usr/bin/env node
//shebang syntax
//this tells the os that this script will work on which env
let input=process.argv.slice(2);
let fs=require("fs");
let path=require("path");

let types={
    media:["mp4","mp3","mkv"],
    archives:['zip','rar','7z','tar','gz','ar','iso','xz'],
    documents:['docx','doc','pdf','ppt','pptx','xlxs','xls','odt','ods','odp','odz','odf','txt','ps','tes'],
    app:['exe','pkg','deb','dmg']

}
//node main.js tree "directory"
//node main.js organize "directory"
//node main.js help
let command=input[0];

switch(command){

    case "tree":
        treeFun(input[1]);
        break;

    case "organize":
        organizeFun(input[1]);
        break;

    case "help":
        helpFun();
        break;

    default:
        console.log("🙏🙏please enetr valid input");

}

function treeFun(dirPath){
    //console.log("tree suceesfully");
    let dest;
    if(dirPath==undefined){
        treeHelper(process.cwd(),"");
        return;
    } else{
        let exist=fs.existsSync(dirPath);
        if(exist){
           treeHelper(dirPath,"");
        }else{
            console.log("enter the path");
            return;
        }
    }


}

function treeHelper(dirPath,indent){
    //is file or folder
    let isFile=fs.lstatSync(dirPath).isFile();
    if(isFile){
        let filename=path.basename(dirPath);
        console.log(indent+"-------"+filename);
    }else{
        let dirName=path.basename(dirPath);
        console.log(indent+"---->>>"+dirName);
        let child=fs.readdirSync(dirPath);
        for(let i=0;i<child.length;i++){
            let childPath=path.join(dirPath,child[i]);
            treeHelper(childPath,indent+" \t");
        }
    }
}



function organizeFun(dirPath){
    //console.log("organize suceesfully");
    let dest;
    if(dirPath==undefined){
        console.log("enter the path");
        return;
    } else{
        let exist=fs.existsSync(dirPath);
        if(exist){
            //organized karna hai files unko ek directory mai rakhunga
            //ceate karunga folder
            dest=path.join(dirPath,"organized_files");
            if(fs.existsSync(dest)==false){
                fs.mkdirSync(dest);
            }
            

        }else{
            console.log("enter the path");
            return;
        }
    }
    //input--directory path
   
    //check karunga all files ko kis category ki files hai or kis type ki hai

    organizeHelper(dirPath,dest);
}

function organizeHelper(src,dest){

    let child=fs.readdirSync(src);//reading the dir

    //identify how many files are there
    for(let i=0;i<child.length;i++){
        let childAdd=path.join(src,child[i]);
        let isFile=fs.lstatSync(childAdd).isFile();
        if(isFile){
            let cat=getCategory(child[i]);
            console.log(child[i],"belongs to ",cat);
            sendFiles(childAdd,dest,cat);

        }

    }

}

function sendFiles(srcFile,dest,category){
    let categoryPath=path.join(dest,category);
    if(fs.existsSync(categoryPath)==false){
        fs.mkdirSync(categoryPath);
    }
    let fileName=path.basename(srcFile);
    let destpath=path.join(categoryPath,fileName);
    fs.copyFileSync(srcFile,destpath);
}

function getCategory(name){
    let extension=path.extname(name);
    extension=extension.slice(1);
    for(let type in types){
        let cType=types[type];
        for(let i=0;i<cType.length;i++){
            if(extension==cType[i]){
                return type;
            }
        }
    }
    return "others";
}

//their are only singlr line string in js
//to use in multiple line we first put back slash tick
function helpFun(){
    console.log(`
     list of all commands
     //node main.js tree "directory"
        //node main.js organize "directory"
        //node main.js help
    `);
}







