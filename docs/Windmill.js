/*
 * GNi 2017-09-27 - 2018-02-26

For background and context, see:
https://codegolf.stackexchange.com/questions/135102/formic-functions-ant-queen-of-the-hill-contest
https://trichoplax.github.io/formic-functions/

*/

// ---- Constants aren't ... ----

// -- Ant types: --
var ANT_JUNIOR_MINER = 1;
var ANT_SENIOR_MINER = 2;
var ANT_ENGINEER = 3;
var ANT_STAFF = 4; // secretary or gardener
var ANT_QUEEN = 5;

// Console logging guards:  Don't enable any in live competition.
var DEBUGME = [false, false, false, false, false, false];
// DEBUGME[ANT_JUNIOR_MINER] = true // ###
// DEBUGME[ANT_SENIOR_MINER] = true // ###
// DEBUGME[ANT_ENGINEER] = true // ###
// DEBUGME[ANT_STAFF] = true // ###
// DEBUGME[ANT_QUEEN] = true // ###
var DEBUG_PATTERN_CHECK_VERBOSELY = false;

// Discovering cases where an ant is confused  (and there's room for code
// improvements)  was easier when they stay put, so random walks are subject
// to this global switch:
var ACT_RANDOMLY_WHEN_CONFUSED = true;

// -- Food hoarding thresholds (tunables): --
// We aim to end  (in a typically crowded arena)  with about 300 food
// hoarded by the queen, 60-65 junior and 45-60 senior miners.
var THRESHOLD0 = 0; // hold on to this once settled
var THRESHOLD1 = 8; // collect at least this much food before settling
var THRESHOLD2 = 17; // throttle back the spawning of junior miners
var THRESHOLD3 = 67; // start creating senior miners
var THRESHOLD4 = 120; // stop creating junior miners
var THRESHOLD5 = 390; // stop spawning altogether
// Threshold for evasion/resettling when under attack:
// We'll only want to do this when we have enough food already to create
// a new hub, and when losing all the food we have would lose a lot of
// score points.  (We won't do it when we've had a bad start anyway.)
var THRESHOLDX = 15;

// We lock in queen's hoarded food  (don't expend it on new workers,
// except in dire emergencies)  when the current amount modulo
// RATCHET_MODULUS equals RATCHET_RESIDUE:
var RATCHET_MODULUS = 7;
var RATCHET_RESIDUE = 4;

// -- Physical colors: --
// These could be permuted without breaking anything else below
// (except for a number of mnemonic comments).
var COL_WHITE = 1;
var COL_YELLOW = 2;
var COL_PURPLE = 3;
var COL_CYAN = 4;
var COL_RED = 5;
var COL_GREEN = 6;
var COL_BLUE = 7;
var COL_BLACK = 8;

// -- Logical colors: --

/*
 * (Cf the ASCII-art schematic at the end of this file.)
 *
 * There's method to which physical colors are used repeatedly and
 * where we need different ones...  The spectral classification helper
 * functions  (near the end of this file)  have some explicit knowledge
 * of the logical-to-physical color assignments built into them, and
 * would need to be rewritten if these assignments are ever changed.
 */

// "Don't care" placeholder for pattern matching:
var LCL_NA = 0;

var LCL_CLEAR = COL_WHITE;

// Trail during initial scrambles:
var LCL_TRAIL = COL_BLUE;

// Alert color - enemy queen near our nest:
var LCL_ALERT = COL_PURPLE;

// The rails:
// Unless we're seriously confused already, we'll never use the RL0/2 color
// to paint a cell just off the left rail edge.  This fact will help workers
// on the rail edge to keep themselves oriented.  (Opponents, of course, could
// mess this up, as could disoriented miners of ours.)
var LCL_RL0 = COL_CYAN;
var LCL_RL1 = COL_GREEN;
var LCL_RL2 = LCL_RL0; // palindromic periodic pattern on left edge
var LCL_RM0 = COL_RED;
var LCL_RM1 = COL_BLUE;
var LCL_RM1_WRP = COL_BLACK; // temporary marker: shaft wrapped onto rail
var LCL_RM2 = COL_GREEN;
var LCL_RR0 = COL_GREEN;
var LCL_RR1 = COL_WHITE; // won't stay white for long
var LCL_RR1_SHAFT_IN_USE = COL_RED;
var LCL_RR1_SHAFT_VACANT = COL_YELLOW;
var LCL_RR1_SHAFT_EXHAUSTED = COL_BLACK; // or purple?
var LCL_RR2 = COL_YELLOW;

// Marker / descent counter cell at start of mine shaft just off the rail:
var LCL_MX_M0 = LCL_CLEAR; // initially
var LCL_MX_M1IN = COL_CYAN; // junior miner is here
var LCL_MX_M1OUT = COL_YELLOW; // ...was here
var LCL_MX_M2IN = COL_PURPLE; // senior miner is here (2nd descent)
var LCL_MX_M2OUT = COL_RED; // ...was here (2nd descent)
var LCL_MX_M3IN = COL_BLUE; // and is here again for a 3rd descent
var LCL_MX_M3OUT = COL_BLACK; // ...and back, mine shaft exhausted
// Marker cell when bottom of shaft has wrapped back onto rail:
var LCL_MS_WRP = COL_BLACK;

// Stepping stones alternating on the shaft walls:
// Avoid the LCL_RL* colors on the righthand wall  (looking down the shaft,
// the opposite of how we'd see it looking at the pattern from outside).
// And none of the LCL_MX_MnIN colors must match LCL_ML1.
var LCL_MR0 = COL_BLACK;
var LCL_ML1 = COL_YELLOW;
var LCL_MR2 = COL_RED;
var LCL_ML3 = COL_CYAN;

// Temporary shaft markers for picking up food from shaft walls:
var LCL_MM_FOOD = COL_GREEN;
var LCL_MM_HOME = COL_PURPLE;

// Gardener's berries' colors:
var LCL_G3 = COL_BLACK;
var LCL_G4 = COL_RED;
var LCL_G5 = COL_BLACK;
var LCL_G6 = COL_BLUE;

// Queen's and staff's status flag, in the gardener's cell:
var LCL_PHASE_RESET = LCL_CLEAR; // not used
var LCL_PHASE_BOOTING = COL_CYAN;
// Avoid the LCL_RL* colors here once we've reached the Running phase.
var LCL_PHASE_RUNNING = COL_YELLOW;
var LCL_PHASE_RUNNING1 = COL_RED;
var LCL_PHASE_RINGING = COL_PURPLE; // tentatively

// -- Logical color ranges: --

var FALSE_X9 = [false, false, false, false, false, false, false, false, false];
var UNDEF_X9 = [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined];

// Queen's clock counter:
var QC_PERIOD = 6;
var LCL_QC_RESET = LCL_CLEAR;
var LCR_QC = [COL_YELLOW, COL_PURPLE, COL_CYAN, COL_RED, COL_GREEN, COL_BLACK];
var LCR_QC_VALID = Array.from(FALSE_X9);
var LCR_QC_VALUE = Array.from(UNDEF_X9);
// inverse mapping, color to counter value:
for (var i = 0; i < QC_PERIOD; i++) {
    LCR_QC_VALID[LCR_QC[i]] = true;
    LCR_QC_VALUE[LCR_QC[i]] = i;
}

// Secretary's clock counter:
var SC_PERIOD = 7;
var LCL_SC_RESET = LCL_CLEAR;
var LCR_SC = [COL_YELLOW, COL_PURPLE, COL_CYAN, COL_RED, COL_GREEN, COL_BLUE, COL_BLACK];
var LCR_SC_VALID = Array.from(FALSE_X9);
var LCR_SC_VALUE = Array.from(UNDEF_X9);
// inverse mapping, color to counter value:
for (i = 0; i < SC_PERIOD; i++) {
    LCR_SC_VALID[LCR_SC[i]] = true;
    LCR_SC_VALUE[LCR_SC[i]] = i;
}

// Gardener's phase states once we're running:
var LCR_PHASES_RUNNING = Array.from(FALSE_X9);
LCR_PHASES_RUNNING[LCL_PHASE_RUNNING] = true;
LCR_PHASES_RUNNING[LCL_PHASE_RUNNING1] = true;
var LCR_PHASES = Array.from(LCR_PHASES_RUNNING);
LCR_PHASES[LCL_PHASE_RINGING] = true;

// RM1 in general:
var LCR_GRM1 = Array.from(FALSE_X9);
LCR_GRM1[LCL_RM1] = true;
LCR_GRM1[LCL_RM1_WRP] = true;

// All valid middle-of-the-rail possibilities:
var LCR_GRM_ALL = Array.from(FALSE_X9);
LCR_GRM_ALL[LCL_RM0] = true;
LCR_GRM_ALL[LCL_RM1] = true;
LCR_GRM_ALL[LCL_RM1_WRP] = true;
LCR_GRM_ALL[LCL_RM2] = true;

// RR1:  after and before the first visit
var LCR_GRR1_OUT = Array.from(FALSE_X9);
LCR_GRR1_OUT[LCL_RR1_SHAFT_VACANT] = true;
LCR_GRR1_OUT[LCL_RR1_SHAFT_EXHAUSTED] = true;
var LCR_GRR1B = Array.from(LCR_GRR1_OUT);
LCR_GRR1B[LCL_RR1_SHAFT_IN_USE] = true;
var LCR_GRR1 = Array.from(LCR_GRR1B);
LCR_GRR1[LCL_RR1] = true;

// Mine-shaft usage counter:
var LCR_MX_INOUT = Array.from(FALSE_X9);
LCR_MX_INOUT[LCL_MX_M1IN] = true;
LCR_MX_INOUT[LCL_MX_M1OUT] = true;
LCR_MX_INOUT[LCL_MX_M2IN] = true;
LCR_MX_INOUT[LCL_MX_M2OUT] = true;
LCR_MX_INOUT[LCL_MX_M3IN ] = true;
LCR_MX_INOUT[LCL_MX_M3OUT] = true;
var LCR_MX = Array.from(LCR_MX_INOUT);
LCR_MX[LCL_MX_M0] = true;

// Subset of valid settings when a miner is descending:
var LCR_MX_IN = Array.from(FALSE_X9);
LCR_MX_IN[LCL_MX_M1IN] = true;
LCR_MX_IN[LCL_MX_M2IN] = true;
LCR_MX_IN[LCL_MX_M3IN ] = true;

// Subset of valid settings when a miner has vacated a shaft:
var LCR_MX_OUT = Array.from(FALSE_X9);
LCR_MX_OUT[LCL_MX_M1OUT] = true;
LCR_MX_OUT[LCL_MX_M2OUT] = true;
// ...but not LCL_MX_M3OUT, which means the shaft counts as exhausted.
// LCR_MX_OUT[LCL_MX_M3OUT] = true;

// Food and direction markers in mid-shaft:
var LCR_MM_FOOD = Array.from(FALSE_X9);
LCR_MM_FOOD[LCL_CLEAR] = true;
LCR_MM_FOOD[LCL_MM_FOOD] = true;
var LCR_MM_HOME = Array.from(FALSE_X9);
LCR_MM_HOME[LCL_CLEAR] = true;
LCR_MM_HOME[LCL_MM_HOME] = true;

// Indicator at bottom of wrapped shaft:
var LCR_MS = Array.from(FALSE_X9);
LCR_MS[LCL_CLEAR] = true;
LCR_MS[LCL_MS_WRP] = true;

// Colors that can appear to the left of a left rail edge  (apart from
// the special case of the gardener's cell which is still visibly from the
// beginning of rail3):
var LCR_FRLL0 = Array.from(FALSE_X9);
LCR_FRLL0[LCL_CLEAR] = true;
LCR_FRLL0[LCL_MR0] = true;
LCR_FRLL0[LCL_MR2] = true;
LCR_FRLL0[LCL_RM0] = true; // near the beginning of rails 1 and 2
LCR_FRLL0[LCL_RM2] = true; // after rails 1 and 3 have met
// Also valid  (after resettling):  LCL_RR0, but this coincides with LCL_RM2.
var LCR_FRLL1 = Array.from(FALSE_X9);
LCR_FRLL1[LCL_CLEAR] = true;
LCR_FRLL1[LCL_MR0] = true;
LCR_FRLL1[LCL_MR2] = true;
// Also valid:  LCL_G3  (near the beginning of rail3) , but this is
// the same as LCL_MR0.
LCR_FRLL1[LCL_RR0] = true; // near the beginning of rails 1 and 2
LCR_FRLL1[LCL_RM1] = true; // after rails 1 and 3 have met
LCR_FRLL1[LCL_RR2] = true; // after a resettling maneuver
var LCR_FRLL2 = Array.from(FALSE_X9);
LCR_FRLL2[LCL_CLEAR] = true;
LCR_FRLL2[LCL_MR0] = true;
LCR_FRLL2[LCL_MR2] = true;
LCR_FRLL2[LCL_RM0] = true; // after rails 1 and 3 have met
LCR_FRLL2[LCL_RR1_SHAFT_VACANT] = true; // after a resettling maneuver
// The other valid RR1 states concide with LCL_CLEAR/MR0/MR2;
// as does LCL_MS_WRP with LCL_MR0.

// -- Addressing cells in the neighborhood: --

var TOTAL_NBRS = 8;

// Expressed in controller's coordinates:
var POS_CENTER = 4;
var CELL_NOP = {cell:POS_CENTER};
// Directions of interest, for passing to the pattern engine:
var AIM_UP = 1;
var AIM_LEFT = 3;
var AIM_RIGHT = 5;
var AIM_DOWN = 7;

// Which cells will remain in view if I step onto a given cell?
var FWD_CELLS = [
    [ true,  true,  false,
      true,  true,  false,
      false, false, false ], // after stepping to cell 0
    [ true,  true,  true,
      true,  true,  true,
      false, false, false ], // 1
    [ false, true,  true,
      false, true,  true,
      false, false, false ], // 2
    [ true,  true,  false,
      true,  true,  false,
      true,  true,  false ], // 3
    [ true, true, true, true, true, true, true, true, true ], // 4
    [ false, true,  true,
      false, true,  true,
      false, true,  true ], // 5
    [ false, false, false,
      true,  true,  false,
      true,  true,  false ], // 6
    [ false, false, false,
      true,  true,  true,
      true,  true,  true ], // 7
    [ false, false, false,
      false, true,  true,
      false, true,  true ] // 8
];

// Pattern-match failure indication:
var PAT_NOMATCH = -9;

// Patterns to match against:

var PAT_HOME = [ // with gardener at bottom left, as seen by the queen
    LCL_RM0,    LCL_RL0,    LCL_RM0,
    LCL_RL0,    LCL_NA,     LCL_RL0,
    LCL_NA,     LCL_NA,     LCL_RM0
];

var PAT_GARDEN = [ // with queen at bottom left, as seen by the gardener
    LCL_G6,     LCL_G5,     LCL_G4,
    LCL_NA,     LCL_NA,     LCL_G3,
    LCL_NA,     LCL_RL0,    LCL_RL1
];

// Freshly laid rail:
var PAT_FRM0 = [ // standing on RM0 cell, etc.
    LCL_RL1,    LCL_RM1,    LCR_GRR1,
    LCL_RL0,    LCL_RM0,    LCL_RR0,
    LCL_RL2,    LCL_RM2,    LCL_RR2
];
var PAT_FRM1 = [
    LCL_RL2,    LCL_RM2,    LCL_RR2,
    LCL_RL1,    LCR_GRM1,   LCR_GRR1,
    LCL_RL0,    LCL_RM0,    LCL_RR0
];
var PAT_FRM2 = [
    LCL_RL0,    LCL_RM0,    LCL_RR0,
    LCL_RL2,    LCL_RM2,    LCL_RR2,
    LCL_RL1,    LCR_GRM1,   LCR_GRR1
];

// Rail in general:
var PAT_GRM0 = [ // standing on RM0 cell, etc.
    LCL_RL1,    LCR_GRM1,   LCR_GRR1,
    LCL_RL0,    LCL_RM0,    LCL_RR0,
    LCL_RL2,    LCL_RM2,    LCL_RR2
];
var PAT_GRM1 = PAT_FRM1;
var PAT_GRM2 = PAT_FRM2;

// Variant used by miners repairing the rail whilst returning laden:
var PAT_GRM2B = [
    LCL_RL0,    LCL_RM0,    LCL_RR0,
    LCL_RL2,    LCL_RM2,    LCL_RR2,
    LCL_RL1,    LCR_GRM1,   LCR_GRR1B
];


// Case where shaft had wrapped, miner had left a reminder to self on RM1
var PAT_GRM1_WRP = [
    LCL_RL2,    LCL_RM2,    LCL_RR2,
    LCL_RL1,    LCL_RM1_WRP, LCL_RR1_SHAFT_EXHAUSTED,
    LCL_RL0,    LCL_RM0,    LCL_RR0
];

var PAT_FRL0 = [ // Engineer's fresh left rail edge, standing on RL0 cell, etc.
    LCR_FRLL1,  LCL_RL1,    LCL_RM1,
    LCR_FRLL0,  LCL_RL0,    LCL_RM0,
    LCR_FRLL2,  LCL_RL2,    LCL_RM2
];
var PAT_FRL1 = [
    LCR_FRLL2,  LCL_RL2,    LCL_RM2,
    LCR_FRLL1,  LCL_RL1,    LCR_GRM1,
    LCR_FRLL0,  LCL_RL0,    LCL_RM0
];
// Special case when we still have the queen behind us, and possibly the
// gardener to our left.
var PAT_FRL0H = [
    LCL_NA,     LCL_RL1,    LCL_RM1,
    LCL_NA,     LCL_RL0,    LCL_RM0,
    LCL_NA,     LCL_NA,     LCL_NA
];
// Special case when, on rail 3, we still see the gardener rear left:
var PAT_FRL1G = [
    LCR_FRLL2,  LCL_RL2,    LCL_RM2,
    LCL_G3,     LCL_RL1,    LCR_GRM1,
    LCR_PHASES, LCL_RL0,    LCL_RM0
];
// There's really another special case on rails1 and 2, with
// (from bottom to top)  G, R, white-or-MR0 to the left. #future#
var PAT_FRL2 = [
    LCR_FRLL0,  LCL_RL0,    LCL_RM0,
    LCR_FRLL2,  LCL_RL2,    LCL_RM2,
    LCR_FRLL1,  LCL_RL1,    LCR_GRM1
];

// General left rail edge, standing on RL0 cell, etc.:
var PAT_GRL0 = [
    LCR_FRLL1,  LCL_RL1,    LCR_GRM1,
    LCR_FRLL0,  LCL_RL0,    LCL_RM0,
    LCR_FRLL2,  LCL_RL2,    LCL_RM2
];
// Just to keep the pattern naming scheme consistent:
var PAT_GRL1 = PAT_FRL1;
var PAT_GRL2 = PAT_FRL2;

// Right rail edge not at a shaft head  (normal rail orientation),
// assuming there are already shafts in view and we are *not* on
// the first RR0 of a rail  (which has no RR2 behind it!):
var PAT_GRR0 = [
    LCR_GRM1,   LCR_GRR1,   LCL_CLEAR,
    LCL_RM0,    LCL_RR0,    LCL_MR0,
    LCL_RM2,    LCL_RR2,    LCR_MX
];
var PAT_GRR2 = [
    LCL_RM0,    LCL_RR0,    LCL_MR0,
    LCL_RM2,    LCL_RR2,    LCR_MX,
    LCR_GRM1,   LCR_GRR1,   LCL_CLEAR
];

// Right rail edge next to a (future) shaft head
// (pattern turned around so shaft goes down & rail leads off right):
var PAT_GRR1 = [
    LCL_RM0,    LCR_GRM1,   LCL_RM2,
    LCL_RR0,    LCR_GRR1,   LCL_RR2,
    LCL_MR0,    LCL_CLEAR,  LCR_MX
];

// Shaft head just off the right rail edge - on the way down  (unladen):
var PAT_MS0R_IN = [
    LCL_RR0,    LCL_RR1_SHAFT_IN_USE, LCL_RR2,
    LCL_MR0,    LCL_CLEAR,  LCR_MX_IN,
    LCL_CLEAR,  LCL_CLEAR,  LCL_ML1
];
// ...and on the way back up  (laden):
var PAT_MS0R_OUT = [
    LCL_RR0,    LCL_RR1_SHAFT_IN_USE, LCL_RR2,
    LCL_MR0,    LCL_CLEAR,  LCR_MX_INOUT,
    LCL_CLEAR,  LCL_CLEAR,  LCL_ML1
];
// Ditto but RR1 has already been changed to VACANT or EXHAUSTED by
// someone else;  in addition, MX may have been wiped out:
var PAT_MS0R_OUT1 = [
    LCL_RR0,    LCR_GRR1_OUT, LCL_RR2,
    LCL_MR0,    LCL_CLEAR,  LCR_MX,
    LCL_CLEAR,  LCL_CLEAR,  LCL_ML1
];

// Shaft in general  (without food markers):
var PAT_MS0 = [
    LCL_CLEAR,  LCR_MM_HOME, LCL_ML3,
    LCL_MR0,    LCR_MM_FOOD, LCL_CLEAR,
    LCL_CLEAR,  LCL_CLEAR,  LCL_ML1
];
var PAT_MS1 = [
    LCL_MR0,    LCR_MM_HOME, LCL_CLEAR,
    LCL_CLEAR,  LCR_MM_FOOD, LCL_ML1,
    LCL_MR2,    LCL_CLEAR,  LCL_CLEAR
];
var PAT_MS2 = [
    LCL_CLEAR,  LCR_MM_HOME, LCL_ML1,
    LCL_MR2,    LCR_MM_FOOD, LCL_CLEAR,
    LCL_CLEAR,  LCL_CLEAR,  LCL_ML3
];
var PAT_MS3 = [
    LCL_MR2,    LCR_MM_HOME, LCL_CLEAR,
    LCL_CLEAR,  LCR_MM_FOOD, LCL_ML3,
    LCL_MR0,    LCL_CLEAR,  LCL_CLEAR
];

