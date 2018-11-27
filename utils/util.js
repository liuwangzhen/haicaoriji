const moment = require('../libs/moment.js');
const _ = require('../libs/lodash.core.min');
require('../libs/locale/zh-cn.js');
moment.locale('zh-cn.js');

moment.fmt = function(dt){
    if (_.isNumber(dt)){
        return moment.unix(dt).format('YYYY年MM月DD日 HH:00');
    }
    return moment(dt).format('YYYY年MM月DD日 HH:00');
};

function getSysInfo(){
    return new Promise((resolve, reject)=>{
        let cached = wx.getStorageSync('sysinfo');
        if(cached){
            return resolve(cached);
        }
        wx.getSystemInfo({
            success:(res)=>{
                wx.setStorageSync('sysinfo', res);
                resolve(res);
            },
            fail:(err)=>{
                reject(err);
            }
        });
    });
}

function copy(data){
    wx.setClipboardData({
        data: data,
        success: function (res) {
            wx.showToast({
                title: '已拷贝',
            });
        }
    })
}

module.exports = {
    moment,
    getSysInfo,
    copy
};