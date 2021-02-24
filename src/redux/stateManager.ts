/***
 * !!! 旧版本的,新版本的需要需要查看是否需要更改
 */
import _ from 'lodash';
import Store from './store';
import { CachingDataStructure, INIT_STATE, CACHING_KEY } from './type';

export class StateManager {

    /**
     * try to get state with path by `Store.getState()`, if value is undefined or null,
     * return the state in `InitState`
     * @param path
     */
    public static get<T = any>(path: keyof CachingDataStructure | string[] | string): T {
        try {
            return _.get(Store.getState(), path);
        } catch (error) {
            return _.get(INIT_STATE, path);
        }
    }

    /**
     * get value from cache
     * @param path
     */
    public static getFromCache<T = any>(path: keyof CachingDataStructure | string[] | string): T {
        try {
            let cache: any = localStorage.getItem(CACHING_KEY);
            cache = JSON.parse(cache);

            let result = _.get(cache, path);
            // 如果发现缓冲中没有对应的值，则从默认配置中获取
            if (typeof result !== 'undefined') return result;
            else return _.get(INIT_STATE, path);

        } catch (error) {
            return _.get(INIT_STATE, path);
        }
    }

}