// Special case just after we leave the shaft head on the way down or
// just before we reach it on the way out:
var PAT_MS1_IN = [
    LCL_MR0,    LCR_MM_HOME, LCR_MX_IN,
    LCL_CLEAR,  LCR_MM_FOOD, LCL_ML1,
    LCL_MR2,    LCL_CLEAR,  LCL_CLEAR
];
// On the way back, someone might have changed MX in the meantime,
// so we must allow for a few more possibilities.
var PAT_MS1_INOUT = [
    LCL_MR0,    LCR_MM_HOME, LCR_MX_INOUT,
    LCL_CLEAR,  LCR_MM_FOOD, LCL_ML1,
    LCL_MR2,    LCL_CLEAR,  LCL_CLEAR
];
// Extraspecial case heading up when a misplaced "IN" marker has fooled us
// one step earlier:
var PAT_MS0_OUT = [
    LCL_CLEAR,  LCL_CLEAR,  LCL_ML3,
    LCL_MR0,    LCL_CLEAR,  LCR_MX_INOUT,
    LCL_CLEAR,  LCL_CLEAR,  LCL_ML1
];

// Shaft about to wrap onto rail:
var PAT_MS0_WRAPPING = [
    LCL_CLEAR,  LCR_MM_HOME, LCL_ML3,
    LCL_MR0,    LCR_MM_FOOD, LCR_MS,
    LCL_RL0,    LCL_RL1,    LCL_RL2
];
// On the left rail edge after shaft has wrapped
// (still drawn looking down the shaft):
// (This is not, in fact, being used at present.)
var PAT_GRL1_WRP = [
    LCL_MR0,    LCL_CLEAR,  LCL_MS_WRP,
    LCL_RL0,    LCL_RL1,    LCL_RL2,
    LCL_RM0,    LCL_RM1_WRP, LCL_RM2 // showing marking already propagated
];

// Patterns seen after collecting food from a shaft wall - left or
// right wall, in four possible phases:

var PAT_MS0FL = [
    LCL_MM_HOME, LCL_ML3,   LCL_NA,
    LCL_MM_FOOD, LCL_CLEAR, LCL_NA,
    LCL_CLEAR,  LCL_ML1,    LCL_NA
];
var PAT_MS1FL = [
    LCL_MM_HOME, LCL_CLEAR, LCL_NA,
    LCL_MM_FOOD, LCL_ML1,   LCL_NA,
    LCL_CLEAR,  LCL_CLEAR,  LCL_NA
];
var PAT_MS2FL = [
    LCL_MM_HOME, LCL_ML1,   LCL_NA,
    LCL_MM_FOOD, LCL_CLEAR, LCL_NA,
    LCL_CLEAR,  LCL_ML3,    LCL_NA
];
var PAT_MS3FL = [
    LCL_MM_HOME, LCL_CLEAR, LCL_NA,
    LCL_MM_FOOD, LCL_ML3,   LCL_NA,
    LCL_CLEAR,  LCL_CLEAR,  LCL_NA
];

var PAT_MS0FR = [
    LCL_NA,     LCL_CLEAR,  LCL_MM_HOME,
    LCL_NA,     LCL_MR0,    LCL_MM_FOOD,
    LCL_NA,     LCL_CLEAR,  LCL_CLEAR
];
var PAT_MS1FR = [
    LCL_NA,     LCL_MR0,    LCL_MM_HOME,
    LCL_NA,     LCL_CLEAR,  LCL_MM_FOOD,
    LCL_NA,     LCL_MR2,    LCL_CLEAR
];
var PAT_MS2FR = [
    LCL_NA,     LCL_CLEAR,  LCL_MM_HOME,
    LCL_NA,     LCL_MR2,    LCL_MM_FOOD,
    LCL_NA,     LCL_CLEAR,  LCL_CLEAR
];
var PAT_MS3FR = [
    LCL_NA,     LCL_MR2,    LCL_MM_HOME,
    LCL_NA,     LCL_CLEAR,  LCL_MM_FOOD,
    LCL_NA,     LCL_MR0,    LCL_CLEAR
];

/*
// Special cases of food right off the rail at the shaft head:
// #future# (not yet used, and corresponding spectrum tests do not yet exist)
var PAT_MS0RF = [
    LCL_RR0,    LCL_RR1_SHAFT_IN_USE, LCL_RR2,
    LCL_MR0,    LCL_MM_FOOD, LCR_MX_IN,
    LCL_CLEAR,  LCL_CLEAR,  LCL_ML1
];
var PAT_MS0RFL = [
    LCL_RR1_SHAFT_IN_USE, LCL_RR2, LCL_RR0,
    LCL_MM_FOOD, LCR_MX_IN, LCL_NA,
    LCL_CLEAR,  LCL_ML1, LCL_NA
];
var PAT_MS0RFR = [
    LCL_RR2,    LCL_RR0,    LCL_RR1_SHAFT_IN_USE,
    LCL_NA,     LCL_MR0,    LCL_MM_FOOD,
    LCL_NA,     LCL_CLEAR,  LCL_CLEAR,
];
// #future# Patterns (and code) for food one cell further out in an incipient
// shaft  (where the existing marker painting scheme would work, but the
// above patterns won't, due to the MX cell)
// #future# Patterns (and code) for food found a moment before wrapping around
// onto the left rail edge

*/

/*
 * Mapping our logical to the controller's physical notion of cell coordinates:
 *
 * We think of what we want to be the "bottom left" (or southwest) neighbor
 * cell as neighbor 0, and proceed counterclockwise, ending with number 7
 * on the left (west).
 * The CCW array maps these ordinals to subscripts into the controller's
 * view[] array.  It is long enough to compute subscripts e.g. of
 * opposite or adjacent neighbor cells without reducing mod 8.  E.g.,
 * the sum of 6 for the compass setting, 7 for a neighbor cell of current
 * interest, plus another 7 meaning "-1 mod 8", i.e. the next neighbor cell
 * in clockwise order, can safely be fed into CCW without falling off the end.
 */
var CCW = [6, 7, 8, 5, 2, 1, 0, 3, 6, 7, 8, 5, 2, 1, 0, 3, 6, 7, 8, 5, 2, 1];

// ---- ... variables won't.  (Well, some will.) ----

/*
 * The compass  (base offset into CCW, taking values from {0, 2, 4, 6})
 * will be set once we determine which way we're facing, based on either
 * seeing our own queen, or a pal of a particular kind or two, or the
 * color pattern under our feet.
 */
var compass = -1;

// ---- Who am I? ----

// Discrepancies found during pattern matching:
var fwdWrong = [];
var rearWrong = [];

var here = view[POS_CENTER];
var myColor = here.color;
var myself = here.ant;
var myType = myself.type;
var myFood = myself.food;
var amNotHungry = (myType == ANT_ENGINEER || (myType != ANT_QUEEN && myFood > 0));

// ---- Where am I?  Take stock of our surroundings ----

/*
 * Guards for cells we may have a need to step onto:
 *
 * The destOK array is indexed by controller coordinates.
 * The queen and unladen workers can step onto cells containing food
 * but no other ant, except the Engineer shouldn't  (she might inadvertently
 * steal food but would never bring it home).  Laden workers can't step
 * onto ants or food.  The destOK array and unobstructed variable are
 * initialized to all true and then set to match reality a moment later.
 */
var destOK = [true, true, true, true, true, true, true, true, true];
var unobstructed = true; // summary thereof

/*
 * For a quick first look at our surroundings, we always collect:
 *
 * + a spectrum of the cells in view  (how often each color occurs),
 * + same but broken down by edge vs corner neighbor cells,
 * + how much food there is around us,
 * + same but broken down by edge vs corner neighbor cells,
 * --- loop separately over both kinds, accumulating totals as we go
 * + how many friendly ants of each type there are around us
 *   (where relevant, we'll pinpoint their locations later)
 *   and how many of them are laden,
 * --- except if our queen is in view, note the orientation straight away,
 * + how many enemy queens and how many enemy workers there are around us
 *   (the worker types are meaningless to us and food transfers would
 *   happen automatically if they haven't already happened),
 * + whether or not we're obstructed in any way
 *   (as a queen or unladen worker, by any other ants;  as a laden worker,
 *   by any other ants or food).
 *
 * #future# If I were to rewrite this from scratch, I would add another
 * level of feature perception:  How often *pairs* of colors occur, one
 * on a corner cell followed by another given one on the next edge cell,
 * going around counter-clockwise, or vice versa.  There are only 128
 * possible combinations  (64 color pairs beginning with corner cells and
 * another 64 beginning with edge cells).
 */

// Per color:
// Colors are numbered from 1 to 8;  in the arrays indexed by a color
// we therefore waste slot 0.
var specLateral = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var specDiagonal = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var specNbrs = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var specTotal = [0, 0, 0, 0, 0, 0, 0, 0, 0];
var foodLateral = 0;
var foodDiagonal = 0;
var foodTotal = 0;

specTotal[myColor]++;

// Inspect corner cells:
for (i = 0; i < TOTAL_NBRS; i += 2) {
    var cell = view[CCW[i]];
    specDiagonal[cell.color]++;
    specNbrs[cell.color]++;
    specTotal[cell.color]++;
    if (cell.food > 0) {
	foodDiagonal++;
	foodTotal++;
	if (amNotHungry) {
	    destOK[CCW[i]] = false;
	    unobstructed = false;
	}
    }
}

// Inspect edge cells:
for (i = 1; i < TOTAL_NBRS; i += 2) {
    var cell = view[CCW[i]];
    specLateral[cell.color]++;
    specNbrs[cell.color]++;
    specTotal[cell.color]++;
    if (cell.food > 0) {
	foodLateral++;
	foodTotal++;
	if (amNotHungry) {
	    destOK[CCW[i]] = false;
	    unobstructed = false;
	}
    }
}

// Any other ants nearby?  Per ant type:
// Ant types are numbered from 1 to 5;  in the arrays indexed by an ant type
// we therefore waste slot 0.
var adjFriends = [0, 0, 0, 0, 0, 0];
var adjLadenFriends = [0, 0, 0, 0, 0, 0];
var adjUnladenFriends = [0, 0, 0, 0, 0, 0];
var friendsTotal = 0;
var myQueenPos = 0;
var adjFoes = [0, 0, 0, 0, 0, 0];
var adjLadenFoes = [0, 0, 0, 0, 0, 0];
var adjUnladenFoes = [0, 0, 0, 0, 0, 0];
var foesTotal = 0;
// We don't care much about enemy worker's types except as a source of entropy,
// but we do occasionally care about enemy queens...

for (i = 0; i < TOTAL_NBRS; i++) {
    var cell = view[CCW[i]];
    if (cell.ant) {
	if (cell.ant.friend) {
	    adjFriends[cell.ant.type]++;
	    friendsTotal++;
	    if (cell.ant.type == ANT_QUEEN) {
		compass = i & 6;
		myQueenPos = i & 1;
	    }
	    if (cell.ant.food > 0) {
		adjLadenFriends[cell.ant.type]++;
	    } else {
		adjUnladenFriends[cell.ant.type]++;
	    }
	} else {
	    adjFoes[cell.ant.type]++;
	    foesTotal++;
	    if (cell.ant.food > 0) {
		adjLadenFoes[cell.ant.type]++;
	    } else {
		adjUnladenFoes[cell.ant.type]++;
	    }
	}
	destOK[CCW[i]] = false;
	unobstructed = false;
    }
}

// Now my own queen is in view iff adjFriends[ANT_QUEEN] > 0;
// in this case we'll already have set our compass and noted whether she
// is straight behind us (myQueenPos = 1) or rear left (0).

// ---- What am I doing here? ----

// ---- Decision Tree: top level ----

switch (myType) {
case ANT_QUEEN:
    return (runQueenStrategies());
case ANT_STAFF:
    if (myQueenPos == 1) {
	return (runSecStrategies());
    } else if (adjFriends[ANT_QUEEN] > 0) {
	return (runGardenerStrategies());
    } else {
	return (runLostStaffStrategy()); // skips to third tree level
    }
case ANT_ENGINEER:
    return (runEngineerStrategies());
case ANT_JUNIOR_MINER: // fallthrough
case ANT_SENIOR_MINER:
    if (adjFoes[ANT_QUEEN] > 0) {
	return (runDefenderStrategies());
    } else if (myFood > 0) {
	return (runLMStrategies());
    } else {
	return (runUMStrategies());
    }
default:
    return CELL_NOP; // notreached
}

// ---- (Ant function body ends here;  remainder is function definitions) ----

// ---- Decision Tree: Second level ----

function runQueenStrategies () {
    // debugme("runQueenStrategies: adjFriends: " + adjFriends);
    switch (adjFriends[ANT_STAFF]) {
    case 0:
	return (runQueenScramblingStrategy());
    case 1:
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    var cell = view[CCW[i]];
	    if (cell.ant && cell.ant.type == ANT_STAFF) {
		compass = i & 6;
		if (i & 1) { // found (only) the secretary
		    return (runQueenLeavingStrategy());
		} else { // found (only) the gardener
		    return (runQueenSettlingStrategy());
		}
	    }
	}
	break; // notreached
    case 2:
	for (i = 0; i < TOTAL_NBRS; i+=2) {
	    var cell0 = view[CCW[i]];
	    var cell1 = view[CCW[i+1]];
	    if ((cell0.ant && (cell0.ant.type == ANT_STAFF)) && // gardener
		(cell1.ant && (cell1.ant.type == ANT_STAFF)) // secretary
	       ) {
		compass = i;
		return (runQueenOperatingMineStrategy());
	    }
	}
	// two staff in view, but not in their correct positions
	return (runQueenConfusedStrategy());
    default: // more than two staff in view!?
	return (runQueenConfusedStrategy());
    }
    return CELL_NOP; // notreached
}

function runSecStrategies () {
    // Assert:  compass is set, queen and myself mutually at CCW[compass+1]
    // (facing in opposite directions).  Normally the gardener will be
    // at CCW[compass+3].
    if (view[CCW[compass+3]].ant &&
	view[CCW[compass+3]].ant.friend &&
	(view[CCW[compass+3]].ant.type == ANT_STAFF)) {
	return (runSecOperatingStrategy());
    } else {
	return (runSecEmergencyStrategy());
    }
}

function runGardenerStrategies () {
    // Assert:  compass is set, queen and myself mutually at CCW[compass]
    // (facing in different directions), the secretary will be created at
    // my CCW[compass+7].
    var secCell = view[CCW[compass+7]];
    if (secCell.ant && (secCell.ant.friend == 1) &&
	(secCell.ant.type == ANT_STAFF)) {
	return (runGardenerOperatingStrategy());
    } else {
	return (runGardenerSettlingStrategy());
    }
    return CELL_NOP; // notreached
}

function runEngineerStrategies () {
    // #future# The wraparound case of seeing another engineer would need
    // to be handled before checking for nearby miners  (and we could and
    // should even set our compass in that case).
    if (adjFriends[ANT_QUEEN] > 0) {
	// Assert:  compass is set.
	return (runEngineerAtHomeStrategy());
    } else if (adjFriends[ANT_JUNIOR_MINER] +
	       adjFriends[ANT_SENIOR_MINER] > 0) {
	return (runEngineerBuildingRailStrategy());
    } else {
	return (runEngineerAloneStrategy());
    }
    return CELL_NOP; // notreached
}

function runDefenderStrategies() {
    // Pompous function name for a simple tactic:  Stare her down.
    // However...
    debugme(((myFood > 0) ? "L" : "Unl") + "aden Miner sees " +
	    adjFoes[ANT_QUEEN] + " enemy queen(s)" +
	    (adjFriends[ANT_QUEEN] > 0) ? " and our own" : "");
    if (adjFriends[ANT_QUEEN] > 0) {
	return (runDefendingHomeStrategy());
    }
    return CELL_NOP; // Neener, neener...
}

function runUMStrategies () {
    if ((friendsTotal + foesTotal >= 4) &&
	(adjFriends[ANT_JUNIOR_MINER] + adjFriends[ANT_SENIOR_MINER] +
	 adjFriends[ANT_ENGINEER] >= 3)) {
	return (runUMCongestionResolutionStrategy());
    } else if (adjFriends[ANT_QUEEN] > 0) {
	// Assert:  compass is set.
	return (runUMAtHomeStrategy());
    } else if (adjFriends[ANT_STAFF] > 0) { // probably the gardener
	debugme("Unladen Miner: staff in view");
	if (adjFriends[ANT_STAFF] > 1) { // we're in the garden
	    return (runMinerToRail1Strategy());
	} else {
	    return (runUMReachingHomeStrategy());
	}
    } else if (adjFriends[ANT_ENGINEER] > 0) {
	return (runUMBuildingRailStrategy());
    } else if (specLikeRL1()) {
	debugme("Unladen Miner: spectrum resembles RL1");
	return (runUMLeaveRL1Strategy());
    } else if (specLikeRR0()) {
	debugme("Unladen Miner: spectrum resembles RR0");
	return (runUMLeaveRR0Strategy());
    } else if (specLikeRR2()) {
	debugme("Unladen Miner: spectrum resembles RR2");
	return (runUMLeaveRR2Strategy());
    } else if (specLikeCenterShaft()) {
	debugme("Unladen Miner: spectrum resembles mine shaft");
	return (runUMDrillingShaftStrategy());
	// #future# return-from-shaft-wall cases  (at present, we simply
	// rely on random walks:  A UM bumping into an LM in a shaft has
	// been descending the wrong shaft to begin with...)
    } else if (specLikeRL02()) {
	debugme("Unladen Miner: spectrum resembles RL0/2");
	return (runUMLeaveRL02Strategy());
    } else if (specLikeCenterRail()) {
	debugme("Unladen Miner: spectrum resembles RM");
	// somewhere on mid rail, or fooled by three cyans just off the rail
	return (runUMTravelOrRepairRailStrategy());
    } else if (specLikeRR1()) { // potential shaft head in view
	debugme("Unladen Miner: spectrum resembles RR1");
	return (runUMPreparingShaftStrategy());
    } else if (specLikeMS0R()) { // at potential shaft head already
	debugme("Unladen Miner: spectrum resembles MS0R");
	return (runUMEnteringShaftStrategy());
    } else if (specLikeMS0Wrapping()) {
	debugme("Unladen Miner: spectrum resembles MS0, wrapping");
	return (runUMShaftWrappingStrategy());
    }
    debugme("Unladen Miner: what spectrum is this??");
    return (runLostMinerStrategy(true));
}

function runLMStrategies () {
    // Mostly a mirror image of the unladen case, except we won't stay
    // laden when we've stepped up next to our queen.
    if ((friendsTotal >= 3) &&
	(friendsTotal + foesTotal >= 4)) {
	// Congestion avoidance has high priority...
	return (runLMCongestionResolutionStrategy());
    } else if (adjFriends[ANT_STAFF] > 0) { // usually the gardener
	debugme("Laden Miner: staff in view");
	if (adjFriends[ANT_STAFF] > 1) { // we're in the garden
	    return (runMinerToRail1Strategy());
	} else {
	    return (runLMReachingHomeStrategy());
	}
    } else if (specLikeMFL()) {
	debugme("Laden Miner: spectrum resembles left shaft wall");
	return (runLMLeavingLeftWallStrategy());
    } else if (specLikeMFR()) {
	debugme("Laden Miner: spectrum resembles right shaft wall");
	return (runLMLeavingRightWallStrategy());
    } else if (specLikeRL1()) {
	debugme("Laden Miner: spectrum resembles RL1");
	return (runLMLeaveRL1Strategy());
    } else if (specLikeRR0()) {
	debugme("Laden Miner: spectrum resembles RR0");
	return (runLMLeaveRR0Strategy());
    } else if (specLikeRR2()) {
	debugme("Laden Miner: spectrum resembles RR2");
	return (runLMLeaveRR2Strategy());
    } else if (specLikeMS0R()) { // at shaft head
	debugme("Laden Miner: spectrum resembles MS0R");
	return (runLMLeavingShaftStrategy());
    } else if (specLikeMS0ROut()) {
	debugme("Laden Miner: spectrum resembles MS0ROut");
	return (runLMLeavingVacantShaftStrategy());
    } else if (specLikeCenterShaft() &&
	       (adjFriends[ANT_ENGINEER] == 0)) {
	debugme("Laden Miner: spectrum resembles mine shaft");
	return (runLMAscendingShaftStrategy());
    } else if (specLikeRL02()) {
	debugme("Laden Miner: spectrum resembles RL0/2");
	return (runLMLeaveRL02Strategy());
    } else if (specLikeCenterRail()) {
	debugme("Laden Miner: spectrum resembles RM");
	// somewhere on mid rail, or fooled by three cyans just off the rail
	return (runLMTravelOrRepairRailStrategy());
    } else if (specLikeRR1()) { // next to shaft head
	debugme("Laden Miner: spectrum resembles RR1");
	return (runLMDepartingFromShaftStrategy());
    } else if (adjFriends[ANT_ENGINEER] > 0) {
	// Found the engineer, but the rail is damaged beyond
	// recognition...
	return (runLMFixingRailStrategy());
    }
    debugme("Laden Miner: what spectrum is this??");
    return (runLostMinerStrategy(true));
}

// ---- Decision Tree: Third level ----

// Queen's strategies

