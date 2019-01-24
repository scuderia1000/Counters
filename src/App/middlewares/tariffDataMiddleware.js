
export const tariffDataMiddleware = store => next => action => {
    console.log('action:', action)
    const result = next(action)
    console.log('state after action:', store.getState())
    return result
    /*switch (action.type) {
        default: next(action)
    }*/
};