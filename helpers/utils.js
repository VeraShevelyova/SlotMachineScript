var assert = require('assert');

var clickButton = function(element, buttonName){
    element.click().then(function(){
        console.log('Button ' + buttonName + ' is clicked');
    })
};

var compareText = function(element, expectedText, elementName){
    element.getText().then(function (actualText) {
        assert.equal(expectedText, actualText, elementName + " values not match. Expected: " + expectedText + " Actual: " + actualText);
    });
};

var setText = function (element, object, property) {
    element.getText().then(function (text) {
        object[property] = text;
        console.log(text);
    });
};

exports.clickButton =clickButton;
exports.compareText = compareText;
exports.setText = setText;