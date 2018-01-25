var AJM=1;var ASM=2;var AE=3;var ASF=4;var AQ=5;var RW=true;var TH0=0;var TH1=8;var TH2=17;var TH3=67;var TH4=120;var TH5=390;var RM=7;var RD=4;var PW=1;var PY=2;var PP=3;var PC=4;var PR=5;var PG=6;var PB=7;var PK=8;var LN=0;var LCLR=PW;var LT=PB;var LA=PP;var LRL0=PC;var LRL1=PG;var LRL2=LRL0;var LRM0=PR;var LRM1=PB;var LRM1_WRP=PK;var LRM2=PG;var LRR0=PG;var LRR1=PW;var LRR1U=PR;var LRR1V=PY;var LRR1X=PK;var LRR2=PY;var LMX_M0=LCLR;var LMX_M1IN=PC;var LMX_M1OUT=PY;var LMX_M2IN=PP;var LMX_M2OUT=PR;var LMX_M3IN=PB;var LMX_M3OUT=PK;var LMS_WRP=PK;var LMR0=PK;var LML1=PY;var LMR2=PR;var LML3=PC;var LMMF=PG;var LMMH=PP;var LG3=PK;var LG4=PR;var LG5=PK;var LG6=PB;var LP0=LCLR;var LPB=PC;var LPG=PY;var LPG1=PR;var LPX=PP;var FALSE_X9=[false,false,false,false,false,false,false,false,false];
var UNDEF_X9=[undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined,undefined];
var QCPERD=6;var LCL_QC_RESET=LCLR;var LCRQC=[PY,PP,PC,PR,PG,PK];var LCRQCVAL=Array.from(FALSE_X9);
var LCRQC_VALUE=Array.from(UNDEF_X9);
for (var i=0; i<QCPERD; i++) {LCRQCVAL[LCRQC[i]]=true;LCRQC_VALUE[LCRQC[i]]=i;}var SCPERD=7;var LCL_SC_RESET=LCLR;var LCRSC=[PY,PP,PC,PR,PG,PB,PK];
var LCRSCVAL=Array.from(FALSE_X9);
var LCRSC_VALUE=Array.from(UNDEF_X9);
for (i=0; i<SCPERD; i++) {LCRSCVAL[LCRSC[i]]=true;LCRSC_VALUE[LCRSC[i]]=i;}var LCRPHR=Array.from(FALSE_X9);
LCRPHR[LPG]=true;LCRPHR[LPG1]=true;var LCRPHASES=Array.from(LCRPHR);
LCRPHASES[LPX]=true;var LCRGRM1=Array.from(FALSE_X9);
LCRGRM1[LRM1]=true;LCRGRM1[LRM1_WRP]=true;var LCRGRM_ALL=Array.from(FALSE_X9);
LCRGRM_ALL[LRM0]=true;LCRGRM_ALL[LRM1]=true;LCRGRM_ALL[LRM1_WRP]=true;LCRGRM_ALL[LRM2]=true;var LCRGRR1_OUT=Array.from(FALSE_X9);
LCRGRR1_OUT[LRR1V]=true;LCRGRR1_OUT[LRR1X]=true;var LCRGRR1B=Array.from(LCRGRR1_OUT);
LCRGRR1B[LRR1U]=true;var LCRGRR1=Array.from(LCRGRR1B);
LCRGRR1[LRR1]=true;var LCRMX_IO=Array.from(FALSE_X9);
LCRMX_IO[LMX_M1IN]=true;LCRMX_IO[LMX_M1OUT]=true;LCRMX_IO[LMX_M2IN]=true;LCRMX_IO[LMX_M2OUT]=true;LCRMX_IO[LMX_M3IN ]=true;LCRMX_IO[LMX_M3OUT]=true;var LCRMX=Array.from(LCRMX_IO);
LCRMX[LMX_M0]=true;var LCRMX_IN=Array.from(FALSE_X9);
LCRMX_IN[LMX_M1IN]=true;LCRMX_IN[LMX_M2IN]=true;LCRMX_IN[LMX_M3IN ]=true;var LCRMX_OUT=Array.from(FALSE_X9);
LCRMX_OUT[LMX_M1OUT]=true;LCRMX_OUT[LMX_M2OUT]=true;var LCRMM_FOOD=Array.from(FALSE_X9);
LCRMM_FOOD[LCLR]=true;LCRMM_FOOD[LMMF]=true;var LCRMM_HOME=Array.from(FALSE_X9);
LCRMM_HOME[LCLR]=true;LCRMM_HOME[LMMH]=true;var LCRMS=Array.from(FALSE_X9);
LCRMS[LCLR]=true;LCRMS[LMS_WRP]=true;var LCRFRLL0=Array.from(FALSE_X9);
LCRFRLL0[LCLR]=true;LCRFRLL0[LMR0]=true;LCRFRLL0[LMR2]=true;LCRFRLL0[LRM0]=true;LCRFRLL0[LRM2]=true;var LCRFRLL1=Array.from(FALSE_X9);
LCRFRLL1[LCLR]=true;LCRFRLL1[LMR0]=true;LCRFRLL1[LMR2]=true;LCRFRLL1[LG3]=true;LCRFRLL1[LRR0]=true;LCRFRLL1[LRM1]=true;var LCRFRLL2=Array.from(FALSE_X9);
LCRFRLL2[LCLR]=true;LCRFRLL2[LMR0]=true;LCRFRLL2[LMR2]=true;LCRFRLL2[LRM0]=true;LCRFRLL2[LMS_WRP]=true;var TN=8;var POSC=4;var NOP={cell:POSC};var AIMU=1;var AIML=3;var AIMR=5;var AIMD=7;var FWD_CELLS=[[ true,true,false,true,true,false,false,false,false ],[ true,true,true,true,true,true,false,false,false ],[ false,true,true,false,true,true,false,false,false ],[ true,true,false,true,true,false,true,true,false ],[ true,true,true,true,true,true,true,true,true ],[ false,true,true,false,true,true,false,true,true ],[ false,false,false,true,true,false,true,true,false ],[ false,false,false,true,true,true,true,true,true ],[ false,false,false,false,true,true,false,true,true ]];var PTNOM=-9;var PTHOME=[LRM0,LRL0,LRM0,LRL0,LN,LRL0,LN,LN,LRM0];var PTGARDEN=[LG6,LG5,LG4,LN,LN,LG3,LN,LRL0,LRL1];var PTFRM0=[LRL1,LRM1,LCRGRR1,LRL0,LRM0,LRR0,LRL2,LRM2,LRR2];var PTFRM1=[LRL2,LRM2,LRR2,LRL1,LCRGRM1,LCRGRR1,LRL0,LRM0,LRR0];var PTFRM2=[LRL0,LRM0,LRR0,LRL2,LRM2,LRR2,LRL1,LCRGRM1,LCRGRR1];var PTGRM0=[LRL1,LCRGRM1,LCRGRR1,LRL0,LRM0,LRR0,LRL2,LRM2,LRR2];var PTGRM1=PTFRM1;var PTGRM2=PTFRM2;var PTGRM2B=[LRL0,LRM0,LRR0,LRL2,LRM2,LRR2,LRL1,LCRGRM1,LCRGRR1B];var PTGRM1_WRP=[LRL2,LRM2,LRR2,LRL1,LRM1_WRP,LRR1X,LRL0,LRM0,LRR0];var PTFRL0=[LCRFRLL1,LRL1,LRM1,LCRFRLL0,LRL0,LRM0,LCRFRLL2,LRL2,LRM2];var PTFRL1=[LCRFRLL2,LRL2,LRM2,LCRFRLL1,LRL1,LCRGRM1,LCRFRLL0,LRL0,LRM0];var PTFRL0H=[LN,LRL1,LRM1,LN,LRL0,LRM0,LN,LN,LN];var PTFRL1G=[LCRFRLL2,LRL2,LRM2,LG3,LRL1,LCRGRM1,LCRPHASES,LRL0,LRM0];var PTFRL2=[LCRFRLL2,LRL0,LRM0,LCRFRLL1,LRL2,LRM2,LCRFRLL0,LRL1,LCRGRM1];var PTGRL0=[LCRFRLL1,LRL1,LCRGRM1,LCRFRLL0,LRL0,LRM0,LCRFRLL2,LRL2,LRM2];var PTGRL1=PTFRL1;var PTGRL2=PTFRL2;var PTGRR0=[LCRGRM1,LCRGRR1,LCLR,LRM0,LRR0,LMR0,LRM2,LRR2,LCRMX];var PTGRR2=[LRM0,LRR0,LMR0,LRM2,LRR2,LCRMX,LCRGRM1,LCRGRR1,LCLR];var PTGRR1=[LRM0,LCRGRM1,LRM2,LRR0,LCRGRR1,LRR2,LMR0,LCLR,LCRMX];var PTMS0R_IN=[LRR0,LRR1U,LRR2,LMR0,LCLR,LCRMX_IN,LCLR,LCLR,LML1];var PTMS0R_OUT=[LRR0,LRR1U,LRR2,LMR0,LCLR,LCRMX_IO,LCLR,LCLR,LML1];var PTMS0R_OUT1=[LRR0,LCRGRR1_OUT,LRR2,LMR0,LCLR,LCRMX,LCLR,LCLR,LML1];var PTMS0=[LCLR,LCRMM_HOME,LML3,LMR0,LCRMM_FOOD,LCLR,LCLR,LCLR,LML1];var PTMS1=[LMR0,LCRMM_HOME,LCLR,LCLR,LCRMM_FOOD,LML1,LMR2,LCLR,LCLR];var PTMS2=[LCLR,LCRMM_HOME,LML1,LMR2,LCRMM_FOOD,LCLR,LCLR,LCLR,LML3];var PTMS3=[LMR2,LCRMM_HOME,LCLR,LCLR,LCRMM_FOOD,LML3,LMR0,LCLR,LCLR];var PTMS1_IN=[LMR0,LCRMM_HOME,LCRMX_IN,LCLR,LCRMM_FOOD,LML1,LMR2,LCLR,LCLR];var PTMS1_IO=[LMR0,LCRMM_HOME,LCRMX_IO,LCLR,LCRMM_FOOD,LML1,LMR2,LCLR,LCLR];var PTMS0_OUT=[LCLR,LCLR,LML3,LMR0,LCLR,LCRMX_IO,LCLR,LCLR,LML1];var PTMS0_WRAPPING=[LCLR,LCRMM_HOME,LML3,LMR0,LCRMM_FOOD,LCRMS,LRL0,LRL1,LRL2];var PTGRL1_WRP=[LMR0,LCLR,LMS_WRP,LRL0,LRL1,LRL2,LRM0,LRM1_WRP,LRM2];var PTMS0FL=[LMMH,LML3,LN,LMMF,LCLR,LN,LCLR,LML1,LN];var PTMS1FL=[LMMH,LCLR,LN,LMMF,LML1,LN,LCLR,LCLR,LN];var PTMS2FL=[LMMH,LML1,LN,LMMF,LCLR,LN,LCLR,LML3,LN];var PTMS3FL=[LMMH,LCLR,LN,LMMF,LML3,LN,LCLR,LCLR,LN];var PTMS0FR=[LN,LCLR,LMMH,LN,LMR0,LMMF,LN,LCLR,LCLR];var PTMS1FR=[LN,LMR0,LMMH,LN,LCLR,LMMF,LN,LMR2,LCLR];var PTMS2FR=[LN,LCLR,LMMH,LN,LMR2,LMMF,LN,LCLR,LCLR];var PTMS3FR=[LN,LMR2,LMMH,LN,LCLR,LMMF,LN,LMR0,LCLR];var CCW=[6,7,8,5,2,1,0,3,6,7,8,5,2,1,0,3,6,7,8,5,2,1];
var xn=-1;var fwdWrong=[];var rearWrong=[];var here=view[POSC];var mC=here.color;var myself=here.ant;var mT=myself.type;var mF=myself.food;var mS=(mT==AE||(mT!=AQ&&mF>0));
var dOK=[true,true,true,true,true,true,true,true,true];
var uo=true;var sL=[0,0,0,0,0,0,0,0,0];var sD=[0,0,0,0,0,0,0,0,0];var sN=[0,0,0,0,0,0,0,0,0];var sT=[0,0,0,0,0,0,0,0,0];var fdL=0;var fdD=0;var fdT=0;sT[mC]++;for (i=0; i<TN; i+=2) {var cell=view[CCW[i]];sD[cell.color]++;sN[cell.color]++;sT[cell.color]++;if (cell.food>0) {fdD++;fdT++;if (mS) {dOK[CCW[i]]=false;uo=false;}}}for (i=1; i<TN; i+=2) {var cell=view[CCW[i]];sL[cell.color]++;sN[cell.color]++;sT[cell.color]++;if (cell.food>0) {fdL++;fdT++;if (mS) {dOK[CCW[i]]=false;uo=false;}}}var aF=[0,0,0,0,0,0];var aLF=[0,0,0,0,0,0];var aUF=[0,0,0,0,0,0];var fT=0;var mQ=0;var aE=[0,0,0,0,0,0];var aLE=[0,0,0,0,0,0];var aUE=[0,0,0,0,0,0];var eT=0;for (i=0; i<TN; i++) {var cell=view[CCW[i]];if (cell.ant) {if (cell.ant.friend) {aF[cell.ant.type]++;fT++;if (cell.ant.type==AQ) {xn=i&6;mQ=i&1;}if (cell.ant.food>0) {aLF[cell.ant.type]++;} else {aUF[cell.ant.type]++;}} else {aE[cell.ant.type]++;eT++;if (cell.ant.food>0) {aLE[cell.ant.type]++;} else {aUE[cell.ant.type]++;}}dOK[CCW[i]]=false;uo=false;}}switch (mT) {case AQ:return (rQSs());case ASF:if (mQ==1) {return (rSSs());} else if (aF[AQ]>0) {return (rGSs());} else {return (rLSSs());}case AE:return (rESs());case AJM:case ASM:if (aE[AQ]>0) {return (rDSs());} else if (mF>0) {return (rLSs());} else {return (rUSs());}default:return NOP;}function rQSs () {switch (aF[ASF]) {case 0:return (rQScrSy());case 1:for (var i=0; i<TN; i++) {var cell=view[CCW[i]];if (cell.ant&&cell.ant.type==ASF) {
xn=i&6;if (i&1) {return (rQLvSy());} else {return (rQSgSy());}}}break;case 2:for (i=0; i<TN; i+=2) {var cell0=view[CCW[i]];var cell1=view[CCW[i+1]];if ((cell0.ant&&(cell0.ant.type==ASF))&&
(cell1.ant&&(cell1.ant.type==ASF))
) {xn=i;return (rQOSy());}}return (rQCSy());default:return (rQCSy());}return NOP;}function rSSs () {return (rSOSy());}function rGSs () {var secCell=view[CCW[xn+7]];if (secCell.ant&&(secCell.ant.friend==1)&&
(secCell.ant.type==ASF)) {return (rGOSy());} else {return (rGSSy());}return NOP;}function rESs () {if (aF[AQ]>0) {return (rEHyS());} else if (aF[AJM] +aF[ASM]>0) {return (rEBRSy());} else {return (rEASy());}return NOP;}function rDSs() {if (aF[AQ]>0) {return (rDHSy());}return NOP;}function rUSs () {if ((fT+eT>=4)&&(aF[AJM]+aF[ASM] +aF[AE]>=3)) {return (rUCRSy());} else if (aF[AQ]>0) {return (rUHSy());} else if (aF[ASF]>0) {return (rURHSy());} else if (aF[AE]>0) {return (rUBRSy());} else if (spcRL1()) {return (rULRL1Sy());} else if (spcRR0()) {return (rULRR0Sy());} else if (spcRR2()) {return (rULRR2Sy());} else if (spcMS()) {return (rUDSSy());} else if (spcRL02()) {return (rULRL02Sy());} else if (spcRM()) {return (rUTRRSy());} else if (spcRR1()) {return (rUPSSy());} else if (spcMS0R()) {return (rUESSy());} else if (spcMS0W()) {return (rUSWSy());}return (rLostMSy(true));}function rLSs () {if ((fT>=3)&&(fT+eT>=4)) {return (rLCRSy());} else if (aF[ASF]>0) {return (rLRHSy());} else if (spcMFL()) {return (rLLLWSy());} else if (spcMFR()) {return (rLLRWSy());} else if (spcRL1()) {return (rLLRL1Sy());} else if (spcRR0()) {return (rLLRR0Sy());} else if (spcRR2()) {return (rLLRR2Sy());} else if (spcMS0R()) {return (rLLSSy());} else if (spcMS0ROut()) {return (rLLVSSy());} else if (spcMS()&&(aF[AE]==0)) {return (rLASSy());} else if (spcRL02()) {return (rLLRL02Sy());} else if (spcRM()) {return (rLTRRSy());} else if (spcRR1()) {return (rLDSSy());} else if (aF[AE]>0) {return (rLFRSy());}return (rLostMSy(true));}function rQScrSy() {if (uo) {if (fdT>0) {return (rQSETc());} else if (mF>=TH1) {return (rQPSTc());} else if (mC!=LT) {if ((mC==LCLR)||(sN[LCLR]>=TN - 1)) {return {cell:POSC,color:LT};} else {return (rQSTCTc());}} else if ((sN[LCLR]>=4)&&(sN[LT]==1)) {for (var i=0; i<TN; i+=2) {if ((view[CCW[i]].color==LT)||(view[CCW[i+1]].color==LT)) {return {cell:CCW[i+4]};}}} else if (sN[LCLR]==TN) {return {cell:0};} else {return (rQSATc());}} else {if ((fdT>0)&&(eT>0)&&(eT==aE[AQ])) {return (rQSSTc());} else {return (rQSEvTc());}}return NOP;}function rQSgSy() {if ((mF>TH0)&&(mC==LCL_QC_RESET)&&
(view[CCW[xn]].color==LPB)) {if (dOK[CCW[xn+3]]) {return { cell:CCW[xn+3],type:AE};
} else if (dOK[CCW[xn+5]]) {return { cell:CCW[xn+5],type:AE};
} else if (dOK[CCW[xn+7]]) {return { cell:CCW[xn+7],type:AE};
} else if (dOK[CCW[xn+2]]) {return { cell:CCW[xn+2],type:AJM};
} else if (dOK[CCW[xn+4]]) {return { cell:CCW[xn+4],type:AJM};
} else if (dOK[CCW[xn+6]]) {return { cell:CCW[xn+6],type:AJM};
} else if (dOK[CCW[xn+1]]) {return { cell:CCW[xn+1],type:ASF};
}}return NOP;}function rQOSy() {if ((aE[AQ]>0)&&(mF>0)) {for (var i=2; i<TN; i++) {if (view[CCW[xn+i]].ant&&(view[CCW[xn+i]].ant.type==AQ)&&
!view[CCW[xn+i]].ant.friend) {if (dOK[CCW[xn+i-1]]) {return {cell:CCW[xn+i-1],type:AJM};
} else if (dOK[CCW[xn+i+1]]) {return {cell:CCW[xn+i+1],type:AJM};
} else if (i==5) {if (dOK[CCW[xn+3]]&&!(view[CCW[xn+4]].ant&&view[CCW[xn+4]].ant.friend&&
view[CCW[xn+6]].ant&&view[CCW[xn+6]].ant.friend&&
view[CCW[xn+7]].ant&&view[CCW[xn+7]].ant.friend)) {
return {cell:CCW[xn+3],type:AJM};
} else if (dOK[CCW[xn+7]]&&!(view[CCW[xn+4]].ant&&view[CCW[xn+4]].ant.friend&&
view[CCW[xn+6]].ant&&view[CCW[xn+6]].ant.friend&&
view[CCW[xn+3]].ant&&view[CCW[xn+3]].ant.friend)) {
return {cell:CCW[xn+7],type:AJM};
}} else if ((i==3)&&dOK[CCW[xn+5]]&&!(view[CCW[xn+2]].ant&&view[CCW[xn+2]].ant.friend&&
view[CCW[xn+4]].ant&&view[CCW[xn+4]].ant.friend)) {
return {cell:CCW[xn+5],type:AJM};
} else if ((i==7)&&dOK[CCW[xn+5]]&&!(view[CCW[xn+6]].ant&&view[CCW[xn+6]].ant.friend)) {
return {cell:CCW[xn+5],type:AJM};
}}}} else if (view[CCW[xn]].ant.food>0) {
if ((mF>0)&&(view[CCW[xn+7]].color==LA)&&dOK[CCW[xn+7]]) {return {cell:CCW[xn+7],type:AJM};
}} else if (view[CCW[xn+1]].ant.food>0) {
if ((mF>0)&&dOK[CCW[xn+2]]) {return {cell:CCW[xn+2],type:AJM};
}} else if ((aLF[AJM]+aLF[ASM]>0)&&
(mF>0)&&(sN[LA]>0)) {for (var i=2; i<TN; i++) {var c=CCW[xn+i];if (dOK[c]&&(view[c].color==LA)) {
return {cell:c,type:AJM};}}}if (!(LCRQCVAL[mC])) {return {cell:POSC,color:LCRQC[1]};
} else if ((view[CCW[xn]].color==LPX)&&
isSc0(view[CCW[xn+1]].color)) {
if ((mF<=TH0)||(mF % RM==RD)) {return (rQHTc());} else if (mF<=TH2) {if (dOK[CCW[0]]) {return {cell:CCW[0],type:AJM};} else {return (rQHTc());}} else {var destCycle=[2,4,6,4,6,2,6,2,4];
var destination=destCycle[mF % 9];
if (!dOK[CCW[xn+destination]]) {
destination=destination % 6+2;}if (!dOK[CCW[xn+destination]]) {
destination=destination % 6+2;}if (!dOK[CCW[xn+destination]]) {
return (rQHTc());}if (mF<=TH3) {if (xn<=2) {return {cell:CCW[xn+destination],type:AJM};
} else {return (rQHTc());}} else if (mF<=TH4) {if (xn<=2) {return {cell:CCW[xn+destination],type:((xn>0) ? AJM : ASM)};} else {return (rQHTc());}} else if (mF<=TH5) {if (xn==0) {return {cell:CCW[xn+destination],type:ASM};
} else {return (rQHTc());}} else {return (rQHTc());}}} else {return {cell:POSC,color:incQc(mC)};
}return NOP;}function rQLvSy() {return NOP;}function rQCSy() {return NOP;}function rSOSy() {if (!(LCRSCVAL[mC])) {return {cell:POSC,color:LCRSC[1]};
} else if (isSc0(mC)&&isQc0(view[CCW[xn+1]].color)&&
(view[CCW[xn+3]].color==LPG)) {
return {cell:CCW[xn+3],color:LPX};
} else {return {cell:POSC,color:incSc(mC)};
}return NOP;}function rGSSy() {if (view[CCW[xn]].color!=LCL_QC_RESET) {
return {cell:CCW[xn],color:LCL_QC_RESET};
}if (mC!=LPB) {return {cell:POSC,color:LPB};}return (rGGTc());}function rGOSy() {if (aE[AQ]>0) {var c=CCW[xn+2];if (view[c].ant&&!view[c].ant.friend&&
(view[c].ant.type==AQ)&&(view[c].ant.food>0)&&!view[CCW[xn+1]].ant) {return {cell:CCW[xn+1],color:LA};
}c=CCW[xn+3];if (view[c].ant&&!view[c].ant.friend&&
(view[c].ant.type==AQ)&&(view[c].ant.food>0)&&!view[CCW[xn+1]].ant) {return {cell:CCW[xn+1],color:LA};
}}if (!LCRPHR[mC]) {if ((mC==LPX)&&isSc0(view[CCW[xn+7]].color)) {
return NOP;} else {return {cell:POSC,color:LPG};}} else if (isSc1(view[CCW[xn+7]].color)&&
isQc2(view[CCW[xn]].color)) {switch (mC) {case LPG:return {cell:POSC,color:LPG1};case LPG1:return {cell:POSC,color:LPG};default:return NOP;}} else {return (rGGTc());}}function rLSSs() {return NOP;}function rEHyS() {if (mQ==1) {var ptrn=PTFRL0H;var msm=patC(ptrn,AIMU,0,1);if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else if (LCRQCVAL[view[CCW[xn+mQ]].color]&&
dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};}}return NOP;}function rEBRSy() {if (aF[ASF]>0) {return (rELGTc());} else {return (rEBRTc());}}function rEASy() {return NOP;}function rUHSy() {if (mQ==0) {if (mC!=LRM0) {return {cell:POSC,color:LRM0};} else if (view[CCW[xn+3]].color!=LRR0) {
return {cell:CCW[xn+3],color:LRR0};
} else if (view[CCW[xn+7]].color!=LRL0) {
return {cell:CCW[xn+7],color:LRL0};
} else if (view[CCW[xn+5]].color!=LRM1) {
return {cell:CCW[xn+5],color:LRM1};
} else if (view[CCW[xn+6]].color!=LRL1) {
return {cell:CCW[xn+6],color:LRL1};
} else if ((!LCRGRR1[view[CCW[xn+4]].color])&&
!(view[CCW[xn+4]].ant&&view[CCW[xn+4]].ant.friend)) {
return {cell:CCW[xn+4],color:LRR1};
}if (LCRQCVAL[view[CCW[xn]].color]) {
if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};} else if (dOK[CCW[xn+4]]) {return {cell:CCW[xn+4]};}}} else {var ptrn=PTFRL0H;var msm=patC(ptrn,AIMU,0,1);if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else if (LCRQCVAL[view[CCW[xn+mQ]].color]) {
if (dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};} else if (view[CCW[xn+3]].ant&&
view[CCW[xn+3]].ant.friend&&dOK[CCW[xn+4]]) {return {cell:CCW[xn+4]};}}}return NOP;}function rUBRSy() {if (spcRL1()) {return (rULRL1Sy());} else if (spcRL02()) {return (rULRL02Sy());} else if (spcRM()) {return (rUFCRTc());}for (var i=TN - 1; i>=0; i--) {
if (view[CCW[i+1]].ant&&view[CCW[i+1]].ant.friend&&
(view[CCW[i+1]].ant.type==AE)&&
dOK[CCW[i]]) {return {cell:CCW[i]};}}return NOP;}function rUTRRSy() {return (rUCRTc());}function rULRL1Sy() {var ptrn=PTGRL1;var msm=patC(ptrn,AIMR,0,1);if (xn>=0) {if ((view[CCW[xn+6]].color==LMS_WRP)&&
(view[CCW[xn+7]].color==LCLR)&&
(view[CCW[xn]].color==LMR0)&&(view[CCW[xn+3]].color!=LRM1_WRP)) {
return {cell:CCW[xn+3],color:LRM1_WRP};
} else if ((view[CCW[xn+3]].color!=LRM1_WRP)&&
view[CCW[xn+3]].ant&&view[CCW[xn+3]].ant.friend&&dOK[CCW[xn+4]]) {return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};} else if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};} else {return NOP;}} else if (spcRM()) {return (rUTRRSy());}return (rLostMSy(false));}function rULRL02Sy() {var ptrn;var msm;if (sL[LRM0]>0) {ptrn=PTGRL0;msm=patC(ptrn,AIMR,1,1);}if (xn<0) {ptrn=PTGRL2;msm=patC(ptrn,AIMR,1,1);}if (xn>=0) {if (view[CCW[xn+3]].ant&&view[CCW[xn+3]].ant.friend&&dOK[CCW[xn+4]]) {return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};} else if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};} else {return NOP;}} else if (spcRM()) {return (rUTRRSy());}return (rLostMSy(false));}function rULRR0Sy() {var ptrn=PTGRR0;var msm=patC(ptrn,AIML,2,1);if (xn>=0) {return (runUMLeaveRRTactic());} else if (spcRM()) {return (rUTRRSy());}return (rLostMSy(false));}function rULRR2Sy() {var ptrn=PTGRR2;var msm=patC(ptrn,AIML,2,1);if (xn>=0) {return (runUMLeaveRRTactic());}    return (rLostMSy(false));}function rUPSSy() {var ptrn=PTGRR1;var msm=patC(ptrn,AIMD,3,2);if (xn>=0) {var c=CCW[xn+1];if (view[c].ant&&view[c].ant.friend&&(view[c].ant.food>0)) {
if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};} else {return NOP;}}if ((view[CCW[xn+2]].color==LMX_M3OUT)&&
(view[CCW[xn]].color==LMR0)&&(view[CCW[xn+1]].color==LCLR)&&
(mC!=LRR1X)) {return {cell:POSC,color:LRR1X};
} else if ((mT==AJM)&&(mC==LRR1U)&&(view[CCW[xn]].color==LMR0)&&(view[CCW[xn+1]].color==LCLR)&&
LCRMX_OUT[view[CCW[xn+2]].color]) {
return {cell:POSC,color:LRR1V};
} else if ((mC==LRR1X)||((mT==AJM)&&(mC==LRR1V))||((mC==LRR1U)&&(view[CCW[xn]].color==LMR0)&&(view[CCW[xn+1]].color==LCLR)&&
LCRMX_IN[view[CCW[xn+2]].color])
) {if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};} else if (dOK[CCW[xn+4]]) {return {cell:CCW[xn+4]};} else if (view[CCW[xn+4]].ant&&
view[CCW[xn+4]].ant.friend&&dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};} else if (dOK[CCW[xn+6]]) {return {cell:CCW[xn+6]};} else {return NOP;}} else if (mC!=LRR1U) {return {cell:POSC,color:LRR1U};
} else if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else {if (dOK[c]) {return {cell:c};} else if (view[c].ant&&view[c].ant.friend) {
if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};} else if (dOK[CCW[xn+4]]) {return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+6]]) {return {cell:CCW[xn+6]};} else {return NOP;}} else {return NOP;}}}return (rLostMSy(false));}function rUESSy() {var ptrn=PTMS0R_IN;var msm=patC(ptrn,AIMD,4,2);if (xn>=0) {return (rUESTc(ptrn,msm));}return (rLostMSy(false));}function rUDSSy() {var ptrn;var msm;if ((sL[LML3]>=1)&&(sD[LMR2]+sD[LMR0]>=1)) {ptrn=PTMS3;msm=patC(ptrn,AIMD,3,2);}if ((xn<0)&&(sL[LMR2]>=1)&&(sD[LML1]+sD[LML3]>=1)) {ptrn=PTMS2;msm=patC(ptrn,AIMD,3,2);}if (xn>=0) {if ((msm<0)&&(view[CCW[xn]].color==LRM0)&&(view[CCW[xn+1]].color==LRR0)&&
(view[CCW[xn+2]].color==LMR0)) {
if (dOK[CCW[xn]]) {return {cell:CCW[xn]};} else if (dOK[CCW[xn+1]]) {return {cell:CCW[xn+1]};} else {return NOP;}}return (rUDSTc(ptrn,msm));}if ((xn<0)&&(sL[LML1]>=1)&&(sD[LMR0]+sD[LMR2]>=1)) {ptrn=PTMS1_IN;msm=patC(ptrn,AIMD,3,4);if (xn<0) {ptrn=PTMS1;msm=patC(ptrn,AIMD,3,2);}}if (xn>=0) {return (rUDSTc(ptrn,msm));}if ((sD[LML3]+sL[LMR0]>=2)&&(sD[LRL0] >=2)&&(sD[LML1]==0)) {
ptrn=PTMS0_WRAPPING;msm=patC(ptrn,AIMD,0,1);if (xn>=0) {return (rUWRTc(ptrn,msm));}}if ((sL[LMR0]>=1)&&(sD[LML3]+sD[LML1]>=1)) {ptrn=PTMS0;msm=patC(ptrn,AIMD,3,2);if (xn>=0) {return (rUDSTc(ptrn,msm));}}if (spcRR1()) {ptrn=PTGRR1;msm=patC(ptrn,AIMD,3,2);if (xn>=0) {if (mC==LRR1) {return {cell:POSC,color:LRR1U};
}return NOP;}}if (spcMS0R()) {ptrn=PTMS0R_IN;msm=patC(ptrn,AIMD,4,2);if (xn>=0) {return (rUESTc(ptrn,msm));}}return (rLostMSy(false));}function rUSWSy() {var ptrn=PTMS0_WRAPPING;var msm=patC(ptrn,AIMD,0,1);if (xn>=0) {return (rUWRTc(ptrn,msm));}return (rLostMSy(false));}function rURHSy() {for (var i=0; i<TN; i++) {if (view[CCW[i]].ant&&view[CCW[i]].ant.friend&&
(view[CCW[i]].ant.type==ASF)) {
if (dOK[CCW[i+1]]) {return {cell:CCW[i+1]};}}}return NOP;}function rUCRSy() {for (var i=TN; i>=1; i--) {if (view[CCW[i]].ant&&dOK[CCW[i-1]]) {
return {cell:CCW[i-1]};}}return NOP;}function rLLLWSy() {var ptrn;var msm;if (mC==LML1) {ptrn=PTMS1FL;msm=patC(ptrn,AIML,0,1);if (xn>=0) {return (rLLLWTc());}} else if (mC==LML3) {ptrn=PTMS3FL;msm=patC(ptrn,AIML,0,1);if (xn>=0) {return (rLLLWTc());}} else if (sL[LML1]+sL[LML3]>=2) {
ptrn=PTMS0FL;msm=patC(ptrn,AIML,0,1);if (xn<0) {ptrn=PTMS2FL;msm=patC(ptrn,AIML,0,1);}if (xn>=0) {return (rLLLWTc());}} else if (spcMFR()) {return (rLLRWSy());} else if (spcMS()) {return (rLASSy());}return (rLostMSy(false));}function rLLRWSy() {var ptrn;var msm;if (mC==LMR0) {ptrn=PTMS0FR;msm=patC(ptrn,AIMR,0,1);if (xn>=0) {return (rLLRWTc());}} else if (mC==LMR2) {ptrn=PTMS2FR;msm=patC(ptrn,AIMR,0,1);if (xn>=0) {return (rLLRWTc());}} else if (sL[LMR0]+sL[LMR2]>=2) {
ptrn=PTMS1FR;msm=patC(ptrn,AIMR,0,1);if (xn<0) {ptrn=PTMS3FR;msm=patC(ptrn,AIMR,0,1);}if (xn>=0) {return (rLLRWTc());}} else if (spcMS()) {return (rLASSy());}return (rLostMSy(false));}function rLASSy() {var ptrn;var msm;if ((sL[LML3]>=1)&&(sD[LMR2]+sD[LMR0]>=1)) {ptrn=PTMS3;msm=patC(ptrn,AIMU,3,2);}if ((xn<0)&&(sL[LMR2]>=1)&&(sD[LML1]+sD[LML3]>=1)) {ptrn=PTMS2;msm=patC(ptrn,AIMU,3,2);}if ((xn<0)&&(sL[LML1]>=1)&&(sD[LMR0]+sD[LMR2]>=1)) {ptrn=PTMS1_IO;msm=patC(ptrn,AIMU,0,1);if (xn<0) {ptrn=PTMS1;msm=patC(ptrn,AIMU,3,2);}}if (xn>=0) {return (rLASTc(ptrn,msm));}if ((sD[LML3]+sL[LMR0]>=2)&&(sD[LRL0] >=2)&&(sD[LML1]==0)) {
ptrn=PTMS0_OUT;msm=patC(ptrn,AIMU,0,1);if (xn>=0) {return {cell:CCW[xn+3],color:LCLR};
}ptrn=PTMS0_WRAPPING;msm=patC(ptrn,AIMD,0,1);if (xn>=0) {return (rLWRTc(ptrn,msm));}}if ((sL[LMR0]>=1)&&(sD[LML3]+sD[LML1]>=1)) {ptrn=PTMS0;msm=patC(ptrn,AIMU,3,2);if (xn>=0) {return (rLASTc(ptrn,msm));}}if (spcRM()) {return (rLTRRSy());}return (rLostMSy(false));}function rLLSSy() {var ptrn=PTMS0R_OUT;var msm=patC(ptrn,AIMU,0,1);if (xn>=0) {} else {ptrn=PTMS0R_IN;msm=patC(ptrn,AIMU,4,2);if (xn>=0) {ptrn=PTMS0R_OUT;msm=patC(ptrn,AIMU,0,1);}}if (xn>=0) {return (rLLSTc(ptrn,msm));} else if (spcMS()) {return (rLASSy());} else {return (rLostMSy(false));}return NOP;}function rLLVSSy() {var ptrn=PTMS0R_OUT1;var msm=patC(ptrn,AIMU,0,1);if (xn>=0) {if (view[CCW[xn+3]].color==LCLR) {
return {cell:CCW[xn+3],color:((mT==ASM) ? LMX_M2OUT : LMX_M1OUT)};
} else if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};} else if (view[CCW[xn+5]].ant&&view[CCW[xn+5]].ant.friend&&
dOK[CCW[xn+6]]) {return {cell:CCW[xn+6]};} else {return NOP;}} else if (spcMS()) {return (rLASSy());}return (rLostMSy(false));}function rLDSSy() {var ptrn=PTGRR1;var msm=patC(ptrn,AIMU,1,1);if (xn>=0) {if ((view[CCW[xn]].color==LMR0)&&
(view[CCW[xn+1]].color==LCLR)) {
if ((mC==LRR1X)&&(view[CCW[xn+2]].color!=LMX_M3OUT)) {
return {cell:CCW[xn+2],color:LMX_M3OUT};
}if ((view[CCW[xn+2]].color==LMX_M3OUT)&&
(mC!=LRR1X)) {return {cell:POSC,color:LRR1X};
} else if ((LCRMX_OUT[view[CCW[xn+2]].color])&&
(mC!=LRR1V)) {return {cell:POSC,color:LRR1V};
} else if ((LCRMX_IN[view[CCW[xn+2]].color])&&
(mC!=LRR1U)) {return {cell:POSC,color:LRR1U};
} else if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
}}if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};} else if (dOK[CCW[xn+6]]) {return {cell:CCW[xn+6]};} else {return NOP;}}return (rLostMSy(false));}function rLTRRSy() {return (rLCRTc());}function rLFRSy() {for (var i=1; i<TN; i+=2) {if (view[CCW[i]].ant&&view[CCW[i]].ant.friend&&
(view[CCW[i]].ant.type==AE)&&dOK[CCW[i+2]]) {return {cell:CCW[i+2]};}}return NOP;}function rLRHSy() {var ptrn=PTFRL1G;var msm=patC(ptrn,AIMR,0,1);if (xn>=0) {return (rLRLTc());}for (var i=0; i<TN; i++) {if (view[CCW[i]].ant&&view[CCW[i]].ant.friend&&
(view[CCW[i]].ant.type==ASF)) {
if (dOK[CCW[i+1]]) {return {cell:CCW[i+1]};}}}return NOP;}function rLLRL1Sy() {var ptrn=PTGRL1;var msm=patC(ptrn,AIMR,0,1);if (xn>=0) {return (rLRLTc());} else if (spcRM()) {return (rLTRRSy());}return (rLostMSy(false));}function rLLRL02Sy() {var ptrn;var msm;if (sL[LRM0]>0) {ptrn=PTGRL0;msm=patC(ptrn,AIMR,1,1);}if (xn<0) {ptrn=PTGRL2;msm=patC(ptrn,AIMR,1,1);}if (xn>=0) {return (rLRLTc());}return (rLostMSy(false));}function rLLRR0Sy() {var ptrn=PTGRR0;var msm=patC(ptrn,AIML,2,1);if (xn>=0) {return (rLRRTc());} else if (spcRM()) {return (rLTRRSy());}return (rLostMSy(false));}function rLLRR2Sy() {var ptrn=PTGRR2;var msm=patC(ptrn,AIML,2,1);if (xn>=0) {return (rLRRTc());} else if (spcRM()) {return (rLTRRSy());}return (rLostMSy(false));}function rLCRSy() {for (var i=TN; i>=1; i--) {if (!dOK[CCW[i]]&&dOK[CCW[i-1]]) {
return {cell:CCW[i-1]};}}return NOP;}function rLostMSy(totally) {if ((fdT>0)&&(mF==0)) {for (var i=0; i<TN; i++) {if ((view[CCW[i]].food>0)&&dOK[CCW[i]]) {
return {cell:CCW[i]};}}}if (totally&(fT==0)) {if (((mC==PG)&&(sN[PG]==0))||((mC==PC)&&(sN[PC]==0))||((mC==PB)&&(sN[PB]==0))||((mC==PP)&&(sN[PP]==0))) {return {cell:POSC,color:PW};} else if ((sT[PG]==0)&&(((mC==PK)&&(sN[PK]==0))||((mC==PY)&&(sN[PY]==0))||((mC==PR)&&(sN[PR]==0)))) {return {cell:POSC,color:PW};} else if ((mC!=PW)&&(sN[mC]>=4)) {return {cell:POSC,color:PW};}}if ((mC==PG)&&(sL[PG]>=2)) {return {cell:POSC,color:PW};} else if (((mC==PK)||(mC==PR))&&
(sN[PK]+sN[PR]>=3)) {return {cell:POSC,color:PW};}if (sN[PW]<=4) {var preferredColors =[PG,PB,PC,PP,PY,PR,PK];for (var ci=0; ci<preferredColors.length; ci++) {
var c=preferredColors[ci];if ((mC!=c)&&(sN[c]>0)) {for (var i=1; i<TN; i++) {if ((view[CCW[i]].color==c)&&dOK[CCW[i]]) {
return {cell:CCW[i]};}}}}}if (RW) {for (var i=1; i<TN; i+=2) {if (dOK[CCW[i]]) {return {cell:CCW[i]};}}for (i=0; i<TN; i+=2) {if (dOK[CCW[i]]) {return {cell:CCW[i]};}}return NOP;} else {return NOP;}}function rDHSy() {if (mQ==0) {var c=CCW[xn+2];if (view[c].ant&&!view[c].ant.friend&&
(view[c].ant.type==AQ)&&(view[c].ant.food>0)&&!view[CCW[xn+1]].ant) {return {cell:CCW[xn+1],color:LA};
}c=CCW[xn+6];if (view[c].ant&&!view[c].ant.friend&&
(view[c].ant.type==AQ)&&(view[c].ant.food>0)&&!view[CCW[xn+7]].ant) {return {cell:CCW[xn+7],color:LA};
}} else {var c=CCW[xn+4];if (view[c].ant&&!view[c].ant.friend&&
(view[c].ant.type==AQ)&&(view[c].ant.food>0)&&!view[CCW[xn+3]].ant) {return {cell:CCW[xn+3],color:LA};
}c=CCW[xn+6];if (view[c].ant&&!view[c].ant.friend&&
(view[c].ant.type==AQ)&&(view[c].ant.food>0)&&!view[CCW[xn+7]].ant) {return {cell:CCW[xn+7],color:LA};
}c=CCW[xn+5];if (view[c].ant&&!view[c].ant.friend&&
(view[c].ant.type==AQ)&&(view[c].ant.food>0)) {if (!view[CCW[xn+3]].ant) {return {cell:CCW[xn+3],color:LA};
} else if (!view[CCW[xn+7]].ant) {
return {cell:CCW[xn+7],color:LA};
}}}return NOP;}function rQSETc() {if (mC!=LT) {return {cell:POSC,color:LT};}for (var i=0; i<TN; i++) {if (view[CCW[i]].food>0) {return {cell:CCW[i]};}}return NOP;}function rQSSTc() {for (var i=0; i<TN; i++) {if ((view[CCW[i]].food>0)&&(dOK[CCW[i]])) {
return {cell:CCW[i]};}}return NOP;}function rQSTCTc() {if ((mC!=LCLR)&&(sN[mC]>=4)) {if (sN[LT]==0) {return {cell:POSC,color:LT};} else if (sN[LT]>=3) {return {cell:POSC,color:LT};} else {for (var i=0; i<TN; i++) {if ((view[CCW[i]].color==LT)&&(view[CCW[i+2]].color!=LT)) {return {cell:CCW[i+2],color:LT};
}}return NOP;}} else if (sN[LT]==1) {for (var i=0; i<TN; i++) {if ((view[CCW[i]].color==LT)&&(view[CCW[i+4]].color!=LCLR)) {
if (view[CCW[i+1]].color==LCLR) {
return { cell:CCW[i+1]};} else if (view[CCW[i+7]].color==LCLR) {
return { cell:CCW[i+7]};} else {return {cell:POSC,color:LT};}}}return {cell:POSC,color:LT};} else {return {cell:POSC,color:LT};}return NOP;}function rQSATc() {for (var i=0; i<TN; i++) {if ((view[CCW[i]].color==LCLR)&&
(view[CCW[i+1]].color==LCLR)&&(view[CCW[i+2]].color==LCLR)) {
if ((view[CCW[i+3]].color==LCLR)&&
(view[CCW[i+4]].color==LCLR)) {
return {cell:CCW[i+2]};}return {cell:CCW[i+1]};}}for (i=TN - 1; i>=0; i--) {if (view[CCW[i]].color!=LT) {return {cell:CCW[i]};}}for (i=0; i<TN; i++) {if (view[CCW[i]].color!=LT) {return {cell:CCW[i],color:LCLR};
}}return {cell:0,color:LCLR};}function rQPSTc() {if (mC!=LCL_QC_RESET) {return {cell:POSC,color:LCL_QC_RESET};
}for (var i=0; i<TN; i++) {if (view[CCW[i]].color!=LCLR) {
return {cell:CCW[i],color:LCLR};
}}return {cell:0,type:ASF};}function rQSEvTc() {if (sN[LT]>0) {for (var i=0; i<TN; i++) {if (view[CCW[i]].color==LT) {xn=i&6;}}if ( dOK[CCW[xn+7]]&&dOK[CCW[xn]]&&
dOK[CCW[xn+1]]&&dOK[CCW[xn+2]]&&
dOK[CCW[xn+3]] ) {return {cell:CCW[xn+1]};} else if (dOK[CCW[xn+5]]&&dOK[CCW[xn+6]]&&
dOK[CCW[xn+7]]&&dOK[CCW[xn]]&&dOK[CCW[xn+1]]) {return {cell:CCW[xn+7]};} else if (dOK[CCW[xn+3]]&&dOK[CCW[xn+4]]&&
dOK[CCW[xn+5]]) {return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+5]]&&dOK[CCW[xn+6]]&&
dOK[CCW[xn+7]]) {return {cell:CCW[xn+6]};} else if (dOK[CCW[xn+1]]&&dOK[CCW[xn+2]]&&
dOK[CCW[xn+3]]) {return {cell:CCW[xn+2]};} else if (dOK[CCW[xn+7]]&&dOK[CCW[xn]]&&
dOK[CCW[xn+1]]) {return {cell:CCW[xn]};} else {for (i=0; i<TN; i++) {if (dOK[CCW[i]]) {return {cell:CCW[i]};}}return NOP;}} else {for (var i=0; i<TN; i++) {if (dOK[CCW[i]]&&dOK[CCW[i+1]]&&
dOK[CCW[i+2]]&&dOK[CCW[i+3]]&&dOK[CCW[i+4]]) {return {cell:CCW[i+2]};}}for (i=0; i<TN; i++) {if (dOK[CCW[i]]&&dOK[CCW[i+1]]&&
dOK[CCW[i+2]]) {return {cell:CCW[i+1]};}}for (i=0; i<TN; i++) {if (dOK[CCW[i]]) {return {cell:CCW[i]};}}return NOP;}return NOP;}function rQHTc() {var ptrn=PTHOME;var msm=patC(ptrn,POSC,0,1);if (msm!=0) {var cc=fwdWrong[0];return {cell:cc.v,color:ptrn[cc.p]};
} else {return NOP;}}function rGGTc() {var ptrn=PTGARDEN;var msm=patC(ptrn,POSC,0,1);if (msm!=0) {var cc=fwdWrong[0];return {cell:cc.v,color:ptrn[cc.p]};
} else {return NOP;}}function rUFCRTc() {var ptrn;var msm;if (mC==LRM0) {ptrn=PTFRM0;msm=patC(ptrn,AIMU,4,1);if ((xn<0)&&(eT>0)) {ptrn=PTFRM1;msm=patC(ptrn,AIMU,4,1);}if ((xn<0)&&(eT>0)) {ptrn=PTFRM2;msm=patC(ptrn,AIMU,4,1);}} else if (mC==LRM2) {ptrn=PTFRM2;msm=patC(ptrn,AIMU,4,1);if ((xn<0)&&(eT>0)) {ptrn=PTFRM0;msm=patC(ptrn,AIMU,4,1);}if ((xn<0)&&(eT>0)) {ptrn=PTFRM1;msm=patC(ptrn,AIMU,4,1);}} else if (mC==LRM1) {ptrn=PTFRM1;msm=patC(ptrn,AIMU,4,1);if ((xn<0)&&(eT>0)) {ptrn=PTFRM2;msm=patC(ptrn,AIMU,4,1);}if ((xn<0)&&(eT>0)) {ptrn=PTFRM0;msm=patC(ptrn,AIMU,4,1);}} else if (mC==LRM1_WRP) {ptrn=PTGRM1_WRP;msm=patC(ptrn,AIMR,1,1);}if ((xn<0)&&spcRR1()) {return (rUPSSy());}if (xn<0) {return (rLostMSy(false));}if (msm==0) {if (fdL>0) {if ((view[CCW[xn+7]].food>0)&&dOK[CCW[xn+7]]) {
return {cell:CCW[xn+7]};} else if ((view[CCW[xn+3]].food>0)&&
dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};}}if ((mC==LRM1)&&(view[CCW[xn+3]].color!=LRR1X)&&
(view[CCW[xn+3]].color!=LRR1U)&&
!((mT==AJM)&&(view[CCW[xn+3]].color==LRR1V))&&
dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};}if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};}return NOP;}for (var i=0; i<TN; i++) {var ce=CCW[xn+i];if (view[ce].ant&&view[ce].ant.friend&&(view[ce].ant.type==AE)) {if ((2<=i)&&(i<=4)) {var msmSaved=msm;var fwdWrongSaved=Array.from(fwdWrong);
var rearWrongSaved=Array.from(rearWrong);
xn=xn % 4+4;msm=patC(ptrn,POSC,0,1);if (msm<msmSaved) {xn=xn % 4+4;msm=msmSaved;fwdWrong=fwdWrongSaved;rearWrong=rearWrongSaved;} else {}break;}}}if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else {var cc=rearWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
}return NOP;}function rUCRTc() {var ptrn;var msm;if (mC==LRM0) {ptrn=PTGRM0;msm=patC(ptrn,AIMU,4,2);if ((xn<0)&&spcRR1()) {return (rUPSSy());}if ((xn<0)&&(eT>0)) {ptrn=PTGRM1;msm=patC(ptrn,AIMU,4,2);}if ((xn<0)&&(eT>0)) {ptrn=PTGRM2;msm=patC(ptrn,AIMU,4,2);}} else if (mC==LRM2) {ptrn=PTGRM2;msm=patC(ptrn,AIMU,4,2);if ((xn<0)&&(eT>0)) {ptrn=PTGRM0;msm=patC(ptrn,AIMU,4,2);}if ((xn<0)&&(eT>0)) {ptrn=PTGRM1;msm=patC(ptrn,AIMU,4,2);}} else if (mC==LRM1) {ptrn=PTGRM1;msm=patC(ptrn,AIMU,4,2);if ((xn<0)&&(eT>0)) {ptrn=PTGRM2;msm=patC(ptrn,AIMU,4,2);}if ((xn<0)&&(eT>0)) {ptrn=PTGRM0;msm=patC(ptrn,AIMU,4,2);}} else if (mC==LRM1_WRP) {ptrn=PTGRM1_WRP;msm=patC(ptrn,AIMR,1,1);}if ((xn<0)&&spcRR1()) {return (rUPSSy());}if (xn<0) {return (rLostMSy(false));}if (msm==0) {if (fdL>0) {if ((view[CCW[xn+7]].food>0)&&dOK[CCW[xn+7]]) {
return {cell:CCW[xn+7]};} else if ((view[CCW[xn+3]].food>0)&&
dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};}}if ((mC==LRM1)&&(view[CCW[xn+3]].color!=LRR1X)&&
(view[CCW[xn+3]].color!=LRR1U)) {
if ((((mT==AJM)&&(view[CCW[xn+3]].color==LRR1))||
((mT==ASM)&&(view[CCW[xn+3]].color==LRR1V)))&&
dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};}}if (mC==LRM0&&(view[CCW[xn+5]].color==LRM1_WRP)&&
!(view[CCW[xn+5]].ant&&view[CCW[xn+5]].ant.friend)) {
return {cell:CCW[xn+5],color:LRM1};
}var c=CCW[xn+5];if (dOK[c]) {return {cell:c};} else if (view[c].ant&&view[c].ant.friend) {
var evade=false;if (view[c].ant.food>0) {evade=true;} else if (view[CCW[xn+1]].ant&&
view[CCW[xn+1]].ant.friend&&(view[CCW[xn+1]].ant.food==0)) {
evade=true;}if (evade) {if (dOK[CCW[xn+4]]) {return {cell:CCW[xn+4]};} else if (dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};} else {return NOP;}} else {return NOP;}}} else if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else {var cc=rearWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
}return NOP;}function rUESTc(ptrn,msm) {switch (view[CCW[xn+3]].color) {
case LMX_M0:return {cell:CCW[xn+3],color:LMX_M1IN};
case LMX_M1OUT:if (mT==ASM) {return {cell:CCW[xn+3],color:LMX_M2IN};
}break;case LMX_M2OUT:if (mT==ASM) {return {cell:CCW[xn+3],color:LMX_M3IN};
}break;case LMX_M3OUT:break;case LMX_M1IN:case LMX_M2IN:case LMX_M3IN:if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else if ((msm==0)&&dOK[CCW[xn+1]]) {
return {cell:CCW[xn+1]};} else {break;}default:break;}if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};}return NOP;}function runUMLeaveRRTactic() {
if (view[CCW[xn+7]].ant&&view[CCW[xn+7]].ant.friend&&dOK[CCW[xn+6]]) {return {cell:CCW[xn+6]};} else if (dOK[CCW[xn+7]]) {return {cell:CCW[xn+7]};} else if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};} else {return NOP;}}function rUDSTc(ptrn,msm) {var c=CCW[xn+1];if ((msm==0)&&(fdL>0)&&(view[CCW[xn+3]].food+view[CCW[xn+7]].food>0)) {
if (mC!=LMMF) {return {cell:POSC,color:LMMF};} else if (view[CCW[xn+5]].color!=LMMH) {
return {cell:CCW[xn+5],color:LMMH};
} else if ((view[CCW[xn+3]].food>0)&&
dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};} else if ((view[CCW[xn+7]].food>0)&&
dOK[CCW[xn+7]]) {return {cell:CCW[xn+7]};}} else if ((msm<0)&&!(view[c].ant&&view[c].ant.friend)) {
var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else if (msm>=0) {if (dOK[c]) {return {cell:c};} else {if (view[c].ant&&view[c].ant.friend&&
(view[c].ant.food>0)) {if ((view[CCW[xn]].color==LCLR)&&
dOK[CCW[xn]]) {return {cell:CCW[xn]};} else if ((view[CCW[xn+2]].color==LCLR)&&
dOK[CCW[xn+2]]) {return {cell:CCW[xn+2]};} else {return NOP;}} else {return NOP;}}}return NOP;}function rUWRTc(ptrn,msm) {if (view[CCW[xn+3]].color!=LMS_WRP) {
return {cell:CCW[xn+3],color:LMS_WRP};
} else if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else if (dOK[CCW[xn+1]]) {return {cell:CCW[xn+1]};}return NOP;}function rLLLWTc() {if (dOK[CCW[xn+7]]) {return {cell:CCW[xn+7]};} else {return NOP;}}function rLLRWTc() {if (dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};} else {return NOP;}}function rLWRTc(ptrn,msm) {return NOP;}function rLASTc(ptrn,msm) {var c=CCW[xn+5];if ((msm<0)&&!(view[c].ant&&view[c].ant.friend)) {
var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else if (mC==LMMF) {return {cell:POSC,color:LCLR};} else if (view[CCW[xn+5]].color==LMMH) {
return {cell:CCW[xn+5],color:LCLR};
} else if ((msm>=0)&&dOK[c]) {return {cell:c};}return NOP;}function rLLSTc(ptrn,msm) {if (msm<0) {if (view[CCW[xn+5]].ant&&view[CCW[xn+5]].ant.friend) {
return NOP;}var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
}switch (view[CCW[xn+3]].color) {
case LMX_M1IN:return {cell:CCW[xn+3],color:LMX_M1OUT};
case LMX_M2IN:return {cell:CCW[xn+3],color:LMX_M2OUT};
case LMX_M3IN:default:return {cell:CCW[xn+3],color:LMX_M3OUT};
case LMX_M1OUT:case LMX_M2OUT:case LMX_M3OUT:if (dOK[CCW[xn+5]]) {return {cell:CCW[xn+5]};}break;}return NOP;}function rLCRTc() {var ptrn;var msm;var trust=(aF[AE]>0 ? 1 : 0);if (mC==LRM0) {ptrn=PTGRM0;msm=patC(ptrn,AIMD,3,2 - trust);
if ((xn<0)&&(eT>0)) {ptrn=PTGRM1;msm=patC(ptrn,AIMD,3,2);}if ((xn<0)&&(eT>0)) {ptrn=PTGRM2B;msm=patC(ptrn,AIMD,3,2);}} else if (mC==LRM2) {ptrn=PTGRM2B;msm=patC(ptrn,AIMD,3,2 - trust);
if ((xn<0)&&(eT>0)) {ptrn=PTGRM0;msm=patC(ptrn,AIMD,3,2);}if ((xn<0)&&(eT>0)) {ptrn=PTGRM1;msm=patC(ptrn,AIMD,3,2);}} else if (mC==LRM1) {ptrn=PTGRM1;msm=patC(ptrn,AIMD,3,2 - trust);
if ((xn<0)&&(eT>0)) {ptrn=PTGRM2B;msm=patC(ptrn,AIMD,3,2);}if ((xn<0)&&(eT>0)) {ptrn=PTGRM0;msm=patC(ptrn,AIMD,3,2);}} else if (mC==LRM1_WRP) {ptrn=PTGRM1;msm=patC(ptrn,AIMD,3,2);if (xn>=0) {if (view[CCW[xn+3]].color!=LRR1X) {
return {cell:CCW[xn+3],color:LRR1X};
} else if (!(view[CCW[xn+7]].ant&&
view[CCW[xn+7]].ant.friend)) {return {cell:POSC,color:LRM1};}}}if (xn<0) {if (spcRR1()) {return (rLDSSy());}return (rLostMSy(false));}if (msm==0) {var c=CCW[xn+1];if (dOK[c]) {return {cell:c};} else if (view[c].ant&&view[c].ant.friend) {
var evade=false;if (view[c].ant.food==0) {evade=true;} else if (view[CCW[xn+5]].ant&&
view[CCW[xn+5]].ant.friend&&(view[CCW[xn+5]].ant.food>0)) {
evade=true;}if (evade) {if (dOK[CCW[xn]]) {return {cell:CCW[xn]};} else if (dOK[CCW[xn+7]]) {return {cell:CCW[xn+7]};} else {return NOP;}} else {return NOP;}}} else if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else {var cc=rearWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
}return NOP;}function rLRLTc() {if (view[CCW[xn+3]].ant&&view[CCW[xn+3]].ant.friend&&
dOK[CCW[xn+2]]) {return {cell:CCW[xn+2]};} else if (dOK[CCW[xn+3]]) {return {cell:CCW[xn+3]};} else if (dOK[CCW[xn+1]]) {return {cell:CCW[xn+1]};} else {return NOP;}}function rLRRTc() {if (view[CCW[xn+7]].ant&&view[CCW[xn+7]].ant.friend&&dOK[CCW[xn]]) {return {cell:CCW[xn]};} else if (dOK[CCW[xn+7]]) {return {cell:CCW[xn+7]};} else if (dOK[CCW[xn+1]]) {return {cell:CCW[xn+1]};} else {return NOP;}}function rELGTc() {var ptrn=PTFRL1G;var msm;for (var i=0; i<TN; i+=2) {if (view[CCW[i]].ant&&view[CCW[i]].ant.friend&&
(view[CCW[i]].ant.type==ASF)) {
xn=i;break;}}msm=patC(ptrn,AIMU,0,1);if ((msm==0)&&dOK[CCW[xn+5]]&&((view[CCW[xn+3]].ant&&view[CCW[xn+3]].ant.friend)||
(view[CCW[xn+4]].ant&&view[CCW[xn+4]].ant.friend))) {
return {cell:CCW[xn+5]};} else if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else if (msm>0) {var cc=rearWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else {return NOP;}return NOP;}function rEBRTc() {var ptrn;var msm;if (mC==LRL0) {ptrn=PTFRL0;msm=patC(ptrn,AIMU,1,1);if (xn<0) {ptrn=PTFRL2;msm=patC(ptrn,AIMU,1,1);}if ((xn<0)&&(eT>0)) {ptrn=PTFRL1;msm=patC(ptrn,AIMU,1,1);}if (xn<0) {return NOP;}} else if (mC==LRL1) {ptrn=PTFRL1;msm=patC(ptrn,AIMU,1,1);if ((xn<0)&&(eT>0)) {ptrn=PTFRL2;msm=patC(ptrn,AIMU,1,1);}if ((xn<0)&&(eT>0)) {ptrn=PTFRL0;msm=patC(ptrn,AIMU,1,1);}if (xn<0) {return NOP;}} else if ((mC==LRR2)&&(sL[LRL1]>=1)&&(sL[LRL0]==0)) {return {cell:POSC,color:LRL0};}if ((msm==0)&&dOK[CCW[xn+5]]&&((view[CCW[xn+3]].ant&&view[CCW[xn+3]].ant.friend)||
(view[CCW[xn+4]].ant&&view[CCW[xn+4]].ant.friend))) {
return {cell:CCW[xn+5]};} else if (msm<0) {var cc=fwdWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else if (msm>0) {var cc=rearWrong[0];return {cell:cc.v,color:fixup(ptrn[cc.p])};
} else {return NOP;}return NOP;}function patC(ptrn,targetCell,qG,wt) {
if (xn>=0) {return (patCO(ptrn,targetCell,qG,wt,xn));
} else {var msm;for (var o=0; o<TN; o+=2) {msm=patCO(ptrn,targetCell,qG,wt,o);
if (xn>=0) {return msm;}}return PTNOM;}}function patCO(ptrn,targetCell,qG,wt,ortn) {
var fwdFCs=FWD_CELLS[targetCell];
var totDscs=0;fwdWrong=[];rearWrong=[];if ((Array.isArray(ptrn[POSC])&&!ptrn[POSC][mC])||
((ptrn[POSC]>0)&&(mC!=ptrn[POSC]))) {
if (fwdFCs[POSC]) {fwdWrong.push({p:POSC,v:POSC});
totDscs+=1;} else {rearWrong.push({p:POSC,v:POSC});
totDscs+=wt;}}if ((xn<0)&&(totDscs>qG)) {return PTNOM;}var jFrom=0;switch (targetCell) {case AIMU:jFrom=4;break;case AIML:jFrom=6;break;case AIMR:jFrom=2;break;case AIMD:case POSC:default:break;}for (var j=jFrom; j<TN+jFrom; j++) {
var posP=CCW[j];var posV=CCW[ortn+j];var c=view[posV].color;if ((Array.isArray(ptrn[posP])&&!ptrn[posP][c])||
((ptrn[posP]>0)&&(c!=ptrn[posP]))) {
if (fwdFCs[posP]) {fwdWrong.push({p:posP,v:posV});
totDscs+=1;} else {rearWrong.push({p:posP,v:posV});
totDscs+=wt;}}if ((xn<0)&&(totDscs>qG)) {return PTNOM;}}if ((xn<0)) {xn=ortn;}if (fwdWrong.length==0) {return (totDscs);} else {return (-totDscs);}}function isQc0(color) {return (LCRQCVAL[color]&&(LCRQC_VALUE[color]==0));
}function isQc2(color) {return (LCRQCVAL[color]&&(LCRQC_VALUE[color]==2));
}function incQc(color) {if (LCRQCVAL[color]) {return (LCRQC[(LCRQC_VALUE[color]+1) % QCPERD]);
} else {return undefined;}}function isSc0(color) {return (LCRSCVAL[color]&&(LCRSC_VALUE[color]==0));
}function isSc1(color) {return (LCRSCVAL[color]&&(LCRSC_VALUE[color]==1));
}function incSc(color) {if (LCRSCVAL[color]) {return (LCRSC[(LCRSC_VALUE[color]+1) % SCPERD]);
} else {return undefined;}}function spcMS() {return (((mC==LCLR)||((mF+fdL>0)&&(mC==LMMF))||((mF>0)&&(mC==LMMH)))&&(sN[LMR0]+sN[LML1] +sN[LMR2]+sN[LML3]>=2)&&(sN[LCLR]>=3)&&(sN[LMMF] +sN[LMMH] +sN[PB]<=3)); }function spcRM() {return (LCRGRM_ALL[mC]&&(sT[LRL0]+sT[LRL1]>=3)&&(sN[LRL0]>=1)&&(sN[LRR0]+sN[LRR2]>=2)&&(sT[LRM0]+sT[LRM1_WRP] +sT[LRM1]+sT[LRM2]>=2)&&(sT[LCLR]<=4));}function spcRL1() {return ((mC==LRL1)&&(sL[LRL0]>=2)&&(sD[LRM0]>=1)&&(sL[LRM1_WRP]+sL[LRM1]>=1)&&(sD[LRM2]>=1));}function spcRL02() {return ((mC==LRL0)&&(sL[LRL1]+sL[LRL2]>=2)&&(sN[LRM0]>=1)&&(sD[LRM1_WRP]+sD[LRM1]>=1));}function spcRR0() {return ((mC==LRR0)&&(sL[LRM1]==0)&&(sD[LRM1]+sD[LRM1_WRP]>=1)&&(sL[LMR0]>=1)&&(sL[LRR2]>=1));}function spcRR1() {return (LCRGRR1[mC]&&(sN[LRR0]>=2)&&(sL[LRR2]>=1)&&(sD[LRM0]>=1)&&(sN[LCLR]<=3)&&(sL[LRM1] +sL[LRM1_WRP]>=1));}function spcRR2() {return ((mC==LRR2)&&(sD[LCLR]>=1)&&(sD[LRM0]>=1)&&(sD[LRM1]+sD[LMR0]>=2)&&(sL[LRR0]>=2));}function spcMS0R() {return((mC==LCLR)&&(sL[LMR0]>=1)&&(sL[LRR1U]>=1)&&
(sD[LRR2]>=1)&&(sD[LRR0]>=1));}function spcMS0ROut() {return ((mC==LCLR)&&(sL[LMR0]+sL[LRR1V]>=2)&&(sD[LRR2]>=2)&&(sD[LRR0]>=1));}function spcMS0W() {return ((mC==LCLR)&&(sD[LRL0]>=3)&&(sL[LRL1]>=1)&&(sL[LMS_WRP]>=2)&&(sN[LCLR]>=2));}function spcMFL() {return ((sL[LMMF]>=1)&&(sD[LMMH]>=1)&&(sT[LCLR]>=2)&&(sT[LML1]+sT[LML3]>=1));}function spcMFR() {return ((sL[LMMF]>=1)&&(sD[LMMH]>=1)&&(sT[LCLR]>=2)&&(sT[LMR0]+sT[LMR2]>=1));}function fixup(ptrnCell) {if (Array.isArray(ptrnCell)) {for (var i=1; i<=9; i++) {if (ptrnCell[i]) {return i;}}return LCLR;} else {return ptrnCell;}}function debugme(arg) {if (DEBUGME[mT]) {console.log(arg);}}