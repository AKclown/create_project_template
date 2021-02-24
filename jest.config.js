module.exports = {
    transform: {
        '^.+\\.(tsx|js|ts)?$': 'ts-jest',
        ".+\\.(css|styl|less|sass|scss)$": "jest-transform-css"
    },
    // 指定需要进行单元测试的文件匹配规则
    testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[jt]s?(x)"],
    // // 需要忽略的文件匹配规则
    testPathIgnorePatterns: ["node_modules"],
    // // 进行需要网络请求的case中是很关键的
    testURL: 'http://localhost/',
    // 是否收集测试覆盖率，以及覆盖率文件路径 (控制台打印所有文件，也会降低测试的速度)
    collectCoverage: false,
    coverageDirectory: './coverage',
    // 与所有源文件路径匹配的regexp模式字符串数组，匹配的文件将跳过转换
    transformIgnorePatterns: ['<rootDir>/node_modules/'],
    // Automatically clear mock calls and instances between every test
    clearMocks: true,
    // 指示是否应在运行期间报告每个测试
    verbose: false,
    //与所有测试路径匹配的regexp模式字符串数组，跳过匹配的测试
    testPathIgnorePatterns: ['\\\\node_modules\\\\'],
    //将用于测试的测试环境
    testEnvironment: 'jsdom',
    // 在每次测试之前运行一些代码以配置或设置测试环境的模块的路径
    setupFiles: ['<rootDir>/enzyme.config.js'],
    // 模块使用的文件扩展名数组
    moduleFileExtensions: ['js', 'json', 'jsx', 'tsx', 'ts'],
    moduleNameMapper: {
        "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "<rootDir>/__test__/__mocks__/fileMock.js",
        "\\.(css|scss)$": "identity-obj-proxy"
    }
};