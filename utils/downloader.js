/**
 * utils/downloader.js
 * @author: liunanbing@devpal.pro
 */

class Downloader{

    constructor(url){
        this.url = url;
    }

    fetchFile(){
        return new Promise((resolve, reject)=>{
            wx.downloadFile({
                url: this.url,
                success: (res) => {
                    if (res.statusCode === 200) {
                        resolve(res.tempFilePath);
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

    fetchImage(){
        return new Promise((resolve, reject)=>{
            this.fetchFile().then((path)=>{
                wx.getImageInfo({
                    src: path,
                    success: (img) => {
                        resolve(img);
                    },
                    fail:(err)=>{
                        reject(err);
                    }
                });
            });
        });
    }
}

module.exports = Downloader;