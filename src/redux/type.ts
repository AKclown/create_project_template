/***
 * !!! 旧版本的,新版本的需要需要查看是否需要更改
 */
import { SettingInfo, MenuDish, TurnInfo, HistoryData, Menu, CurrentBusinessMenu } from '../constants/type.constant';
import { MinimizeCondiment, CartMetaData } from '../modules/cart/type';
import { GlobalConfig } from '../gconfig';
import { PropType } from '../constants';
// *********************
// Actions
// *********************
const HREF = window.location.host
// const HREFARR = HREF.split(':')

export type Actions = SynchronizeAction | ResetAction | ResetCachingAction | SetAction | SetCachingAction | SetCachingAndStateAction;

export type CachingDataStructure = {
    // $ 开桌点餐相关规则
    settingInfo: Array<SettingInfo>;
};
export type SynchronizeAction = {
    type: 'SYNCHRONIZE';
    direction: 'STATE_TO_CACHING' | 'CACHING_TO_STATE';
}

export type ResetAction = {
    type: 'RESET';
    path: string;
}

export type ResetCachingAction = {
    type: 'RESET_CACHING';
    path: string;
}

export type SetAction = {
    type: 'SET';
    path: string;
    value: any;
}

export type SetCachingAction = {
    type: 'SET_CACHING';
    path: string;
    value: any;
}

export type SetCachingAndStateAction = {
    type: 'SET_CACHING_AND_STATE';
    path: string;
    value: any;
};

// *********************
// Caching
// *********************

export const CACHING_KEY = 'DEFAULT_CACHING';

export const CACHING_EMPTY_STRING = '{}';

// *********************
// State
// *********************

export type States = {

    // *********************
    // 新的
    // *********************

    // 全局loading
    globalLoading: boolean;

    // *********************
    // 旧的
    // *********************

    // $ 基础参数
    // 服务器地址
    serverUrl: string;

    // $ 语言
    language: string,

    // $ 开桌点餐相关规则
    settingInfo: Array<SettingInfo>;

    // $ 基础数据
    // 一级订单
    firstLevelMenu: any[];
    // 二级订单
    secondLevelMenu: any[];

    // $ 订单类数据
    // ...
    // 订单信息
    orderTab: {
        // 开台人数
        person: number;
        // 订单Id
        orderId: number;
        // 菜单信息
        menuList: {
            // id
            main_group_id: number,
            // name
            main_group_name: string,
        };
        // 扫码id
        customer: string;
        // 开台具体人数
        childNum: number,
        normalNum: number,
    };
    // 本轮次规则
    turnInfo: TurnInfo;
    // 是否倒时间
    isShowTime: boolean,

    // Footer栏目控制的页面切换
    viewPage: string;
    // 购物车
    shoppingCart: CartMetaData;
    // 底部导航栏模式
    foodBarMode: 'MULTIPLE' | 'SINGLE';

    // 用于标记用户是否第一次加载
    markNumber: number;

    // 审核状态 REVIEW审核中 APPROVED审核通过 NO已经审核通过（不需要显示审核） REJECTED审核拒绝
    approvalStatus: 'REVIEW' | 'APPROVED' | 'NO' | 'REJECTED';

    // 记录菜品提示状态
    addedTipsStatus: boolean;
    // 当前轮次顾客的购物车数据
    cartData: Array<{
        _origin: MenuDish;
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
        // for view fields
        excessPriceAndCondimentsPriceForView: string;
    }>;
    // 开台请求的信息
    orderRequestMsg: {
        type: string,
        tableId: string,
        menu: {
            // id
            main_group_id: number,
            // name
            main_group_name: string,
        },
        person: number,
        adultNum: number,
        childNum: number,
        customer: string
    };

    // 菜品锁状态
    dishesLock: boolean;
    // 桌台id
    tableId: number;
    // 桌台名称
    tableName: string;

    localHref: string;

    // 是否已经开台
    isOpenTab: boolean;

    // 重新发送倒计时
    resendOrderSecond: number;
    // 记录每一轮的历史记录
    roundCustomerDishData: PropType<HistoryData, 'round_customer_dish_data'>;
    // 记录推进的轮次
    advGlobalRound: number;
    // 记录轮次倒计时(秒)
    roundTime: number;
    // 初始化顾客购物车对应的人数
    personArr: Array<string>;
    // 是否开启打印机
    printChecked: boolean;
    // 接口切换开关
    isInterfaceSwitch: boolean;
    // 记录初始化语言类型状态
    languageStatus: boolean;
    // 60s轮询桌台状态
    pollingSecond: number;
    // 初始选中的一级菜品栏位
    selectedFirstLevelMenu: Menu;
    // 记录聚客开桌状态
    tableStatus: boolean;
    // 记录菜单显示方式
    menuModeDefaultVal: 'CAROUSEL' | 'NORMAL' | 'DETAIL',
    // 记录二级菜单下标
    recordMenuIndex: number;
    // 记录二级菜单栏滑动定位
    swiperTransform: string;
    // 是否处于点餐时间段
    isBusinessTime: boolean;
    // 当前营业时间资源
    businessTime: CurrentBusinessMenu;
    // 记录营业时间段提示框状态
    businessTimeStatus: boolean;
    // 引导页是否显示
    guidePageHideDishes: boolean;
    // 新手引导-卡片提示
    guidePageHideCard: boolean;
    // 新手引导-Door 页面 首选菜单卡片提示
    guidePageHideHomeCard: boolean;
    // 新手引导-Door 页面 首选菜单卡片提示 状态2
    guidePageHideHomeCardTwo: boolean;
    // 通过扫码进入判断是否为Lite版（精简版）模式
    liteMode: boolean;
};

