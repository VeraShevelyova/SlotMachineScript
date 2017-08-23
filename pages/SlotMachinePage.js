
var webdriver = require('selenium-webdriver');
var utils = require('./../helpers/utils.js');
var clickButton = utils.clickButton;
var assert = require('assert');
var correspondings  = {"top: -1114px;": 5, "top: -634px;": 1, "top: -1234px;": 6, "top: -994px;": 4, "top: -874px;" : 3, "top: -754px;": 2};
var winResultsArray = [];
var actualResultRow = [];
var isActualWon = false;
var startTotalWins = -1;
var startBets = -1;
var betContainerValues = {};
var lastWin = 0;
var i = 0;

var State = function(){
    this.slotMachineIndex = 1;
    this.totalSpins = -1;
    this.bet = -1;
    this.lastWin = "";
    this.dayWinnings = -1;
    this.lifetimeWinnings = -1;
    this.isExpectedWon = false;
    this.isActualWon = false;
    this.winIndex = -1;
    this.winAmount = 0;
    this.winChartAmountsArray = [];
}

var SlotMachinePage = function(driver){

    var spinButton = driver.findElement(webdriver.By.id('spinButton'));
    var credits = driver.findElement(webdriver.By.id('credits'));
    var bet = driver.findElement(webdriver.By.id('bet'));
    var lastWin = driver.findElement(webdriver.By.id('lastWin'));
    var slotsOuterContainer = driver.findElement(webdriver.By.id('SlotsOuterContainer'));
    var betSpinUpButton  = driver.findElement(webdriver.By.id('betSpinUp'));
    var betSpinDownButton  = driver.findElement(webdriver.By.id('betSpinDown'));
    var changeBackGroundButton = driver.findElement(webdriver.By.className('btnChangeBackground'));
    var changeIconsButton =  driver.findElement(webdriver.By.className('btnChangeReels'));
    var changeMachineButton = driver.findElement(webdriver.By.className('btnChangeMachine'));
    var dayWinnings = driver.findElement(webdriver.By.id('dayWinnings'));
    var lifetimeWinnings = driver.findElement(webdriver.By.id('lifetimeWinnings'));
    var winChartAmountsArray = driver.findElements(webdriver.By.xpath("//div[@id='prizes_list_slotMachine1']/div[@class='trPrize']/span"));
    var possibleBackgrounds = driver.findElements(webdriver.By.xpath("//div[@id='slot_machines_backgrounds']/div"));
    var state = new State();

    this.openPage = function(){
        driver.get('http://slotmachinescript.com/');
    };

    this.clickSpinButton = function(){
        clickButton(spinButton, 'Spin');
    };

    this.clickBetUpButton = function(){
        clickButton(betSpinUpButton, 'Bet up');
    };

    this.clickBetDownButton = function(){
        clickButton(betSpinDownButton, 'Bet down');
    };

    this.clickChangeBackGroundButton = function(){
        clickButton(changeBackGroundButton, 'Change Background');
    };

    this.waitUntilRun = function(){
        driver.wait(function(){
            return spinButton.getAttribute('class')
                .then(function(classes){
                    if(classes === ""){
                        console.log('Finished!!!');
                        return true;
                    }
                    else
                        console.log(classes);
                });
        }, 20000);
    };

    this.getCurrentCredit = function(){
        var d = webdriver.promise.defer();
        credits.getText().then(function (text) {
            startTotalWins = text;
            d.fulfill(text);
            console.log('At the begining credit number: ' + text);
        });
        return d.promise;
    };

    this.getTotalSpins = function(){
        var d = webdriver.promise.defer();
        credits.getText().then(function (text) {
            betContainerValues.totalSpins = text;
            d.fulfill(text);
            state.totalSpins = text;
        });
        return d.promise;
    };

    this.getBet = function(){
        bet.getText().then(function (text) {
            state.bet = text;;
        });
    };

    this.getLastWin = function(){
        lastWin.getText().then(function (text) {
            betContainerValues.lastWin = text;
            state.lastWin = text;
        });
    };

    this.getDaydayWinnings= function(){
        dayWinnings.getText().then(function (text) {
            state.dayWinnings= text;
        });
    };

    this.getlifetimeWinnings= function(){
        lifetimeWinnings.getText().then(function (text) {
            state.lifetimeWinnings = text;
        });
    };

    this.getWinChartAmountsArray = function(){
        winChartAmountsArray.then(function (winChartAmountsArray) {
            state.winChartAmountsArray = [];
            winChartAmountsArray.forEach(function(winAmount){
                winAmount.getText().then(function(text){
                    state.winChartAmountsArray.push(text);
                })
            })
        })
    }

    this.rememberState = function(){
        var flow = webdriver.promise.controlFlow();
        flow.execute(function(){
            state = new State();
            console.log('get state');
        })
        flow.execute(this.getTotalSpins);
        flow.execute(this.getLastWin);
        flow.execute(this.getBet);
        flow.execute(this.getWinChartAmountsArray);
        flow.execute(function(){
            console.log(state);
        })
    };

    this.compareActualAndExpectedState = function(action, amount){
        switch(action) {
            case "SpinButtonClick":
                var self = this;
                credits.getText().then(function (currentTotalspins) {
                    assert.equal(state.totalSpins - state.bet, currentTotalspins, "Number of Spins");
                    state.totalSpins = currentTotalspins;
                });
                bet.getText().then(function (currentBet) {
                    assert.equal(state.bet, currentBet, "Number of Bets");
                });
                lastWin.getText().then(function (currentLastWin) {
                    assert.equal("", currentLastWin, "Last Win");
                })
                break;
            case "AfterSpinResult":
                credits.getText().then(function (currentTotalspins) {
                    var expectedTotalSpins = parseInt(state.totalSpins.toString()) + parseInt(state.winAmount.toString())
                    assert.equal(expectedTotalSpins, currentTotalspins, "Number of Spins");
                    state.totalSpins = currentTotalspins;
                });
                lastWin.getText().then(function (actualLastWin) {
                    var expectedLastWin = parseInt(state.winAmount.toString()) === 0 ? "" : parseInt(state.winAmount.toString());
                    assert.equal(expectedLastWin, actualLastWin, "Last Win");
                    state.lastWin = actualLastWin;
                });
                break;
            case "BetChange":
                var flow = webdriver.promise.controlFlow();
                flow.execute(function () {
                    bet.getText().then(function (currentBet) {
                        var am = parseInt(amount.toString()) > 9 ? 9 : parseInt(amount.toString());
                        var expectedBet = parseInt(state.bet.toString()) + am;
                        expectedBet = expectedBet === 0 ? 1 : expectedBet
                        assert.equal(expectedBet, currentBet, "Number of Bets");
                    });
                });
                flow.execute(function () {
                    winChartAmountsArray.then(function (winChartAmountsArray) {
                        console.log('Why I am here???');
                        winChartAmountsArray.forEach(function (winAmount, index) {
                            winAmount.getText().then(function (actualAmount) {
                                console.log(actualAmount);
                                var am = parseInt(amount.toString()) > 9 ? 9 : parseInt(amount.toString());
                                var betAm =  (parseInt(state.bet.toString()) + am) === 0 ? 1: (parseInt(state.bet.toString()) + am);
                                var expectedAmount = (state.winChartAmountsArray[index] / parseInt(state.bet.toString())) * betAm;
                                console.log(expectedAmount);
                                console.log(state);
                                assert.equal(actualAmount, expectedAmount, 'Compare win amount. Expected:' + expectedAmount + ' but actual: ' + actualAmount);
                            })
                        })
                    });
                })
        }
    };

    this.compareActualAndExpectedWonResult = function(){

    };

    this.getActualRow = function(){
        var reels = driver.findElements(webdriver.By.xpath("//div[@id='reel1' or @id='reel2' or @id='reel3']"));
        var d = webdriver.promise.defer();
        reels.then(function(reels){
            reels.forEach(function(reel){
                reel.getAttribute("style").then(function(style){
                    actualResultRow.push(correspondings[style]);
                    console.log(correspondings[style]);
                });
            });
            d.fulfill(actualResultRow);
        });

        return d.promise;
    }

    this.getWinResultsArray  = function(){
        var resultsList  = driver.findElements(webdriver.By.css('#prizes_list_slotMachine1 > div'));
        var d = webdriver.promise.defer();
        resultsList.then(function(resultList){
            resultList.forEach(function(result, resListIndex){
                var resultColumns = result.findElements(webdriver.By.css('.tdReels > div'))
                resultColumns.then(function(resultColumns){
                    var winResultRow = [];
                    resultColumns.forEach(function(resultColumn, index){
                        resultColumn.getAttribute("class").then(function(attribute){
                            var res =  /prize.*/.exec(attribute);
                            console.log(res? res[0]: null);
                            winResultRow.push(res? res[0]: null);
                            if(index === resultColumns.length - 1)
                                winResultsArray.push(winResultRow);
                        });
                    })
                })

                if(resListIndex===resultList.length - 1){
                    d.fulfill(winResultsArray);
                }
            })
        });

        return d.promise;
    };

    this.isExpectedWon = function() {
        var isExpectedWon = false;
        var self = this;
        winResultsArray.forEach(function (winResultRow, index) {
            if(!isExpectedWon) {
                isExpectedWon = winResultRow[0].indexOf(actualResultRow[0]) > -1
                    && winResultRow[1].indexOf(actualResultRow[1]) > -1
                    && winResultRow[2].indexOf(actualResultRow[2]) > -1;
                if(isExpectedWon)
                    state.winIndex = index;
            }
        });

        state.isExpectedWon = isExpectedWon;

        return isExpectedWon;
    };

    this.getWinAmount = function(){
        if(state.winIndex > -1) {
            var winAmountEl = driver.findElement(webdriver.By.css("#prizes_list_slotMachine1 > div:nth-child(" + (state.winIndex + 1) + ") > span"));
            winAmountEl.getText().then(function (text) {
                state.winAmount = text;
            });
        }
    };

    this.checkSpinResult = function(){
        var flow = webdriver.promise.controlFlow();
        flow.execute(this.getActualRow);
        flow.execute(this.getWinResultsArray);
        flow.execute(this.isExpectedWon);
        flow.execute(this.isActualWon);
        flow.execute(this.getWinAmount)
        flow.execute(function(){
            assert.equal(state.isExpectedWon, state.isActualWon, 'Check win Result');
        })

    };

    this.closeBrowser  = function()  {
        driver.quit();
    }

    this.isActualWon = function(){
        slotsOuterContainer.getAttribute("class").then(function (classAttr) {
            var res = classAttr === 'won';
            state.isActualWon = res;
        })
    }
}

exports.SlotMachinePage = SlotMachinePage;