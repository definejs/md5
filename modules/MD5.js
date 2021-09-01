
const fs = require('fs');
const crypto = require('crypto');       //node 的内置模块。


module.exports = exports = {
    /**
    * 计算指定内容的 MD5 值。
    * @param {string} content 要计算的字符串内容。 
        如果传入的不是字符串，则会转成 JSON 字符串再进行计算。
    * @param {number} len 要对计算结果即 MD5 值进行截取的长度。
        当不指定时，则全部返回(32 位)。
    * @return {string} 返回一个 32 位(或指定长度)的 MD5 字符串。
    */
    get(content, len) {
        if (typeof content != 'string') {
            content = JSON.stringify(content) || '';
        }

        let md5 = crypto.createHash('md5');
        md5 = md5.update(content).digest('hex');

        if (typeof len == 'number') {
            md5 = md5.slice(0, len);
        }

        md5 = md5.toUpperCase();

        return md5;
    },

    /**
    * 读取指定文件的内容并计算 MD5 值。
    * 已重载 read(file); //使用同步的方式读取文件并计算文件的 md5。 默认为 `utf8` 编码。
    * 已重载 read(file, fn); //使用异步的方式读取文件并计算文件的 md5。 默认为 `utf8` 编码。
    * 已重载 read(file, encoding, fn); //使用指定编码的异步方式读取文件并计算文件的 md5。
    */
    read(file, encoding, fn) {
        //重载 read(file, fn);
        if (typeof encoding == 'function') {
            fn = encoding;
            encoding = 'utf8';
        }

        let hash = crypto.createHash('md5');

        //同步模式。
        //适用于小文件。 
        //如果用于大文件，性能会降低，请改用异步模式。
        if (!fn) {
            let buffer = fs.readFileSync(file);
            hash.update(buffer, encoding);

            let md5 = hash.digest('hex');
            return md5;
            
        }
        
        //异步模式，适用于大文件。
        let stream = fs.createReadStream(file);

        stream.on('data', chunk => {
            hash.update(chunk, encoding);
        });

        stream.on('end', () => {
            let md5 = hash.digest('hex');
            fn(md5);
        });


    },

}