function runQueenScramblingStrategy() {
    // Still need to orient ourselves.
    if (unobstructed) {
	if (foodTotal > 0) {
	    return (runQueenScramblingEatingTactic()); // fast path
	} else if (myFood >= THRESHOLD1) {
	    return (runQueenPrepareToSettleTactic());
	} else if (myColor != LCL_TRAIL) {
	    if ((myColor == LCL_CLEAR) ||
		(specNbrs[LCL_CLEAR] >= TOTAL_NBRS - 1)) {
		// extend trail by the cell we're standing on, fast
		return {cell:POS_CENTER, color:LCL_TRAIL};
	    } else {
		// check our surroundings more carefully
		return (runQueenScramblingTrailCheckTactic());
	    }
	    
	} else if ((specNbrs[LCL_CLEAR] >= 4) &&
		   (specNbrs[LCL_TRAIL] == 1)) {
	    // Continue trail, fast.  Still need to orient ourselves.
	    // There's one trail cell in view;  aim diagonally away from it.
	    for (var i = 0; i < TOTAL_NBRS; i+=2) {
		if ((view[CCW[i]].color == LCL_TRAIL) ||
		    (view[CCW[i+1]].color == LCL_TRAIL)) {
		    return {cell:CCW[i+4]};
		}
	    }
	} else if (specNbrs[LCL_CLEAR] == TOTAL_NBRS) {
	    // Everything's white  (trail start, or lost it).
	    // Any diagonal direction is as good as any other.
	    return {cell:0};
	} else { // slow path: no food, confusing colors
	    return (runQueenScramblingAroundTactic());
	}
    } else {
	// Obstructed.  There should not exist any friends (yet).
	if ((foodTotal > 0) && (foesTotal > 0) &&
	    (foesTotal == adjFoes[ANT_QUEEN])) {
	    // No unfriendly workers in view and there's food we can
	    // snatch before the other queen gets it.  Have at it.
	    return (runQueenScramblingSnatchingTactic());
	} else {
	    return (runQueenScramblingEvasionTactic());
	}
    }
    return CELL_NOP; // notreached
}

/*
 * The queen is settling down and creating the initial team of workers:
 *
 * The gardener will ensure that the queen's myColor is LCL_QC_RESET
 * (a synonym of LCL_CLEAR)  and then kick everything off by setting her
 * cell to LCL_PHASE_BOOTING.  Since the gardener, being the oldest worker,
 * moves first, then all the younger workers, and then the queen, we can
 * rely on the engineers and miners  (who can see the queen's cell's color)
 * to stay in view until we've created all of them and the secretary, in
 * turn allowing the queen to keep track of how far we are.
 * While we're doing this  (it takes less than a dozen successive turns),
 * we're very vulnerable to interference by opponents, and can't really
 * do anything about it.  If anybody else is standing in the way, forego
 * a rail, work around them, and pray.
 */
function runQueenSettlingStrategy() {
    // Assert:  compass is set, gardener and self mutually at CCW[compass]
    // (facing in different directions).  Phase ends with the secretary at
    // our CCW[compass+1] and the clock not yet running.
    // When resettling after an emergency, we gain one tempo by creating
    // the rail3 engineer  (on the side where we know an enemy to be near)
    // one turn before the gardener sets her cell to LCL_PHASE_BOOTING.
    if ((myFood > THRESHOLD0) && (myColor == LCL_QC_RESET)) {
	if (destOK[CCW[compass+7]]) {
	    return { cell:CCW[compass+7], type:ANT_ENGINEER};
	} else if (view[CCW[compass]].color == LCL_PHASE_BOOTING) {
	    if (destOK[CCW[compass+3]]) {
		return { cell:CCW[compass+3], type:ANT_ENGINEER};
	    } else if (destOK[CCW[compass+5]]) {
		return { cell:CCW[compass+5], type:ANT_ENGINEER};
	    } else if (destOK[CCW[compass+6]]) {
		return { cell:CCW[compass+6], type:ANT_JUNIOR_MINER};
	    } else if (destOK[CCW[compass+2]]) {
		return { cell:CCW[compass+2], type:ANT_JUNIOR_MINER};
	    } else if (destOK[CCW[compass+4]]) {
		return { cell:CCW[compass+4], type:ANT_JUNIOR_MINER};
	    } else if (destOK[CCW[compass+1]]) {
		// finally, the secretary
		return { cell:CCW[compass+1], type:ANT_STAFF};
	    }
	}
	// Assert:  still holding >= THRESHOLD0 food
    }
    return CELL_NOP; // not normally reached
}

/*
 * About the clock oscillator in runQueenOperatingMineStrategy() and
 * runSecOperatingStrategy():
 *
 * The queen cycles her own cell through six colors, the secretary cycles
 * hers through seven, resulting in a 42-moves "beat" cycle.  The gardener
 * monitors both cells and divides the clock rate by two.  The secretary
 * monitors all three cells, too, and after 84 cycles, uses one extra move
 * to "ring the alarm"  (by painting the gardener's cell to say so).
 * This gives the queen one extra turn to do whatever needs doing now,
 * before both queen and secretary resume the clock-ticking.  Clearing
 * the alarm is left to the gardener.  Overall we get one clock ring
 * every 85 moves  (or just under 12 per 1000 moves).
 *
 * For miner-spawning purposes, the random controller orientation is then
 * thrown in to reduce this further to 9 or 6 or 3 (or no) new miners on
 * average every 1000 moves, subject to food being available, and governed
 * by how much we have hoarded.
 *
 * The clock-ringing logic depends crucially on the gardener moving first,
 * then the secretary, then the queen.
 *
 * There would be many other ways to run an oscillator.  As dzaima points out
 * in the comments on the PPCG answer, a single ant  (e.g. the secretary)
 * could easily maintain a Gray-code clock on three cells, and then the queen
 * could just watch this and draw her own conclusions, without any explicit
 * ringing.  However, I had found that having an ant stand on each of these 
 * state-carrying cells makes the affair more robust against generic intruders,
 * and the staff do not have that much else to do...
 *
 * Dedicated intruders could of course easily stop our clock.  But what would
 * be the point?  Its main purpose is to prevent us from turning too much
 * food into ants, and with a stopped clock we'd hoard *all* still-arriving
 * food and turn none of it into ants.  We would just lose part of our self-
 * repair capabilities...
 */

function runQueenOperatingMineStrategy() {
    // Assert:  compass is set, secretary and self mutually at CCW[compass+1]
    // (facing in opposite directions), gardener at CCW[compass].
    if ((adjFoes[ANT_QUEEN] > 0) && (myFood > 0)) {
	// Emergency...  Forget about our clock for a moment.
	// Try to create a bodyguard on a cell from where both queens
	// will be visible, if possible.
	debugme("Queen:  Enemy at our doors!  Enable the shields.");
	for (var i = 2; i < TOTAL_NBRS; i++) {
	    if (view[CCW[compass+i]].ant &&
		(view[CCW[compass+i]].ant.type == ANT_QUEEN) &&
		!view[CCW[compass+i]].ant.friend) {
		debugme("Enemy sighted at " + i + "!");
		if (destOK[CCW[compass+i-1]]) {
		    debugme("--- outflanking at " + (i-1));
		    return {cell:CCW[compass+i-1], type:ANT_JUNIOR_MINER};
		} else if (destOK[CCW[compass+i+1]]) {
		    debugme("--- outflanking at " + (i+1));
		    return {cell:CCW[compass+i+1], type:ANT_JUNIOR_MINER};
		} else if (i == 5) {
		    // When the enemy queen is on an edge neighbor cell, we can
		    // also use the preceding or following edge cells, not just
		    // the corners.  When i == 3 or 7, the secretary is already
		    // in such a place.  Don't go over the top, though -- more
		    // than three defenders are unnecessary.
		    if (destOK[CCW[compass+3]] &&
			!(view[CCW[compass+4]].ant && view[CCW[compass+4]].ant.friend &&
			  view[CCW[compass+6]].ant && view[CCW[compass+6]].ant.friend &&
			  view[CCW[compass+7]].ant && view[CCW[compass+7]].ant.friend)) {
			debugme("--- double-outflanking at 3");
			return {cell:CCW[compass+3], type:ANT_JUNIOR_MINER};
		    } else if (destOK[CCW[compass+7]] &&
			       !(view[CCW[compass+4]].ant && view[CCW[compass+4]].ant.friend &&
				 view[CCW[compass+6]].ant && view[CCW[compass+6]].ant.friend &&
				 view[CCW[compass+3]].ant && view[CCW[compass+3]].ant.friend)) {
			debugme("--- double-outflanking at 7");
			return {cell:CCW[compass+7], type:ANT_JUNIOR_MINER};
		    }
		} else if ((i == 3) &&
			   destOK[CCW[compass+5]] &&
			   !(view[CCW[compass+2]].ant && view[CCW[compass+2]].ant.friend &&
			     view[CCW[compass+4]].ant && view[CCW[compass+4]].ant.friend)) {
		    debugme("--- double-outflanking at 5");
		    return {cell:CCW[compass+5], type:ANT_JUNIOR_MINER};
		} else if ((i == 7) &&
			   destOK[CCW[compass+5]] &&
			   !(view[CCW[compass+6]].ant && view[CCW[compass+6]].ant.friend)) {
		    // Both the secretary and the gardener can see the enemy.
		    debugme("--- double-outflanking at 5");
		    return {cell:CCW[compass+5], type:ANT_JUNIOR_MINER};
		}
	    }
	}
	// Otherwise, fall through to normal operations.  Either there
	// are already defenders in place, or there's no unoccupied cell
	// to do anything about the intruder(s).
    } else if ((myFood > 0) &&
	       (view[CCW[compass+7]].color == LCL_ALERT) &&
	       destOK[CCW[compass+7]]) {
	// We normally never use this color on an RL0 cell, and the gardener
	// would only plant violets to tell us that she can see a queen whom
	// we can't see directly.  Note that when the enemy has only just
	// stepped up, the gardener would typically *not* appear laden:  She
	// would have received one food at the end of the enemy queen's move,
	// and would have delivered it at the end of her own move, before it
	// is our  (the Windmill queen's)  turn.
	// Note that runGardenerGardeningTactic() would normally ensure that
	// RL0 has its usual color when *no* enemy queen is in view  (as long
	// as the gardener isn't preoccupied with other things).  Thus a single
	// enemy worker on RL1, say, can't trick us into spawning an unlimited
	// number of defenders by overpainting RL0.
	debugme("Enemy queen beyond our own view reported by the gardener.");
	// About the first thing the defender will do is restore the RL0 cell
	// color.  And the gardener won't use the alert color again until the
	// cell becomes empty.  This puts a limit on the rate at which this
	// mechanism can get triggered.
	// #future# Alternatively, what about an extra Engineer as a
	// defender.....?  (That would depend on teaching an Engineer
	// at home to pay attention to unfriendly ants in her view.)
	// On the other hand, when we find ourselves having to expend food
	// for a defender:  While an extra engineer might later help to keep
	// a damaged rail right-side up, extra miners could proceed to gather
	// food when their patrol service is over.
	return {cell:CCW[compass+7], type:ANT_JUNIOR_MINER};
    } else if (view[CCW[compass+1]].ant.food > 0) {
	// A food-bearing enemy queen has appeared next to our secretary,
	// but neither the gardener nor myself can see her directly.
	// There is only one possible place she can be:  the RR0 cell of
	// rail1, thus no signal color is needed.  Put a miner on the
	// adjacent RM0 cell if necessary and possible.
	debugme("Enemy queen beyond our own view reported by the secretary.");
	if ((myFood > 0) && destOK[CCW[compass+2]]) {
	    return {cell:CCW[compass+2], type:ANT_JUNIOR_MINER};
	}
    } else if ((adjLadenFriends[ANT_JUNIOR_MINER] + adjLadenFriends[ANT_SENIOR_MINER] > 0) &&
	       (myFood > 0) &&
	       (specNbrs[LCL_ALERT] > 0)) {
	// An adjacent miner cannot be laden unless she hast just stolen food
	// from an enemy queen at the end of the miner's move.
	// (Miners stepping up to us bearing food would become unladen before
	// it is the queen's turn to look at them.)
	// Check whether there's an unoccupied neighbor cell painted in the
	// alert color, and if so, place another friendly miner there.
	// NB the spectrum check may see a false positive  (LCL_ALERT is also
	// one of the secretary's valid counter colors),  and another friendly
	// ant may have stepped onto the painted cell in the meantime, so the
	// loop may well come up empty.
	debugme("Enemy queen beyond our own view reported by one of our miners.");
	for (var i = 2; i < TOTAL_NBRS; i++) {
	    var c = CCW[compass+i];
	    if (destOK[c] && (view[c].color == LCL_ALERT)) {
		return {cell:c, type:ANT_JUNIOR_MINER};
	    }
	}
	// Otherwise, fall through and get on with business as best we can.
    } else if ((foesTotal > 0) &&
	       (adjUnladenFoes[1] + adjUnladenFoes[2] + adjUnladenFoes[3] + adjUnladenFoes[4] >= 2) &&
	       (myFood > THRESHOLDX)) {
	debugme("Thieves in our hall.");
	// Step to RM0 of rail1 if possible, keeping the secretary
	// in our lateral view and vice versa.
	if (destOK[CCW[compass+2]]) {
	    debugme("Going unhinged...");
	    return {cell:CCW[compass+2]};
	}
	// Otherwise, fall through and get on with business as best we can.
    }
    if (!(LCR_QC_VALID[myColor])) {
	// (Re)start our clock.  (Not at zero since we don't want it to
	// ring immediately.)
	return {cell:POS_CENTER, color:LCR_QC[1]};
    } else if ((view[CCW[compass]].color == LCL_PHASE_RINGING) &&
	       isScZero(view[CCW[compass+1]].color)) {
	// Try to spawn a worker, in a direction determined by controller's
	// random orientation.  However, we use a "ratchet" to not waste
	// all our food on new miners when no new food at all is coming in.
	if ((myFood <= THRESHOLD0) ||
	    // No food to spare, can't spawn.
	    (myFood % RATCHET_MODULUS == RATCHET_RESIDUE)
	    // Lock in what we have  (except for theft).
	   ) {
	    return (runQueenHousekeepingTactic());
	} else if (myFood <= THRESHOLD2) {
	    if (destOK[CCW[0]]) {
		return {cell:CCW[0], type:ANT_JUNIOR_MINER};
		// #future# Create miners on edge neighbor cells too,
		// when the corner cells are otherwise occupied?
	    } else {
		// Too crowded.  Try to make ourselves useful in another way.
		return (runQueenHousekeepingTactic());
	    }
	} else {
	    // From here on, we use orientation randomness  (reflected in
	    // the computed compass setting)  to lower the spawning rate
	    // further below the ~12 clock rings per 1000 move, and the
	    // residue of myFood modulo  (a multiple of)  three to select
	    // the rail for our offspring.
	    var destCycle = [2, 4, 6, 4, 6, 2, 6, 2, 4];
	    var destination = destCycle[myFood % 9];
	    if (!destOK[CCW[compass+destination]]) {
		destination = destination % 6 + 2;
	    }
	    if (!destOK[CCW[compass+destination]]) {
		destination = destination % 6 + 2;
	    }
	    if (!destOK[CCW[compass+destination]]) {
		return (runQueenHousekeepingTactic()); // too crowded
	    }
	    // Assert:  destOK[CCW[compass+destination]]
	    if (myFood <= THRESHOLD3) {
		if (compass <= 2) {
		    return {cell:CCW[compass+destination], type:ANT_JUNIOR_MINER};
		} else {
		    return (runQueenHousekeepingTactic());
		}
	    } else if (myFood <= THRESHOLD4) {
		// Add senior miners to the mix.
		// #future# Create these on RL0 cells instead of RM0 and then
		// let them linger there for a bit before they depart?
		if (compass <= 2) {
		    return {cell:CCW[compass+destination],
			    type:((compass > 0) ? ANT_JUNIOR_MINER : ANT_SENIOR_MINER)};
		} else {
		    return (runQueenHousekeepingTactic());
		}
	    } else if (myFood <= THRESHOLD5) {
		// Drop junior miners, halving the rate again.
		if (compass == 0) {
		    return {cell:CCW[compass+destination], type:ANT_SENIOR_MINER};
		} else {
		    return (runQueenHousekeepingTactic());
		}
	    } else {
		// Stop spawning entirely.
		return (runQueenHousekeepingTactic());
	    }
	}
    } else {
	// step the clock
	return {cell:POS_CENTER, color:incrementQc(myColor)};
    }
    return CELL_NOP; // notreached
}

function runQueenLeavingStrategy() {
    // Assert:  compass is set, secretary at CCW[compass+1].
    debugme("Yukon ho!");
    // We trust the secretary's navigation abilities.  If the secretary's
    // way on is blocked, we end up going around her and ultimately
    // toppling over  (if the gardener should come into our view again
    // from a funny angle).  But then we'll still receive some food and
    // some miners will still be able to turn around and depart...
    if (destOK[CCW[compass+2]]) {
	return {cell:CCW[compass+2]};
    }
    return CELL_NOP;
}

function runQueenConfusedStrategy() {
    // Nor this.
    return CELL_NOP; // placeholder
}

// Secretary's strategies

function runSecOperatingStrategy() {
    // Assert:  compass is set, queen and myself mutually at CCW[compass+1]
    // (facing in opposite directions);  gardener at my CCW[compass+3].
    // If our clock is not yet running, start it.  (Not at zero since we
    // don't want it to ring immediately.)
    if (!(LCR_SC_VALID[myColor])) {
	return {cell:POS_CENTER, color:LCR_SC[1]};
    } else if (isScZero(myColor) && isQcZero(view[CCW[compass+1]].color) &&
	       (view[CCW[compass+3]].color == LCL_PHASE_RUNNING)) {
	return {cell:CCW[compass+3], color:LCL_PHASE_RINGING};
    } else { // in particular, if it's already ringing...
	// step the clock
	return {cell:POS_CENTER, color:incrementSc(myColor)};
    }
    return CELL_NOP; // notreached
}

function runSecEmergencyStrategy() {
    // Assert:  compass is set, queen and myself mutually at CCW[compass+1]
    // (facing in opposite directions);  *no* gardener at CCW[compass+3].
    // Our strategy is quick and dirty, trusting that most colors are still
    // as they should be near home, without over-matching.  Any obstacle
    // along our path will result in the windmill toppling over in some
    // uncontrolled fashion.  (Can't win them all...)
    debugme("Escorting the departing queen.");
    if (view[CCW[compass+5]].ant &&
	view[CCW[compass+5]].ant.friend &&
	(view[CCW[compass+5]].ant.type == ANT_STAFF)) {
	debugme("First step");
	if (destOK[CCW[compass]]) {
	    return {cell:CCW[compass]};
	}
    } else if ((myColor == LCL_RR0) &&
	       (view[CCW[compass+5]].color == LCL_G6)) {
	debugme("Second step");
	if (destOK[CCW[compass]]) {
	    return {cell:CCW[compass]};
	}
    } else {
	debugme("Third step");
	if (destOK[CCW[compass+3]]) {
	    debugme("Taking up gardening.");
	    return {cell:CCW[compass+3]};
	    // This should result in persuading the queen to settle anew.
	} else if (destOK[CCW[compass]]) {
	    debugme("No garden soil here, going further.");
	    // More than three steps mean we'll lose the fortuitous
	    // alignment between old and new rails if we resettle later.
	    return {cell:CCW[compass]};
	}
    }
    // Otherwise, stay put.  The queen would step around us if possible,
    // so the next time it's our turn we would try to do things at a
    // new angle.
    return CELL_NOP;
}

// Gardener's strategies

function runGardenerSettlingStrategy() {
    // Assert:  compass is set, queen and myself mutually at CCW[compass]
    // (facing in different directions), secretary yet to be created.
    // Our prime responsibility here is to keep the queen's cell white
    // (normally a no-op!):
    if (view[CCW[compass]].color != LCL_QC_RESET) {
	return {cell:CCW[compass], color:LCL_QC_RESET};
    }
    // Once this is OK, kick off the bootstrap sequence.
    if (myColor != LCL_PHASE_BOOTING) {
	return {cell:POS_CENTER, color:LCL_PHASE_BOOTING};
    }
    // Leaving the queen to it, begin to look after the garden.
    return (runGardenerGardeningTactic());
}

function runGardenerOperatingStrategy() {
    // Assert:  compass is set, queen and myself mutually at CCW[compass]
    // (facing in different directions), secretary at my CCW[compass+7].
    if (adjFoes[ANT_QUEEN] > 0) {
	// Defending our home:  Is the enemy queen somewhere that we can
	// see and that a newly created miner could see but our queen
	// cannot see directly?  There are only two possibilities;
	// in both the only candidate cell for a new miner is the RL0
	// of rail3.  We'll also steal one food at the end of this move
	// (if we aren't laden already).
    	var c = CCW[compass+2]; // RL1 cell of rail3
	if (view[c].ant && !view[c].ant.friend &&
	    (view[c].ant.type == ANT_QUEEN) &&
	    (view[c].ant.food > 0) &&
	    !view[CCW[compass+1]].ant) {
	    return {cell:CCW[compass+1], color:LCL_ALERT};
	}
	c = CCW[compass+3]; // our G3 garden cell
	if (view[c].ant && !view[c].ant.friend &&
	    (view[c].ant.type == ANT_QUEEN) &&
	    (view[c].ant.food > 0) &&
	    !view[CCW[compass+1]].ant) {
	    return {cell:CCW[compass+1], color:LCL_ALERT};
	}
    }
    // Otherwise, get on with our normal business.
    if (!LCR_PHASES_RUNNING[myColor]) {
	// This happens either at the start of the mining phase, or
	// whenever the secretary had just used this cell to indicate
	// a ringing clock.  The gardener prefers it quiet, but we give
	// the secretary time to advance her clock before clearing the
	// alarm  (otherwise it would immediately ring again!).
	if ((myColor == LCL_PHASE_RINGING) &&
	    isScZero(view[CCW[compass+7]].color)) {
	    return CELL_NOP;
	} else {
	    return {cell:POS_CENTER, color:LCL_PHASE_RUNNING};
	}
    } else if (isScOne(view[CCW[compass+7]].color) &&
	       isQcTwo(view[CCW[compass]].color)) {
	// act as a clock divider
	switch (myColor) {
	case LCL_PHASE_RUNNING:
	    return {cell:POS_CENTER, color:LCL_PHASE_RUNNING1};
	case LCL_PHASE_RUNNING1:
	    return {cell:POS_CENTER, color:LCL_PHASE_RUNNING};
	default:
	    return CELL_NOP; // notreached
	}
    } else {
	return (runGardenerGardeningTactic());
    }
}

// Emergency staff strategy

function runLostStaffStrategy() {
    // Tell our friends that we're lost.
    if (myColor != LCL_CLEAR) {
	return {cell:POS_CENTER, color:LCL_CLEAR};
    }
    return CELL_NOP;
}

// Engineers' strategies

