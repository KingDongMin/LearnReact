// [ 웹팩으로 프로젝트를 빌드하는 스크립트 ]

process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';

process.on('unhandledRejection',err=>{throw err;});

require('../config/env');
const fs = require('fs-extra');
const webpack = require('webpack');
const config = require('../config/webpack.config.server');
const paths = require('../config/paths');

function build(){
    console.log('Creating server build...');
    fs.emptyDirSync(paths.ssrBuild);
    let compiler = webpack(config);
    return new Promise((resolve, reject)=>{
        compiler.run((err,stats)=>{
            if(err){
                console.log(err);
                return;
            }
            console.log(stats.toString());
        });
    });
}

build();

/**
 * 코딩 후 빌드 확인 명령어
 * node scripts/build.server.js
 */