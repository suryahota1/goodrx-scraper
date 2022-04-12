'use strict';

const { DOMParser } = require ('xmldom');
const { xpath, SignedXml } = require ('xml-crypto');
const getPem = require ('rsa-pem-from-mod-exp');

module.exports = QlmRsaCrypt;


function KeyInfo(publicKey) {
	this.publicKey = publicKey;
}

KeyInfo.prototype.getKeyInfo = function(key, prefix) {
	prefix = prefix ? prefix + ':' : '';
	return `<${prefix}X509Data></${prefix}X509Data>`;
}

// KeyInfo must return the Key in PEM format, not XML containing Base64 Modulus and Exponent.
KeyInfo.prototype.getKey = function(keyInfo) {
	const doc = new DOMParser().parseFromString(this.publicKey);
	const mod = xpath(doc, '//Modulus/text()')[0].toString();
	const exp = xpath(doc, '//Exponent/text()')[0].toString();
	return getPem(mod, exp);
}

function QlmRsaCrypt(publicKey) {
	this.publicKey = publicKey;	
}

QlmRsaCrypt.prototype.getPublicKey = function() {
	return this.publicKey;
};

QlmRsaCrypt.prototype.VerifySignature = function(xmlFragment) {
	let result = false;
	xmlFragment = xmlFragment.replace('</Signature></QuickLicenseManager>', this.getPublicKey() + '</Signature></QuickLicenseManager>');

	let doc = new DOMParser().parseFromString(xmlFragment);
	let signatures = xpath(doc, '/*/*[local-name(.)="Signature" and namespace-uri(.)="http://www.w3.org/2000/09/xmldsig#"]');

	if (signatures.length === 0) 
	{
		console.warn('Verification failed: No Signature was found in the document.');
	} 
	else if (signatures.length > 1) 
	{
		console.warn('Verification failed: More than one signature was found for the document.');
	} 
	else 
	{
		let signature = signatures[0];
		var sig = new SignedXml();

		sig.keyInfoProvider = new KeyInfo(this.publicKey);
		sig.loadSignature(signature);
		result = sig.checkSignature(xmlFragment);
		
		if (!result) {
			console.warn(sig.validationErrors);
		}
	}
	return result;
};