function runEngineerAtHomeStrategy() {
    // Assert:  compass is set.
    // Don't move until queen's clock counter has turned valid, but may
    // paint ahead.
    // We start out on the left rail edge with the queen straight behind
    // us (myQueenPos == 1) and we should normally stay on this
    // edge, but be prepared for weird "edge" cases.
    if (myQueenPos == 1) {
	// The cell at CCW[compass+2] belongs to the previous rail or to the
	// secretary;  leave it alone.  And ignore the cells to our left.
	// If RM1 looks plausible, we dare not overpaint it  (doing so
	// might subsequently inconvenience both ourselves and an earlier
	// miner working down this shaft).  If it didn't start out claiming
	// the shaft was exhausted, a senior miner will have a closer look
	// later on.  But we do sanitize inappropriate colors here.
	var pattern = PAT_FRL0H;
	var mismatch = patternCheck(pattern, AIM_UP, 0, 1);
	if (mismatch < 0) {
	    var cc = fwdWrong[0];
	    return {cell:cc.v, color:fixup(pattern[cc.p])};
	} else if (LCR_QC_VALID[view[CCW[compass+myQueenPos]].color] &&
	    destOK[CCW[compass+5]]) {
	    // Pattern complete - step ahead when the clock is running and
	    // the road ahead is clear
	    // #future# handle congestion ahead? (or be stubborn...)
	    return {cell:CCW[compass+5]};
	}
    }
    // #future# sitting on RM0 instead of RL0 -- step back to the left edge
    // as soon as possible
    return CELL_NOP;
}

function runEngineerBuildingRailStrategy() {
    // Assert:  We're away from the queen, and a friendly junior or senior
    // miner is in view.
    if (adjFriends[ANT_STAFF] > 0) { // can only be the gardener
	return (runEngineerLeavingGardenTactic());
    } else {
	return (runEngineerBuildingRailTactic());
    }
}

function runEngineerAloneStrategy() {
    // Without a friendly miner in sight, the engineer will stay where she is
    // and guard the current rail head.
    // We don't even dare to keep the colors intact, because we don't have
    // enough redundancy on our own to be sure of not losing the right
    // orientation.
    return CELL_NOP;
}

// Unladen Miners' strategies

function runUMAtHomeStrategy() {
    // Assert:  compass is set.
    // Don't move until queen's clock counter has turned valid, but may
    // paint ahead.
    // We start out in the middle of the rail with the queen diagonally
    // behind us (myQueenPos == 0),  but later on we might find
    // ourselves on the left rail if we've had to let someone else pass.
    // (The queen's cell can't be seen from the right rail edge.)
    if (myQueenPos == 0) {
	// Cells at CCW[compass+1], CCW[compass+2] belong to the previous
	// rail or to the secretary and garden.  Leave them alone.
	if (myColor != LCL_RM0) {
	    return {cell:POS_CENTER, color:LCL_RM0};
	} else if (view[CCW[compass+3]].color != LCL_RR0) {
	    return {cell:CCW[compass+3], color:LCL_RR0};
	} else if (view[CCW[compass+7]].color != LCL_RL0) {
	    return {cell:CCW[compass+7], color:LCL_RL0};
	} else if (view[CCW[compass+5]].color != LCL_RM1) {
	    return {cell:CCW[compass+5], color:LCL_RM1};
	} else if (view[CCW[compass+6]].color != LCL_RL1) {
	    return {cell:CCW[compass+6], color:LCL_RL1};
	} else if ((!LCR_GRR1[view[CCW[compass+4]].color]) &&
		   // Sanitize, but do not clear plausible settings;
		   // if a friend is already on the RR1 cell, don't interfere.
		   !(view[CCW[compass+4]].ant && view[CCW[compass+4]].ant.friend)) {
	    return {cell:CCW[compass+4], color:LCL_RR1};
	}
	// #future# Deal with possible food on RR0 at this point
	// (but only when the clock has started!)
	// Pattern complete - step ahead when the clock is running and
	// the road ahead is clear
	if (LCR_QC_VALID[view[CCW[compass]].color]) {
	    if (destOK[CCW[compass+5]]) { // off we go to RM1...
		return {cell:CCW[compass+5]};
	    } else if (destOK[CCW[compass+4]]) {
		// try to sneak around the congestion by heading to RR1
		return {cell:CCW[compass+4]};
	    }
	}
    } else {
	// Sitting on RL0 instead, whether created here or as a result of
	// letting someone else pass at the last moment whilst returning
	// home laden.  Imitate Engineer's startup pattern-checking/fixing.
	var pattern = PAT_FRL0H;
	var mismatch = patternCheck(pattern, AIM_UP, 0, 1);
	if (mismatch < 0) {
	    var cc = fwdWrong[0];
	    return {cell:cc.v, color:fixup(pattern[cc.p])};
	} else if (LCR_QC_VALID[view[CCW[compass+myQueenPos]].color]) {
	    // #future# possibly delay this and play bodyguard for a while?
	    if (destOK[CCW[compass+3]]) {
		// step to RM0 when the road is clear
		return {cell:CCW[compass+3]};
	    } else if (view[CCW[compass+3]].ant &&
		       view[CCW[compass+3]].ant.friend &&
		       destOK[CCW[compass+4]]) {
		// step ahead to RM1, lifelined
		return {cell:CCW[compass+4]};
	    }
	}
    }
    // #future# handle worker-at-RL0 situation
    // (check and fix pattern, then return to RM0 if possible)
    return CELL_NOP;
}

function runUMBuildingRailStrategy() {
    // Assert:  A friendly engineer is in view.  (Since engineers stay
    // on the left side of the rail, we can't be on the right edge.)
    // There are weird cases to consider:  Seeing an engineer minus
    // her colors whilst approaching what used to be the left rail edge,
    // in the unlikely case that the youngest shaft is wrapping around,
    // or having stepped onto the left rail edge to let a laden miner
    // pass...  Thus check the spectrum first.
    if (specLikeRL1()) {
	debugme("Unladen Miner next to Engineer: spectrum resembles RL1");
	return (runUMLeaveRL1Strategy());
    } else if (specLikeRL02()) {
	debugme("Unladen Miner next to Engineer: spectrum resembles RL0/2");
	return (runUMLeaveRL02Strategy());
    } else if (specLikeCenterRail()) {
	debugme("Unladen Miner next to Engineer: spectrum resembles RM");
	return (runUMFreshCenterRailTactic());
    }
    debugme("Unladen Miner next to Engineer:  Spectrum unrecognizable");
    // Try circling the engineer counterclockwise until our surroundings look
    // familiar or until a SAR party turns up and repaints them.
    for (var i = TOTAL_NBRS - 1; i >= 0; i--) {
	if (view[CCW[i+1]].ant && view[CCW[i+1]].ant.friend &&
	    (view[CCW[i+1]].ant.type == ANT_ENGINEER) &&
	    destOK[CCW[i]]) {
	    return {cell:CCW[i]};
	}
    }
    return CELL_NOP; // otherwise stay put
}

function runUMTravelOrRepairRailStrategy() {
    // Assert:  specLikeCenterRail, engineer is not in view
    debugme("Unladen Miner sans Engineer: spectrum resembles RM");
    return (runUMCenterRailTactic());
}

function runUMLeaveRL1Strategy() {
    var pattern = PAT_GRL1;
    debugme("- trying PAT_GRL1");
    var mismatch = patternCheck(pattern, AIM_RIGHT, 0, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	// "PAT_GRL1_WRP", but done manually
	if ((view[CCW[compass+6]].color == LCL_MS_WRP) &&
	    (view[CCW[compass+7]].color == LCL_CLEAR) &&
	    (view[CCW[compass]].color == LCL_MR0) &&
	    (view[CCW[compass+3]].color != LCL_RM1_WRP)) {
	    // propagate the shaft wraparound status
	    return {cell:CCW[compass+3], color:LCL_RM1_WRP};
	} else if ((view[CCW[compass+3]].color != LCL_RM1_WRP) &&
		   view[CCW[compass+3]].ant &&
		   view[CCW[compass+3]].ant.friend &&
		   destOK[CCW[compass+4]]) {
	    // lifelined ascent
	    return {cell:CCW[compass+4]};
	} else if (destOK[CCW[compass+3]]) {
	    return {cell:CCW[compass+3]};
	} else if (destOK[CCW[compass+5]]) {
	    // creep forward, gingerly
	    return {cell:CCW[compass+5]};
	} else { // wait for the obstacles to go away
	    return CELL_NOP;
	}
    } else if (specLikeCenterRail()) {
	debugme("Unladen Miner: spectrum also resembles RM");
	return (runUMTravelOrRepairRailStrategy());
    }
    return (runLostMinerStrategy(false));
}

function runUMLeaveRL02Strategy() {
    // In normal circumstances, an unladen miner shouldn't step onto the
    // left side of the rail, but accidents happen...
    // #future# PAT_GRL0 can match upside-down when we're really on RL2, or
    // vice versa, when there happens to be a red MR2 in view outside.
    var pattern;
    var mismatch;
    if (specLateral[LCL_RM0] > 0) {
	// The red we're seeing here isn't necessarily the RM0 cell;
	// it could be from the lateral off-rail cell instead.
	pattern = PAT_GRL0;
	debugme("- trying PAT_GRL0");
	mismatch = patternCheck(pattern, AIM_RIGHT, 1, 1);
    }
    if (compass < 0) {
	pattern = PAT_GRL2;
	debugme("- trying PAT_GRL2");
	mismatch = patternCheck(pattern, AIM_RIGHT, 1, 1);
    }
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	if (view[CCW[compass+3]].ant &&
	    view[CCW[compass+3]].ant.friend &&
	    destOK[CCW[compass+4]]) {
	    // lifelined ascent
	    return {cell:CCW[compass+4]};
	} else if (destOK[CCW[compass+3]]) {
	    return {cell:CCW[compass+3]};
	} else if (destOK[CCW[compass+5]]) {
	    // creep forward, gingerly
	    return {cell:CCW[compass+5]};
	} else { // wait for the obstacles to go away
	    return CELL_NOP;
	}
    } else if (specLikeCenterRail()) {
	debugme("Unladen Miner: spectrum also resembles RM");
	return (runUMTravelOrRepairRailStrategy());
    }
    return (runLostMinerStrategy(false));
}

function runUMLeaveRR0Strategy() {
    var pattern = PAT_GRR0;
    debugme("- trying PAT_GRR0");
    var mismatch = patternCheck(pattern, AIM_LEFT, 2, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runUMLeaveRRTactic());
    } else if (specLikeCenterRail()) {
	debugme("Unladen Miner: spectrum also resembles RM");
	return (runUMTravelOrRepairRailStrategy());
    }
    return (runLostMinerStrategy(false));
}

function runUMLeaveRR2Strategy() {
    var pattern = PAT_GRR2;
    debugme("- trying PAT_GRR2");
    var mismatch = patternCheck(pattern, AIM_LEFT, 2, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runUMLeaveRRTactic());
    }    
    return (runLostMinerStrategy(false));
}

function runUMPreparingShaftStrategy() {
    var pattern = PAT_GRR1;
    debugme("- trying PAT_GRR1");
    var mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	var c = CCW[compass+1];
	// Before we start painting anything:  Is there a laden friend trying to
	// step up out of this shaft?
	if (view[c].ant && view[c].ant.friend && (view[c].ant.food > 0)) {
	    debugme("UM at RR1: Have met an LM, postponing my drilling");
	    if (destOK[CCW[compass+5]]) {
		// retreat to RM1 if possible and let them get on with it first
		return {cell:CCW[compass+5]};
	    } else {
		// don't interfere with the LM's painting
		return CELL_NOP;
	    }
	}
	if ((view[CCW[compass+2]].color == LCL_MX_M3OUT) &&
	    (view[CCW[compass]].color == LCL_MR0) &&
	    (view[CCW[compass+1]].color == LCL_CLEAR) &&
	    (myColor != LCL_RR1_SHAFT_EXHAUSTED)) {
	    // Propagate an "apparently exhausted" indication to RR1.
	    debugme("UM at RR1: finding shaft exhausted");
	    return {cell:POS_CENTER, color:LCL_RR1_SHAFT_EXHAUSTED};
	} else if ((myType == ANT_JUNIOR_MINER) &&
		   (myColor == LCL_RR1_SHAFT_IN_USE) && // painted by self
		   (view[CCW[compass]].color == LCL_MR0) &&
		   (view[CCW[compass+1]].color == LCL_CLEAR) &&
		   LCR_MX_OUT[view[CCW[compass+2]].color]) {
	    debugme("UM at RR1: finding shaft vacated");
	    return {cell:POS_CENTER, color:LCL_RR1_SHAFT_VACANT};
	} else if ((myColor == LCL_RR1_SHAFT_EXHAUSTED) ||
		   ((myType == ANT_JUNIOR_MINER) &&
		    (myColor == LCL_RR1_SHAFT_VACANT)) || // someone's been here before
		   ((myColor == LCL_RR1_SHAFT_IN_USE) &&
		    (view[CCW[compass]].color == LCL_MR0) &&
		    (view[CCW[compass+1]].color == LCL_CLEAR) &&
		    LCR_MX_IN[view[CCW[compass+2]].color]) // someone else is here
		  ) {
	    // Return to mid rail, one way or another, if possible.
	    debugme("UM at RR1: I shouldn't be drilling here");
	    if (destOK[CCW[compass+5]]) {
		return {cell:CCW[compass+5]};
	    } else if (destOK[CCW[compass+4]]) { // RM2, slightly risky...
		return {cell:CCW[compass+4]};
	    } else if (view[CCW[compass+4]].ant &&
		       view[CCW[compass+4]].ant.friend &&
		       destOK[CCW[compass+3]]
		      ) { // lifelined advance to RR2
		return {cell:CCW[compass+3]};
	    } else if (destOK[CCW[compass+6]]) { // retreat to RM0
		return {cell:CCW[compass+6]};
	    } else {
		return CELL_NOP;
	    }
	} else if (myColor != LCL_RR1_SHAFT_IN_USE) {
	    return {cell:POS_CENTER, color:LCL_RR1_SHAFT_IN_USE};
	} else if (mismatch < 0) {
	    // Fix a forward discrepancy.
	    var cc = fwdWrong[0];
	    return {cell:cc.v, color:fixup(pattern[cc.p])};
	} else {
	    if (destOK[c]) {
		// The MX cell will be painted "IN" once we're one further
		// step down into the shaft head.
		return {cell:c};
	    } else if (view[c].ant && view[c].ant.friend) {
		// A fellow miner is already on the MS0 cell  (probably
		// an unladen one, but it doesn't matter).  Step aside and
		// let her get on with her mission.
		debugme("UM at RR1: I shouldn't be drilling here");
		if (destOK[CCW[compass+5]]) {
		    return {cell:CCW[compass+5]};
		} else if (destOK[CCW[compass+4]]) { // slightly risky...
		    return {cell:CCW[compass+4]};
		} else if (destOK[CCW[compass+6]]) {
		    return {cell:CCW[compass+6]};
		} else {
		    return CELL_NOP;
		}
	    } else {
		// Otherwise, the obstacle can only be an enemy.
		// Stay put and annoy her.
		return CELL_NOP;
	    }
	}
    }
    // Don't know what I am doing here...
    return (runLostMinerStrategy(false));
}

function runUMEnteringShaftStrategy() {
    var pattern = PAT_MS0R_IN;
    debugme("- trying PAT_MS0R_IN");
    var mismatch = patternCheck(pattern, AIM_DOWN, 4, 2);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runUMEnteringShaftTactic(pattern, mismatch));
    }
    return (runLostMinerStrategy(false));
}

function runUMDrillingShaftStrategy() {
    // Check the four shaft pattern phases...
    var pattern;
    var mismatch;
    if ((specLateral[LCL_ML3] >= 1) &&
	(specDiagonal[LCL_MR2] + specDiagonal[LCL_MR0] >= 1)) {
	pattern = PAT_MS3;
	debugme("- trying PAT_MS3");
	mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
    }
    if ((compass < 0) &&
	(specLateral[LCL_MR2] >= 1) &&
	(specDiagonal[LCL_ML1] + specDiagonal[LCL_ML3] >= 1)) {
	pattern = PAT_MS2;
	debugme("- trying PAT_MS2");
	mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
    }
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	// Check for possible wraparound onto the head of the next rail.
	// We only do this for these first two patterns, so as not to be too
	// easily confused when we drill into unknown random ground;  at worst
	// we might already have obliterated a short stretch of rail before we
	// notice it.
	if ((mismatch < 0) &&
	    (view[CCW[compass]].color == LCL_RM0) &&
	    (view[CCW[compass+1]].color == LCL_RR0) &&
	    (view[CCW[compass+2]].color == LCL_MR0)) {
	    debugme("This looks like a rail head, let's see...");
	    // Step onto the apparent RM0 cell, if possible.  Ideally we should
	    // then find ourselves on mid-rail with seven correctly colored
	    // cells, and we'll turn around and extend this rail, repairing
	    // any damage we had already done.  If we guessed wrong, we'll
	    // probably do what a confused UM does and erase some colours whilst
	    // random walking;  if we then happen to wander into our previous
	    // shaft again, we may be able to continue drilling.
	    if (destOK[CCW[compass]]) {
		return {cell:CCW[compass]};
	    } else if (destOK[CCW[compass+1]]) {
		// Try the apparent RR0 cell instead  (risky - we might not
		// recognize it as such once we stand on it, even it is!).
		return {cell:CCW[compass+1]};
	    } else {
		debugme("Too crowded to try switching to the rail.");
		return CELL_NOP;
	    }
	}
	return (runUMDrillingShaftTactic(pattern, mismatch));
    }
    if ((compass < 0) &&
	(specLateral[LCL_ML1] >= 1) &&
	(specDiagonal[LCL_MR0] + specDiagonal[LCL_MR2] >= 1)) {
	pattern = PAT_MS1_IN;
	debugme("- trying PAT_MS1_IN");
	mismatch = patternCheck(pattern, AIM_DOWN, 3, 4);
	if (compass < 0) {
	    pattern = PAT_MS1;
	    debugme("- trying PAT_MS1");
	    mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
	}
    }
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runUMDrillingShaftTactic(pattern, mismatch));
    }
    if ((specDiagonal[LCL_ML3] + specLateral[LCL_MR0] >= 2) &&
	(specDiagonal[LCL_RL0] >=2) && (specDiagonal[LCL_ML1] == 0)) {
	pattern = PAT_MS0_WRAPPING;
	debugme("- trying PAT_MS0_WRAPPING");
	mismatch = patternCheck(pattern, AIM_DOWN, 0, 1);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runUMWrappingOntoRailTactic(pattern, mismatch));
	}
    }
    if ((specLateral[LCL_MR0] >= 1) &&
	(specDiagonal[LCL_ML3] + specDiagonal[LCL_ML1] >= 1)) {
	pattern = PAT_MS0;
	debugme("- trying PAT_MS0");
	mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runUMDrillingShaftTactic(pattern, mismatch));
	}
    }
    // Still no match?  A fresh RR1 also has a shaft-like spectrum
    // (although the arrangement isn't even close).
    if (specLikeRR1()) {
	pattern = PAT_GRR1;
	debugme("- trying PAT_GRR1");
	mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    if (myColor == LCL_RR1) {
		return {cell:POS_CENTER, color:LCL_RR1_SHAFT_IN_USE};
	    }
	    return CELL_NOP;
	}
    }
    if (specLikeMS0R()) {
	pattern = PAT_MS0R_IN;
	debugme("- trying PAT_MS0R_IN");
	mismatch = patternCheck(pattern, AIM_DOWN, 4, 2);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runUMEnteringShaftTactic(pattern, mismatch));
	}
    }
    debugme("Unladen Miner: What spectrum is this??");
    return (runLostMinerStrategy(false));
}

function runUMShaftWrappingStrategy() {
    // This would normally run after we've painted the wraparound marker
    // when we're about to step onto RL1.  The tactic handles both cases,
    // before and after the marker painting, but the spectra differ.
    var pattern = PAT_MS0_WRAPPING;
    debugme("- trying PAT_MS0_WRAPPING");
    var mismatch = patternCheck(pattern, AIM_DOWN, 0, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runUMWrappingOntoRailTactic(pattern, mismatch));
    }
    return (runLostMinerStrategy(false));
}

function runUMReachingHomeStrategy() {
    return (runMinerNavigatingTheGardenTactic());
}

function runUMCongestionResolutionStrategy() {
    // Try wandering counterclockwise around the throng.  To this end,
    // look clockwise for an occupied neighbor cell followed by an
    // unoccupied one.
    debugme("! UM congestion resolution - amoeba style");
    for (var i = TOTAL_NBRS; i >= 1; i--) {
	if (view[CCW[i]].ant && destOK[CCW[i-1]]) {
	    return {cell:CCW[i-1]};
	}
    }
    return CELL_NOP; // completely blocked
}

// Laden Miners' strategies

function runLMLeavingLeftWallStrategy() {
    var pattern;
    var mismatch;
    if (myColor == LCL_ML1) {
	pattern = PAT_MS1FL;
	debugme("- trying PAT_MS1FL");
	// What the miner thinks of as the left wall  (looking down)
	// is to the right in the pattern, so we're aiming left here,
	// not right, to return to the middle of the shaft.
	mismatch = patternCheck(pattern, AIM_LEFT, 0, 1);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runLMLeavingLeftWallTactic());
	}
    } else if (myColor == LCL_ML3) {
	pattern = PAT_MS3FL;
	debugme("- trying PAT_MS3FL");
	mismatch = patternCheck(pattern, AIM_LEFT, 0, 1);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runLMLeavingLeftWallTactic());
	}
    } else if (specLateral[LCL_ML1] + specLateral[LCL_ML3] >= 2) {
	pattern = PAT_MS0FL;
	debugme("- trying PAT_MS0FL");
	mismatch = patternCheck(pattern, AIM_LEFT, 0, 1);
	if (compass < 0) {
	    pattern = PAT_MS2FL;
	    debugme("- trying PAT_MS2FL");
	    mismatch = patternCheck(pattern, AIM_LEFT, 0, 1);
	}
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runLMLeavingLeftWallTactic());
	}
    } else if (specLikeMFR()) {
	// We had tested the left wall spectrum first, but this may in fact
	// have matched a right wall  (why?  because one likely thing to exist
	// just outside a right wall is the left wall of the next shaft).
	// So we need to check for right-wall patterns here, too.  We won't
	// have wasted any time on patternCheck()s yet since none of the
	// myColor and specLateral conditions would have been satisifed.
	debugme("Laden Miner: spectrum also resembles right shaft wall");
	return (runLMLeavingRightWallStrategy());
    } else if (specLikeCenterShaft()) {
	debugme("Laden Miner: spectrum also resembles mine shaft");
	// switch strategy
	return (runLMAscendingShaftStrategy());
    }
    return (runLostMinerStrategy(false));
}

