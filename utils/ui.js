/**
 * utils/ui.js
 */

class ContactDialog {

    constructor(Component, id, msg) {
        this.Component = Component;
        this.id = id || 'zan-dialog-contact';
        this.message = msg || '复制请点击下方联系信息';
    }

    render(){
        return this.Component({
            selector: `#${this.id}`,
            buttonsShowVertical: true,
            message: this.message,
            buttons: [
                {
                    text: '客服微信：SpringPax',
                    type: 'wechat'
                },
                {
                    text: '取消',
                    type: 'cancel'
                }
            ]
        });
    }

    onClick(type) {
        let info = {
            wechat: 'SpringPax',
            cancel: null
        }[type];
        if (info) {
            wx.setClipboardData({
                data: info,
                success: () => {
                    wx.showToast({
                        title: '已拷贝'
                    });
                }
            });
        }
    }

    build(){
        return new Promise((resolve) => {
            this.render().then((res)=>{
                this.onClick(res.type);
                resolve(res);
            });
        });
    }
}

function ui(Component) {
    return {
        showContact() {
            return new ContactDialog(Component).build();
        }
    };
}

module.exports = ui;
