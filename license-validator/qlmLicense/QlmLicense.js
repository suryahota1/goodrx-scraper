//'use strict';

const http = require ('http');
var DOMParser = require('xmldom').DOMParser;

const QlmRsaCrypt = require ('./QlmRsaCrypt');
const QlmCustomer = require('./QlmCustomer')
const QlmProduct = require ('./QlmProduct');
const fetch = require('node-fetch');

var  EnumLicenseStatus = 
{
	EKeyNotFound : 0,
	EKeyPermanent : 2,
	EKeyDemo : 4,
	EKeyInvalid : 8,
	EKeyProductInvalid : 16,
	EKeyVersionInvalid : 32,
	EKeyExpired : 64,
	EKeyTampered : 128,
	EKeyMachineInvalid : 256,
	EKeyNeedsActivation : 512,
	EKeyExceededAllowedInstances : 1024,
	EKeyRevoked : 2048
};

//var productID;
//var productName;
//var majorVersion;
//var minorVersion;
//var publicKey;


//import http from 'http';
//import { DOMParser } from 'xmldom';
//import { licensingServer } from '../licensingServer';
//import QlmRsaCrypt from './QlmRsaCrypt';
//import QlmCustomer from './QlmCustomer';
//import QlmProduct from './QlmProduct';

module.exports = QlmLicense;



function QlmLicense() {
	
	//this.licenseFile;
	//this.result;
	//this.features;
	//this.duration;
	this.remainingDays = -1;
	//this.expiryDate;
	//this.status;
	this.rsaCrypt = null;
	//this.customer;
	//this.product;
	this.qlmResult = new QlmResult();
	//this.activationKey;
	//this.computerKey;
	//this.computerID;
	this.response = '';

	this.productID = 0;
	this.productName = "Demo";
	this.majorVersion = 1;
	this.minorVersion = 0;
	this.publicKey = "";
}

QlmLicense.prototype.DefineProduct = function (_productID, _productName, _majorVersion, _minorVersion, _publicKey)
{
	this.productID = _productID;
	this.productName = _productName;
	this.majorVersion = _majorVersion;
	this.minorVersion = _minorVersion;
	this.publicKey = _publicKey;
}



QlmLicense.prototype.ValidateLicense = function(licenseData, computerID) {
	if (licenseData) 
	{
		if (this.VerifySignature(licenseData)) 
		{
			this.ProcessResponseforActivation(licenseData, computerID);
		} else 
		{
			this.setStatus(EnumLicenseStatus.EKeyInvalid);
			this.setResult('Failed to validate the signature of the license data.');
		}
	} else 
	{
		this.setStatus(EnumLicenseStatus.EKeyInvalid);
		this.setResult('No license data was found on your system.');	
	}
};


QlmLicense.prototype.ActivateLicense = function(url, _activationKey, pckey, computerID, checkIfCanSave, callback) 
{
	let status = false;
	_activationKey = _activationKey.replace(/-/g, '');
	_activationKey = _activationKey.trim();
	

	this.GetServiceResponse(url, _activationKey, pckey, computerID, (err, xmlResponse) => {
		// console.log("GetServiceResponse err===========", err);
		if (!err) {
			
			// console.log("GetServiceResponse xmlResponse===============", xmlResponse);
			// console.log("GetServiceResponse computerID===============", computerID);

			if (this.ProcessResponseforActivation(xmlResponse, computerID)) {
				status = true;
				callback(this.getResult(), status, xmlResponse);			
				
				
			} else {
				callback(this.getResult(), status, xmlResponse);
				return;
			}
		} else {
			callback(null, null, null);
		}	
	});
};

QlmLicense.prototype.DeactivateLicense = function(url, _activationKey, computerID, vendor, user, pwd, callback) 
{
	let status = false;
	_activationKey = _activationKey.replace(/-/g, '');
	_activationKey = _activationKey.trim();
	

	this.GetReleaseResponse(url, _activationKey, computerID, vendor, user, pwd, (err, xmlResponse) => {
		if (!err) {
			if (this.ProcessResponseForDeactivation(xmlResponse, computerID)) {
				status = true;
				callback(this.getResult(), status, xmlResponse);			
				
				
			} else {
				callback(this.getResult(), status, xmlResponse);
				return;
			}
		}		
	});
};