function runLMLeavingRightWallStrategy() {
    var pattern;
    var mismatch;
    // Here, we needn't bother with left wall scenarios  (they would have
    // produced a left-wall-like spectrum and runLMLeavingLeftWallStrategy()
    // would have been called).
    if (myColor == LCL_MR0) {
	pattern = PAT_MS0FR;
	debugme("- trying PAT_MS0FR");
	mismatch = patternCheck(pattern, AIM_RIGHT, 0, 1);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runLMLeavingRightWallTactic());
	}
    } else if (myColor == LCL_MR2) {
	pattern = PAT_MS2FR;
	debugme("- trying PAT_MS2FR");
	mismatch = patternCheck(pattern, AIM_RIGHT, 0, 1);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runLMLeavingRightWallTactic());
	}
    } else if (specLateral[LCL_MR0] + specLateral[LCL_MR2] >= 2) {
	pattern = PAT_MS1FR;
	debugme("- trying PAT_MS1FR");
	mismatch = patternCheck(pattern, AIM_RIGHT, 0, 1);
	if (compass < 0) {
	    pattern = PAT_MS3FR;
	    debugme("- trying PAT_MS3FR");
	    mismatch = patternCheck(pattern, AIM_RIGHT, 0, 1);
	}
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runLMLeavingRightWallTactic());
	}
    } else if (specLikeCenterShaft()) {
	debugme("Laden Miner: spectrum also resembles mine shaft");
	// switch strategy
	return (runLMAscendingShaftStrategy());
    }
    return (runLostMinerStrategy(false));
}

function runLMAscendingShaftStrategy() {
    // Mirror image of runUMDrillingShaftStrategy().
    // Check the four shaft pattern phases...
    var pattern;
    var mismatch;
    if ((specLateral[LCL_ML3] >= 1) &&
	(specDiagonal[LCL_MR2] + specDiagonal[LCL_MR0] >= 1)) {
	pattern = PAT_MS3;
	debugme("- trying PAT_MS3");
	mismatch = patternCheck(pattern, AIM_UP, 3, 2);
    }
    if ((compass < 0) &&
	(specLateral[LCL_MR2] >= 1) &&
	(specDiagonal[LCL_ML1] + specDiagonal[LCL_ML3] >= 1)) {
	pattern = PAT_MS2;
	debugme("- trying PAT_MS2");
	mismatch = patternCheck(pattern, AIM_UP, 3, 2);
    }
    if ((compass < 0) &&
	(specLateral[LCL_ML1] >= 1) &&
	(specDiagonal[LCL_MR0] + specDiagonal[LCL_MR2] >= 1)) {
	pattern = PAT_MS1_INOUT;
	debugme("- trying PAT_MS1_INOUT");
	mismatch = patternCheck(pattern, AIM_UP, 0, 1);
	if (compass < 0) {
	    pattern = PAT_MS1;
	    debugme("- trying PAT_MS1");
	    mismatch = patternCheck(pattern, AIM_UP, 3, 2);
	}
    }
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runLMAscendingShaftTactic(pattern, mismatch));
    }
    if ((specDiagonal[LCL_ML3] + specLateral[LCL_MR0] >= 2) &&
	(specDiagonal[LCL_RL0] >=2) && (specDiagonal[LCL_ML1] == 0)) {
	pattern = PAT_MS0_OUT;
	debugme("- trying PAT_MS0_OUT");
	mismatch = patternCheck(pattern, AIM_UP, 0, 1);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return {cell:CCW[compass+3], color:LCL_CLEAR};
	}
	pattern = PAT_MS0_WRAPPING;
	debugme("- trying PAT_MS0_WRAPPING");
	// Take the short route onto the rail rather than the long one...
	mismatch = patternCheck(pattern, AIM_DOWN, 0, 1);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runLMWrappingOntoRailTactic(pattern, mismatch));
	}
    }
    if ((specLateral[LCL_MR0] >= 1) &&
	(specDiagonal[LCL_ML3] + specDiagonal[LCL_ML1] >= 1)) {
	pattern = PAT_MS0;
	debugme("- trying PAT_MS0");
	mismatch = patternCheck(pattern, AIM_UP, 3, 2);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    return (runLMAscendingShaftTactic(pattern, mismatch));
	}
    }
    // One weird edge case is standing on RM2 with RR1, RM1, RL1 erased
    // (white) in front of us  (but RM0, RR0, RL0 behind us intact as well
    // as our own row).
    if (specLikeCenterRail()) {
	debugme("Laden Miner: spectrum also resembles RM");
	return (runLMTravelOrRepairRailStrategy());
    }
    return (runLostMinerStrategy(false));
}

function runLMLeavingShaftStrategy() {
    // Mirror image of runUMEnteringShaftStrategy().
    var pattern = PAT_MS0R_OUT;
    debugme("- trying PAT_MS0R_OUT");
    var mismatch = patternCheck(pattern, AIM_UP, 0, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
    } else {
	pattern = PAT_MS0R_IN;
	debugme("- trying PAT_MS0R_IN");
        mismatch = patternCheck(pattern, AIM_UP, 4, 2);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    pattern = PAT_MS0R_OUT;
	    debugme("- switching to PAT_MS0R_OUT");
	    mismatch = patternCheck(pattern, AIM_UP, 0, 1);
	}
    }
    if (compass >= 0) {
	return (runLMLeavingShaftTactic(pattern, mismatch));
    } else if (specLikeCenterShaft()) {
	debugme("Laden Miner: spectrum also resembles mine shaft");
	return (runLMAscendingShaftStrategy());
    } else {
	// Can happen when we've stepped onto food at MS0 before
	// having had time to paint - or even look! - further ahead.
	return (runLostMinerStrategy(false));
    }
    return CELL_NOP; // notreached
}

function runLMLeavingVacantShaftStrategy() {
    var pattern = PAT_MS0R_OUT1;
    debugme("- trying PAT_MS0R_OUT1");
    var mismatch = patternCheck(pattern, AIM_UP, 0, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	if (view[CCW[compass+3]].color == LCL_CLEAR) {
	    // Must have been wiped out while we were away...  So we have
	    // lost count of the descents.  Hazard a guess.
	    return {cell:CCW[compass+3], color:((myType == ANT_SENIOR_MINER) ? LCL_MX_M2OUT : LCL_MX_M1OUT)};
	} else if (destOK[CCW[compass+5]]) {
	    // MX already shows we're out and so does RR1 (which must have been
	    // changed by someone else, either upon seeing our MX, or in the
	    // course of rail repair) -- so just step up to RR1.
	    return {cell:CCW[compass+5]};
	} else if (view[CCW[compass+5]].ant && view[CCW[compass+5]].ant.friend &&
		   destOK[CCW[compass+6]]) {
	    // Try stepping around our friend (who might wish to drill here) to RR0.
	    return {cell:CCW[compass+6]};
	} else {
	    return CELL_NOP; // hope and wait for the obstacles to go away
	}
    } else if (specLikeCenterShaft()) {
	debugme("Laden Miner: spectrum also resembles mine shaft");
	return (runLMAscendingShaftStrategy());
    }
    return (runLostMinerStrategy(false));
}

function runLMDepartingFromShaftStrategy() {
    // Mirror image of runUMPreparingShaftStrategy().
    var pattern = PAT_GRR1;
    debugme("- trying PAT_GRR1");
    var mismatch = patternCheck(pattern, AIM_UP, 1, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	if ((view[CCW[compass]].color == LCL_MR0) &&
	    (view[CCW[compass+1]].color == LCL_CLEAR)) {
	    // Propagate a possible shaft-exhausted marking to the shaft head.
	    // (This can happen when an LM had strayed into a shaft whose
	    // original driller had previously wrapped onto the rail.)
	    if ((myColor == LCL_RR1_SHAFT_EXHAUSTED) &&
		(view[CCW[compass+2]].color != LCL_MX_M3OUT)) {
		return {cell:CCW[compass+2], color:LCL_MX_M3OUT};
	    }
	    // Otherwise make sure RR1 reflects the state of the adjacent shaft head.
	    if ((view[CCW[compass+2]].color == LCL_MX_M3OUT) &&
		(myColor != LCL_RR1_SHAFT_EXHAUSTED)) {
		return {cell:POS_CENTER, color:LCL_RR1_SHAFT_EXHAUSTED};
	    } else if ((LCR_MX_OUT[view[CCW[compass+2]].color]) &&
		       (myColor != LCL_RR1_SHAFT_VACANT)) {
		return {cell:POS_CENTER, color:LCL_RR1_SHAFT_VACANT};
	    } else if ((LCR_MX_IN[view[CCW[compass+2]].color]) &&
		       (myColor != LCL_RR1_SHAFT_IN_USE)) {
		return {cell:POS_CENTER, color:LCL_RR1_SHAFT_IN_USE};
	    } else if (mismatch < 0) {
		// Fix a forward discrepancy.
		var cc = fwdWrong[0];
		return {cell:cc.v, color:fixup(pattern[cc.p])};
	    }
	}
	// Return to center rail, one way or another, if possible.
	if (destOK[CCW[compass+5]]) {
	    return {cell:CCW[compass+5]};
	} else if (destOK[CCW[compass+6]]) {
	    return {cell:CCW[compass+6]};
	} else {
	    // Trying compass+4 would be risky and a bit hopeless here.
	    // Wait for the others to move out of the way.
	    // #future# deal with congestion here, too?
	    return CELL_NOP; // too crowded...
	}
    }
    // Don't know what I am doing here...
    return (runLostMinerStrategy(false));
}

function runLMTravelOrRepairRailStrategy() {
    // Assert:  spectrum resembles the mid rail.
    debugme("LMTravelOrRepairRailStrategy...");
    return (runLMCenterRailTactic());
}

function runLMFixingRailStrategy() {
    // Assert:  Engineer in view, but rail no longer recognizable
    // by its spectrum.  By our maxim not to imagine things that
    // aren't there, our best bet is to wait for a SAR team to turn
    // up from home and patch up the rail.  But there is one thing
    // we can usefully do and which may save the day if we've just
    // returned from the first shaft off a rail to find our hub
    // ravaged and overpainted by an adversary:  If we see the
    // engineer on a lateral neighbor cell, step clockwise to have
    // her in diagonal view instead.  In that particular scenario
    // this would take us from RM1 to RM0 and put us next to the
    // queen, so we can deliver our food and turn around to repair
    // the rail ourselves.
    debugme("LMFixingRailStrategy...");
    for (var i = 1; i < TOTAL_NBRS; i+=2) {
	if (view[CCW[i]].ant && view[CCW[i]].ant.friend &&
	    (view[CCW[i]].ant.type == ANT_ENGINEER) &&
	    destOK[CCW[i+2]]) {
	    return {cell:CCW[i+2]};
	}
    }
    // Otherwise, do wait for someone who knows where she is to put
    // ourselves and the engineer back on track.
    return CELL_NOP;
}

function runLMReachingHomeStrategy() {
    // Special case of the following.  Unless we've been random-walking,
    // we must have stepped aside onto the first RL1 cell of rail3.
    var pattern = PAT_FRL1G;
    debugme("- trying PAT_FRL1G");
    var mismatch = patternCheck(pattern, AIM_RIGHT, 0, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runLMLeaveRLTactic());
    }
    // If this didn't work, we do what a UM would do in this case:  locate the
    // friendly staff and circle her clockwise.
    return (runMinerNavigatingTheGardenTactic());
}

function runLMLeaveRL1Strategy() {
    var pattern = PAT_GRL1;
    debugme("- trying PAT_GRL1");
    var mismatch = patternCheck(pattern, AIM_RIGHT, 0, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runLMLeaveRLTactic());
    } else if (specLikeCenterRail()) {
	debugme("Laden Miner: spectrum also resembles RM");
	return (runLMTravelOrRepairRailStrategy());
    }
    return (runLostMinerStrategy(false));
}

function runLMLeaveRL02Strategy() {
    // Mirror image (sort of) of runUMLeaveRL02Strategy().
    // #future# PAT_GRL0 can match upside-down when we're really on RL2, or
    // vice versa, when there happens to be a red MR2 in view outside.
    var pattern;
    var mismatch;
    if (specLateral[LCL_RM0] > 0) {
	// Again, this could be a false positive.
	pattern = PAT_GRL0;
	debugme("- trying PAT_GRL0");
	mismatch = patternCheck(pattern, AIM_RIGHT, 1, 1);
    }
    if (compass < 0) {
	pattern = PAT_GRL2;
	debugme("- trying PAT_GRL2");
	mismatch = patternCheck(pattern, AIM_RIGHT, 1, 1);
    }
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runLMLeaveRLTactic());
    }
    return (runLostMinerStrategy(false));
}

// The following are mirror images of UM analogues, and should rarely get
// used  (but they might, e.g. when an unladen miner on RR0/2 inadvertently
// gains food from a passing enemey queen).
function runLMLeaveRR0Strategy() {
    var pattern = PAT_GRR0;
    debugme("- trying PAT_GRR0");
    var mismatch = patternCheck(pattern, AIM_LEFT, 2, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runLMLeaveRRTactic());
    } else if (specLikeCenterRail()) {
	debugme("Laden Miner: spectrum also resembles RM");
	return (runLMTravelOrRepairRailStrategy());
    }
    return (runLostMinerStrategy(false));
}

function runLMLeaveRR2Strategy() {
    var pattern = PAT_GRR2;
    debugme("- trying PAT_GRR2");
    var mismatch = patternCheck(pattern, AIM_LEFT, 2, 1);
    if (compass >= 0) {
	debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	return (runLMLeaveRRTactic());
    } else if (specLikeCenterRail()) {
	debugme("Laden Miner: spectrum also resembles RM");
	return (runLMTravelOrRepairRailStrategy());
    }
    return (runLostMinerStrategy(false));
}

function runLMCongestionResolutionStrategy() {
    // Very similar to its UM analogue, except we also need to step
    // around any uneaten food.
    debugme("! LM congestion resolution - amoeba style");
    for (var i = TOTAL_NBRS; i >= 1; i--) {
	if (!destOK[CCW[i]] && destOK[CCW[i-1]]) {
	    return {cell:CCW[i-1]};
	}
    }
    return CELL_NOP; // completely blocked
}

// Other Miners' strategies

function runMinerToRail1Strategy() {
    // Assert:  More than one friendly staff in view.  (So we're in the
    // garden, on G5 or G6.)  Aim for rail1, whether laden or not, senior
    // or not.  The compass is not set.
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if (view[CCW[i]].ant && view[CCW[i]].ant.friend &&
	    (view[CCW[i]].ant.type == ANT_STAFF) &&
	    view[CCW[i+1]].ant && view[CCW[i+1]].ant.friend &&
	    (view[CCW[i+1]].ant.type == ANT_STAFF)) {
	    // Found two adjacent stuff;  the one at CCW[i] would be the
	    // secretary.
	    if (i & 1) {
		debugme("Miner on G6, heading for rail1 RM0.");
	    } else {
		debugme("Miner on G5, heading for G6.");
	    }
	    // In CCW terms, both goals amount to the same thing:
	    if (destOK[CCW[i+7]]) {
		return {cell:CCW[i+7]};
	    } else {
		return CELL_NOP;
	    }
	}
    }
    // Loop came up empty, no two adjacent friendly staff in view after all.
    debugme("Miner near staff:  This garden is a mess.");
    return (runLostMinerStrategy(true));
}

function runLostMinerStrategy(totally) {
    if ((foodTotal > 0) && (myFood == 0)) {
	// Might as well grab it while we're here.
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    if ((view[CCW[i]].food > 0) && destOK[CCW[i]]) {
		return {cell:CCW[i]};
	    }
	}
    }
    if (totally & (friendsTotal == 0)) {
	// Selectively mess with the arena  (but don't even think of attempting
	// to battle a pal over it):
	if (((myColor == COL_YELLOW) && (specNbrs[COL_YELLOW] == 0)) ||
	    ((myColor == COL_RED) && (specNbrs[COL_RED] == 0))) {
	    return {cell:POS_CENTER, color:COL_PURPLE};
	}
	// Selectively erase some paint:
	if (((myColor == COL_GREEN) && (specNbrs[COL_GREEN] == 0)) ||
	    ((myColor == COL_CYAN) && (specNbrs[COL_CYAN] == 0)) ||
	    ((myColor == COL_BLUE) && (specNbrs[COL_BLUE] == 0)) ||
	    ((myColor == COL_PURPLE) && (specNbrs[COL_PURPLE] == 0))) {
	    return {cell:POS_CENTER, color:COL_WHITE};
	} else if ((specTotal[COL_GREEN] == 0) &&
		   (((myColor == COL_BLACK) && (specNbrs[COL_BLACK] == 0)) ||
		    ((myColor == COL_YELLOW) && (specNbrs[COL_YELLOW] == 0)) ||
		    ((myColor == COL_RED) && (specNbrs[COL_RED] == 0)))) {
	    return {cell:POS_CENTER, color:COL_WHITE};
	} else if ((myColor != COL_WHITE) &&
		   (specNbrs[myColor] >= 4)) {
	    return {cell:POS_CENTER, color:COL_WHITE};
	}
    }
    // We don't like straight green trails, nor glowing embers:
    if ((myColor == COL_GREEN) && (specLateral[COL_GREEN] >= 2)) {
	return {cell:POS_CENTER, color:COL_WHITE};
    } else if (((myColor == COL_BLACK) || (myColor == COL_RED)) &&
	       (specNbrs[COL_BLACK] + specNbrs[COL_RED] >= 3)) {
   	return {cell:POS_CENTER, color:COL_WHITE};
    }
    // Look for a familiar color, but only if we aren't surrounded by mostly
    // white  (so as not to get easily trapped near small colored islands):
    if (specNbrs[COL_WHITE] <= 4) {
	var preferredColors =
	    [COL_GREEN, COL_BLUE, COL_CYAN, COL_PURPLE, COL_YELLOW, COL_RED, COL_BLACK];
	for (var ci = 0; ci < preferredColors.length; ci++) {
	    var c = preferredColors[ci];
	    if (myColor == c) {
		break; // don't go round in circles...
	    }
	    if (specNbrs[c] > 0) {
		for (var i = 1; i < TOTAL_NBRS; i++) {
		    if ((view[CCW[i]].color == c) && destOK[CCW[i]]) {
			return {cell:CCW[i]};
		    }
		}
	    }
	}
    }
    // Have run out of ideas - resort to random walking.
    // (Caveat maintainer:  Any further color-erasing at this point
    // would be liable to damage the rails.)
    if (ACT_RANDOMLY_WHEN_CONFUSED) {
	for (var i = 1; i < TOTAL_NBRS; i += 2) {
	    // lateral directions preferred
	    if (destOK[CCW[i]]) {
		return {cell:CCW[i]};
	    }
	}
	for (i = 0; i < TOTAL_NBRS; i += 2) {
	    if (destOK[CCW[i]]) {
		return {cell:CCW[i]};
	    }
	}
	return CELL_NOP; // hemmed in
    } else {
	return CELL_NOP; // stay put for analysis
    }
}

function runDefendingHomeStrategy() {
    // Assert:  compass is set, along with myQueenPos;  we also have
    // an enemy queen in view.
    // Work out whether the latter is on a cell where our queen cannot
    // see her directly, and whether there is another, unoccupied, cell
    // from which both queens are visible.  If so, paint that cell to
    // inform our queen.
    if (myQueenPos == 0) {
	// Enemy queens at CCW[compass] or CCW[compass+7] are directly
	// in our queen's view.  We can do something useful only when
	// an enemy queen is at an adjacent corner.
	var c = CCW[compass+2];
	if (view[c].ant && !view[c].ant.friend &&
	    (view[c].ant.type == ANT_QUEEN) &&
	    (view[c].ant.food > 0) &&
	    !view[CCW[compass+1]].ant) {
	    return {cell:CCW[compass+1], color:LCL_ALERT};
	}
	c = CCW[compass+6];
	if (view[c].ant && !view[c].ant.friend &&
	    (view[c].ant.type == ANT_QUEEN) &&
	    (view[c].ant.food > 0) &&
	    !view[CCW[compass+7]].ant) {
	    return {cell:CCW[compass+7], color:LCL_ALERT};
	}
    } else {
	// Enemy queens at CCW[compass+i] will be directly in our queen's
	// view for i in {2,3,7,0}.
	var c = CCW[compass+4];
	if (view[c].ant && !view[c].ant.friend &&
	    (view[c].ant.type == ANT_QUEEN) &&
	    (view[c].ant.food > 0) &&
	    !view[CCW[compass+3]].ant) {
	    return {cell:CCW[compass+3], color:LCL_ALERT};
	}
	c = CCW[compass+6];
	if (view[c].ant && !view[c].ant.friend &&
	    (view[c].ant.type == ANT_QUEEN) &&
	    (view[c].ant.food > 0) &&
	    !view[CCW[compass+7]].ant) {
	    return {cell:CCW[compass+7], color:LCL_ALERT};
	}
	c = CCW[compass+5];
	if (view[c].ant && !view[c].ant.friend &&
	    (view[c].ant.type == ANT_QUEEN) &&
	    (view[c].ant.food > 0)) {
	    if (!view[CCW[compass+3]].ant) {
		return {cell:CCW[compass+3], color:LCL_ALERT};
	    } else if (!view[CCW[compass+7]].ant) {
		return {cell:CCW[compass+7], color:LCL_ALERT};
	    }
	}
    }
    // Otherwise, just stay put, and steal and pass on any food held
    // by the other queen.
    return CELL_NOP;
}

