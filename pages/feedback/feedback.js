import Protocol from "../../modules/network/network/libs/protocol";
import {Toast} from "heheda-common-view";

Page({
    data: {},
    async savePic() {
        const {statusCode, tempFilePath} = await Protocol.downloadFile({url: 'https://backend.stage.hipee.cn/hipee-web-hiecg/img/mine_fankui_hipeeerweima.png'});
        if (statusCode === 200) {
            wx.saveImageToPhotosAlbum({
                filePath: tempFilePath,
                success: (res) => {
                    Toast.success('保存成功');
                },
                fail: (res) => {
                    console.log(res)
                    wx.showToast({
                        title: '保存失败',
                        icon: 'fail',
                        duration: 2000
                    })
                }
            })
        }
    }
})
