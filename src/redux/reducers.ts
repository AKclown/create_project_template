/***
 * !!! 旧版本的,新版本的需要需要查看是否需要更改
 */
import { INIT_STATE, States, Actions, CACHING_KEY, CACHING_EMPTY_STRING } from "./type"
import _ from "lodash";

export const Reducer = (state: States = INIT_STATE, action: Actions) => {
    // init
    let newState = _.cloneDeep([state])[0];
    // switch actions
    switch (action.type) {
        case 'SYNCHRONIZE': {
            if (action.direction === 'STATE_TO_CACHING') {
                localStorage.setItem(CACHING_KEY, JSON.stringify(newState));
            }
            if (action.direction === 'CACHING_TO_STATE') {
                const caching = JSON.parse(localStorage.getItem(CACHING_KEY) || CACHING_EMPTY_STRING);
                newState = caching;
            }
            break;
        }
        case 'RESET': {
            _.set(newState, action.path, _.get(INIT_STATE, action.path));
            break;
        }
        case 'RESET_CACHING': {
            _.set(newState, action.path, _.get(INIT_STATE, action.path));
            localStorage.setItem(CACHING_KEY, JSON.stringify(newState));
            break;
        }
        case 'SET': {
            _.set(newState, action.path, _.get(action, 'value'));
            break;
        }
        case 'SET_CACHING': {
            _.set(newState, action.path, _.get(action, 'value'));
            const caching = JSON.parse(localStorage.getItem(CACHING_KEY) || CACHING_EMPTY_STRING);
            _.set(caching, action.path, action.value);
            localStorage.setItem(CACHING_KEY, JSON.stringify(caching));
            break;
        }
        case 'SET_CACHING_AND_STATE': {
            // update state
            _.set(newState, action.path, _.get(action, 'value'));
            // update caching
            const caching = JSON.parse(localStorage.getItem(CACHING_KEY) || CACHING_EMPTY_STRING);
            _.set(caching, action.path, action.value);
            localStorage.setItem(CACHING_KEY, JSON.stringify(caching));
            break;
        }
        default: { break; }
    }
    // return
    return newState;
}