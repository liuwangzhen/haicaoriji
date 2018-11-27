/**
 * utils/groups.js
 * @author: liunanbing@devpal.pro
 */

class Groups{
    /**
     * @param myGroups list 我参与和创建的拼团
     * @param group object 邀请我加入的拼团
     */
    constructor(myGroups, group){
        this.myGroups = myGroups||[];
        this.group = group;
    }

    rule(){
        return new Promise((resolve)=>{
            wx.cdc.user.self().then((self)=>{
                this.list = this.makeList(self);
                this.isEmpty = this.list.length === 0;
                this.canCreate = this.ifCanCreate(self);
                this.canJoin = this.ifCanJoin(self);
                this.isInvitationSucceed = this.group && this.group.members.length === wx.cdc.settings.MAX_GROUP_MEMBER;
                resolve(this);
            });
        });
    }

    makeList(self){
        let result = this.myGroups;
        if(this.group){
            result= [this.group];
        }
        result.map((item)=>{
            item.gap = wx.cdc.settings.MAX_GROUP_MEMBER - item.members.length;
            /**
             * 严格来说应该拼团成功，gap为0，但发现出现了多3人成团的情况，
             * 这时 gap 为负数。虽然本身为异常，但也不应该再显示参与按钮
             */
            item.isSucceed = item.gap <= 0; 
            item.isIamMember = item.members.some((member)=>{
                return self.id === member;
            });
            item.isIamOwner = item.created_by.id === self.id;
            return item;
        });
        return result;
    }

    /**
     * 如果已经创建了一个团，则不能再创建了。
     */
    ifCanCreate(self){
        let created = this.myGroups.some((group)=>{
            return group.created_by.id === self.id;
        });
        return !created;
    }

    /**
     * 还能加入拼团
     * 1.如果已经加入了两个团，不能
     * 2.已经加入了一个团，不能
     * 3.没有加入任何团，或者自己发起了一个团，能
     */
    ifCanJoin(self){
        if (this.myGroups.length===2){
            return false;
        }
        if(this.myGroups.length===1){
            return this.myGroups[0].created_by.id === self.id;
        }
        return true;
    }

    isWin(winGroups){
        if(winGroups && winGroups.length>0){
            return this.myGroups.some((myGroup)=>{
                return winGroups.some((winGroup)=>{
                    return myGroup.id === winGroup.id;
                });
            });
        }
        return false;
    }
}

module.exports = Groups;