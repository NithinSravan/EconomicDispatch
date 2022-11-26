/*
Input parameters: D-Demand, M-no. of generators | an,bn,cn - Cost characteristics; P(n,max),P(n,min) - Generator Limits
Output parameters:  Generator loadings and cost
*/

let nextbtn = document.getElementById("next");
let prevbtn = document.getElementById("prev");
let submitbtn=document.getElementById("submit");
let geninp=document.getElementById("geninp");
let snoinp=document.getElementById("snoinp");
let dmndinp=document.getElementById("dmndinp");
let formsection=document.querySelectorAll("section");
let manual=document.getElementById("manual");
let autom=document.getElementById("autom");

manual.addEventListener("click",()=>{
  document.getElementsByClassName("home")[0].classList.remove("unhide");
  document.getElementsByClassName("home")[0].classList.add("hide");
  document.getElementsByClassName("inst")[0].classList.remove("unhide");
  document.getElementsByClassName("inst")[0].classList.add("hide");
  document.querySelector("form").classList.remove("hide");

})
const csvDiv = document.getElementsByClassName("home");
autom.addEventListener("click",()=>{
  document.getElementsByClassName("home")[0].classList.remove("unhide");
  document.getElementsByClassName("home")[0].classList.add("hide");
  document.getElementsByClassName("inst")[0].classList.remove("unhide");
  document.getElementsByClassName("inst")[0].classList.add("hide");
    
  
  document.getElementById("submit").style.display="inline-block";
  csvDiv[1].classList.remove("hide");
  csvDiv[1].classList.add("unhide");
})
let d,n;
let flag=false;
let epsilon=0.0001;
let lambda=9;
let m=10000;
let a=[];
let b=[];
let c=[];
let pG=[];
let pMin=[];
let pMax=[];
let uploadData=(e)=>{

  const csvFile = document.getElementById("csvFile");
  let i=snoinp.value;
  const input = csvFile.files[0];
  const reader = new FileReader();
  reader.onload = function (e) {
     const text = e.target.result.split(/\r?\n/)[i].replace(/"/g,"");
     const params=text.split(",");
     n=parseFloat(params[0]);
     d=parseFloat(params[1]);
     for(let i=0;i<n;i++){
      a[i]=parseFloat(params[2+i])
      a[i]=parseFloat(a[i])
     }
     for(let i=0;i<n;i++){
      b[i]=parseFloat(params[2+n+i])
      b[i]=parseFloat(b[i])
     }
     for(let i=0;i<n;i++){
      c[i]=parseFloat(params[2+2*n+i])
      c[i]=parseFloat(c[i])
     }
     for(let i=0;i<n;i++){
      pMin[i]=parseFloat(params[2+3*n+i])
      pMin[i]=parseFloat(pMin[i])
     }
     for(let i=0;i<n;i++){
      pMax[i]=parseFloat(params[2+4*n+i])
      pMax[i]=parseFloat(pMax[i])
     }
    submitAuto();
  };
  reader.readAsText(input);
 
}
let submitAuto=()=>{
  for(let i=0;i<n;i++){
    invC[i]=1/(2*c[i]);
  }
  formsection[0].classList.remove("unhide");
  formsection[0].classList.add("hide");
  formsection[2].classList.remove("hide");
  formsection[2].classList.add("unhide");
  prevbtn.style.display="none";
  submitbtn.style.display="none";
  nextbtn.style.display="none";
  csvDiv[1].classList.remove("unhide");
  csvDiv[1].classList.add("hide");
  document.querySelector("form").classList.remove("hide");
  algorithm();

  graphCalc();
  dispOutput();
}


let createInpEle=(label,box)=>{

  const inpdiv = document.createElement('div');
  const inp = document.createElement('input');
  const lbl = document.createElement('label');
  inpdiv.classList.add("input-box");
  inp.classList.add("params");
  inp.setAttribute('type','text');
  inp.setAttribute('required','');

  lbl.innerText=label;

  box.appendChild(inpdiv);
  box.style.display="flex";
  box.style.flexDirection="row";
  box.style.justifyContent="space-between";
  formsection[1].appendChild(box);
  inpdiv.appendChild(inp);
  inpdiv.appendChild(lbl);

}

let alert=()=>{
  document.getElementsByClassName("inst")[1].classList.remove("hide");
  document.getElementsByClassName("inst")[1].classList.add("unhide");
}

let removeAlert=()=>{
  document.getElementsByClassName("inst")[1].classList.remove("unhide");
  document.getElementsByClassName("inst")[1].classList.add("hide");
}
let setInputFields=(e)=>{

  for(let i=0;i<n;i++){
    const genbox=document.createElement('div');
    const genname=document.createElement('div');
    formsection[1].appendChild(genname);
    genname.style.marginBottom="30px";
    genname.classList.add("text");
    genname.innerText=`Generator ${i+1}`;
    createInpEle("a",genbox);
    createInpEle("b",genbox);
    createInpEle("c",genbox);
    createInpEle("Pmin",genbox);
    createInpEle("Pmax",genbox);
  }
}
let copyParams=(e)=>{
  for(let i=0;i<n;i++){
    a[i]=parseFloat(document.getElementsByClassName("params")[5*i].value);
    b[i]=parseFloat(document.getElementsByClassName("params")[5*i+1].value);
    c[i]=parseFloat(document.getElementsByClassName("params")[5*i+2].value);
    pMin[i]=parseFloat(document.getElementsByClassName("params")[5*i+3].value);
    pMax[i]=parseFloat(document.getElementsByClassName("params")[5*i+4].value);
  }
}
let prevSection=(e)=>{
  formsection[0].classList.remove("hide");
  formsection[0].classList.add("unhide");
  formsection[1].classList.remove("unhide");
  formsection[1].classList.add("hide");
  prevbtn.style.display="none";
  submitbtn.style.display="none";
  nextbtn.style.display="inline-block";
  
  if(localStorage.getItem("n")!=n)formsection[1].innerHTML="";
  // copyParams();
}

let nextSection=(e)=>{

  n = geninp.value;
  d = dmndinp.value;
  console.log(n)
  if(n==''||d==''){
    alert();
    return;
  }
  removeAlert();
  formsection[0].classList.remove("unhide");
  formsection[0].classList.add("hide");
  formsection[1].classList.remove("hide");
  formsection[1].classList.add("unhide");
  prevbtn.style.display="inline-block";
  submitbtn.style.display="inline-block";
  nextbtn.style.display="none";
  
 
  if(!flag){
    flag=true;
    localStorage.setItem("n",n);
    setInputFields();
  }
  else if(localStorage.getItem("n")!=n){
    formsection[1].innerHTML="";
    setInputFields();
  }
}

let invC=[];

let dispOutput=()=>{
  console.log("lol")
  for(let i=0;i<n;i++){
    const op=document.createElement('div');
    const pgDiv=document.createElement('div');
    const cDiv=document.createElement('div');
    const graphBtn = document.createElement('button');
    
    formsection[2].appendChild(op);
    op.appendChild(pgDiv);
    op.appendChild(cDiv);
    op.appendChild(graphBtn);
    
    const pgBox = document.createElement('div');
    const nameLbl = document.createElement('span');
    const cBox = document.createElement('div');
    const cnameLbl = document.createElement('span');
  
    pgDiv.classList.add("pgDiv");
    pgBox.classList.add("pgBox");
    cDiv.classList.add("pgDiv");
    cBox.classList.add("pgBox");
    nameLbl.classList.add("nameLbl");
    cnameLbl.classList.add("nameLbl");
    graphBtn.classList.add("graphBtn");

    let grphBtnEle=document.getElementsByClassName("graphBtn");
    grphBtnEle[i].innerText="Show Graph";
    grphBtnEle[i].addEventListener("click",(e)=>{
      e.preventDefault();
      openGraph(i);
    });

    pgDiv.appendChild(nameLbl);
    pgDiv.appendChild(pgBox);
    cDiv.appendChild(cnameLbl);
    cDiv.appendChild(cBox);
    formsection[2].appendChild(graphBtn);
    
    nameLbl.innerHTML=`P<sub>${i+1}</sub>`;
    pgBox.innerText=pG[i].toFixed(2)+" MW";
    cnameLbl.innerHTML=`C<sub>${i+1}</sub>`;
    cBox.innerText= `Rs.${c[i]+b[i]*pG[i]+a[i]*pG[i]^2}`;
  }
}
let graphDiv=document.getElementsByClassName("graphsec");
let graphLbl=document.getElementsByClassName("g");
let grph=document.getElementsByClassName("pg");
let closeBtn=document.getElementsByClassName('closebtn');
let closed=true;

let closeGraph=(i)=>{
  closed=true;
  graphDiv[i].classList.remove("unhide");
  graphDiv[i].classList.add("hide");
}

let openGraph=(i)=>{
  closed=false;
  graphDiv[i].classList.remove("hide");
  graphDiv[i].classList.add("unhide");
}

let graphCalc=()=>{
  console.log("lmao")
  for(let i=0;i<n;i++){
  
    const grphDivEle=document.createElement('div');
    const grphLblEle=document.createElement('span');
    const grphEle=document.createElement('div');
    const closeBtnEle=document.createElement('button');
  
    document.body.appendChild(grphDivEle);
    grphDivEle.appendChild(grphLblEle);
    grphDivEle.appendChild(grphEle);
    grphDivEle.appendChild(closeBtnEle);
  
    grphDivEle.classList.add("graphsec");
    grphDivEle.classList.add("hide");
    grphLblEle.classList.add("g");
    grphEle.classList.add("pg");
    closeBtnEle.classList.add("closebtn");
  
    closeBtn[i].innerText="Close";
  
    closeBtn[i].addEventListener("click",(e)=>{
      e.preventDefault();
      closeGraph(i)
    });
    // graphDiv[i].classList.add("unhide");
    graphLbl[i].innerHTML=`Generator ${i+1}`;
    console.log("f");
    let graph = Desmos.GraphingCalculator(grph[i],{keypad:false});
  
    graph.updateSettings({ xAxisLabel: 'P' });
    graph.updateSettings({ yAxisLabel: 'C' });
    graph.setMathBounds({
      left: 0,
      right: pMax[i],
      bottom: 0,
      top: c[i]+b[i]*pMax[i]+a[i]*pMax[i]^2
    });
  
    graph.setExpression({ id: "graph1", latex: `${c[i]}+${b[i]}*x+${a[i]}*x^2=y` ,color:'#ff0b54'});
  }
 
}
 let checkArr=(arr)=>{
  let f=true;
  arr.forEach(d=>{
    if(isNaN(d))
    f=false
  })
  if(!f)return true
  return false;
 }
let submitForm=(e)=>{
  copyParams();

  if(checkArr(a)||checkArr(b)||checkArr(c)||checkArr(pMin)||checkArr(pMax)){
    alert();
    return;
  }
  removeAlert()
  formsection[1].classList.remove("unhide");
  formsection[1].classList.add("hide");
  formsection[2].classList.remove("hide");
  formsection[2].classList.add("unhide");
  prevbtn.style.display="none";
  submitbtn.style.display="none";
  nextbtn.style.display="none";

  for(let i=0;i<n;i++){
    invC[i]=1/(2*c[i]);
  }
  
  algorithm();
  //console.log(invC)
  graphCalc();
  dispOutput();

}

let sumArr=(arr)=>{
  let sum=0;
  arr.forEach(e=>{
    sum+=e;
  })
  return sum;
}

let algorithm=(e)=>{

  let k=0;
  console.log("hi")

  delP=0.1;

  while(k<m||Math.abs(delP)>epsilon){

    for(let i=0;i<n;i++){
      pG[i]=(lambda-b[i])/(2*c[i]);

      if(pG[i]<pMin[i]){
        pG[i]=pMin[i];
      }
      else if(pG[i]>pMax[i]){
        pG[i]=pMax[i];
      }
    }

    delP=d-sumArr(pG);
    if(Math.abs(delP)<=epsilon)break;
    if(k>m)break;
    delLambda=delP/sumArr(invC);
    lambda=lambda+delLambda;
    k++;
  }   
}