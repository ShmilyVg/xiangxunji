import Network from "./network/libs/network";

export default class Protocol {

    static getAccountInfo() {
        return Network.request({url: 'account/info'});
    }
}


