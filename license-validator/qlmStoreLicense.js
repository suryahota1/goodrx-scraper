var fs = require ('fs');
var licenseFile = "./BotLicenseFile.xml";
var licenseKeys = "./BotLicenseKeys.xml";

  // Store the license file
  exports.storeLicenseFile = function(activatedLicenseFile) {

    fs.writeFileSync (licenseFile, activatedLicenseFile);

  };


  // Read the license file
  exports.readLicenseFile = function () { 

    if (fs.existsSync (licenseFile))
    {
      return fs.readFileSync (licenseFile, 'utf8');
    }
    else
    {
      return "";
    }

  };

  // Store the license file
  exports.storeLicenseKeys = function(activationKey, computerKey) {

    fs.writeFileSync (licenseKeys, activationKey + ';' + computerKey);

  };


  // Read the license file
  exports.readLicenseKeys = function() { 

    if (fs.existsSync (licenseKeys))
    {
      return fs.readFileSync (licenseKeys, 'utf8');
    }
    else
    {
      return "";
    }

  };
  