QlmLicense.prototype.IsKeyValid = function(_status) {
	let ret = true;
	let invalidKeys = [	EnumLicenseStatus.EKeyInvalid, 
						EnumLicenseStatus.EKeyProductInvalid, 
						EnumLicenseStatus.EKeyVersionInvalid, 
						EnumLicenseStatus.EKeyMachineInvalid, 
						EnumLicenseStatus.EKeyTampered];

	invalidKeys.forEach(key => {
		if (this.IsTrue(_status,key)) {
			ret = false;
		}
	});
	return ret;
};

QlmLicense.prototype.countDaysBetween = function(date1, date2) {
	if (date2 - date1 < 0) {
		this.result = 'This license key expired.';
		console.warn('The end date must be later than the start date');
		//RETURNED -1
		return -1;
	} else {
		let start = new Date(date1);
		start.setHours(0);
		start.setMinutes(0);
		start.setSeconds(0);
		start.setMilliseconds(0);
		let end = new Date(date2);
		end.setHours(0);
		end.setMinutes(0);
		end.setSeconds(0);
		end.setMilliseconds(0);

		return (((end - start) / (1000 * 60 * 60 * 24)) + 1);
	}
};

QlmLicense.prototype.IsLicenseValid = function(computerID) {
	let ret = false;
	let _status = this.getStatus();

	if (!this.IsKeyValid(_status)) {
		ret = false;
	} else if (computerID !== this.computerID) {
		this.setStatus(EnumLicenseStatus.EKeyMachineInvalid);
		ret = false;
	} else if (this.IsTrue(_status, EnumLicenseStatus.EKeyPermanent)) {
		ret = true;
	} else if (this.IsTrue(_status, EnumLicenseStatus.EKeyDemo)) {
		let today = new Date();
		this.remainingDays = this.countDaysBetween(today, this.expiryDate);
		if (this.remainingDays > 0) {
			ret = true;
		} else {
			ret = false;
		}
	}

	return ret;
};

QlmLicense.prototype.IsFeatureEnabled = function(featureSet, featureID) {
	let enabled = false;

	if (this.features && (this.features[featureSet] & featureID) === featureID){
		enabled = true;
	}

	return enabled;
};

QlmLicense.prototype.getPublicKey = function() {
	return this.publicKey;
};

QlmLicense.prototype.setPublicKey = function(value) {
	this.publicKey = value;
};

QlmLicense.prototype.validationResult = function() {
	return this.qlmResult;
};

QlmLicense.prototype.getResult = function() {
	return this.result;
};

QlmLicense.prototype.setResult = function(value) {
	this.result = value;
};

QlmLicense.prototype.getStatus = function() {
	return this.status;
};

QlmLicense.prototype.setStatus = function(value) {
	this.status = value;
};

QlmLicense.prototype.getComputerKey = function() {
	return this.computerKey;
};

QlmLicense.prototype.setComputerKey = function(value) {
	this.computerKey = value;
};

QlmLicense.prototype.getComputerID = function() {
	return this.computerID;
};

QlmLicense.prototype.setComputerID = function(value) {
	this.computerID = value;
};

QlmLicense.prototype.getActivationKey = function() {
	return this.activationKey;
};

QlmLicense.prototype.setActivationKey = function(value) {
	this.activationKey = value;
};

QlmLicense.prototype.getFeatures = function() {
	return this.features;
};

QlmLicense.prototype.setFeatures = function(value) {
	this.features = value;
};

QlmLicense.prototype.getDuration = function() {
	return this.duration;
};

QlmLicense.prototype.setDuration = function(value) {
	this.duration = value;
};

QlmLicense.prototype.getExpiryDate = function() {
	return this.expiryDate;
};

QlmLicense.prototype.setExpiryDate = function(value) {
	this.expiryDate = value;
};

QlmLicense.prototype.getCustomer = function() {
	return this.customer;
};

QlmLicense.prototype.setCustomer = function(value) {
	this.customer = value;
};

QlmLicense.prototype.getProduct = function() {
	return this.product;
};

QlmLicense.prototype.setProduct = function(value) {
	this.product = value;
};

QlmLicense.prototype.getRemainingDays = function() {
	return this.remainingDays;
};

QlmLicense.prototype.setRemainingDays = function(value) {
	this.remainingDays = value;
};

