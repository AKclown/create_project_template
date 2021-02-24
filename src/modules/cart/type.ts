/***
 * !!! 旧版本的,新版本的需要需要查看是否需要更改
 */
import { RequiredSome, Condiment, MenuDish } from "../../constants/type.constant";

// *********************
// Default
// *********************

export type MinimizeDish = RequiredSome<MenuDish,
    // 基础信息
    'item_id' | 'price_1' | 'condiments' |
    // 关于轮次规则的限制
    'not_joining_global_limit' |
    // 关于局部菜品规则的限制
    'rule_lnr_enable' | 'rule_lnr_limit_enable' | 'rule_lnr_limit_price' | 'rule_lnr_max_num'
> & {
    remarks: string;
};

export type MinimizeCondiment = RequiredSome<Condiment, 'item_id' | 'item_name1' | 'price_1' | 'free'>;

// *********************
// Module Type
// *********************

/**
 * 购物车元数据结构
 */
export type CartMetaData = {
    [round_name: number]: RoundCustomerMetaData;
};

/**
 * 购物车轮次数据结构
 */
export type RoundCustomerMetaData = {
    [cutomer_name: string]: Array<CartDish>;
}

/**
 * 从接口返回的历史记录的菜品数量
 */
export type HistoryDishNumMetaData = {
    [item_id: number]: {
        [round_name: number]: {
            [cutomer_name: string]: number;
        }
    } & {
        'all': {
            [cutomer_name: string]: number;
        } & {
            'total': number;
        }
    };
}
/**
 * 从接口返回的历史记录的菜品规则
 */
export type HistoryDishRulesMetaData = {
    [item_id: number]: {
        not_joining_global_limit: number
        rule_lnr_enable: number
        rule_lnr_max_num: number
        rule_lnr_max_num_with_customer: number
        rule_lnr_limit_enable: number
        rule_lnr_limit_price: number
    }
}
/**
 * 历史同类点餐数量
 */
export type HistoryCategoryDishLimit = {
    [cutomer_name: number]: {
        [dmi_slu_id: number]: number
    }
}
/**
 * 购物车菜品数据结构
 * 
 * 注意：此数据为
 */
export type CartDish = {
    // meta data
    _id: string;
    _origin: Partial<MinimizeDish>;
    // basic
    count: number;
    price: number;
    totalPrice: number;
    // excess
    excessCount: number;
    excessPrice: number;
    excessTotalPrice: number;
    // condiment
    condiments: Array<MinimizeCondiment>;
    condimentsTotalPrice: number;
    // remarks
    remarks: string;
    // for view fields
    excessPriceAndCondimentsPriceForView: string;
}

/**
 * 同族菜品报告
 */
export type FamilyDishesReport = {
    // 元信息
    _origin: MinimizeDish;
    // 同`_id`菜品
    _iPath: string | null;
    _iTarget: CartDish | null;
    // 次菜品在历史记录中的数量
    historyCount: number;
    // 同`item_id``remarks`的菜品
    irMap: { [round: number]: Array<CartDishDetail> };
    irCount: number;
    irExcessCount: number;
    irTotalPrice: number;
    // 同类点餐数量
    irCategoryDishCount: 0,
    irExcessTotalPrice: number;
    irCondimentsTotalPrice: number;
    // 同`item_id``remarks``condiments`的菜品
    cirMap: { [round: number]: Array<CartDishDetail> };
    cirCount: number;
    cirExcessCount: number;
    cirTotalPrice: number;
    cirExcessTotalPrice: number;
    cirCondimentsTotalPrice: number;
}

/**
 * 菜品分析报告
 */
export type AnalysisReport = {
    // 菜品的占比率
    countPercentage: { [round: number]: number; } & { 'all': number };
    // 菜品的顾客采用率
    customerPercentage: number;
    roundDishTotalCountMap: {
        [round: number]: {
            othersDishCount: number,
            targetDishCount: number
        };
    };
    // 每个顾客当前菜品数量统计
    customerRoundDishCountMap: { [customer_name: string]: number };
}

/**
 * 购物车菜品详情
 * @path 菜品相对于`metaData`的路径
 * @target 菜品数据
 */
export type CartDishDetail = {
    path: string;
    target: CartDish;
}

/**
 * 更新类操作结果报告
 * 
 * 其中不同字段的可能的业务使用场景为：
 * - `familyDishTotalCount`：更新完菜品后，更新此菜品在菜单中的已点数量
 */
export type UpdateActionResult = {
    // 同族菜品总数量
    familyDishTotalCount: number;
    // 同族菜品总价格
    familyDishTotalPrice: number;
}

/**
 * 宣传媒体字段
 */
export const PROPAGANDA = {
    // $ 分享平台链接
    // Facebook
    FACEBOOK: 'FACEBOOK',
    // 抖音
    TIKTOK: 'TIK_TOK',
    // 推特
    TWITTER: 'TWITTER',
    // 猫途鹰
    TRIPADVISOR: 'TRIP_ADVISOR',
    // 瓦次普
    WHATSAPP: 'WHATSAPP',
    // Facebook照片墙
    INSTAGRAM: 'INSTAGRAM',
    // google
    GOOGLE: 'GOOGLE',
    // $ 其他
    // 预约
    RESERVATION: 'RESERVATION',
    // 外卖
    TAKEAWAY: 'TAKEAWAY ',
};