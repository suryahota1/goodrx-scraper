'use strict';

module.exports = QlmProduct;

function QlmProduct(productID, productName, majorVersion, minorVersion) {
	this.productID = productID;
	this.productName = productName;
	this.majorVersion = majorVersion;
	this.minorVersion = minorVersion;
}

QlmProduct.prototype.getProductID = function() {
	return this.productID;
};

QlmProduct.prototype.setProductID = function(value) {
	this.productID = value;
};

QlmProduct.prototype.getProductName = function() {
	return this.productName;
};

QlmProduct.prototype.setProductName = function(value) {
	this.productName = value;
};

QlmProduct.prototype.getMajorVersion = function() {
	return this.majorVersion;
};

QlmProduct.prototype.setMajorVersion = function(value) {
	this.majorVersion = value;
};

QlmProduct.prototype.getMinorVersion = function() {
	return this.minorVersion;
};

QlmProduct.prototype.setMinorVersion = function(value) {
	this.minorVersion = value;
};

//export default QlmProduct;