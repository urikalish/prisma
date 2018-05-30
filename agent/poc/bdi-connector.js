export default class BdiConnector {

	constructor() {
		this._contextTypes = {
			'DATA': 'prod_internal',
//			'DATA_NTH': 'prod_internal_nth',
			'ERROR': 'errors'
//			'ERROR_NTH': 'errors_nth'
		};
	}

	get contextTypes() { return this._contextTypes; }

	sendDataToBdi(data, context) {
		data.context = context;
		let img = document.createElement('img');
		img.src = 'https://prism.hpe-bdi.net/rest-service/api/browser_eventX/data-in?json_data=' + encodeURIComponent(JSON.stringify(data));
	}
	
}