QlmLicense.prototype.ProcessResponseforActivation = function(_xmlResponse, computerID) {
	let activationStatus = false;
	
	var parser = new DOMParser();

	var  doc = parser.parseFromString(_xmlResponse, 'text/xml');
	let nodes = doc.getElementsByTagName('QuickLicenseManager');

	this.setStatus(this.GetXmlIntAttribute(nodes, 'status'));

	//var sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	//var x = sdf.parse (this.GetXmlStringAttribute(nodes, 'expiryDate'));

	let _expiryDate = this.GetXmlStringAttribute(nodes, 'expiryDate');

	//CHECK TIME ZONE ?
	this.setExpiryDate(new Date(_expiryDate));

	this.setResult(this.GetXmlStringAttribute(nodes, 'error'));

	if (!this.IsKeyValid(this.getStatus())) 
	{
		this.qlmResult.result = this.getResult();
	} 
	else 
	{
		//this.features USE SET ?
		this.features = this.ConvertFeaturesToArray(this.GetXmlStringAttribute(nodes, 'features'));
		this.setDuration(this.GetXmlIntAttribute(nodes, 'duration'));
		this.setActivationKey(this.GetXmlStringAttribute(nodes, 'activationKey'));
		this.setComputerKey(this.GetXmlStringAttribute(nodes, 'pckey'));
		this.setComputerID(this.GetXmlStringAttribute(nodes, 'computerID'));

		let qlmCustomer = new QlmCustomer();
		qlmCustomer.setUserCompany(this.GetXmlStringAttribute(nodes, 'userCompany'));
		qlmCustomer.setUserFullName(this.GetXmlStringAttribute(nodes, 'userFullName'));
		qlmCustomer.setUserEmail(this.GetXmlStringAttribute(nodes, 'userEmail'));

		let qlmProduct = new QlmProduct();
		qlmProduct.setProductID(this.GetXmlIntAttribute(nodes, 'productID'));
		qlmProduct.setProductName(this.GetXmlStringAttribute(nodes, 'productName'));
		qlmProduct.setMajorVersion(this.GetXmlIntAttribute(nodes, 'majorVersion'));
		qlmProduct.setMinorVersion(this.GetXmlIntAttribute(nodes, 'minorVersion'));

		if (this.getStatus() === EnumLicenseStatus.EKeyPermanent) {
			activationStatus = true;
			this.setResult('Your license was successfully activated.');
		} else {
			let licenseValid = this.IsLicenseValid(computerID);
			if (licenseValid) {
				this.setResult(`Your license expires in ${parseInt(this.remainingDays)} days.`);
				activationStatus = true;
			} else {
				activationStatus = false;
				this.setResult(`Your license has expired on ${this.getExpiryDate()}.`);
				//this.setResult('Your license key expired.');
			}
		}

		this.customer = qlmCustomer;
		this.product = qlmProduct;
	}

	return activationStatus;
};

QlmLicense.prototype.ProcessResponseForDeactivation = function(_xmlResponse, computerID) {
	let deactivationStatus = false;
	
	var parser = new DOMParser();

	var  doc = parser.parseFromString(_xmlResponse, 'text/xml');
	let nodes = doc.getElementsByTagName('QuickLicenseManager');

	this.qlmResult = new QlmResult();

	this.qlmResult.result = this.GetXmlStringAttribute(nodes, 'error');
	
	if (this.qlmResult.result)
	{				
		deactivationStatus = false;
		this.setResult(this.qlmResult.result);
	}
	else
	{
		this.qlmResult = new QlmResult();
		this.qlmResult.result = this.GetXmlStringAttribute(nodes, 'result');
		deactivationStatus = true;
		this.setResult(this.qlmResult.result);
	}
	

	return deactivationStatus;
};

QlmLicense.prototype.GetXmlStringAttribute = function(parentNode, tag) {
	let val = '';
	for (var i = 0; i < parentNode.length; i++) {
		let item = parentNode.item(i);
		//SHOULD USE ELEMENT_NODE CONSTANT INSTEAD OF 1
		if (item.nodeType === 1) {
			if (item.getElementsByTagName(tag).item(0)) {
				val += item.getElementsByTagName(tag).item(0).textContent;
			}
		}
	}
	return val;
};

