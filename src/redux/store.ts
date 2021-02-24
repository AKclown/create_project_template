/***
 * !!! 旧版本的,新版本的需要需要查看是否需要更改
 */
import { createStore, Store as ReduxStore } from 'redux'
import { Reducer } from './reducers';
import { States, Actions } from './type';

const Store: ReduxStore<States, Actions> = createStore(Reducer);
export default Store;
