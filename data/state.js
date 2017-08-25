var State = function(){
    this.slotMachineIndex = 1;
    this.totalSpins = -1;
    this.bet = -1;
    this.lastWin = "";
    this.dayWinnings = -1;
    this.lifetimeWinnings = -1;
    this.actualResultRow = [];
    this.actualResultRowStyles = [];
    this.winResultsArray = [];
    this.isExpectedWon = false;
    this.isActualWon = false;
    this.winIndex = -1;
    this.winAmount = 0;
    this.winChartAmountsArray = [];
    this.backGroundIndex = 0;
    this.reel = 1;
    this.machine = 1;
};

exports.State = State;