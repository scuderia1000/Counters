import { ALERT } from '../constants/ActionConst';

export const showAlert = ({message, title, okAction, ids = []}) => {
    return (dispatch, getState) => {
        dispatch({
            type: ALERT.SHOW,
            payload: {
                message: message,
                title: title,
                okAction: okAction,
                ids: ids
            }
        });
    }
};