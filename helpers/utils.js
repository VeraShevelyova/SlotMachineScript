var assert = require('assert');

var clickButton = function(element, buttonName){
    element.click().then(function(){
        console.log('Button ' + buttonName + ' is clicked');
    })
};

var compareTextOfElement = function(element, expectedText, elementName){
    element.getText().then(function (actualText) {
        console.log("Comparing " + elementName + ". Expected: " + expectedText + ". Actual: " + actualText);
        assert.equal(expectedText, actualText, elementName + " values not match. Expected: " + expectedText + " Actual: " + actualText);
    });
};

var compareText = function(expectedText, actualText, elementName){
    console.log("Comparing " + elementName + ". Expected: " + expectedText + ". Actual: " + actualText);
    assert.equal(expectedText, actualText, elementName + " values not match. Expected: " + expectedText + " Actual: " + actualText);
}

var setText = function (element, object, property) {
    element.getText().then(function (text) {
        object[property] = text;
        console.log(text);
    });
};

String.prototype.toInt = function(){
    return parseInt(this.toString());
}


exports.clickButton =clickButton;
exports.compareText = compareText;
exports.compareTextOfElement = compareTextOfElement;
exports.setText = setText;