/**
 * utils/poster.js
 * @author: liunanbing@devpal.pro
 */
const WXACode = require('./wxacode.js');
const Downloader = require('./downloader.js');

const BACKGROUND = '../../images/poster_bg.png';
const DEFAULTCOVER = '/images/cover.default.jpg';
const BACKGROUND_WIDTH = 750;
const BACKGROUND_HEIGHT = 1334;
const TOP_MARGIN = 30;
const COVER_HEIGHT = 210;
const WXACODE_SIZE = 130;
const AVATAR_SIZE = 68;

class Poster {

    constructor(page, user, {
        canvasID = 'poster',
        beforeHook,
        afterHook
    } = {}) {
        this.page = page;
        this.canvasID = canvasID;
        this.ctx = wx.createCanvasContext(this.canvasID);
        this.user = user;
        this.beforeHook = beforeHook;
        this.afterHook = afterHook;
    }

    get bonus(){
        return this.page.data.bonus;
    }

    get canvas(){
        return this.page.data.canvas;
    }

    draw(params) {
        this.params = params;
        this.beforeHook && this.beforeHook();
        this._draw();
    }

    _draw(tryTimes=0){
        if(tryTimes > 3){
            this.afterHook && this.afterHook();
            return false;
        }
        tryTimes += 1;
        wx.getSystemInfo({
            success: (res) => {
                const {
                    bgWidth,
                    bgHeight
                } = this.calcDimension(res);
                this.drawBackdrop(bgWidth, bgHeight);
                Promise.all([
                    this.drawAvatar(),
                    this.drawNickname(),
                    this.drawMessage(),
                    this.drawCover().then((height) => {
                        return new Promise((resolve) => {
                            this.drawTitle(height);
                            resolve();
                        });
                    }),
                    this.drawWXACode()
                ]).then(() => {
                    this.ctx.draw(false, () => {
                        this.preview().then(() => {
                            this.afterHook && this.afterHook();
                        }).catch(()=>{
                            setTimeout(() => {
                                this._draw(tryTimes);
                            }, 1000);
                        });
                    });
                }).catch((err) => {
                    console.error(err);
                    setTimeout(()=>{
                        this._draw(tryTimes);
                    },2000);
                });
            }
        });
    }

    drawAvatar() {
        return new Promise((resolve) => {
            this.getAvatar().then((avatar) => {
                const x = this.offsetX(AVATAR_SIZE);
                this.ctx.drawImage(avatar.path, x, TOP_MARGIN, AVATAR_SIZE, AVATAR_SIZE);
                resolve();
            });
        });
    }

    drawNickname(){
        return new Promise((resolve)=>{
            const FONT_SIZE = 14;
            const MAX_WIDTH = 160;
            this.ctx.setFillStyle('white');
            this.ctx.setFontSize(FONT_SIZE);
            this.ctx.setTextAlign('center');
            const Y = AVATAR_SIZE + TOP_MARGIN + FONT_SIZE + 5;
            const WIDTH =  this.textWidth(this.user.nickname);
            const X = this.offsetX(WIDTH) + WIDTH / 2;
            this.ctx.fillText(this.user.nickname, X, Y, MAX_WIDTH);
            resolve();
        });
    }

    drawMessage(){
        return new Promise((resolve) => {
            const FONT_SIZE = 18;
            const MAX_WIDTH = 160;
            const message = '发起了一个抽奖活动';
            this.ctx.setFontSize(FONT_SIZE);
            this.ctx.setTextAlign('center');
            const Y = AVATAR_SIZE + TOP_MARGIN + FONT_SIZE + 27;
            const WIDTH = this.textWidth(message);
            const X = this.offsetX(WIDTH) + WIDTH / 2;
            this.ctx.fillText(message, X, Y, MAX_WIDTH);
            resolve();
        });
    }

