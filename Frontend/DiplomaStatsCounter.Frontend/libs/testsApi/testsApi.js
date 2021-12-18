class TestsApiClass {
    async registerTest(name, func) {
        var key="Test_"+name;
        window[key]=func;
    }
}

var TestsApi=new TestsApiClass();

export default TestsApi;