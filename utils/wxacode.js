/**
 * utils/wxacode.js
 * @author: liunanbing@devpal.pro
 */
const CODE_TYPE = 'wxacodeunlimit';
const FILE_CATEGORY ='bonus_wxacode';

class WXACode{

    constructor(cacheKey, params){
        this.params = params;
        this.cacheKey = cacheKey;
    }   


    create(){
        return new Promise((resolve, reject)=>{
            wx.BaaS.getWXACode(CODE_TYPE, this.params, true, FILE_CATEGORY).then(res => {
                resolve(res.download_url);
            }).catch(err => {
                reject(err);
            });
        });
    }

    save(path){
        return new Promise((resolve, reject)=>{
            wx.saveFile({
                tempFilePath: path,
                success:(res)=>{
                    wx.BaaS.storage.set(this.cacheKey, res.savedFilePath);
                    resolve(res.savedFilePath);
                },
                fail:(err)=>{
                    reject(err);
                }
            });
        });
    }

    download(url){
        return new Promise((resolve, reject)=>{
            wx.downloadFile({
                url: url,
                success: (res) => {
                    if (res.statusCode === 200) {
                        this.save(res.tempFilePath).then((path)=>{
                            resolve(path);
                        });
                    } else {
                        reject(res);
                    }
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    }

    get filepath(){
        return new Promise((resolve)=>{
            const path = wx.BaaS.storage.get(this.cacheKey);
            if (path){
                return resolve(path);
            }
            this.create().then((url)=>{
                this.download(url).then((path)=>{
                    resolve(path);
                });
            });
        });
    }

    make(){
        return new Promise((resolve, reject)=>{
            this.filepath.then((path)=>{
                wx.getImageInfo({
                    src:path,
                    success: (res)=>{
                        resolve(res);
                    },
                    faile: (err)=>{
                        reject(err);
                    }
                });
            });
        });
    }
}

module.exports = WXACode;