QlmLicense.prototype.GetXmlIntAttribute = function(parentNode, tag) {
	let val = 0;
	for (var i = 0; i < parentNode.length; i++) {
		let item = parentNode.item(i);
		//SHOULD USE ELEMENT_NODE CONSTANT INSTEAD OF 1
		if (item.nodeType === 1) {
			if (item.getElementsByTagName(tag).item(0)) {
				val += Number(item.getElementsByTagName(tag).item(0).textContent.trim());
			}
		}
	}
	return val;
};

/*
QlmLicense.prototype.SaveSettings = function(response) {
	window.localStorage.setItem('licenseData', response);
};
*/

//ADDED CALLBACK
QlmLicense.prototype.GetServiceResponse = function(url, activationKey, computerKey, deviceId, callback) {

	let args = '';
	//this.setComputerKey(computerKey);
	// console.log("GetServiceResponse url", url);
	// console.log("GetServiceResponse activationKey", activationKey);
	// console.log("GetServiceResponse computerKey", computerKey);
	// console.log("GetServiceResponse deviceId", deviceId);

	if (activationKey) {
		args += 'is_avkey=' + activationKey;
	}

	if (computerKey) {
		args += '&is_pckey=' + computerKey;
	}

	if (deviceId) {
		args += '&is_pcid=' + deviceId;
	}

	if (args) {
		url += '/ValidateLicenseHttp?' + args;
	}

	url += '&is_productid=' + this.productID;	
	url += '&is_majorversion=' + this.majorVersion;
	url += '&is_minorversion=' + this.minorVersion;
	url += '&is_sign=true';

	// console.log("GetServiceResponse url 222222222222222", url);


	fetch(url).then(response => {
		response.text().then(data => {
			// console.log("GetServiceResponse data 222222222222222", data);
			if (!this.VerifySignature(data)) {
				console.warn('The response received from the license server failed signature validation.');
			}
			callback(null, data);
		});
	}).catch(err => {
		console.warn(`Problem with license server request: ${err.message}`);
		callback(err, '');
	});
};



QlmLicense.prototype.VerifySignature = function(xmlFragment) {
	if (this.rsaCrypt === null) 
    {
		this.rsaCrypt = new QlmRsaCrypt(this.publicKey);
	}

	let result = this.rsaCrypt.VerifySignature(xmlFragment);

	if (!result) {
		this.setResult('Failed to validate the signature of the license file.');
		return false;
	}

	return result;
};

QlmLicense.prototype.GetReleaseResponse = function(url, activationKey, deviceId, vendor, user, pwd, callback) {

	let args = '';
	
	if (activationKey) {
		args += 'is_avkey=' + activationKey;
	}
	
	if (deviceId) {
		args += '&is_pcid=' + deviceId;
	}

	if (vendor) {
		args += '&is_vendor=' + vendor;
	}

	if (user) {
		args += '&is_user=' + user;
	}

	if (pwd) {
		args += '&is_pwd=' + pwd;
	}

	if (args) {
		url += '/ReleaseLicenseHttp?' + args;
	}

	fetch(url).then(response => {
		response.text().then(data => {
			
			callback(null, data);
		});
	}).catch(err => {
		console.warn(`Problem with license server request: ${err.message}`);
		callback(err, '');
	});
};

QlmLicense.prototype.ConvertFeaturesToArray = function(featureList) {
	let features = [];
	let sep01 = ',';
	let sep02 =';';
	let sep1 = ':';
	let selectedFeatures1 = featureList.split(sep01);
	let selectedFeatures2 = featureList.split(sep02);

	if (featureList) {
		selectedFeatures1.forEach(feature => {
			let oneFeature = feature.split(sep1);
			let featureSet = Number(oneFeature[0]);
			let featureIdString = oneFeature[1];
			let featureIdArr = featureIdString.split(';');
			let featureID = Number(featureIdArr[0]);
			features[featureSet] |= featureID;
		});

		selectedFeatures2.forEach(feature => {
			let oneFeature = feature.split(sep1);
			let featureSet = Number(oneFeature[0]);
			let featureID = Number(oneFeature[1]);
			features[featureSet] |= featureID;
		});
	}

	return features;
};

QlmLicense.prototype.IsTrue = function(nVal1, nVal2) {
	if (((nVal1 & nVal2) === nVal1) || ((nVal1 & nVal2) === nVal2)) {
		return true;
	}

	return false;
};



function QlmResult() {
	//this.status;
	//this.result;
	//this.expiryDate;
	//this.computerKey;
}

//export default QlmLicense;