// ---- Decision tree: fourth (tactical) level ----

// Queen's tactics

function runQueenScramblingEatingTactic() {
    // Part of fast path, still need to orient ourselves.
    // Assert:  unobstructed, food available.
    if (myColor != LCL_TRAIL) { // paint trail, fast
	return {cell:POS_CENTER, color:LCL_TRAIL};
    }
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if (view[CCW[i]].food > 0) {
	    // grab the first we identify
	    return {cell:CCW[i]};
	}
    }
    return CELL_NOP; // notreached
}

function runQueenScramblingSnatchingTactic() {
    // Assert:  Food in view, and one or more enemy queens in view and
    // no enemy workers.  Still need to orient ourselves.
    // Don't wait to paint our current cell -- just grab the food.
    // (The destOK check is paranoia;  if the cell contained food
    // and an ant, the food would have been eaten already.)
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if ((view[CCW[i]].food > 0) && (destOK[CCW[i]])) {
	    // grab it
	    return {cell:CCW[i]};
	}
    }
    return CELL_NOP; // notreached
}

function runQueenScramblingTrailCheckTactic() {
    // Assert:  unobstructed; myColor != LCL_TRAIL
    // Still need to orient ourselves.
    if ((myColor != LCL_CLEAR) && (specNbrs[myColor] >= 4)) {
	debugme("Queen:  Yuck!");
	// Oooh, we've stepped into gooo.
	// Add some blooh to help us find a better direction on the next move.
	if (specNbrs[LCL_TRAIL] == 0) {
	    // We don't know where we are anyway...
	    return {cell:POS_CENTER, color:LCL_TRAIL};
	} else if (specNbrs[LCL_TRAIL] >= 3) {
	    // Beam me up...
	    return {cell:POS_CENTER, color:LCL_TRAIL};
	} else {
	    // Loop will find something since at most two neighbor cells
	    // can already be trail-colored:
	    for (var i = 0; i < TOTAL_NBRS; i++) {
		if ((view[CCW[i]].color == LCL_TRAIL) &&
		    (view[CCW[i+2]].color != LCL_TRAIL)) {
		    return {cell:CCW[i+2], color:LCL_TRAIL};
		}
	    }
	    return CELL_NOP; // notreached
	}
    } else if (specNbrs[LCL_TRAIL] == 1) {
	// Don't end up following somebody else's trail when we've
	// stepped straight onto the beginning of it and it runs
	// precisely along the line we're aiming for.  But we do want
	// to be able to cross foreign diagonal trails at right angles,
	// and once we've painted the cell we're on, we can no longer
	// distinguish these two cases.  So...
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    if ((view[CCW[i]].color == LCL_TRAIL) &&
		(view[CCW[i+4]].color != LCL_CLEAR)) {
		// Retreat to a white cell next to our last trail cell
		// in view, if there is one, and reconsider the situation
		// from there on the next turn
		if (view[CCW[i+1]].color == LCL_CLEAR) {
		    return { cell:CCW[i+1]};
		} else if (view[CCW[i+7]].color == LCL_CLEAR) {
		    return { cell:CCW[i+7]};
		} else {
		    // Back to plan A:  mark our present cell.
		    return {cell:POS_CENTER, color:LCL_TRAIL};
		}
	    }
	}
	// Back to plan A:  mark our present cell.
	return {cell:POS_CENTER, color:LCL_TRAIL};
    } else {
	// Back to plan A:  mark our present cell.
	return {cell:POS_CENTER, color:LCL_TRAIL};
    }
    return CELL_NOP; // notreached
}

function runQueenScramblingAroundTactic() {
    // Assert unobstructed, myColor == LCL_TRAIL
    // Still need to orient ourselves.  Find a promising direction.
    // First attempt, intentionally lopsided:
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if ((view[CCW[i]].color == LCL_CLEAR) &&
	    (view[CCW[i+1]].color == LCL_CLEAR) &&
	    (view[CCW[i+2]].color == LCL_CLEAR)) {
	    if ((view[CCW[i+3]].color == LCL_CLEAR) &&
		(view[CCW[i+4]].color == LCL_CLEAR)) {
		return {cell:CCW[i+2]};
	    }
	    return {cell:CCW[i+1]};
	}
    }
    // Second attempt - look for the first neighbor cell that's white
    // or a foreign color, for variety turning clockwise:
    for (i = TOTAL_NBRS - 1; i >= 0; i--) {
	if (view[CCW[i]].color != LCL_TRAIL) {
	    return {cell:CCW[i]};
	}
    }
    // Meh, we're painted in.  Erase something that isn't our color:
    for (i = 0; i < TOTAL_NBRS; i++) {
	if (view[CCW[i]].color != LCL_TRAIL) {
	    return {cell:CCW[i], color:LCL_CLEAR};
	}
    }
    // Still no cigar, we seem to have painted ourselves in.
    // Erase *something*.  We'll step that way on our next move in the
    // hope that things will look better from there.
    return {cell:0, color:LCL_CLEAR};
}

function runQueenPrepareToSettleTactic() {
    // Assert unobstructed, compass not set.
    // Paint our surroundings white before creating the gardener.
    if (myColor != LCL_QC_RESET) {
	return {cell:POS_CENTER, color:LCL_QC_RESET};
    }
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if (view[CCW[i]].color != LCL_CLEAR) {
	    return {cell:CCW[i], color:LCL_CLEAR};
	}
    }
    return {cell:0, type:ANT_STAFF}; // gardener-to-be
}

function runQueenScramblingEvasionTactic() {
    // Assert:  Enemies in view  (there can't be any friends yet).
    // Evasion takes precedence over eating and over painting.
    if (specNbrs[LCL_TRAIL] > 0) {
	// still need to orient ourselves
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    if (view[CCW[i]].color == LCL_TRAIL) {
		compass = i & 6; // ignore the LSB
	    }
	} // Assert:  compass is set now
	if ( destOK[CCW[compass+7]] && destOK[CCW[compass]] &&
	     destOK[CCW[compass+1]] && destOK[CCW[compass+2]] &&
	     destOK[CCW[compass+3]] ) {
	    // Move down if other ants are only in  (one or more of)
	    // the upper three cells.
	    // This case and the next keep the trail-colored cell in view
	    // (unless it gets overpainted before our next turn).
	    return {cell:CCW[compass+1]};
	} else if (destOK[CCW[compass+5]] && destOK[CCW[compass+6]] &&
		   destOK[CCW[compass+7]] && destOK[CCW[compass]] &&
		   destOK[CCW[compass+1]]) {
	    // Move down if other ants are only in the righthand three cells...
	    return {cell:CCW[compass+7]};
	} else if (destOK[CCW[compass+3]] && destOK[CCW[compass+4]] &&
		   destOK[CCW[compass+5]]) {
	    // ...carry on to upper right if three adjacent cells are clear, etc...
	    return {cell:CCW[compass+4]};
	} else if (destOK[CCW[compass+5]] && destOK[CCW[compass+6]] &&
		   destOK[CCW[compass+7]]) {
	    // ...turn to upper left...
	    return {cell:CCW[compass+6]};
	} else if (destOK[CCW[compass+1]] && destOK[CCW[compass+2]] &&
		   destOK[CCW[compass+3]]) {
	    // ...turn to lower right...
	    return {cell:CCW[compass+2]};
	} else if (destOK[CCW[compass+7]] && destOK[CCW[compass]] &&
		   destOK[CCW[compass+1]]) {
	    // ...double back (sigh)...
	    return {cell:CCW[compass]};
	} else {
	    // ...or aim in any unoccupied direction (if there is one).
	    for (i = 0; i < TOTAL_NBRS; i++) {
		if (destOK[CCW[i]]) {
		    return {cell:CCW[i]};
		}
	    }
	    return CELL_NOP;
	}
    } else { // lost sight of trail, too
	// Aim into empty space, as far as possible.
	for (var i = 0; i < TOTAL_NBRS; i++) {
	    if (destOK[CCW[i]] && destOK[CCW[i+1]] &&
		destOK[CCW[i+2]] && destOK[CCW[i+3]] &&
		destOK[CCW[i+4]]) {
		return {cell:CCW[i+2]};
	    }
	}
	for (i = 0; i < TOTAL_NBRS; i++) {
	    if (destOK[CCW[i]] && destOK[CCW[i+1]] &&
		destOK[CCW[i+2]]) {
		return {cell:CCW[i+1]};
	    }
	}
	for (i = 0; i < TOTAL_NBRS; i++) {
	    if (destOK[CCW[i]]) {
		return {cell:CCW[i]};
	    }
	}
	return CELL_NOP;
    }
    return CELL_NOP; // notreached
}

function runQueenHousekeepingTactic() {
    // Assert:  compass is set, secretary and self mutually at CCW[compass+1]
    // (facing in opposite directions), gardener at CCW[compass];  the clock
    // has rung but we aren't using our turn to create a new worker -- so
    // use it instead to make sure our immediate surroundings are in order.
    var pattern = PAT_HOME;
    var mismatch = patternCheck(pattern, POS_CENTER, 0, 1);
    if (mismatch != 0) {
	var cc = fwdWrong[0];
	// (PAT_HOME contains no color ranges)
	return {cell:cc.v, color:pattern[cc.p]};
    } else {
	return CELL_NOP;
    }
}

// Gardener's tactic

function runGardenerGardeningTactic() {
    // Assert:  compass is set, queen and myself mutually at CCW[compass]
    // (facing in different directions).  Either waiting for the secretary
    // to materialize, or seeing her at my CCW[compass+7].
    // Aside from the garden, also keep an eye on what we can see of rail3.
    var pattern = PAT_GARDEN;
    var mismatch = patternCheck(pattern, POS_CENTER, 0, 1);
    debugme("GardenerGardeningTactic...");
    if (mismatch != 0) {
	var cc = fwdWrong[0];
	// (PAT_GARDEN contains no color ranges)
	return {cell:cc.v, color:pattern[cc.p]};
    } else {
	return CELL_NOP;
    }
}

// Miners' tactics

function runUMFreshCenterRailTactic() {
    // Assert:  spectrum suggests we're on mid rail;
    // freshRail is true iff our engineer is in view.
    // #future# Review this -- could the "weird" cases benefit from
    // additional specLateral or specDiagonal checks?
    var pattern;
    var mismatch;
    debugme("UMFreshCenterRailTactic...");
    if (myColor == LCL_RM0) {
	pattern = PAT_FRM0;
	debugme("- trying PAT_FRM0");
	mismatch = patternCheck(pattern, AIM_UP, 4, 1);
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_FRM1;
	    debugme("- trying PAT_FRM1");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 1);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_FRM2;
	    debugme("- trying PAT_FRM2");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 1);
	}
    } else if (myColor == LCL_RM2) {
	pattern = PAT_FRM2;
	debugme("- trying PAT_FRM2");
	mismatch = patternCheck(pattern, AIM_UP, 4, 1);
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_FRM0;
	    debugme("- trying PAT_FRM0");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 1);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_FRM1;
	    debugme("- trying PAT_FRM1");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 1);
	}
    } else if (myColor == LCL_RM1) {
	pattern = PAT_FRM1;
	debugme("- trying PAT_FRM1");
	mismatch = patternCheck(pattern, AIM_UP, 4, 1);
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_FRM2;
	    debugme("- trying PAT_FRM2");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 1);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_FRM0;
	    debugme("- trying PAT_FRM0");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 1);
	}
    } else if (myColor == LCL_RM1_WRP) {
	// Deal with propagating this to the shafthead (RR1) cell.
	// At this point, we won't bother to revert myColor to LCL_RM1.
	// The next miner passing by in either direction will do so.
	pattern = PAT_GRM1_WRP;
	debugme("- trying PAT_GRM1_WRP");
	mismatch = patternCheck(pattern, AIM_RIGHT, 1, 1);
    }
    if ((compass < 0) && specLikeRR1()) {
	// could happen next to an exhausted shaft
	debugme("Unladen Miner: spectrum also resembles RR1");
	return (runUMPreparingShaftStrategy());
    }
    if (compass < 0) { // still no idea where I am, give up
	return (runLostMinerStrategy(false));
    }
    // Assert:  compass is now set.
    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
    if (mismatch == 0) { // perfect pattern match
	if (foodLateral > 0) {
	    // Any food which it is now time to grab?
	    if ((view[CCW[compass+7]].food > 0) && destOK[CCW[compass+7]]) {
		return {cell:CCW[compass+7]};
	    } else if ((view[CCW[compass+3]].food > 0) &&
		       destOK[CCW[compass+3]]) {
		return {cell:CCW[compass+3]};
	    }
	}
	// Should we step onto a potential shaft head?
	// Here at the rail head, even a senior miner would start a new
	// shaft  (having found nothing better to do closer to home).
	if ((myColor == LCL_RM1) &&
	    (view[CCW[compass+3]].color != LCL_RR1_SHAFT_EXHAUSTED) &&
	    (view[CCW[compass+3]].color != LCL_RR1_SHAFT_IN_USE) &&
	    !((myType == ANT_JUNIOR_MINER) &&
	      (view[CCW[compass+3]].color == LCL_RR1_SHAFT_VACANT)) &&
	    destOK[CCW[compass+3]]) {
	    return {cell:CCW[compass+3]};
	}
	// Otherwise, can we step ahead along the rail?
	if (destOK[CCW[compass+5]]) {
	    return {cell:CCW[compass+5]};
	}
	// #future# deal with congestion here, too?
	return CELL_NOP; // placeholder
    }
    // If the compass is set, but the match isn't perfect, sanity-check
    // it against the Engineer's location before doing any painting.
    for (var i = 0; i < TOTAL_NBRS; i++) {
	var ce = CCW[compass+i];
	if (view[ce].ant &&
	    view[ce].ant.friend &&
	    (view[ce].ant.type == ANT_ENGINEER)) {
	    // found her
	    if ((2 <= i) && (i <= 4)) {
		debugme("Unladen Miner next to Engineer: Are we upside down?");
		var mismatchSaved = mismatch;
		var fwdWrongSaved = Array.from(fwdWrong);
		var rearWrongSaved = Array.from(rearWrong);
		compass = compass % 4 + 4;
		// Compass is reset, so the qualityGoal is irrelevant:
		mismatch = patternCheck(pattern, POS_CENTER, 0, 1);
		debugme("+ compass after retry: " + compass + "; mismatch = " + mismatch);
		if (mismatch < mismatchSaved) {
		    debugme("+ This was no improvement.");
		    compass = compass % 4 + 4; // back to where it had been
		    mismatch = mismatchSaved;
		    fwdWrong = fwdWrongSaved;
		    rearWrong = rearWrongSaved;
		} else {
		    debugme("+ Reoriented to match the Engineer's location.");
		}
		break;
	    }
	}
    }
    if (mismatch < 0) {
	// Fix a forward discrepancy.
	var cc = fwdWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    } else { // (mismatch > 0)
	// Fix a discrepancy behind us.
	var cc = rearWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    }
    return CELL_NOP; // notreached
}

function runUMCenterRailTactic() {
    // Assert:  spectrum suggests we're on mid rail;
    // our engineer is _not_ in view.
    // #future# Review this -- could the "weird" cases benefit from
    // additional specLateral or specDiagonal checks?
    var pattern;
    var mismatch;
    debugme("UMCenterRailTactic...");
    if (myColor == LCL_RM0) {
	pattern = PAT_GRM0;
	debugme("- trying PAT_GRM0");
	mismatch = patternCheck(pattern, AIM_UP, 4, 2);
	if ((compass < 0) && specLikeRR1()) {
	    // Happens when RR1 indicates SHAFT_IN_USE and MX says M1IN
	    // (and we got here because we check for RM spectra before
	    // checking for RR1).  Switch strategies:
	    debugme("Unladen Miner: spectrum also resembles RR1");
	    return (runUMPreparingShaftStrategy());
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM1;
	    debugme("- trying PAT_GRM1");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 2);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM2;
	    debugme("- trying PAT_GRM2");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 2);
	}
    } else if (myColor == LCL_RM2) {
	pattern = PAT_GRM2;
	debugme("- trying PAT_GRM2");
	mismatch = patternCheck(pattern, AIM_UP, 4, 2);
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM0;
	    debugme("- trying PAT_GRM0");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 2);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM1;
	    debugme("- trying PAT_GRM1");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 2);
	}
    } else if (myColor == LCL_RM1) {
	pattern = PAT_GRM1;
	debugme("- trying PAT_GRM1");
	mismatch = patternCheck(pattern, AIM_UP, 4, 2);
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM2;
	    debugme("- trying PAT_GRM2");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 2);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM0;
	    debugme("- trying PAT_GRM0");
	    mismatch = patternCheck(pattern, AIM_UP, 4, 2);
	}
    } else if (myColor == LCL_RM1_WRP) {
	// Deal with propagating this to the shafthead (RR1) cell.
	// One could argue that we should also revert myColor to LCL_RM1
	// before moving on.  At present we don't, leaving this to the
	// next miner passing this spot in either direction  (see below
	// in this function body for the UM case);  keeping the temporary
	// state here for a while does no harm and adds a small amount of
	// redundancy.
	pattern = PAT_GRM1_WRP;
	debugme("- trying PAT_GRM1_WRP");
	mismatch = patternCheck(pattern, AIM_RIGHT, 1, 1);
    }
    if ((compass < 0) && specLikeRR1()) {
	// Can happen when immediately after a shaft has wrapped we need
	// to step aside to the RR1 cell  (already painted black for
	// "exhausted")  to let a laden miner pass on RM1.
	debugme("Unladen Miner: spectrum also resembles RR1");
	return (runUMPreparingShaftStrategy());
    }
    if (compass < 0) { // still no idea where I am, give up
	return (runLostMinerStrategy(true));
    }
    // Assert:  compass is now set.
    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
    if (mismatch == 0) { // perfect pattern match
	if (foodLateral > 0) {
	    // (Could happen if our friendly engineer got pinned behind us
	    // by an enemy, and we're building ahead on our own)
	    if ((view[CCW[compass+7]].food > 0) && destOK[CCW[compass+7]]) {
		return {cell:CCW[compass+7]};
	    } else if ((view[CCW[compass+3]].food > 0) &&
		       destOK[CCW[compass+3]]) {
		return {cell:CCW[compass+3]};
	    }
	}
	// Should we step onto a potential shaft head?
	// Away from the rail ahead, junior engineers would not bother
	// with already-explored shafts, and senior engineers would not
	// bother with what looks like a fresh shaft (or should they?).
	if ((myColor == LCL_RM1) &&
	    (view[CCW[compass+3]].color != LCL_RR1_SHAFT_EXHAUSTED) &&
	    (view[CCW[compass+3]].color != LCL_RR1_SHAFT_IN_USE)) {
	    if ((((myType == ANT_JUNIOR_MINER) &&
		  (view[CCW[compass+3]].color == LCL_RR1)) ||
		 ((myType == ANT_SENIOR_MINER) &&
		  (view[CCW[compass+3]].color == LCL_RR1_SHAFT_VACANT))) &&
		destOK[CCW[compass+3]]) {
		return {cell:CCW[compass+3]};
	    }
	}
	// If we're on RM0 and the RM1 cell ahead of us is wrap-coloured (black)
	// rather than its normal blue  (possibly painted as part of a wrapped
	// or misplaced shaft of ours),  and not occupied by a friend who might
	// have her own ideas what to do about it, adjust it.  Otherwise we risk
	// being lost after stepping onto it and finding the rail beyond it damaged
	// beyond recognition.  (The pattern check would intentionally not have
	// flagged this as a mismatch.)
	if (myColor == LCL_RM0 &&
	    (view[CCW[compass+5]].color == LCL_RM1_WRP) &&
	    !(view[CCW[compass+5]].ant && view[CCW[compass+5]].ant.friend)) {
	    return {cell:CCW[compass+5], color:LCL_RM1};
	}
	// Otherwise, can we step ahead?
	var c = CCW[compass+5];
	if (destOK[c]) {
	    return {cell:c};
	} else if (view[c].ant && view[c].ant.friend) {
	    var evade = false;
	    if (view[c].ant.food > 0) {
		debugme("! collision avoidance: laden friend ahead");
		evade = true;
	    } else if (view[CCW[compass+1]].ant &&
		       view[CCW[compass+1]].ant.friend &&
		       (view[CCW[compass+1]].ant.food == 0)) {
		debugme("! congestion avoidance: unladen friends ahead and behind");
		evade = true;
	    }
	    if (evade) {
		if (destOK[CCW[compass+4]]) {
		    // Pass them by stepping diagonally onto the right rail edge.
		    return {cell:CCW[compass+4]};
		} else if (destOK[CCW[compass+3]]) {
		    // Step sideways onto the right rail edge.
		    return {cell:CCW[compass+3]};
		} else { // let the other(s) deal with it first
		    return CELL_NOP;
		}
	    } else {
		// Wait and see whether this clears itself up before more
		// friends come up from behind.
		return CELL_NOP;
	    }
	}
    } else if (mismatch < 0) {
	// Fix a forward discrepancy.
	var cc = fwdWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    } else { // (mismatch > 0)
	// Fix a discrepancy behind us.
	var cc = rearWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    }
    return CELL_NOP; // notreached
}

