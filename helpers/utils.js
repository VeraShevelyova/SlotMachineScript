var clickButton = function(odjToClick, buttonName){
    odjToClick.click().then(function(){
        console.log('Button ' + buttonName + ' is clicked');
    })
};

exports.clickButton =clickButton;