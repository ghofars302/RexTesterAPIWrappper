/*
* Created by Monodoxy / github.com/ghofars302
* API Wrapper for rextester.com in node.js
* Node-fetch require for this module.
*/

const fetch = require('node-fetch');
const api = require('./api.json');

const RexTester = function (code, options) {
    if (!RexTester.Promise) {
        throw new Error('Native promise is missing, you can set it by do RexTester.Promise = (Your Promise)');
    }
    
    if (!options) options = { language: 'nodejs' };
    
    const fetchOptions = {
        "method": "POST",
        "qs": {
            "LanguageChoice": Object.keys(api).includes(options.language.toLowerCase()) ? api[options.language.toLowerCase()] : null,
            "Program": typeof code === 'string' || code.length > 0 ? code : ''
        }
    }
   
    if (options.args) fetchOptions.qs['CompilerArgs'] = options.args
    
    return new RexTester.Promise(async (resolve, reject) => {
        let body;
        try {
            body = await fetch('http://rextester.com/rundotnet/api', fetchOptions);
        } catch (error) {
            reject(error)
        }
        
        const json = await body.json();
        
        resolve({ status: json.Errors ? "error" : "ok", result: json.Errors ? json.Errors : json.Result })
    })
}

RexTester.Promise = Promise;

module.exports = RexTester;