export const INIT_STATE: States = {

    // *********************
    // 新的
    // *********************

    // 全局loading
    globalLoading: false,

    // *********************
    // 旧的
    // *********************

    // $ 基础参数
    // 服务器地址
    serverUrl: `${GlobalConfig.HTTPS_HTTP_SERVER_URL}`,

    // $ 语言
    language: 'EN',

    // $ 开桌点餐相关规则
    settingInfo: [],

    // $ 基础数据
    // 一级订单
    firstLevelMenu: [],
    // 二级订单
    secondLevelMenu: [],

    // $ 订单类数据
    // ...
    // 开台信息
    orderTab: {
        person: 1,
        orderId: 0,
        menuList: {
            // id
            main_group_id: 0,
            // name
            main_group_name: '',
        },
        customer: '',
        childNum: 0,
        normalNum: 0,
    },
    // 开台请求的信息
    orderRequestMsg: {
        type: '',
        tableId: '',
        menu: {
            // id
            main_group_id: 0,
            // name
            main_group_name: '',
        },
        adultNum: 0,
        childNum: 0,
        person: 0,
        customer: '1'
    },
    // 本轮次规则
    turnInfo: {
        rule_gnr_turn: null,
        rule_gnr_num: 0,
        rule_gnr_time_start: '',
        remark: '',
        check_name: '',
        customer_dish_num: {},
        dishes_number: {},
        slu_dishes_number: {},
    },
    // 时间戳
    isShowTime: false,

    // Footer栏目控制的页面切换
    viewPage: 'menuPage',
    // 购物车（包括所有轮次的下的所有顾客）
    shoppingCart: {},
    // 底部导航栏模式
    foodBarMode: 'MULTIPLE',
    // 用于标记用户是否第一次加载
    markNumber: 0,
    // 审核状态 
    approvalStatus: 'NO',

    // 记录菜品提示状态
    addedTipsStatus: true,

    // 当前轮次所有顾客的购物车数据
    cartData: [],

    // 菜品锁状态
    dishesLock: false,
    // 桌台id
    tableId: 0,
    // 桌台名称
    tableName: '',

    localHref: HREF,

    // 是否已经开台
    isOpenTab: false,
    // 重新发送倒计时
    resendOrderSecond: 60,
    // 记录每一轮的历史记录
    roundCustomerDishData: {},
    // 记录推进的轮次
    advGlobalRound: 1,
    // 记录轮次倒计时(秒)
    roundTime: -1,
    // 初始化顾客购物车对应的人数
    personArr: [],
    // 是否开启打印机
    printChecked: false,
    // 接口切换开关
    isInterfaceSwitch: true,

    // 记录初始化语言类型状态
    languageStatus: false,
    // 30s轮询桌台状态
    pollingSecond: 30,
    // 初始选中的一级菜品栏位
    selectedFirstLevelMenu: {
        main_group_name: '',
        main_group_id: 0,
        menu_item_slu: [],
    },
    // 记录聚客开桌状态
    tableStatus: false,
    // 记录菜单显示方式
    menuModeDefaultVal: 'CAROUSEL',
    // 记录二级菜单下标
    recordMenuIndex: 0,
    // 记录二级菜单栏滑动定位
    swiperTransform: 'translate3d(0px, 0px, 0px)',
    // 是否处于点餐时间段
    isBusinessTime: false,
    businessTime: {
        alternative_menu: '',
        end_time: '',
        id: 0,
        preferred_menu: '',
        start_time: '',
    },
    // 记录营业时间段提示框状态
    businessTimeStatus: true,
    // 引导页是否显示
    guidePageHideDishes: true,
    // 新手引导-卡片提示
    guidePageHideCard: true,
    // 新手引导-Door 页面 首选菜单卡片提示
    guidePageHideHomeCard: true,
    // 新手引导-Door 页面 首选菜单卡片提示 状态2
    guidePageHideHomeCardTwo: true,

    // 通过扫码进入判断是否为Lite版（精简版）模式
    liteMode: false,
}