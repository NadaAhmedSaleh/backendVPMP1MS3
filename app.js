const express = require('express');
const app = express();
const cors = require("cors");
const fs = require('fs');
app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, X-Auth-Token, Content-Type, Accept"
  );
  // res.header("Access-Control-Expose-Headers", "Access-Token", "X-Auth-Token")
  next();
});
app.use(
  cors({
    origin: true, credentials: true,
    exposedHeaders: "X-Auth-Token"
  })
);




//get result of query
app.get('/getText/',(req,res)=>{

  fs.readFile("try.txt", function(err, buf) {
    if(err) res.send("error",err);
    else{
    res.send( wholeCode( buf.toString()) )
    }
  });
 console.log(returnOneSequential( ["whenflagclicked","forever","F[","if","IF[","touchingobject;[Ben]","broadcast;[ballhit]","IF]","F]",""] ))
})

function myTrim(x) {
  return x.replace(/^\s+|\s+$/gm,'');
}


function wholeCode (text){
  text = myTrim(text)
  var spritesArr = text.split("*****************************#\n");

  var finalArr = []

  for (var i = 1 ; i< spritesArr.length;i++)
  {
    
    var oneSpriteSeq = spritesArr[i].split("-------------(New Sequential Blocks)----------------#\n")
    var oneSprite = [oneSpriteSeq[0]]
    for(j =1 ; j<oneSpriteSeq.length;j++){
      oneSprite.push(returnOneSequential(oneSpriteSeq[j].split("#\n")))
    }
    finalArr.push(oneSprite)
  }
  return finalArr;
}


function oneSequential(text) {
 text = myTrim(text)
  return text.split("#");
}



function removeBrackets(text){
  //[gooo]-->gooo
  if(text.charAt(0)=='[' )
  return text.substring(1,text.length-1)
  else
  return text
}

function get2ElementsArray (text){
  //"[yarb goal,1.5]"-->[yarbgoal,1.5]

  return (removeBrackets(text)).split(",");
}

function oneLineFunctions(text){ 

  firstSplit = text.split(";")

  switch (firstSplit[0]){
  // repeat;10 --> [repeat,10]
  // wait;0.2 --> [wait,0.2]
  // say;[gooo ben] --> [say,gooo ben]
  // think;[hmmm] --> [think,hmmm]
  // touchingobject;[Soccer Ball] --> [touchingobject,Soccer Ball]
  // pointindirection;[90] --> [pointindirection,90]
  // switchcostumeto;[ben-a] --> [switchcostumeto,ben-a]
  // movesteps;[10] --> [ movesteps,10]
  // turnleft;[30] --> [turnleft,30]
  // setx;[3] --> [setx,3]
  // sety;[-77] --> [sety,-77]
  // changexby;[5] --> [changexby,5] 
  // changeyby;[1] --> [changeyby,1]
  // broadcast;[ballhit] --> [broadcast,ballhit]
  // whenkeypressed;[up arrow] --> [whenkeypressed,up arrow]
  // whenbroadcastreceived;[mshgoal] --> [whenbroadcastreceived,mshgoal]
  //  case "repeat":
    case "wait":
    case "say":
    case "think":
    case "touchingobject":
    case "pointindirection":
    case "switchcostumeto":
    case "movesteps":
    case "turnleft":
    case "setx":
    case "sety":
    case "changexby":
    case "changeyby":
    case "broadcast":
    case "whenbroadcastreceived":
    case "whenkeypressed":
      return [firstSplit[0],removeBrackets(firstSplit[1])];


    // thinkforsecs;[yarb goal,1.5] --> [thinkforsecs,yarb goal,1.5]
    // sayforsecs;[opps,1.5] --> [sayforsecs,opps,1.5]
    // gotoxy;[-156,-18] --> [gotoxy,-156,-18]

    case "thinkforsecs":
    case "sayforsecs":
    case "gotoxy":
      return [firstSplit[0]].concat(get2ElementsArray(firstSplit[1]));


   // nextcostume --> [nextcostume]
   // whenflagclicked --> [whenflagclicked]

    case "nextcostume":
    case "whenflagclicked":
      return [firstSplit[0]];


    default:
      return;
  

  }

}

//"if","IF[","touchingobject;[Ben]","broadcast;[ballhit]","IF]"

function returnOneSequential(arr){
 var finalArr = []
  for (var i = 0; i<arr.length ;i++){
    if(arr[i].split(";")[0]=="if"){
      var newArr = ["if"]
      var startIndex = i+2;
      var endIndex = arr.indexOf("IF]")
      if(endIndex==-1 )
       endIndex = arr.indexOf("IF]#")
      var subArr = arr.slice(startIndex,endIndex)
      newArr.push(returnOneSequential(subArr))
      finalArr.push(newArr)
      i = endIndex
      console.log("if")
      console.log(newArr)

    }
   else if(arr[i].split(";")[0]=="wait_until"){
      var newArr = ["wait_until"]
      var startIndex = i+2;
      var endIndex = arr.indexOf("WU]")
      if(endIndex==-1 )
       endIndex = arr.indexOf("WU]#")
      var subArr = arr.slice(startIndex,endIndex)
      newArr.push(returnOneSequential(subArr))
      finalArr.push(newArr)
      i = endIndex
      console.log("wait_until")
      console.log(newArr)

    }
    else if(arr[i].split(";")[0]=="repeat_until"){
      var newArr = ["repeat_until"]
      var startIndex = i+2;
      var endIndex = arr.indexOf("RU]")
      if(endIndex==-1 )
       endIndex = arr.indexOf("RU]#")
      var subArr = arr.slice(startIndex,endIndex)
      newArr.push(returnOneSequential(subArr))
      finalArr.push(newArr)
      i = endIndex
      console.log("repeat_until")
      console.log(newArr)

    }

   else if(arr[i].split(";")[0]=="if_else"){
      var newArr = ["if_else"]
      var startIndex = i+2;
      var endIndex = arr.indexOf("IF-E]")
      if(endIndex==-1 )
       endIndex = arr.indexOf("IF-E]#")
      var subArr = arr.slice(startIndex,endIndex)
      newArr.push(returnOneSequential(subArr))
      finalArr.push(newArr)
      i = endIndex
      console.log("if_else: ")
      console.log(newArr)

    }
     else if (arr[i].split(";")[0]=="forever"){
       console.log(arr)
      var newArr = ["forever"]
      var startIndex = i+2;
      var endIndex = arr.indexOf("F]")
      if(endIndex==-1 )
       endIndex = arr.indexOf("F]#")
      var subArr = arr.slice(startIndex,endIndex)
      newArr.push(returnOneSequential(subArr))
      finalArr.push(newArr)
      i = endIndex
      //console.log("forever: ",i)
      //console.log(newArr)
    }
    else if (arr[i].split(";")[0]=="repeat"){
      
      var newArr = arr[i].split(";")
      var startIndex = i+2;
      var endIndex = arr.indexOf("R]")
      if(endIndex==-1 )
       endIndex = arr.indexOf("R]#")
      var subArr = arr.slice(startIndex,endIndex)
      newArr.push(returnOneSequential(subArr))
      finalArr.push(newArr)
      i = endIndex
     // console.log("repeat")
     // console.log(newArr)
    }
    else if(arr[i]==""){
      finalArr= finalArr

    }
    else{
      finalArr.push(oneLineFunctions(arr[i]))
    }
  }


  return finalArr

}

  





app.listen(8000||env.config.Port,()=>{ console.log("listening on 8000") });