function runUMEnteringShaftTactic(pattern, mismatch) {
    // Assert:  got a plausible match on PAT_MS0R_IN, compass is set
    // If the MX cell was already "...M3OUT", same black as MR0,
    // and the three cells in view at the bottom of the shaft are
    // "just so" to result in a view with central inversion symmetry,
    // we could conceivably have got an upside-down match.  We'll
    // either end up back on RR1, or lost.  But then in this case
    // we shouldn't have stepped onto this cell in the first place...
    // #future# Deal with food at this level (without using the HOME color)!
    debugme("UMEnteringShaftTactic...");
    switch (view[CCW[compass+3]].color) {
    case LCL_MX_M0: // we're the first person down
	return {cell:CCW[compass+3], color:LCL_MX_M1IN};
    case LCL_MX_M1OUT: // we're the second person down
	if (myType == ANT_SENIOR_MINER) {
	    return {cell:CCW[compass+3], color:LCL_MX_M2IN};
	}
	break;
    case LCL_MX_M2OUT: // we're the third person down
	if (myType == ANT_SENIOR_MINER) {
	    return {cell:CCW[compass+3], color:LCL_MX_M3IN};
	}
	break;
    case LCL_MX_M3OUT: // oops
	break;
    case LCL_MX_M1IN:
    case LCL_MX_M2IN:
    case LCL_MX_M3IN: // MX looks good, deal with the rest
	if (mismatch < 0) {
	    // fix a forward discrepancy
	    var cc = fwdWrong[0];
	    return {cell:cc.v, color:fixup(pattern[cc.p])};
	} else if ((mismatch == 0) && destOK[CCW[compass+1]]) {
	    // descend!
	    return {cell:CCW[compass+1]};
	} else { // some colors behind me are off now
	    break; // or should we descend anyway???
	}
    default: // confused
	break;
    }
    // If we get here, we shouldn't be standing in this cell...
    if (destOK[CCW[compass+5]]) { // try stepping back to RR1
	return {cell:CCW[compass+5]};
    }
    // #future# Deal with congestion here, too?
    return CELL_NOP;
}

function runUMLeaveRRTactic() {
    // Assert:  PAT_GRR0 or PAT_GRR2 has matched, compass is set.
    if (view[CCW[compass+7]].ant &&
	view[CCW[compass+7]].ant.friend &&
	destOK[CCW[compass+6]]) {
	// lifelined ascent
	return {cell:CCW[compass+6]};
    } else if (destOK[CCW[compass+7]]) {
	return {cell:CCW[compass+7]};
    } else if (destOK[CCW[compass+5]]) {
	// creep forward, gingerly
	return {cell:CCW[compass+5]};
    } else { // wait for the obstacles to go away
	return CELL_NOP;
    }
}

function runUMDrillingShaftTactic(pattern, mismatch) {
    // Assert:  One of the four shaft-phase patterns has matched,
    // compass is set accordingly.
    debugme("UMDrillingShaftTactic...");
    var c = CCW[compass+1];
    if ((mismatch == 0) && (foodLateral > 0) &&
	(view[CCW[compass+3]].food + view[CCW[compass+7]].food > 0)) {
	if (myColor != LCL_MM_FOOD) {
	    return {cell:POS_CENTER, color:LCL_MM_FOOD};
	} else if (view[CCW[compass+5]].color != LCL_MM_HOME) {
	    return {cell:CCW[compass+5], color:LCL_MM_HOME};
	} else if ((view[CCW[compass+3]].food > 0) &&
		   destOK[CCW[compass+3]]) {
	    return {cell:CCW[compass+3]};
	} else if ((view[CCW[compass+7]].food > 0) && // must be
		   destOK[CCW[compass+7]]) {
	    return {cell:CCW[compass+7]};
	}
	// notreached (a cell with food can't be also occupied by an ant)
    } else if ((mismatch < 0) &&
	       !(view[c].ant && view[c].ant.friend)) {
	// Fix a forward discrepancy, but only if we aren't interfering
	// with a pal already drilling immediately below us.
	var cc = fwdWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    } else if (mismatch >= 0) {
	if (destOK[c]) {
	    debugme("......Drill, baby, drill!");
	    return {cell:c};
	} else {
	    // Collisions can happen when confused miners have wandered over
	    // into an adjacent shaft or when we're recreating a shaft whose
	    // beginnings, including the IN_USE marking, had been wiped out
	    // by an opponent.  We don't expect them to be frequent.
	    if (view[c].ant && view[c].ant.friend &&
		(view[c].ant.food > 0)) {
		// Painting a homeward marker would be pointless -- our
		// opposite number would clear it before we could make any
		// use of it.  So just step aside to let the laden friend
		// pass.
		// #future# We lack explicit code for doing a lifelined
		// step back to the middle of the shaft.  A random walk
		// usually succeeds anyway, and the situation can only arise
		// when we were *already* descending a busy shaft by mistake,
		// so ending up in a parallel shaft nearby is not going to
		// make things any worse than they already are.
		if ((view[CCW[compass]].color == LCL_CLEAR) &&
			   destOK[CCW[compass]]) {
		    return {cell:CCW[compass]};
		} else if ((view[CCW[compass+2]].color == LCL_CLEAR) &&
			   destOK[CCW[compass+2]]) {
		    return {cell:CCW[compass+2]};
		} else { // hemmed in by a crowd
		    // #future# attempt shaft congestion resolution...?
		    return CELL_NOP;
		}
	    } else {
		// Wait behind an unladen buddy, or obstruct a foe.
		return CELL_NOP;
	    }
	}
    }
    return CELL_NOP;
}

function runUMWrappingOntoRailTactic(pattern, mismatch) {
    // Assert:  PAT_MS0_WRAPPING has matched, the compass is set.
    debugme("UMWrappingOntoRailTactic...");
    if (view[CCW[compass+3]].color != LCL_MS_WRP) {
	return {cell:CCW[compass+3], color:LCL_MS_WRP};
    } else if (mismatch < 0) {
	// Fix a forward discrepancy (can't really happen).
	var cc = fwdWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    } else if (destOK[CCW[compass+1]]) {
	// Step onto the presumed RL1 cell.
	return {cell:CCW[compass+1]};
    }
    // Otherwise, wait for the obstacle to disappear.
    return CELL_NOP;
}

function runLMLeavingLeftWallTactic() {
    // Assert:  compass is set, one PAT_MSnFL has matched
    debugme("LMLeavingLeftWallTactic...");
    if (destOK[CCW[compass+7]]) {
	return {cell:CCW[compass+7]};
    } else {
	return CELL_NOP;
    }
}

function runLMLeavingRightWallTactic() {
    // Assert:  compass is set, one PAT_MSnFR has matched
    debugme("LMLeavingRightWallTactic...");
    if (destOK[CCW[compass+3]]) {
	return {cell:CCW[compass+3]};
    } else {
	return CELL_NOP;
    }
}

function runLMWrappingOntoRailTactic(pattern, mismatch) {
    // Assert:  compass is set, PAT_MS0_WRAPPING has matched.
    debugme("LMWrappingOntoRailTactic...");
    // #future# (hasn't yet occurred often enough to look worth the effort)
    return CELL_NOP; // placeholder
}

function runLMAscendingShaftTactic(pattern, mismatch) {
    // Assert:  compass is set, a suitable pattern has matched.
    // Any food on the walls would already have been grabbed.
    debugme("LMAscendingShaftTactic...");
    var c = CCW[compass+5];
    if ((mismatch < 0) &&
	!(view[c].ant && view[c].ant.friend)) {
	// Fix a forward discrepancy, but only if we aren't interfering
	// with a pal already ascending immediately above us.
	var cc = fwdWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    } else if (myColor == LCL_MM_FOOD) {
	return {cell:POS_CENTER, color:LCL_CLEAR};
    } else if (view[CCW[compass+5]].color == LCL_MM_HOME) {
	return {cell:CCW[compass+5], color:LCL_CLEAR};
    } else if ((mismatch >= 0) && destOK[c]) {
	debugme("......Climb, baby, climb!");
	return {cell:c};
    }
    // Let our descending pals deal with any collision resolution.
    // If we're stopped by food, it means we have *already* missed our
    // rail on our way home.  In this case, best to stay where we are
    // rather than creating yet more of a mess by trying to go around
    // the "obstacle".
    return CELL_NOP;
}

function runLMLeavingShaftTactic(pattern, mismatch) {
    // Assert:  compass is set (PAT_MS0R_IN having matched) but the
    // mismatch has been recomputed based on PAT_MS0R_OUT, or the
    // latter has matched straight away.
    debugme("LMLeavingShaftTactic...");
    if (mismatch < 0) {
	if (view[CCW[compass+5]].ant && view[CCW[compass+5]].ant.friend) {
	    // Don't dispute a friend over colors of cells closer to her than to us.
	    // An LM will soon walk away towards the queen;  a UM will see us and
	    // try to bow out and retreat to RM1.
	    debugme("LM: Friend on RR1, deferring to her for now");
	    return CELL_NOP;
	}
	// Fix any forward discrepancy first (e.g. if IN_USE got lost).
	// #future# Review this... can this overpaint MX prematurely?
	var cc = fwdWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    }
    switch (view[CCW[compass+3]].color) {
    case LCL_MX_M1IN:
	return {cell:CCW[compass+3], color:LCL_MX_M1OUT};
    case LCL_MX_M2IN:
	return {cell:CCW[compass+3], color:LCL_MX_M2OUT};
    case LCL_MX_M3IN:
    default:
	return {cell:CCW[compass+3], color:LCL_MX_M3OUT};
    case LCL_MX_M1OUT:
    case LCL_MX_M2OUT:
    case LCL_MX_M3OUT:
	if (destOK[CCW[compass+5]]) { // try stepping back to RR1
	    return {cell:CCW[compass+5]};
	}
	break;
    }
    return CELL_NOP;
}

function runLMCenterRailTactic() {
    // Assert:  spectrum suggests we're on mid rail.
    // Mirror image of runUMCenterRailTactic(), more or less.
    // When we pick up food at the rail head  (next to the engineer),
    // we turn around towards the queen and have unpainted territory to
    // our rear.  The trust setting allows to set our compass for the
    // homeward journey without the rear discrepancies worrying us too much.
    // #future# Review this -- could the "weird" cases benefit from
    // additional specLateral or specDiagonal checks?
    var pattern;
    var mismatch;
    var trust = (adjFriends[ANT_ENGINEER] > 0 ? 1 : 0);
    debugme("LMCenterRailTactic...");
    if (myColor == LCL_RM0) {
	pattern = PAT_GRM0;
	debugme("- trying PAT_GRM0");
	mismatch = patternCheck(pattern, AIM_DOWN, 3, 2 - trust);
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM1;
	    debugme("- trying PAT_GRM1");
	    mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM2B;
	    debugme("- trying PAT_GRM2B");
	    mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
	}
    } else if (myColor == LCL_RM2) {
	pattern = PAT_GRM2B;
	debugme("- trying PAT_GRM2B");
	mismatch = patternCheck(pattern, AIM_DOWN, 3, 2 - trust);
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM0;
	    debugme("- trying PAT_GRM0");
	    mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM1;
	    debugme("- trying PAT_GRM1");
	    mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
	}
    } else if (myColor == LCL_RM1) {
	pattern = PAT_GRM1;
	debugme("- trying PAT_GRM1");
	mismatch = patternCheck(pattern, AIM_DOWN, 3, 2 - trust);
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM2B;
	    debugme("- trying PAT_GRM2B");
	    mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_GRM0;
	    debugme("- trying PAT_GRM0");
	    mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
	}
    } else if (myColor == LCL_RM1_WRP) {
	// This could be a shaft-has-wrapped marking left behind by
	// a UM earlier, but it could equally well be damage, e.g.
	// from a misplaced shaft that has gone across the rail here.
	// So we'd better be careful and not try PAT_GRM1_WRP with
	// tight quality control.
	pattern = PAT_GRM1;
	debugme("- trying PAT_GRM1 (shaft had wrapped?)");
	mismatch = patternCheck(pattern, AIM_DOWN, 3, 2);
	if (compass >= 0) {
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    if (view[CCW[compass+3]].color != LCL_RR1_SHAFT_EXHAUSTED) {
		return {cell:CCW[compass+3], color:LCL_RR1_SHAFT_EXHAUSTED};
	    } else if (!(view[CCW[compass+7]].ant &&
			 view[CCW[compass+7]].ant.friend)) {
		// Clear the temporary wrap marking, unless the miner
		// responsible for it is still on RL1
		return {cell:POS_CENTER, color:LCL_RM1};
	    }
	}
    }
    if (compass < 0) {
	if (specLikeRR1()) {
	    // Can happen when an LM had strayed into a shaft which had
	    // wrapped in the meantime, and both RR1 and RM1 are still
	    // painted to reflect this fact.
	    debugme("Laden Miner: spectrum also resembles RR1");
	    return (runLMDepartingFromShaftStrategy());
	}
	// Still no idea where I am, give up.
	return (runLostMinerStrategy(true));
    }
    // Assert:  compass is now set.
    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
    if (mismatch == 0) { // perfect pattern match
	// Can we step homeward?  NB food can't be an obstacle unless we
	// are confused and sitting in a rail mockup away from the real one.
	var c = CCW[compass+1];
	if (destOK[c]) {
	    return {cell:c};
	} else if (view[c].ant && view[c].ant.friend) {
	    var evade = false;
	    if (view[c].ant.food == 0) {
		debugme("! collision avoidance: unladen friend ahead");
		evade = true;
	    } else if (view[CCW[compass+5]].ant &&
		       view[CCW[compass+5]].ant.friend &&
		       (view[CCW[compass+5]].ant.food > 0)) {
		debugme("! congestion avoidance: laden friends ahead and behind");
		evade = true;
	    }
	    if (evade) {
		if (destOK[CCW[compass]]) {
		    // Pass them by stepping diagonally onto the left rail edge
		    // (forward right when looking towards the queen)
		    return {cell:CCW[compass]};
		} else if (destOK[CCW[compass+7]]) {
		    // step sideways onto the left rail edge
		    return {cell:CCW[compass+7]};
		} else { // let the other deal with it
		    return CELL_NOP;
		}
	    } else {
		// Wait and see whether this clears itself up before more
		// friends come up from behind.
		return CELL_NOP;
	    }
	}
    } else if (mismatch < 0) {
	// Fix a forward discrepancy.
	var cc = fwdWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    } else { // (mismatch > 0)
	// Fix a discrepancy behind us.
	var cc = rearWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    }
    return CELL_NOP; // notreached
}

function runLMLeaveRLTactic() {
    // Assert:  pattern has matched, compass is set.
    if (view[CCW[compass+3]].ant && view[CCW[compass+3]].ant.friend &&
	destOK[CCW[compass+2]]) {
	// lifelined descent
	return {cell:CCW[compass+2]};
    } else if (destOK[CCW[compass+3]]) {
	return {cell:CCW[compass+3]};
    } else if (destOK[CCW[compass+1]]) {
	// creep homeward, gingerly
	return {cell:CCW[compass+1]};
    } else { // wait for the obstacles to go away
	return CELL_NOP;
    }
}

function runLMLeaveRRTactic() {
    // Assert:  PAT_GRR0 or PAT_GRR2 has matched, compass is set.
    if (view[CCW[compass+7]].ant &&
	view[CCW[compass+7]].ant.friend &&
	destOK[CCW[compass]]) {
	// lifelined descent
	return {cell:CCW[compass]};
    } else if (destOK[CCW[compass+7]]) {
	return {cell:CCW[compass+7]};
    } else if (destOK[CCW[compass+1]]) {
	// creep homeward, gingerly
	return {cell:CCW[compass+1]};
    } else { // wait for the obstacles to go away
	return CELL_NOP;
    }
}

function runMinerNavigatingTheGardenTactic() {
    // The first shaft drilled off rail3 will wrap around onto the garden
    // if it finds no food.  The miner will dispute some colors with the
    // gardener until the gardener is momentarily preoccupied with clock
    // business, allowing us to step forward, and then we'll know we're
    // close to home.  (Or we may have got confused and found the secretary
    // by lucky accident.  Or we have stepped aside to the first RR0 cell of
    // rail1, where we see the secretary but not the queen.)  Either way...
    // try going clockwise until we're on a rail again.
    for (var i = 0; i < TOTAL_NBRS; i++) {
	if (view[CCW[i]].ant && view[CCW[i]].ant.friend &&
	    (view[CCW[i]].ant.type == ANT_STAFF)) {
	    if (view[CCW[i]].color == LCL_CLEAR) {
		// Oops, we've met staff who is herself lost.
		// Assuming the queen has resettled, look for the new garden.
		if (i & 1) {
		    if ((view[CCW[i+3]].color == LCL_G5) &&
			destOK[CCW[i+3]]) {
			return {cell:CCW[i+3]};
		    }
		} else {
		    if ((view[CCW[i+4]].color == LCL_G6) &&
			destOK[CCW[i+4]]) {
			return {cell:CCW[i+4]};
		    } else if ((view[CCW[i+3]].color == LCL_G5) &&
			       destOK[CCW[i+3]]) {
			return {cell:CCW[i+3]};
		    }
		}
		return (runLostMinerStrategy(true));
	    } else if (destOK[CCW[i+1]]) {
		return {cell:CCW[i+1]};
	    }
	}
    }
    // No cigar... for now, wait for a better opportunity.
    return CELL_NOP;
}

// Engineers' tactics

function runEngineerLeavingGardenTactic() {
    // Assert:  We're away from the queen, the gardener is still in view
    // (so we are on rail 3 and the gardener is to our rear left),  and a
    // friendly junior or senior miner is also in view.  Use the gardener
    // to set the compass.
    // #future# Also handle case where rail2 wraps back to the garden??
    // (Most games do not last long enough for this to happen.)
    var pattern = PAT_FRL1G;
    var mismatch;
    debugme("EngineerLeavingGardenTactic...");
    for (var i = 0; i < TOTAL_NBRS; i += 2) {
	if (view[CCW[i]].ant && view[CCW[i]].ant.friend &&
	    (view[CCW[i]].ant.type == ANT_STAFF)) {
	    compass = i;
	    break;
	}
    }
    mismatch = patternCheck(pattern, AIM_UP, 0, 1);
    if ((mismatch == 0) && destOK[CCW[compass+5]] &&
	((view[CCW[compass+3]].ant && view[CCW[compass+3]].ant.friend) ||
	 (view[CCW[compass+4]].ant && view[CCW[compass+4]].ant.friend))) {
	// Only step forward when a friend will remain in view.
	return {cell:CCW[compass+5]};
    } else if (mismatch < 0) {
	// Fix a forward discrepancy.
	var cc = fwdWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    } else if (mismatch > 0) {
	// Fix a discrepancy behind us.
	var cc = rearWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    } else {
	// Wait for the buddy to catch up with us.
	return CELL_NOP;
    }
    return CELL_NOP; // notreached
}

/*
 * In the following tactic, the miner could legitimately be anywhere:
 * Normally to our right on the middle rail;  but she could have stepped
 * straight in front of us to collect food, or she could come in via a
 * wrapped shaft  (or a confused brownian walk)  from our left.
 * So unfortunately she will be no help in setting our compass.
 * Instead we'll have to rely on her doing most of the rail painting.
 *
 * Since there isn't a whole lot of redundancy on the left rail edge,
 * we use tight quality control on our pattern match attempts, which in
 * turn requires the friendly miner to paint at least one of the left
 * and middle rail cells ahead of us correctly before we dare painting
 * the others.  (Otherwise there's a risk that we might set our own
 * compass backwards on RL1, or mistake a forward RL0 view for a backward
 * RL2 pattern or vice versa.)
 *
 * Specifically for the PAT_RL1 check:
 * It would be nice if we could use a qualityGoal of zero here,
 * but that would leave the engineer stuck if anything off the
 * left rail edge  (where nobody else can correct it)  isn't to
 * our liking...  Unfortunately, with a tolerance of one, we get
 * another annoying effect:  When the youngest shaft happens to
 * wrap around onto the left rail edge before another miner comes
 * along to extend the rail and move the engineer further, the
 * engineer would still be sitting on the RL1 cell, and thus in
 * the middle of the wrapping miner's way.  (Why?  Because she
 * would have attained the qualityGoal just in time to paint the
 * RL2 cell ahead, thus just before the miner stepped out of her
 * view towards the shaft head, and on her own she wouldn't have
 * advanced to the RL2 cell).
 */
function runEngineerBuildingRailTactic() {
    // Assert:  We've left the queen and the gardener behind us, and a
    // friendly junior or senior miner is in view.
    // Help them to extend the rail.  Still need to orient ourselves first.
    // #future# Would more up-front spectrum checking be worthwhile?
    // #future# cases where rail1 has met rail3 -- again, most games do not
    // last long enough for this to happen  (and it seems to work just fine
    // when it does happen, thanks to the palindromic colors on the left
    // rail lanes).
    // #future# The youngest shaft can wrap around while the engineer is
    // still standing in the way.  Should the engineer step out of the way?
    // At present, we simply wait for another miner to turn up and cause the
    // engineer to move on.
    var pattern;
    var mismatch;
    debugme("EngineerBuildingRailTactic...");
    if (myColor == LCL_RL0) {
	pattern = PAT_FRL0;
	debugme("- trying PAT_FRL0");
	mismatch = patternCheck(pattern, AIM_UP, 1, 1);
	if (compass < 0) { // didn't recognize this as RL0, try RL2
	    pattern = PAT_FRL2;
	    debugme("- trying PAT_FRL2");
	    mismatch = patternCheck(pattern, AIM_UP, 1, 1);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    // one more try, on the chance a foe overpainted my own cell
	    pattern = PAT_FRL1;
	    debugme("- trying PAT_FRL1");
	    mismatch = patternCheck(pattern, AIM_UP, 1, 1);
	}
	// #future# Garden-ahead case would go here  (separate pattern needed).
	if (compass < 0) { // still no idea where I am
	    return runEngineerCleaningLeftRailEdgeTactic();
	}
    } else if (myColor == LCL_RL1) {
	pattern = PAT_FRL1;
	debugme("- trying PAT_FRL1");
	// See the comment just before this function.
	mismatch = patternCheck(pattern, AIM_UP, 1, 1);
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_FRL2;
	    debugme("- trying PAT_FRL2");
	    mismatch = patternCheck(pattern, AIM_UP, 1, 1);
	}
	if ((compass < 0) && (foesTotal > 0)) {
	    pattern = PAT_FRL0;
	    debugme("- trying PAT_FRL0");
	    mismatch = patternCheck(pattern, AIM_UP, 1, 1);
	}
	if (compass < 0) {
	    return runEngineerCleaningLeftRailEdgeTactic();
	}
    } else if ((myColor == LCL_RR2) &&
	       (specLateral[LCL_RL1] >= 1) &&
	       (specLateral[LCL_RL0] == 0)) {
	// Someone near us has turned this rail upside down!?
	debugme("Engineer: You must be kidding (whoever you are).");
	return {cell:POS_CENTER, color:LCL_RL0};
    }
    // Assert:  compass is now set.
    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
    if ((mismatch == 0) && destOK[CCW[compass+5]] &&
	((view[CCW[compass+3]].ant && view[CCW[compass+3]].ant.friend) ||
	 (view[CCW[compass+4]].ant && view[CCW[compass+4]].ant.friend))) {
	// Only step forward when a friend will remain in view.
	return {cell:CCW[compass+5]};
    } else if (mismatch < 0) {
	// Fix a forward discrepancy.
	var cc = fwdWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    } else if (mismatch > 0) {
	// Fix a discrepancy behind us.
	var cc = rearWrong[0];
	return {cell:cc.v, color:fixup(pattern[cc.p])};
    } else {
	// Wait for the buddy to catch up with us.
	return CELL_NOP;
    }
    return CELL_NOP; // notreached
}

