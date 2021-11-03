import { WS_RECEIVED_MESSAGE } from '../constants/actionTypes';

export default (state = {}, action) => {
    switch (action.type) {
        case WS_RECEIVED_MESSAGE:
            return {
                ...state,
                message: action.message.message,
                product_id: action.message.message.split(";")[0],
                last_consumed_message: ''
            };
        default:
            return state;
    }
};