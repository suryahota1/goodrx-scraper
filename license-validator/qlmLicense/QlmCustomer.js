'use strict';

module.exports = QlmCustomer;

function QlmCustomer(userCompany, userFullName, userEmail) {
	this.userCompany = userCompany;
	this.userFullName = userFullName;
	this.userEmail = userEmail;
}

QlmCustomer.prototype.getUserCompany = function() {
	return this.userCompany;
};

QlmCustomer.prototype.setUserCompany = function(value) {
	this.userCompany = value;
};

QlmCustomer.prototype.getUserFullName = function() {
	return this.userFullName;
};

QlmCustomer.prototype.setUserFullName = function(value) {
	this.userFullName = value;
};

QlmCustomer.prototype.getUserEmail = function() {
	return this.userEmail;
};

QlmCustomer.prototype.setUserEmail = function(value) {
	this.userEmail = value;
};

//export default QlmCustomer;