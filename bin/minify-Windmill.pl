#!/usr/bin/perl

while (<>) {
    s/^\s+//;
    s!\s*//.*$!!;
    s/ANT_JUNIOR_MINER/AJM/g;
    s/ANT_SENIOR_MINER/ASM/g;
    s/ANT_ENGINEER/AE/g;
    s/ANT_STAFF/ASF/g;
    s/ANT_QUEEN/AQ/g;
    s/^.*(DEBUGME|debugme).*;$//g; # needs manual work
    s/DEBUG_PATTERN_CHECK_VERBOSELY/DPCV/g;
    s/ACT_RANDOMLY_WHEN_CONFUSED/RW/g;
    s/THRESHOLD/TH/g;
    s/RATCHET_MODULUS/RM/g;
    s/RATCHET_RESIDUE/RD/g;
    s/COL_WHITE/PW/g;
    s/COL_YELLOW/PY/g;
    s/COL_PURPLE/PP/g;
    s/COL_CYAN/PC/g;
    s/COL_RED/PR/g;
    s/COL_GREEN/PG/g;
    s/COL_BLUE/PB/g;
    s/COL_BLACK/PK/g;
    s/LCL_NA/LN/g;
    s/LCL_TRAIL/LT/g;
    s/LCL_ALERT/LA/g;
    s/LCL_R/LR/g;
    s/LRR1_SHAFT_IN_USE/LRR1U/g;
    s/LRR1_SHAFT_VACANT/LRR1V/g;
    s/LRR1_SHAFT_EXHAUSTED/LRR1X/g;
    s/LCL_M/LM/g;
    s/LMM_FOOD/LMMF/g;
    s/LMM_HOME/LMMH/g;
    s/LCL_G/LG/g;
    s/LCL_PHASE_/LP/g;
    s/LCL_CLEAR/LCLR/g;
    s/LPRESET/LP0/g;
    s/LPBOOTING/LPB/g;
    s/LPRUNNING/LPG/g;
    s/LPRUNNING1/LPV/g;
    s/LPRINGING/LPX/g;
    s/LCR_/LCR/g;
    s/LCRPHASES_RUNNING/LCRPHR/g;
    s/PAT_/PT/g;
    s/PTNOMATCH/PTNOM/g;
    s/_VALID/VAL/g;
    s/_PERIOD/PERD/g;
    s/INOUT/IO/g;
    s/AIM_UP/AIMU/g;
    s/AIM_DOWN/AIMD/g;
    s/AIM_LEFT/AIML/g;
    s/AIM_RIGHT/AIMR/g;

    s/compass/xn/g;
    s/myColor/mC/g;
    s/myType/mT/g;
    s/myFood/mF/g;
    s/amNotHungry/mS/g;
    s/adjFriends/aF/g;
    s/adjLadenFriends/aLF/g;
    s/adjUnladenFriends/aUF/g;
    s/friendsTotal/fT/g;
    s/myQueenPos/mQ/g;
    s/adjFoes/aE/g;
    s/adjLadenFoes/aLE/g;
    s/adjUnladenFoes/aUE/g;
    s/foesTotal/eT/g;
    s/destOK/dOK/g;
    s/unobstructed/uo/g;
    s/specLateral/sL/g;
    s/specDiagonal/sD/g;
    s/specNbrs/sN/g;
    s/specTotal/sT/g;
    s/foodLateral/fdL/g;
    s/foodDiagonal/fdD/g;
    s/foodTotal/fdT/g;
    s/POS_CENTER/POSC/g;
    s/CELL_NOP/NOP/g;
    s/TOTAL_NBRS/TN/g;

    s/runQueenStrategies/rQSs/g;
    s/runSecStrategies/rSSs/g;
    s/runGardenerStrategies/rGSs/g;
    s/runEngineerStrategies/rESs/g;
    s/runDefenderStrategies/rDSs/g;
    s/runLMStrategies/rLSs/g;
    s/runUMStrategies/rUSs/g;

    s/runQueenScramblingStrategy/rQScrSy/g;
    s/runQueenLightspeedStrategy/rQLsSy/g;
    s/runQueenLeavingStrategy/rQLvSy/g;
    s/runQueenSettlingStrategy/rQSgSy/g;
    s/runQueenOperatingMineStrategy/rQOSy/g;
    s/runQueenConfusedStrategy/rQCSy/g;
    s/runSecOperatingStrategy/rSOSy/g;
    s/runSecLightspeedStrategy/rSLSy/g;
    s/runSecEmergencyStrategy/rSESy/g;
    s/runGardenerOperatingStrategy/rGOSy/g;
    s/runGardenerSettlingStrategy/rGSSy/g;
    s/runLostStaffStrategy/rLSSy/g;
    s/runEngineerAtHomeStrategy/rEHyS/g;
    s/runEngineerBuildingRailStrategy/rEBRSy/g;
    s/runEngineerAloneStrategy/rEASy/g;
    s/runDefendingHomeStrategy/rDHSy/g;
    s/runUMCongestionResolutionStrategy/rUCRSy/g; #894
    s/runUMAtHomeStrategy/rUHSy/g;
    s/runUMReachingHomeStrategy/rURHSy/g;
    s/runUMBuildingRailStrategy/rUBRSy/g;
    s/runUMLeaveRL1Strategy/rULRL1Sy/g;
    s/runUMLeaveRR0Strategy/rULRR0Sy/g;
    s/runUMLeaveRR2Strategy/rULRR2Sy/g;
    s/runUMDrillingShaftStrategy/rUDSSy/g;
    s/runUMLeaveRL02Strategy/rULRL02Sy/g;
    s/runUMTravelOrRepairRailStrategy/rUTRRSy/g;
    s/runUMPreparingShaftStrategy/rUPSSy/g;
    s/runUMEnteringShaftStrategy/rUESSy/g;
    s/runUMShaftWrappingStrategy/rUSWSy/g;
    s/runLostMinerStrategy/rLostMSy/g;
    s/runMinerToRail1Strategy/rM2R1Sy/g;
    s/runLMCongestionResolutionStrategy/rLCRSy/g;
    s/runLMReachingHomeStrategy/rLRHSy/g;
    s/runLMLeavingLeftWallStrategy/rLLLWSy/g;
    s/runLMLeavingRightWallStrategy/rLLRWSy/g;
    s/runLMLeaveRL1Strategy/rLLRL1Sy/g;
    s/runLMLeaveRR0Strategy/rLLRR0Sy/g;
    s/runLMLeaveRR2Strategy/rLLRR2Sy/g;
    s/runLMLeavingShaftStrategy/rLLSSy/g;
    s/runLMLeavingVacantShaftStrategy/rLLVSSy/g;
    s/runLMAscendingShaftStrategy/rLASSy/g;
    s/runLMLeaveRL02Strategy/rLLRL02Sy/g;
    s/runLMTravelOrRepairRailStrategy/rLTRRSy/g;
    s/runLMDepartingFromShaftStrategy/rLDSSy/g;
    s/runLMFixingRailStrategy/rLFRSy/g;

    s/runQueenScramblingEatingTactic/rQSETc/g;
    s/runQueenScramblingTrailCheckTactic/rQSTCTc/g;
    s/runQueenScramblingAroundTactic/rQSATc/g;
    s/runQueenScramblingSnatchingTactic/rQSSTc/g;
    s/runQueenScramblingEvasionTactic/rQSEvTc/g;
    s/runQueenHousekeepingTactic/rQHTc/g;
    s/runGardenerGardeningTactic/rGGTc/g;
    s/runEngineerLeavingGardenTactic/rELGTc/g;
    s/runEngineerBuildingRailTactic/rEBRTc/g;
    s/runEngineerCleaningLeftRailEdgeTactic/rECLRETc/g;
    s/runUMFreshCenterRailTactic/rUFCRTc/g;
    s/runUMCenterRailTactic/rUCRTc/g;
    s/runUMEnteringShaftTactic/rUESTc/g;
    s/runUMWrappingOntoRailTactic/rUWRTc/g;
    s/runUMDrillingShaftTactic/rUDSTc/g;
    s/runLMLeavingLeftWallTactic/rLLLWTc/g;
    s/runLMLeavingRightWallTactic/rLLRWTc/g;
    s/runLMWrappingOntoRailTactic/rLWRTc/g;
    s/runLMAscendingShaftTactic/rLASTc/g;
    s/runLMLeavingShaftTactic/rLLSTc/g;
    s/runLMCenterRailTactic/rLCRTc/g;
    s/runLMLeaveRLTactic/rLRLTc/g;
    s/runLMLeaveRRTactic/rLRRTc/g;
    s/runMinerNavigatingTheGardenTactic/rMNGTc/g;
    
    s/specLikeRL1/spcRL1/g;
    s/specLikeRR0/spcRR0/g;
    s/specLikeRR2/spcRR2/g;
    s/specLikeCenterShaft/spcMS/g;
    s/specLikeRL02/spcRL02/g;
    s/specLikeCenterRail/spcRM/g;
    s/specLikeRR1/spcRR1/g;
    s/specLikeMS0R/spcMS0R/g;
    s/specLikeMS0Wrapping/spcMS0W/g;
    s/specLikeMFL/spcMFL/g;
    s/specLikeMFR/spcMFR/g;
    s/specLikeMS0ROut/spcMS0RO/g;
    s/patternCheckOrientation/patCO/g;
    s/patternCheck/patC/g;
    s/incrementQc/incQc/g;
    s/incrementSc/incSc/g;
    s/isScZero/isSc0/g;
    s/isQcZero/isQc0/g;
    s/isScOne/isSc1/g;
    s/isQcTwo/isQc2/g;

    s/mismatch/msm/g;
    s/pattern/ptrn/g;
    s/totalDiscrepancies/totDscs/g;
    s/forwardFacingCells/fwdFCs/g;
    s/qualityGoal/qG/g;
    s/weight/wt/g;
    s/orientation/ortn/g;

    s/ \= /=/g;
    s/ \!\= /!=/g;
    s/ \=\= /==/g;
    s/ \+\= /+=/g;
    s/ \< /</g;
    s/ \> />/g;
    s/ \<\= /<=/g;
    s/ \>\= />=/g;
    s/ \& /&/g;
    s/ \&\& /&&/g;
    s/ \&\&$/&&/;
    s/ \|\| /||/g;
    s/ \|\|$/||/g;
    s/ \+ /+/g;
    s/ \- /-/g;
    s/[)] [{]/){/g;
    s/[,]\s+/,/g;
    chomp if (length($_) < 48);
    $_ =~ /[{}]$/ && chomp;
    $_ !~ /^$/ && print $_;
}
