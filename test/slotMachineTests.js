var assert = require('assert'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    driver;
var SlotMachinePage = require('./../pages/SlotMachinePage.js').SlotMachinePage;

test.describe('Slot Machine work', function() {

    beforeEach(function() {
         driver = new webdriver.Builder().
         withCapabilities(webdriver.Capabilities.chrome()).
        build();
        driver.get('http://slotmachinescript.com/')
    });

     afterEach(function() {
         driver.quit();
    });

  test.it('Run slot machine once', function() {
    var slotMachinePage = new SlotMachinePage(driver);
    slotMachinePage.rememberState();
    slotMachinePage.clickSpinButton();
    slotMachinePage.compareActualAndExpectedState('SpinButtonClick');
    slotMachinePage.waitUntilRun();
    slotMachinePage.checkSpinResult();
    slotMachinePage.compareActualAndExpectedState('AfterSpinResult');
  });

   test.it('Run slot machine after increasing bets', function() {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.rememberState();
        slotMachinePage.clickBetUpButton();
        slotMachinePage.compareActualAndExpectedState('BetChange', 1);
        slotMachinePage.rememberState();
        slotMachinePage.clickSpinButton();
        slotMachinePage.compareActualAndExpectedState('SpinButtonClick');
        slotMachinePage.waitUntilRun();
        slotMachinePage.checkSpinResult();
        slotMachinePage.compareActualAndExpectedState('AfterSpinResult');
    });

    test.it('Check max of bets', function() {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.rememberState();
        var i = 0;
        while(i<11){
            slotMachinePage.clickBetUpButton();
            i++
        };
        slotMachinePage.compareActualAndExpectedState('BetChange', 11);
    });

    test.it('Check min of bets', function() {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.rememberState();
        slotMachinePage.clickBetDownButton();
        slotMachinePage.compareActualAndExpectedState('BetChange', -1);
    });

    test.it('Check decreasing of bets', function() {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.rememberState();
            var i = 0;
            while(i<5){
                slotMachinePage.clickBetUpButton();
                i++
            };
        slotMachinePage.compareActualAndExpectedState('BetChange', 5);
        slotMachinePage.rememberState();
        var j = 0;
        while(j<3){
            slotMachinePage.clickBetDownButton();
            j++
        };
        slotMachinePage.compareActualAndExpectedState('BetChange', -3);
    });

    test.it('Change background', function() {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.clickChangeBackGroundButton();
    });
});