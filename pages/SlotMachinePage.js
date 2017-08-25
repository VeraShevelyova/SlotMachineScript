
var webdriver = require('selenium-webdriver');
var utils = require('./../helpers/utils.js');
var State = require('./../data/state.js').State;
var clickButton = utils.clickButton;
var assert = require('assert');
var correspondings = { "top: -1114px;": 5, "top: -634px;": 1, "top: -1234px;": 6, "top: -994px;": 4, "top: -874px;": 3, "top: -754px;": 2 };

var SlotMachinePage = function (driver) {

    var state = new State();
    var spinButton = driver.findElement(webdriver.By.id('spinButton'));
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

    this.openPage = function () {
        driver.get('http://slotmachinescript.com/');
    };

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

    this.waitUntilRun = function () {
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

    this.getTotalSpins = function () {
        credits.getText().then(function (text) {
            state.totalSpins = text;
        });
    };

    this.getBet = function () {
        bet.getText().then(function (text) {
            state.bet = text;
        });
    };

    this.getLastWin = function () {
        lastWin.getText().then(function (text) {
            state.lastWin = text;
        });
    };

    this.getDaydayWinnings = function () {
        dayWinnings.getText().then(function (text) {
            state.dayWinnings = text;
        });
    };

    this.getlifetimeWinnings = function () {
        lifetimeWinnings.getText().then(function (text) {
            state.lifetimeWinnings = text;
        });
    };

    this.getCurrentReel = function () {
        slotMachineWrapper.getAttribute("class").then(function (dataReel) {
            state.reel = (/reelSet\d{1}/.exec(dataReel)).toString().replace('reelSet', '');
        })
    }

    this.getCurrentMahcine = function () {
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
        flow.execute(this.getTotalSpins);
        flow.execute(this.getLastWin);
        flow.execute(this.getBet);
        flow.execute(this.getCurrentMahcine);
        flow.execute(this.getWinChartAmountsArray);
        flow.execute(this.getCurrentReel);
        flow.execute(this.getActualRow);
        flow.execute(this.getWinResultsArray);
        flow.execute(function () {
            console.log(state);
        })
    };

    this.compareActualAndExpectedState = function (action, amount) {
        switch (action) {
            case "SpinButtonClick":
                var self = this;
                credits.getText().then(function (currentTotalspins) {
                    var expectedSpins = parseInt(state.totalSpins.toString()) - parseInt(state.bet.toString());
                    assert.equal(expectedSpins, currentTotalspins,
                        "Number of Spins. Expected: " + expectedSpins + " Actual: " + currentTotalspins);
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
                    assert.equal(expectedTotalSpins, currentTotalspins, "Number of Spins. Expected: " + expectedTotalSpins + " Actual: "
                        + currentTotalspins);
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
                        winChartAmountsArray.forEach(function (winAmount, index) {
                            winAmount.getText().then(function (actualAmount) {
                                console.log(actualAmount);
                                var am = parseInt(amount.toString()) > 9 ? 9 : parseInt(amount.toString());
                                var betAm = (parseInt(state.bet.toString()) + am) === 0 ? 1 : (parseInt(state.bet.toString()) + am);
                                var expectedAmount = (state.winChartAmountsArray[index] / parseInt(state.bet.toString())) * betAm;
                                console.log(expectedAmount);
                                console.log(state);
                                assert.equal(actualAmount, expectedAmount, 'Compare win amount. Expected:' + expectedAmount + ' but actual: ' + actualAmount);
                            })
                        })
                    });
                })
                break;
            case "BackgroundRotate":
                possibleBackgrounds.then(function (possibleBackgrounds) {
                    var totalAmountOfRotations = parseInt(state.backGroundIndex.toString()) + parseInt(amount.toString())
                    var numberOfBackgrounds = possibleBackgrounds.length;
                    var expectedIndex = totalAmountOfRotations % numberOfBackgrounds;
                    possibleBackgrounds.forEach(function (possibleBackground, index) {
                        possibleBackground.getAttribute("style").then(function (style) {
                            if (index === expectedIndex)
                                assert.equal(-1, style.indexOf("display: none;"), "Style for visible background")
                            else
                                assert.equal(true, style.indexOf("display: none;") > -1, "Style for not visible background")
                        })
                    })
                });
                break;
            case "Change Icons":
                slotMachineWrapper.getAttribute("class").then(function (dataReel) {
                    var actualReel = parseInt((/reelSet.*/.exec(dataReel)).toString().replace('reelSet', ''));
                    var expectedReel = (parseInt(state.reel.toString()) + parseInt(amount.toString())) % 4;
                    console.log('Compare actual and Expected Reel. Expected: ' + expectedReel + ' Actual: ' + actualReel);
                    assert.equal(expectedReel, actualReel, "Check that icons has changed correctly");
                })



        }
    };

    this.getActualRow = function () {
        var reels = driver.findElements(webdriver.By.xpath("//div[@id='reel1' or @id='reel2' or @id='reel3']"));
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
        var resultsList = driver.findElements(webdriver.By.css('#prizes_list_slotMachine' + state.machine + ' > div'));
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

    this.getWinAmount = function () {
        if (state.winIndex > -1) {
            var winAmountEl = driver.findElement(webdriver.By.css("#prizes_list_slotMachine" + state.machine + " > div:nth-child(" + (state.winIndex + 1) + ") > span"));
            winAmountEl.getText().then(function (text) {
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
            assert.equal(state.isExpectedWon, state.isActualWon,
                'Check win Result. Expected: ' + state.isExpectedWon + ' Actual: ' + state.isActualWon);
        })

    };

    this.isActualWon = function () {
        slotsOuterContainer.getAttribute("class").then(function (classAttr) {
            var res = classAttr === 'won';
            state.isActualWon = res;
        })
    };
}

exports.SlotMachinePage = SlotMachinePage;