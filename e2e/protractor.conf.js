const { SpecReporter } = require('jasmine-spec-reporter');

exports.config = {
    SELENIUM_PROMISE_MANAGER: false,
    chromeDriver: require('chromedriver').path,
    directConnect: true,
    baseUrl: 'http://localhost:8100/',
    specs: ['./src/**/*.e2e-spec.ts'],
    capabilities: {
        browserName: 'chrome',
        chromeOptions: { args: ['--headless=new', '--disable-gpu'] }
    },
    framework: 'jasmine',
    jasmineNodeOpts: { showColors: true, defaultTimeoutInterval: 90000 },
    onPrepare() {
        require('ts-node').register({ project: require('path').join(__dirname, 'tsconfig.json') });
        jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: 'none' } }));
    }
};