function runEngineerCleaningLeftRailEdgeTactic() {
    // Assert:  At least one miner is in view  (and the gardener isn't),
    // and attempts to match an appropriate PAT_FRLn with AIM_UP and
    // tight quality control have failed.  This could mean that we're
    // really at the rail head and waiting for our buddy to paint enough
    // cells that we can be sure of our own way ahead, or that the RL and
    // RM cells are already fine but more than one RLL cell is messed up.
    // We deal here with the latter possibility by calling the pattern
    // engine with AIM_RIGHT  (treating RLL country as "rearward" and
    // assigning a very small weight to these cells),  after locating
    // at least one buddy on a laterally adjacent cell and setting our
    // compass on the assumption that she has more information than we do.
    // If this doesn't result in a decent match, we refrain from doing
    // anything.
    var pattern;
    var mismatch;
    debugme("runEngineerCleaningLeftRailEdgeTactic...");
    for (var i = 3; i < TOTAL_NBRS + 2; i += 2) {
	if (view[CCW[i]].ant && view[CCW[i]].ant.friend &&
	    ((view[CCW[i]].ant.type == ANT_JUNIOR_MINER) ||
	     (view[CCW[i]].ant.type == ANT_SENIOR_MINER))) {
	    compass = i - 3;
	    if (myColor == LCL_RL0) {
		pattern = PAT_FRL0;
		debugme("- trying PAT_FRL0");
		mismatch = patternCheck(pattern, AIM_RIGHT, 1, 0.3);
		if (mismatch < 0) { // didn't recognize this as RL0, try RL2
		    pattern = PAT_FRL2;
		    debugme("- trying PAT_FRL2");
		    mismatch = patternCheck(pattern, AIM_RIGHT, 1, 0.3);
		}
	    } else if (myColor == LCL_RL1) {
		pattern = PAT_FRL1;
		debugme("- trying PAT_FRL1");
		mismatch = patternCheck(pattern, AIM_RIGHT, 1, 0.3);
	    }
	    debugme("+ compass is set at " + compass + "; mismatch = " + mismatch);
	    if (mismatch > 0) { // decent match
		// Fix a discrepancy "behind" us.
		var cc = rearWrong[0];
		return {cell:cc.v, color:fixup(pattern[cc.p])};
	    }
	    return CELL_NOP;
	}
    }
    // No miner is _laterally_ adjacent, after all.
    return CELL_NOP;
}

// ---- The Programmable Pattern Engine ----

/*
 * In many situations, a worker  (and sometimes the queen)  already has a
 * rough grasp  (spectrum etc)  of the surroundings, and needs answers to
 * the following questions:
 * + Am I looking at a color arrangement similar to this pattern here?
 * + If so, which way am I facing relative to it?
 * + And how good is the match?
 * + Is it good enough to risk stepping into direction such-and-such now?
 * + If not, is it good enough that I can improve it  (by painting a cell)
 * without conjuring imagined things into existence that aren't really there?
 *
 * The Programmable Pattern Engine will find the answers.
 *
 * It can see the view around us  (and everything we already know about it).
 * It can see whether the compass has already been set, and can set it when
 * it hadn't yet been set and when the match is good enough.
 * It won't pay attention to food and other ants, though -- these are the
 * caller's responsibility to deal with as she sees fit.
 *
 * The caller will pass:
 * (1) an array pattern[] of colors indexed by "to-be-rotated controller"
 * coordinates.  Once we have a match, pattern[CCW[i]] will correspond to
 * view[CCW[compass+i]].color, and of course pattern[POS_CENTER] to myColor.
 * The array values can be a positive specific logical color, or zero
 * (indicating "don't care"),  or a color range  (an array of booleans);
 * (2) the index (from 0 to 8) of a cell in the pattern which we may want
 * to move to.  (So we'd pass AIM_UP if we subsequently plan to move to
 * cell:CCW[compass+5], or POS_CENTER if we contemplate staying put);
 * (3) a maximum number of discrepancies we're willing to accept before the
 * compass will be set.  The caller had best ensure that the pattern, for
 * *any* coloring in view, can meet this threshold in only one of the four
 * orientations.  If the compass is already set, this argument is ignored;
 * the PPE will use the compass as-is;
 * (4) an extra weight factor applied to "rear" discrepancies  (if the caller
 * wants to make them "worse"... needed for shaft pattern matching not to get
 * confused).
 *
 * The caller should pass a pattern that's reasonably likely to fit the
 * spectrum.  If we are to avoid imagining things which aren't there, we
 * should usually insist on 6 "good" cells in view, unless a buddy in view
 * in a presumably safer place helps to corroborate our guesses.  A pattern
 * of which less than five requirements agree with the spectrum is unlikely
 * to be useful.  But conversely, even when the pattern matches the spectrum
 * perfectly, the colors in view could be arranged so differently that we
 * can't make sense of them.  (Observation:  We can trust myColor not to have
 * been changed by an opponent as long as no opponent is currently in view,
 * since they could not have overpainted our cell *and* stepped away in a
 * single turn.)
 *
 * The caller will know whether the compass had already been set, and if not,
 * will easily see whether the PPE has succeeded in setting it.
 *
 * Before returning with the compass set, the PPE will populate two
 * arrays with pairs of indices of cells in the pattern and in the view
 * where the colors do not match, one for cells that will remain in sight
 * if we do step in the intended direction, one for the remaining cells.
 * (The point being that if the former are OK, we can walk away from the
 * latter;  but if the former aren't, the latter had better be right before
 * we reach for the paint brush and fix up the former.)  For painting, the
 * caller can readily retrieve the desired color from the pattern, or
 * deal with cases where one of several colors might be appropriate.
 *
 * The order of indices in these two arrays will be non-random  (we always
 * check the pattern in the same order).  If the caller wants to introduce
 * some randomness into which cell out of several candidates to paint first,
 * they can use the compass value to help picking one.
 *
 * The return value will be:
 * - if there are no forward discrepancies, the number of (weighted)
 * discrepancies to our rear  (zero for a perfect match);
 * - otherwise, minus the total number of (weighted) discrepancies found.
 */

function patternCheck(pattern, targetCell, qualityGoal, weight) {
    if (compass >= 0) { // already set
	return (patternCheckOrientation(pattern, targetCell, qualityGoal, weight, compass));
    } else {
	var mismatch;
	for (var o = 0; o < TOTAL_NBRS; o += 2) {
	    debugme("patternCheck: hunting for compass (now " + compass + ") at " + o);
	    mismatch = patternCheckOrientation(pattern, targetCell, qualityGoal, weight, o);
	    debugme("-> got mismatch " + mismatch + " and compass " + compass);
	    if (compass >= 0) {
		return mismatch;
	    }
	}
	return PAT_NOMATCH;
    }
}

// Workhorse, for one given orientation
function patternCheckOrientation(pattern, targetCell, qualityGoal, weight, orientation) {
    var forwardFacingCells = FWD_CELLS[targetCell];
    var totalDiscrepancies = 0;
    DEBUG_PATTERN_CHECK_VERBOSELY && debugme("Enter pCO([" + pattern + "]; " + targetCell + ", " + qualityGoal + ", " + weight + ", " + orientation + ");  compass: " + compass);
    fwdWrong = [];
    rearWrong = [];
    if ((Array.isArray(pattern[POS_CENTER]) && !pattern[POS_CENTER][myColor]) ||
	((pattern[POS_CENTER] > 0) && (myColor != pattern[POS_CENTER]))) {
	if (forwardFacingCells[POS_CENTER]) { // always true, in fact
	    fwdWrong.push({p:POS_CENTER, v:POS_CENTER});
	    totalDiscrepancies += 1;
	} else {
	    rearWrong.push({p:POS_CENTER, v:POS_CENTER});
	    totalDiscrepancies += weight;
	}
    }
    if ((compass < 0) && (totalDiscrepancies > qualityGoal)) {
	DEBUG_PATTERN_CHECK_VERBOSELY && debugme("--- too bad");
	return PAT_NOMATCH;
    }
    var jFrom = 0;
    switch (targetCell) {
    case AIM_UP:
	jFrom = 4;
	break;
    case AIM_LEFT:
	jFrom = 6;
	break;
    case AIM_RIGHT:
	jFrom = 2;
	break;
    case AIM_DOWN:
    case POS_CENTER:
    default:
	break;
    }
    for (var j = jFrom; j < TOTAL_NBRS + jFrom; j++) {
	var posP = CCW[j];
	var posV = CCW[orientation + j];
	var c = view[posV].color;
	if ((Array.isArray(pattern[posP]) && !pattern[posP][c]) ||
	    ((pattern[posP] > 0) && (c != pattern[posP]))) {
	    if (forwardFacingCells[posP]) {
		fwdWrong.push({p:posP, v:posV});
		// #future# If it should ever be needed, we could push j as a
		// third member of these objects  (its absence indicating the
		// center cell).
		totalDiscrepancies += 1;
	    } else {
		rearWrong.push({p:posP, v:posV});
		totalDiscrepancies += weight;
	    }
	}
	if ((compass < 0) && (totalDiscrepancies > qualityGoal)) {
	    DEBUG_PATTERN_CHECK_VERBOSELY && debugme("--- too bad");
	    return PAT_NOMATCH;
	}
    }
    // Assert:  totalDiscrepancies == fwdWrong.length + rearWrong.length;
    // Assert:  If compass < 0, then totalDiscrepancies <= qualityGoal
    debugme("-> total " + totalDiscrepancies + " weighted discrepancies found.");
    if ((compass < 0)
	// && (totalDiscrepancies <= qualityGoal)
       ) {
	compass = orientation;
    }
    if (DEBUGME[myType]) {
	// Bypass the single-arg debugme() in order to get the objects printed.
	DEBUG_PATTERN_CHECK_VERBOSELY && console.log("forwardD: [", fwdWrong, "]");
	DEBUG_PATTERN_CHECK_VERBOSELY && console.log("rearD:    [", rearWrong, "]");
    }
    if (fwdWrong.length == 0) {
	return (totalDiscrepancies);
    } else {
	return (-totalDiscrepancies);
    }
}

// ---- Helper functions ----

// Queen's clock counter:

function isQcZero(color) {
    return (LCR_QC_VALID[color] && (LCR_QC_VALUE[color] == 0));
}

function isQcTwo(color) {
    return (LCR_QC_VALID[color] && (LCR_QC_VALUE[color] == 2));
}

function incrementQc(color) {
    if (LCR_QC_VALID[color]) {
	return (LCR_QC[(LCR_QC_VALUE[color] + 1) % QC_PERIOD]);
    } else {
	return undefined;
    }
}

// Secretary's clock counter:

function isScZero(color) {
    return (LCR_SC_VALID[color] && (LCR_SC_VALUE[color] == 0));
}

function isScOne(color) {
    return (LCR_SC_VALID[color] && (LCR_SC_VALUE[color] == 1));
}

function incrementSc(color) {
    if (LCR_SC_VALID[color]) {
	return (LCR_SC[(LCR_SC_VALUE[color] + 1) % SC_PERIOD]);
    } else {
	return undefined;
    }
}

// Spectral analysis:

// #future# some quantitative correlation analysis...?

function specLikeCenterShaft() {
    // Blithely exploits that we don't use physical color blue in shafts...
    // but it may occur in front of the drill.
    // Surprise:  This will also match RR1 before it's been marked IN_USE!
    // It will also match RL1 (when we're laden), so specLikeRL1 must
    // be tested before this.
    return (((myColor == LCL_CLEAR) ||
	     ((myFood + foodLateral > 0) && (myColor == LCL_MM_FOOD)) ||
	     ((myFood > 0) && (myColor == LCL_MM_HOME))) &&
	    (specNbrs[LCL_MR0] + specNbrs[LCL_ML1] +
	     specNbrs[LCL_MR2] + specNbrs[LCL_ML3] >= 2) &&
	    (specNbrs[LCL_CLEAR] >= 3) &&
	    (specNbrs[LCL_MM_FOOD] + // green
	     specNbrs[LCL_MM_HOME] + // purple
	     specNbrs[COL_BLUE] <= 3)); 
}

function specLikeCenterRail() {
    // The test relies on LCL_RL0 == LCL_RL2 and LCL_RL1 == LCL_RR0 == LCL_RM2.
    // It is not infallible  (e.g. it could return true when we're standing
    // on the right rail edge with three cyan cells just outside the rail,
    // and for similar reasons when we're standing on the left edge),
    // but it suggests when we should check mid-rail patterns first.
    return (LCR_GRM_ALL[myColor] &&
	    (specTotal[LCL_RL0] + specTotal[LCL_RL1] >= 3) &&
	    (specNbrs[LCL_RL0] >= 1) &&
	    (specNbrs[LCL_RR0] + specNbrs[LCL_RR2] >= 2) &&
	    (specTotal[LCL_RM0] + specTotal[LCL_RM1_WRP] +
	     specTotal[LCL_RM1] + specTotal[LCL_RM2] >= 2) &&
	    (specTotal[LCL_CLEAR] <= 4));
}

function specLikeRL1() {
    // This one is pretty tight (thus can be checked early).
    return ((myColor == LCL_RL1) &&
	    (specLateral[LCL_RL0] >= 2) &&
	    (specDiagonal[LCL_RM0] >= 1) &&
	    (specLateral[LCL_RM1_WRP] + specLateral[LCL_RM1] >= 1) &&
	    (specDiagonal[LCL_RM2] >= 1));
}

function specLikeRL02() {
    // Can't meaningfully check LCL_RM2 separately here.
    return ((myColor == LCL_RL0) && // same as LCL_RL2
	    (specLateral[LCL_RL1] + specLateral[LCL_RL2] >= 2) &&
	    (specNbrs[LCL_RM0] >= 1) &&
	    (specDiagonal[LCL_RM1_WRP] + specDiagonal[LCL_RM1] >= 1));
}

function specLikeRR0() {
    // The first RR0 cell at the beginning of rails 1 and 2 has the
    // next rail's first RL1 behind it, instead of an RR2.  And the first
    // RR0 at the beginning of rail 3 has the gardeners's G6 in this
    // position.  These cases will *not* match this spectrum, and may
    // need special treatment.
    return ((myColor == LCL_RR0) &&
	    (specLateral[LCL_RM1] == 0) &&
	    (specDiagonal[LCL_RM1] + specDiagonal[LCL_RM1_WRP] >= 1) &&
	    (specLateral[LCL_MR0] >= 1) &&
	    (specLateral[LCL_RR2] >= 1));
}

function specLikeRR1() {
    // Expect:  myColor is no longer LCL_RR1, but in weird cases it might
    // still be  (e.g. lots of blue just off the right rail edge).
    return (LCR_GRR1[myColor] &&
	    (specNbrs[LCL_RR0] >= 2) && // also counts RM2
	    (specLateral[LCL_RR2] >= 1) &&
	    (specDiagonal[LCL_RM0] >= 1) &&
	    (specNbrs[LCL_CLEAR] <= 3) &&
	    (specLateral[LCL_RM1] +
	     specLateral[LCL_RM1_WRP] >= 1));
}

function specLikeRR2() {
    return ((myColor == LCL_RR2) &&
	    (specDiagonal[LCL_CLEAR] >= 1) &&
	    (specDiagonal[LCL_RM0] >= 1) &&
	    // (exploiting that LCL_MR0 == LCL_RM1_WRP)
	    (specDiagonal[LCL_RM1] + specDiagonal[LCL_MR0] >= 2) &&
	    // (exploiting that LCL_RM2 == LCL_RR0)
	    (specLateral[LCL_RR0] >= 2));
}

function specLikeMS0R() {
    return((myColor == LCL_CLEAR) &&
	   (specLateral[LCL_MR0] >= 1) && (specLateral[LCL_RR1_SHAFT_IN_USE] >= 1) &&
	   // Cannot exploit LCL_RR2 == LCL_ML1 here since ML1 may not yet
	   // have been painted:
	   (specDiagonal[LCL_RR2] >= 1) && (specDiagonal[LCL_RR0] >= 1));
}

function specLikeMS0ROut() { // for use with PAT_MS0R_OUT1
    return ((myColor == LCL_CLEAR) &&
	    // exploiting LCL_RR1_SHAFT_EXHAUSTED == LCL_MR0:
	    (specLateral[LCL_MR0] + specLateral[LCL_RR1_SHAFT_VACANT] >= 2) &&
	    // exploiting LCL_RR2 == LCL_ML1:
	    (specDiagonal[LCL_RR2] >= 2) && (specDiagonal[LCL_RR0] >= 1));
}

function specLikeMS0Wrapping() {
    return ((myColor == LCL_CLEAR) &&
	    (specDiagonal[LCL_RL0] >= 3) && // includes LCL_ML3
	    (specLateral[LCL_RL1] >= 1) &&
	    (specLateral[LCL_MS_WRP] >= 2) && // includes LCL_MR0
	    (specNbrs[LCL_CLEAR] >= 2));
    // (this allows for one RL cell to be mispainted)
}

// Spectrum after collecting food from shaft wall:

function specLikeMFL() {
    return ((specLateral[LCL_MM_FOOD] >= 1) &&
	    (specDiagonal[LCL_MM_HOME] >= 1) &&
	    (specTotal[LCL_CLEAR] >= 2) &&
	    (specTotal[LCL_ML1] + specTotal[LCL_ML3] >= 1));
}

function specLikeMFR() {
    return ((specLateral[LCL_MM_FOOD] >= 1) &&
	    (specDiagonal[LCL_MM_HOME] >= 1) &&
	    (specTotal[LCL_CLEAR] >= 2) &&
	    (specTotal[LCL_MR0] + specTotal[LCL_MR2] >= 1));
}

// #future# special cases of food markings at the MS0 level:
// The FOOD color reoccurs as RR0...

/*
 * Fixing up one color discrepancy in a pattern:
 *
 * We can afford a no-brains linear search here -- most of the time,
 * the outcome will be COL_WHITE on the first iteration.
 * (Otherwise we'd have to store a predetermined suggested fixup color
 * with each color range referenced by a pattern.  In fact, it is more
 * efficient to run a linear search here on demand, immediately before
 * the ant function returns, than to run several up front on each ant
 * function invocation...)
 */
function fixup(patternCell) {
    if (Array.isArray(patternCell)) {
	for (var i = 1; i <= 9; i++) {
	    if (patternCell[i]) {
		return i;
	    }
	}
	return LCL_CLEAR; // notreached (all our ranges are non-empty)
    } else {
	return patternCell;
    }
}

// console.log wrapper:
function debugme(arg) {
    if (DEBUGME[myType]) {
	console.log(arg);
    }
}

/*
--- ASCII-art schematic of the windmill hub geometry: ---
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|   |   |   |   | ^ |MR2|   | v |MR2|   | ^ |   |   |   |   |   |   |   |   |
|   |   |   |   | i |   |   | a | r |  rail 2   |   |   |   |   |   |   |   |
+---+---+---+---+-n-+---+---+-c-+---+---+---+---+---+---+---+---+---+---+---+
|   |   |   |ML1|   |   |ML1| a |   |RL0|RM0|RR0|   |   |   |   |   |   |   |
|   |   |   | y | u |   | y | t |   | c | r | g |   |   |   |   |   |   |   |
+---+---+---+---+-s-+---+---+-e-+---+---+---+---+---+---+---+---+---+---+---+
|   |   |   |MX | e |MR0|MX | d |MR0|RL2|RM2|RR2|MX |ML1|   |ML3|   |ML1|   |
|   |   |   | c |   | k | y |   | k | c | g | y | c | y |   | c |   | y |   |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|   |RR1|RR0|RR2|RR1|RR0|RR2|RR1|RR0|RL1|RM1|RR1|   | shaft in use  |  >|   |
|  r|   | g | y | r | g | y | y | g | g | b | r |   |   |   |   |   |   |   |
+--a+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
| <i|RM1|RM0|RM2|RM1|RM0|RM2|RM1|RM0|RL0|RM0|RR0|MR0|   |MR2|   |MR0|   |   |
|  l| b | r | g | b | r | g | b | r | c | r | g | k |   | r |   | k |   |   |
+-- +---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|  3|RL1|RL0|RL2|RL1|RL0|RL2|RL1|RL0|*Q*|RL0|RL1|RL2|RL0|RL1|RL2|RL0|RL1|   |
|   | g | c | c | g | c | c | g | c |clk| c | g | c | c | g | c | c | g |r  |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+a--+
|   |   |   |   |   |   |   |G3 |Grd|Sec|RM0|RM1|RM2|RM0|RM1|RM2|RM0|RM1|i >|
|   |   |   |   |   |   |   | k |r/y|clk| r | b | g | r | b | g | r | b |l  |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+ --+
|   |   |   |   |   |   |   |G4 |G5 |G6 |RR0|RR1|RR2|RR0|RR1|RR2|RR0|RR1|1  |
|   |   |   |   |   |   |   | r | k | b | g | y | y | g | r | y | g |   |   |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
|   |   |   |   |   |   |   |   |   |   |MR0|   |MX |MR0|   |MX |   |   |   |
|   |   |   |   |   |   |   |   |   |   | k |   | y | k |   | c |   |   |   |
+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+---+
(showing MX and RR1 colors during and after the first descent by a
junior miner)
 */
