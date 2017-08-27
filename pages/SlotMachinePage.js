
var webdriver = require('selenium-webdriver');
var utils = require('./../helpers/utils.js');
var State = require('./../data/state.js').State;
var Actions = require('./../helpers/actions');
var url  = require('./../package.json').url;
var clickButton = utils.clickButton;
var compareTextOfElement = utils.compareTextOfElement;
var compareText = utils.compareText;
var assert = require('assert');
var correspondings = { "top: -1114px;": 5, "top: -634px;": 1, "top: -1234px;": 6, "top: -994px;": 4, "top: -874px;": 3, "top: -754px;": 2 };
var numberOfReels = 3;

var SlotMachinePage = function (driver) {

    var state = new State();
    var spinButton = driver.findElement(webdriver.By.id('spinButton'));
    var overviewBitton = driver.findElement(webdriver.By.xpath('//*[text()="Overview"]'));
    var testimonals = driver.findElement(webdriver.By.xpath('//*[text()="Testimonials"]'));
    var buyNow = driver.findElement(webdriver.By.xpath('//*[text()="Buy Now!"]'));
    var credits = driver.findElement(webdriver.By.id('credits'));
    var bet = driver.findElement(webdriver.By.id('bet'));
    var lastWin = driver.findElement(webdriver.By.id('lastWin'));
    var slotsOuterContainer = driver.findElement(webdriver.By.id('SlotsOuterContainer'));
    var betSpinUpButton = driver.findElement(webdriver.By.id('betSpinUp'));
    var betSpinDownButton = driver.findElement(webdriver.By.id('betSpinDown'));
    var changeBackGroundButton = driver.findElement(webdriver.By.className('btnChangeBackground'));
    var changeIconsButton = driver.findElement(webdriver.By.className('btnChangeReels'));
    var changeMachineButton = driver.findElement(webdriver.By.className('btnChangeMachine'));
    var dayWinnings = driver.findElement(webdriver.By.id('dayWinnings'));
    var lifetimeWinnings = driver.findElement(webdriver.By.id('lifetimeWinnings'));
    var winChartAmountsArray = driver.findElements(webdriver.By.xpath("//div[@id='prizes_list_slotMachine"
        + state.machine + "']/div[@class='trPrize']/span"));
    var possibleBackgrounds = driver.findElements(webdriver.By.className("changeable_background"));
    var backgroundsContainer = driver.findElement(webdriver.By.id("slot_machines_backgrounds"));
    var slotMachineWrapper = driver.findElement(webdriver.By.id("slotsSelectorWrapper"));
    var thirdReel = driver.findElement(webdriver.By.id('reel3'));
    var reels = driver.findElements(webdriver.By.className("reel"));
    var winElPattern = "#prizes_list_slotMachine_machineNumber_ > div:nth-child(_winIndex_) > span";
    var resultListPattern = "#prizes_list_slotMachine_machineNumber_ > div";

    this.clickSpinButton = function () {
        clickButton(spinButton, 'Spin');
    };

    this.clickBetUpButton = function () {
        clickButton(betSpinUpButton, 'Bet up');
    };

    this.clickBetDownButton = function () {
        clickButton(betSpinDownButton, 'Bet down');
    };

    this.clickChangeBackGroundButton = function () {
        clickButton(changeBackGroundButton, 'Change Background');
    };

    this.clickChangeIconsButton = function () {
        clickButton(changeIconsButton, 'Change Icons');
    };

    this.clickChangeMachineButton = function () {
        clickButton(changeMachineButton, 'Change machine');
    }

    this.waitUntilSpinRun = function () {
        spinButton.getAttribute('class').then(function () {
            console.log('Wait for spin run');
            driver.wait(function () {
                return spinButton.getAttribute('class')
                    .then(function (classes) {
                        return classes === "";
                    }).then(function (prevRes) {
                        return thirdReel.getAttribute('style').then(function (style) {
                            return prevRes && Object.keys(correspondings).indexOf(style) > -1;
                        })
                    });
            }, 20000);
        })
    };

    this.waitBackgroundRotate = function () {
        backgroundsContainer.getAttribute('style').then(function () {
            console.log('Wait background rotate');
            driver.wait(function () {
                return backgroundsContainer.getAttribute('style')
                    .then(function (style) {
                        return style === "width: 100%; left: 0px;";
                    });
            }, 20000);
        })
    };

    this.waitFoRefresh = function () {
            driver.wait(function () {
                return driver.findElement(webdriver.By.id('spinButton')).isElementPresent().then(function(isDisplayed){
                    return isDisplayed;
                })
            }, 20000);
    };

    this.waitUntilSlotMachineChanges = function () {
        slotMachineWrapper.getAttribute('style').then(function () {
            console.log('Wait for slot machine change');
            driver.wait(function () {
                return slotMachineWrapper.getAttribute('style')
                    .then(function (style) {
                        return style.indexOf("left: 0px;") > -1;
                    });
            }, 20000);
        });
    };

    this.setValue = function(element, stateProperty){
        element.getText().then(function(text){
            state[stateProperty] = text;
        })
    };

    this.setTotalSpins = function () {
        this.setValue(credits, 'totalSpins');
    };

    this.setBet = function () {
        this.setValue(bet, 'bet');
    };

    this.setLastWin = function () {
        this.setValue(lastWin, 'lastWin');
    };

    this.setDaydayWinnings = function () {
        this.setValue(dayWinnings, 'dayWinnings');
    };

    this.setLifetimeWinnings = function () {
        this.setValue(lifetimeWinnings, 'lifetimeWinnings');
    };

    this.getCurrentReel = function () {
        slotMachineWrapper.getAttribute("class").then(function (dataReel) {
            state.reel = (/reelSet\d{1}/.exec(dataReel)).toString().replace('reelSet', '');
        })
    }

    this.getCurrentMachine = function () {
        slotMachineWrapper.getAttribute("class").then(function (dataReel) {
            state.machine = (/slotMachine\d{1}/.exec(dataReel)).toString().replace('slotMachine', '');
        })
    }

    this.getWinChartAmountsArray = function () {
        driver.findElements(webdriver.By.xpath("//div[@id='prizes_list_slotMachine"
            + state.machine + "']/div[@class='trPrize']/span")).then(function (winChartAmountsArray) {
                state.winChartAmountsArray = [];
                winChartAmountsArray.forEach(function (winAmount) {
                    winAmount.getText().then(function (text) {
                        state.winChartAmountsArray.push(text);
                    })
                })
            })
    }

    this.rememberState = function () {
        var flow = webdriver.promise.controlFlow();
        flow.execute(function () {
            state = new State();
        })
        flow.execute(this.setTotalSpins.bind(this));
        flow.execute(this.setLastWin.bind(this));
        flow.execute(this.setBet.bind(this));
        flow.execute(this.setDaydayWinnings.bind(this));
        flow.execute(this.setLifetimeWinnings.bind(this));
        flow.execute(this.getCurrentMachine);
        flow.execute(this.getWinChartAmountsArray);
        flow.execute(this.getCurrentReel);
        flow.execute(this.getActualRow);
        flow.execute(this.getWinResultsArray);
    };

    this.getExpectedBet = function(changeAmount){
        var expectedBet = state.bet.toInt() + changeAmount;
        if(expectedBet >state.maxBet)
            expectedBet = state.maxBet;
        if(expectedBet< state.minBet)
            expectedBet = state.minBet;
        return expectedBet;
    };

    this.getExpectedWinAmountsArray = function(){
        var self = this;
        var expectedWinAmountsArray = [];
        winChartAmountsArray.then(function (winChartAmountsArray) {
            var expectedBet = self.getExpectedBet();
            winChartAmountsArray.forEach(function (winAmount, index) {
                var expectedAmount = (state.winChartAmountsArray[index] / state.bet.toInt()) * expectedBet;
                expectedWinAmountsArray.push(expectedAmount);
            })
        });
    };

    this.getExpectedReel = function(amount){
        var rawExpectedReel = (state.reel.toInt() + amount) % numberOfReels;
        var expectedReel = rawExpectedReel ===0 ? numberOfReels : rawExpectedReel;
        return expectedReel;
    };

    this.getExpectedBackgroundIndex = function(amount, numberOfBackgrounds){
        var rawExpectedBackdround = (state.backGroundIndex + amount);
        var expectedBackgroundIndex = rawExpectedBackdround % numberOfBackgrounds ;
        return expectedBackgroundIndex;

    }

    this.compareStateAfterAction = function (action, amount) {
        var self = this;
        switch (action) {
            case 'SpinButtonClick':
                credits.getText().then(function (currentTotalspins) {
                    console.log("Check values after spin button is clicked...");
                    var expectedSpins = state.totalSpins.toInt() - state.bet.toInt();
                    compareTextOfElement(credits, expectedSpins, "Total Spins");
                    compareTextOfElement(bet, state.bet, "Bets");
                    compareTextOfElement(lastWin, "", "Last win");
                });
                break;
            case 'ReceivedSpinResult':
                credits.getText().then(function (currentTotalspins) {
                    console.log("Check values after getting spin result");
                    var expectedTotalSpins = state.totalSpins.toInt() + state.winAmount.toString().toInt();
                    console.log('state.winAmount' + state.winAmount);
                    compareTextOfElement(credits, expectedTotalSpins, "Total spins");
                    var expectedLastWin = state.winAmount === 0 ? "" : state.winAmount;
                    compareTextOfElement(lastWin, expectedLastWin, "Last win");
                    if(state.machine === 3) {
                        compareTextOfElement(dayWinnings, state.dayWinnings + expectedLastWin, 'Daily Winings');
                        compareTextOfElement(lifetimeWinnings, state.lifetimeWinnings + expectedLastWin, 'Lifitime Winings');
                    }
                });
                break;
            case 'BetChange':
                var flow = webdriver.promise.controlFlow();
                flow.execute(function () {
                    compareTextOfElement(bet, self.getExpectedBet(amount), "Bet");
                });
                flow.execute(function () {
                    winChartAmountsArray.then(function (winChartAmountsArray) {
                        var expectedBet = self.getExpectedBet(amount);
                        winChartAmountsArray.forEach(function (winAmount, index) {
                            var expectedAmount = (state.winChartAmountsArray[index] / state.bet.toInt()) * expectedBet;
                            compareTextOfElement(winAmount, expectedAmount, "Win amount with index " + index);
                        })
                    });
                })
                break;
            case 'BackgroundRotate':
                possibleBackgrounds.then(function (possibleBackgrounds) {
                    console.log("Comparing that background has changed correctly");
                    var expectedBackgroundIndex = self.getExpectedBackgroundIndex(amount, possibleBackgrounds.length);
                    possibleBackgrounds.forEach(function (possibleBackground, index) {
                        possibleBackground.getAttribute("style").then(function (style) {
                            if (index === expectedBackgroundIndex)
                                compareText(true, style.indexOf("display: none;") === -1, "Style for visible background")
                            else
                                compareText(true, style.indexOf("display: none;") > -1, "Style for not visible background")
                        })
                    })
                });
                break;
            case 'Change Icons':
                slotMachineWrapper.getAttribute("class").then(function (dataReel) {
                    var actualReel = (/reelSet.*/.exec(dataReel)).toString().replace('reelSet', '').toInt();
                    var expectedReel = self.getExpectedReel(amount);
                    compareText(expectedReel, actualReel, "Active Icon");
                })
                break;
            case 'Reopen_Browser':
                credits.getText().then(function (currentTotalspins) {
                    console.log("Check values after reopening browser");
                    compareTextOfElement(credits, state.totalSpins, "Total spins");
                    compareTextOfElement(lastWin, state.winAmount, "Last win");
                    compareTextOfElement(bet, state.bet, "Bet")
                    compareTextOfElement(dayWinnings, state.dayWinnings + expectedLastWin, 'Daily Winings');
                    compareTextOfElement(lifetimeWinnings, state.lifetimeWinnings + expectedLastWin, 'Lifitime Winings');
                });
                break;
        }
    };

    this.getActualRow = function () {
        reels.then(function (reels) {
            state.actualResultRow = [];
            state.actualResultRowStyles = [];
            reels.forEach(function (reel) {
                reel.getAttribute("style").then(function (style) {
                    state.actualResultRow.push(correspondings[style]);
                    state.actualResultRowStyles.push(style);
                });
            });
        });
    }

    this.getWinResultsArray = function () {
        var resultsList = driver.findElements(webdriver.By.css(resultListPattern.replace("_machineNumber_", state.machine)));
        resultsList.then(function (resultList) {
            resultList.forEach(function (result, resListIndex) {
                var resultColumns = result.findElements(webdriver.By.css('.tdReels > div'))
                resultColumns.then(function (resultColumns) {
                    var winResultRow = [];
                    resultColumns.forEach(function (resultColumn, index) {
                        resultColumn.getAttribute("class").then(function (attribute) {
                            var res = /prize.*/.exec(attribute);
                            winResultRow.push(res ? res[0] : null);
                            if (index === resultColumns.length - 1)
                                state.winResultsArray.push(winResultRow);
                        });
                    })
                })
            })
        });
    };

    this.isExpectedWon = function () {
        var isExpectedWon = false;
        var self = this;
        state.winResultsArray.forEach(function (winResultRow, index) {
            if (!isExpectedWon) {
                isExpectedWon = winResultRow[0].indexOf(state.actualResultRow[0]) > -1
                    && winResultRow[1].indexOf(state.actualResultRow[1]) > -1
                    && winResultRow[2].indexOf(state.actualResultRow[2]) > -1;
                if (isExpectedWon)
                    state.winIndex = index;
            }
        });

        state.isExpectedWon = isExpectedWon;

        return isExpectedWon;
    };

    this.isActualWon = function () {
        slotsOuterContainer.getAttribute("class").then(function (classAttr) {
            state.isActualWon = classAttr === 'won';
        })
    };

    this.getWinAmount = function () {
        if (state.winIndex > -1) {
            console.log(winElPattern.replace("_machineNumber_", state.machine).replace("_winIndex_", state.winIndex));
            var winAmountEl = driver.findElement(webdriver.By.css(winElPattern.replace("_machineNumber_", state.machine).replace("_winIndex_", state.winIndex)));
            winAmountEl.getText().then(function (text) {
                console.log(text);
                state.winAmount = text;
            });
        }
    };

    this.checkSpinResult = function () {
        var flow = webdriver.promise.controlFlow();
        flow.execute(this.getActualRow);
        flow.execute(this.getWinResultsArray);
        flow.execute(this.isExpectedWon);
        flow.execute(this.isActualWon);
        flow.execute(this.getWinAmount)
        flow.execute(function () {
            compareText(state.isExpectedWon, state.isActualWon, "Win result");
        })

    };

    this.checkOverviewButtonRedirect = function(){
        overviewBitton.getAttribute('href').then(function(href){
            compareText(href , url + '#overview', 'Compare Overwiew button redirection');
        })
    }

    this.checkTestimonalsButtonRedirect = function(){
        testimonals.getAttribute('href').then(function(href){
            compareText(href , url + '#testimonials', 'Compare Testimonals button redirection');
        })
    }

    this.checkBuyNowButtonRedirect = function(){
        buyNow.getAttribute('href').then(function(href){
            compareText(href , url + '#buy_now', 'Compare Buy Now! button redirection');
        })
    }

}

exports.SlotMachinePage = SlotMachinePage;