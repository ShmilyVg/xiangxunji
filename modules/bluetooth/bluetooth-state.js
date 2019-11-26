import {CommonConnectState, CommonProtocolState} from "heheda-bluetooth-state";

const ConnectState = {...CommonConnectState};

const XXJProtocolState = {
    RECEIVE_ALL_STATE: 'receive_all_state',
    ...CommonProtocolState
};

export {
    ConnectState, XXJProtocolState
}
