var assert = require('assert'),
    test = require('selenium-webdriver/testing'),
    webdriver = require('selenium-webdriver'),
    driver;
var SlotMachinePage = require('./../pages/SlotMachinePage.js').SlotMachinePage;
var url  = require('./../package.json').url;
// actions
var spin_button_click = 'SpinButtonClick';
var received_spin_result = 'ReceivedSpinResult';
var bet_change = 'BetChange';
var background_rotate = 'BackgroundRotate';
var change_icons = 'Change Icons';

test.describe('Slot Machine work', function () {

    beforeEach(function () {
        driver = new webdriver.Builder().
            withCapabilities(webdriver.Capabilities.chrome()).
            build();
        driver.get(url)
    });

    afterEach(function () {
        driver.quit();
    });

    test.it('Run slot machine once', function () {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.rememberState();
        slotMachinePage.clickSpinButton();
        slotMachinePage.compareStateAfterAction(spin_button_click);
        slotMachinePage.rememberState();
        slotMachinePage.waitUntilSpinRun();
        slotMachinePage.checkSpinResult();
        slotMachinePage.compareStateAfterAction(received_spin_result);
    });

    test.it('Run slot machine after increasing bets', function () {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.rememberState();
        slotMachinePage.clickBetUpButton();
        slotMachinePage.compareStateAfterAction(bet_change, 1);
        slotMachinePage.rememberState();
        slotMachinePage.clickSpinButton();
        slotMachinePage.compareStateAfterAction(spin_button_click);
        slotMachinePage.rememberState();
        slotMachinePage.waitUntilSpinRun();
        slotMachinePage.checkSpinResult();
        slotMachinePage.compareStateAfterAction(received_spin_result);
    });

    test.it('Check max of bets', function () {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.rememberState();
        var i = 0;
        while (i < 11) {
            slotMachinePage.clickBetUpButton();
            i++
        };
        slotMachinePage.compareStateAfterAction(bet_change, 11);
    });

    test.it('Check min of bets', function () {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.rememberState();
        slotMachinePage.clickBetDownButton();
        slotMachinePage.compareStateAfterAction(bet_change, -1);
    });

    test.it('Check decreasing of bets', function () {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.rememberState();
        var i = 0;
        while (i < 5) {
            slotMachinePage.clickBetUpButton();
            i++
        };
        slotMachinePage.compareStateAfterAction(bet_change, 5);
        slotMachinePage.rememberState();
        var j = 0;
        while (j < 3) {
            slotMachinePage.clickBetDownButton();
            j++
        };
        slotMachinePage.compareStateAfterAction(bet_change, -3);
    });

    test.it('Change background', function () {
        var slotMachinePage = new SlotMachinePage(driver);
        var flow = webdriver.promise.controlFlow();
            flow.execute(slotMachinePage.clickChangeBackGroundButton);
            flow.execute(slotMachinePage.waitBackgroundRotate);
            flow.execute(function () {
                slotMachinePage.compareStateAfterAction(background_rotate, 1);
            })
    });

    test.it('Change icons', function () {
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.rememberState();
        var i = 1;
        while(i<5){
            slotMachinePage.clickChangeIconsButton();
            slotMachinePage.compareStateAfterAction(change_icons, i);
            i++;
        }
    });

    test.it('Run tests under different machines', function () {
        var slotMachinePage = new SlotMachinePage(driver);
        var i = 0;
        while (i < 5) {
            slotMachinePage.rememberState();
            slotMachinePage.clickChangeBackGroundButton();
            slotMachinePage.clickChangeMachineButton();
            slotMachinePage.waitUntilSlotMachineChanges();
            slotMachinePage.rememberState();
            slotMachinePage.clickSpinButton();
            slotMachinePage.compareStateAfterAction(spin_button_click);
            slotMachinePage.rememberState();
            slotMachinePage.waitUntilSpinRun();
            slotMachinePage.checkSpinResult();
            slotMachinePage.compareStateAfterAction(received_spin_result);
            i++;
        }
    });

    test.it('Check Overview link redirects to the text', function(){
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.checkOverviewButtonRedirect();
    })

    test.it('Check Testimonials link redirects to the text', function(){
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.checkTestimonalsButtonRedirect();
    })

    test.it('Check Buy Now link redirects to the text', function(){
        var slotMachinePage = new SlotMachinePage(driver);
        slotMachinePage.checkBuyNowButtonRedirect();
    })
});