    drawTitle(height) {
        return new Promise((resolve) => {
            const FONT_SIZE = 18;
            const X = 30;
            const Y = AVATAR_SIZE + TOP_MARGIN + 105 + height;
            this.ctx.setTextAlign('left');
            this.ctx.setFillStyle('black');
            this.ctx.setFontSize(FONT_SIZE);
            let title = `奖品: ${this.bonus.name.substr(0,14)} x ${this.bonus.quantity*3}`;
            this.ctx.fillText(title, X, Y);
            resolve();
        });
    }
    drawCover() {
        return new Promise((resolve) => {
            this.getCover().then((img) => {
                const MARGIN = 30;
                const Y = AVATAR_SIZE + TOP_MARGIN + 73;
                const width = this.page.data.canvas.width - MARGIN*2;
                const rate = width / img.width;
                const height = Math.min(Math.ceil(img.height * rate), COVER_HEIGHT);
                const path = img.path.startsWith('images') ? '/'+img.path : img.path;
                this.ctx.drawImage(path, 0, 0, img.width, img.height, MARGIN, Y, width, height);
                resolve(height);
            });
        });
    }

    getCover() {
        if(this.bonus.cover){
            return new Downloader(`${this.bonus.cover.path}!/both/600x400`).fetchImage();
        }
        return this.getDefaultCover();   
    }

    getDefaultCover(){
        return new Promise((resolve, reject)=>{
            wx.getImageInfo({
                src: DEFAULTCOVER,
                success: (img) => {
                    resolve(img);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    }

    drawWXACode() {
        return new Promise((resolve, reject) => {
            this.getWXACode().then((img) => {
                const X = this.offsetX(WXACODE_SIZE);
                const Y = this.canvas.height - WXACODE_SIZE - 70;
                this.ctx.drawImage(img.path, X, Y, WXACODE_SIZE, WXACODE_SIZE);
                //this.ctx.moveTo(30, Y - 30);
                //this.ctx.setStrokeStyle('#EEEEEE');
                //this.ctx.lineTo(this.canvas.width - 30, Y - 30);
                //this.ctx.stroke();
                resolve();
            }).catch(err => {
                reject(err);
            });
        });
    }

    getWXACode() {
        let wxacode = new WXACode(`${this.params.wxacode.scene}` ,this.params.wxacode);
        return wxacode.make();
    }

    getAvatar(){
        const url = `${this.user.avatar}!/both/${AVATAR_SIZE}x${AVATAR_SIZE}/roundrect/${AVATAR_SIZE/2}/format/png`;
        return new Downloader(url).fetchImage();
    }

    textWidth(text, maxWidth=160){
        const metrics = this.ctx.measureText(text);
        return metrics.width > maxWidth ? maxWidth : metrics.width;
    }

    offsetX(width){
        return (this.canvas.width - width) / 2;
    }

    calcDimension(res) {
        const bgWidth = res.screenWidth;
        const bgRate = (bgWidth / BACKGROUND_WIDTH).toFixed(3);
        const bgHeight = parseInt(BACKGROUND_HEIGHT * bgRate);
        this.page.setData({
            'canvas.width': bgWidth,
            'canvas.height': bgHeight
        });
        return {
            bgWidth,
            bgHeight
        };
    }

    drawBackdrop(width, height) {
        this.ctx.drawImage(this.params.background || BACKGROUND, 0, 0, width, height);
    }

    saveTempFile() {
        return new Promise((resolve, reject) => {
            const {
                width,
                height
            } = this.page.data.canvas;
            wx.canvasToTempFilePath({
                canvasId: this.canvasID,
                width: width,
                height: height,
                destWidth: width * 2,
                destHeight: height * 2,
                fileType: 'jpg',
                quality: 1,
                success: (res) => {

                    resolve(res.tempFilePath);
                    
                },
                fail: (err)=>{
                    reject(err);
                }
            }, this);
        });
    }

    preview() {
        return new Promise((resolve, reject)=>{
            this.saveTempFile().then((filePath) => {
                wx.previewImage({
                    urls: [filePath]
                });
                resolve();
            }).catch((err)=>{
                reject(err);
            });
        });
    }
}

module.exports = Poster;