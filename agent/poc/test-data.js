export default class TestData {

    constructor() {
        this._testData = {aut_test_name: ''};
    }

    appendTestData(info) {
        let that = this;
        var testObjectFromLocalStorage = JSON.parse(localStorage.getItem('automationTestDetails'));
        that._testData['aut_test_name'] = testObjectFromLocalStorage ? testObjectFromLocalStorage.testMethodName : '';
        Object.keys(that._testData).forEach(function (key) {
            info[key] = that._testData[key];
        });
    }

}
