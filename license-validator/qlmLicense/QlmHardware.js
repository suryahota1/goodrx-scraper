const os = require('os')
//const mac = require('macaddress');

var hw_getComputerName =  function  ()
{    
    return os.hostname ();
};

module.exports.hw_getComputerName = hw_getComputerName;