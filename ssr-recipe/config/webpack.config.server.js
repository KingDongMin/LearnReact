/**
 * [ 웹팩 환경 설정 파일 ]
 * - 빌드시 어떤 파일들이 필요한지 여기에 명시
 * 
 */

const paths = require('./paths');
const getCSSModuleLocalIdent = require('react-dev-utils/getCSSModuleLocalIdent');
const nodeExternals = require('webpack-node-externals');// node-modules를 제외하고 번들링하기 위한 라이브러리
const webpack = require('webpack');
const getClientEnvironment = require('./env');

const cssRegex = /\.css$/;
const cssModuleRegex = /\.module\.css$/;
const sassRegex = /\.(scss|sass)/;
const sassModuleRegex = /\.module\.(scss|sass)$/;

const env = getClientEnvironment(paths.publicUrlOrPath.slice(0,-1));

module.exports = {
    mode : 'production', // 프로덕션 모드 : 최적화 옵션 활성화
    entry: paths.ssrIndexJs, // 엔트리 경로
    target : 'node', // node환경 설정
    output:{
        path: paths.ssrBuild, //빌드 경로
        filename: 'server.js', // 빌드 파일 이름
        chunkFilename : 'js/[name].chunk.js', // 청크 파일 이름
        publicPath:paths.publicUrlOrPath, // 정적 파일이 제공될 경로
    },
    // 여기까지 기본 설정, 그 다음은 로더 설정
    // 로더 : 빌드를 하기위해 파일 불러올때 파일 확장자에 따라 다른 빌드 작업을 해주는 것
    module:{
        rules:[
            {
                oneOf:[
                    // js 처리?
                    // 기존 webpack.config.js참고
                    {
                        test: /\.(js|mjs|jsx|ts|tsx)$/,
                        include: paths.appSrc,
                        loader: require.resolve('babel-loader'),
                        options: {
                            customize: require.resolve(
                                'babel-preset-react-app/webpack-overrides'
                            ),
                            presets: [
                                [
                                    require.resolve('babel-preset-react-app'),
                                    {
                                        runtime:'automatic',
                                    },
                                ],
                            ],
                            plugins: [
                                [
                                    require.resolve('babel-plugin-named-asset-import'),
                                    {
                                        loaderMap:{
                                            svg:{
                                                ReactComponent:
                                                '@svgr/webpack?-svgo,+titleProp,+ref![path]',
                                            },
                                        },
                                    },
                                ],  
                            ],
                            caheDirectory:true,
                            caheCompression:false,
                            compact:false,
                        },
                    },
                    // CSS를 위한 처리
                    {
                        test : cssRegex,
                        exclude:cssModuleRegex,
                        // exportOnlyLocals : true옵션을 설정해야 실제 css파일을 생성하지 않음
                        loader:require.resolve('css-loader'),
                        options : {
                            importLoaders:1,
                            modules:{
                                exportOnlyLocals:true,
                            },
                        },
                    },
                    // CSS Module을 위한 처리
                    {
                        test: cssModuleRegex,
                        loader : require.resolve('css-loader'),
                        options:{
                            importLoaders : 1,
                            modules:{
                                exportOnlyLocals:true,
                                getLocalIdent: getCSSModuleLocalIdent,

                            },
                        },
                    },
                    //Sass를 위한 처리
                    {
                        test:sassRegex,
                        exclude: sassModuleRegex,
                        use:[
                            {
                                loader:require.resolve('css-loader'),
                                options:{
                                    importLoaders:3,
                                    modules:{
                                        exportOnlyLocals:true,
                                    },
                                },
                            },
                            require.resolve('sass-loader')
                        ],
                    },
                    // Sass + CSS Module을 위한 처리
                    {
                        test:sassRegex,
                        exclude: sassModuleRegex,
                        use : [
                            {
                                loader:requrie.resolve('css-loader'),
                                options:{
                                    importLoaders:3,
                                    modules:{
                                        exportOnlyLocals:true,
                                        getLocalIdent:getCSSModuleLocalIdent,
                                    },
                                },
                            },
                            require.resovle('sass-loader'),
                        ],
                    },
                    // url-loader를 위한 설정
                    {
                        test:[/\.bmp$/,/\.gif$/,/\.jpe?g$/,/\.png$/],
                        loader:require.resolve('resolve-url-loader'),
                        options:{
                            emitFile:false, // 파일을 따로 저장하지 않는 옵션
                            limit:10000, // 원래는 9.76KB 넘어가면 파일로 저장하는데 
                            // emitFile 값이 false일땐 경로만 준비하고 파일은 저장하지 않는다.
                            name:'static/media/[name].[hash:8].[ext]',
                        },
                    },
                    // 위에서 설정된 확장자를 제외한 파일들은 file-loader를 사용
                    {
                        loader: require.resolve('file-loader'),
                        exclude:[/\.(js|mjs|jsx|ts|tsx)$/,/\.html$/,/\.json$/],
                        options : {
                            emitFile:false,
                            name :'static/media/[name].[hash:8].[ext]'
                        }
                    }
                ],
            },
        ],
    },
    // node_modules 내부의 라이브러리를 불러오는 거
    // 이것이 import로 react같은 라이브러리 불러올때 여기서 찾아 사용
    // 라이브러리는 빌드할 때 결과물(번들)파일 안에 번들링됨
    // 왜 이렇게 할까? 이렇게 하면 브라우저가 서버 안에 있는 react라이브러리를 가져다 사용하지 않아도 됨?
    // 아마 자주 사용하는 라이브러리는 브라우저에 두는 건가?
    // 즉, node_modules를 통해서 브라우저가 라이브러리를 불러와 사용한다?
    // 그리고 최종 번들링은 여기 node_modules에서 불러오는 라이브러리를 제외한다.
    // 이때 webpack-node-externals 라이브러리를 사용해야 한다.
    resolve : {
        modules : ['node_modules']
    },
    externals:[
        nodeExternals({
            allowlist:[/@babel/],
        }),
    ],
    plugins : [
        new webpack.DefinePlugin(env.stringified), // 환경변수 주입
    ]

};