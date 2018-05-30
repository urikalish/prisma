export default class AutData {

	constructor() {
		let that = this;
		this._autData = {};
		window.addEventListener('message', function(request) {
			if (request.data.type == 'prism-aut-data')
			{
				let data = request.data.data;
				Object.keys(data).forEach(function(key) {
					that._autData[key] = data[key];
				});
			}
		}, true);
		let s = document.createElement('script');
		s.src = chrome.extension.getURL('prism/prism-web-access.js');
		document.body.appendChild(s);
	}

	appendAutData(info) {
		let that = this;
		Object.keys(that._autData).forEach(function (key) {
			info[key] = that._autData[key];
		});
	}

}
