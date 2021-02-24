/***
 * !!! 旧版本的,新版本的需要需要查看是否需要更改
 */
export enum CART_MODULE_ERRORS {
    // $ 通用
    // 顾客不存在
    CUSTOME_NOT_EXISTS = 'CUSTOME_NOT_EXISTS',
    // 菜品不存在
    DISH_NOT_EXISTS = 'DISH_NOT_EXISTS',
    // $ 全局菜品轮次限制
    // 超过轮次最大点餐数量 
    REACHED_ROUND_MAX_ORDER_COUNT = 'REACHED_ROUND_MAX_ORDER_COUNT',
    // 无法创建超过最大轮次数量的轮次 
    CANNOT_CREATE_MORE_ROUNDS_THAN_MAXIMUM_ROUND = '超过最大回合数',
    // $ 局部菜品数量限制
    // 超过局部菜品最大点餐数量 
    REACHED_DISH_MAX_ORDER_COUNT = '超过最大点餐数量',

    // $ 同类菜品数量限制
    // 超过同类菜品限制数量
    CATEGORY_DISH_LIMIT_COUNT = '超过同类菜品限制数量',
}