import { MenuDish, CommitDishes, TurnInfo } from "../constants/type.constant";
import { AnalysisReport, CartMetaData, UpdateActionResult, RoundCustomerMetaData } from "../modules/cart/type";
import { States } from "../redux/type";

export declare type EventObject =
    CreateOrderRequestSuccessedEventObject |
    CreateOrderRequestFailedEventObject |
    SendOrderRequestEventObject |
    ResendOrderRequestEventObject |
    CartCommitOtherEventObject |
    CartCommitEventObject |
    AddDishLockEventObject |
    RemoveDishLockEventObject |
    CreateDishEventObject |
    DeleteDishEventObject |
    AddDishCountEventObject |
    RemoveDishCountEventObject |
    DishModifyEventObject |
    UpdateDishEventObject |
    DishReportEventObject |
    TableStatusEventObject |
    DistributionIdEventObject |
    TableStatusEventObject |
    CustomerIdEventObject |
    UpdateDishCountEventObject |
    UpdateSelfDishCountEventObject |
    UpdateTurnRulesEventObject |
    UpdateResetDishEventObject |
    FirstJoinEventObject |
    CountDownDishEventObject |
    SetNextTurnDishEventObject |
    UpdateCondimentsEventObject |
    AddCommitLockEventObject |
    RemoveCommitLockEventObject;

export declare type EventName =
    // $ ----  Default Events ----
    // Connect / Disconnect
    'CONNECT' | 'DISCONNECT' |
    // Result
    'JOIN_ORDER_RESULT' | 'LEAVE_ORDER_MESSAGE' | 'SEND_EVENT_RESULT' | 'ERROR' |

    // $ ----  Create Order Request Events ----
    // 申请开台的结果（成功/失败）
    'CREATE_ORDER_REQUEST_SUCCESSED' | 'CREATE_ORDER_REQUEST_FAILED' |
    // 已经有设备发送了开台申请（当别的设备收到时，应该从首页跳转至菜单页面）
    'SEND_ORDER_REQUEST' |
    // 已经有设备重新发送了开台申请（当别的设备收到时，应该禁用重发开台申请按钮）
    'RESEND_ORDER_REQUEST' |

    // $ ----  Service Events ----
    // Cart Commit
    'CART_COMMIT' |
    'CART_COMMIT_OTHER' |
    // Dish Lock
    'ADD_DISH_LOCK' | 'REMOVE_DISH_LOCK' |
    // Create / Delete Dish
    'CREATE_DISH' | 'DELETE_DISH' |
    // Add / Remove Dish Count
    'ADD_DISH_COUNT' | 'REMOVE_DISH_COUNT' |
    // Modify Dish
    'MODIFY_DISH' | 'UPDATE_DISH' |
    // Dish Report
    'DISH_REPORT' |
    // Table Status
    'TABLE_STATUS' |
    // Distribution Id
    'DISTRIBUTION_ID' |
    // customer id
    'CUSTOMER_ID' |
    // Update dish count
    'UPDATE_DISH_COUNT' |
    'UPDATE_DISH_COUNT_SELF' |
    // Update turnRules
    'UPDATE_TURNRULES' |
    'UPDATE_RESET_DISH' |
    // First Join
    'FIRST_JOIN' |
    // Count Down Dish
    'COUNT_DOWN_DISH' |
    // 轮次倒计时结束，通知对方设备更新对应的顾客购物车
    'SET_NEXT_TURN_DISH' |
    // 更新调味品
    'UPDATE_CONDIMENTS' |
    // 菜品提交锁
    'ADD_COMMIT_LOCK' |
    'REMOVE_COMMIT_LOCK';

export declare type CreateOrderRequestSuccessedEventObject = {
    event: 'CREATE_ORDER_REQUEST_SUCCESSED';
    customer: string;
    orderId: number;
}

export declare type CreateOrderRequestFailedEventObject = {
    event: 'CREATE_ORDER_REQUEST_FAILED';
    customer: string;
}

export declare type SendOrderRequestEventObject = {
    event: 'SEND_ORDER_REQUEST';
    customer: string;
    orderRequestMsg: States['orderRequestMsg'];
    dish?: any;
    orderId?: number;
}

export declare type ResendOrderRequestEventObject = {
    event: 'RESEND_ORDER_REQUEST';
    customer: string;
    selectMenu: States['orderTab']['menuList'];
}
export declare type CartCommitOtherEventObject = {
    event: 'CART_COMMIT_OTHER';
    turnInfo: TurnInfo;
    customer: string;
    dishes: CommitDishes;
}
export declare type CartCommitEventObject = {
    event: 'CART_COMMIT';
    turnInfo: TurnInfo;
    customer: string;
    dishes: CommitDishes;
}
export declare type AddDishLockEventObject = {
    event: 'ADD_DISH_LOCK';
    customer: string;
    dish: MenuDish;
    wid: string;
}

export declare type RemoveDishLockEventObject = {
    event: 'REMOVE_DISH_LOCK';
    customer: string;
    dish: MenuDish;
    wid: string;
}

export declare type AddCommitLockEventObject = {
    event: 'ADD_COMMIT_LOCK';
    customer: string;
}
export declare type RemoveCommitLockEventObject = {
    event: 'REMOVE_COMMIT_LOCK';
    customer: string;
    isMessage?: boolean;
}

export declare type CreateDishEventObject = {
    event: 'CREATE_DISH';
    customer: string;
    dish: any;
}

export declare type DeleteDishEventObject = {
    event: 'DELETE_DISH';
    customer: string;
    dish: any;
}

export declare type AddDishCountEventObject = {
    event: 'ADD_DISH_COUNT';
    customer: string;
    wid: string;
    dishes: MenuDish;
    reportCount: UpdateActionResult
}

export declare type RemoveDishCountEventObject = {
    event: 'REMOVE_DISH_COUNT';
    customer: string;
    wid: string;
    dishes: MenuDish;
    reportCount: UpdateActionResult;
}

export declare type DishModifyEventObject = {
    event: 'MODIFY_DISH';
    customer: string;
    dish: any;
}
export declare type UpdateDishEventObject = {
    event: 'UPDATE_DISH';
    customer: string;
    dish: any;
}
export declare type UpdateResetDishEventObject = {
    event: 'UPDATE_RESET_DISH';
    customer: string;
    dish: any;
}
export declare type UpdateCondimentsEventObject = {
    event: 'UPDATE_CONDIMENTS';
    customer: string;
    dishes: any;
    wid: string;
    cartData: CartMetaData
}
export declare type DishReportEventObject = {
    event: 'DISH_REPORT';
    customer: string;
    dishes: MenuDish;
    dishReport: AnalysisReport,
    cartData: CartMetaData
}
export declare type TableStatusEventObject = {
    event: 'TABLE_STATUS';
    customer: string;
    orderRequestMsg: States['orderRequestMsg'];
    isOpenTab: boolean;
    resendOrderSecond: number;
    orderTab: States['orderTab'];
}
export declare type DistributionIdEventObject = {
    event: 'DISTRIBUTION_ID';
    customer: string;
}
export declare type CustomerIdEventObject = {
    event: 'CUSTOMER_ID';
    customer: string;
}
export declare type UpdateDishCountEventObject = {
    event: 'UPDATE_DISH_COUNT';
    customer: string;
    turnInfo: TurnInfo;
    globalRound?: number;
}
export declare type UpdateSelfDishCountEventObject = {
    event: 'UPDATE_DISH_COUNT_SELF';
    customer: string;
    turnInfo: TurnInfo;
}
export declare type UpdateTurnRulesEventObject = {
    event: 'UPDATE_TURNRULES';
    customer: string;
    turnInfo: TurnInfo;
}
export declare type FirstJoinEventObject = {
    event: 'FIRST_JOIN';
    customer: string;
    dish: any;
    round: number;
    isShowTime?: boolean
}
export declare type CountDownDishEventObject = {
    event: 'COUNT_DOWN_DISH';
    customer: string;
    dish: any;
}

export declare type SetNextTurnDishEventObject = {
    event: 'SET_NEXT_TURN_DISH';
    customer: string;
    round: number,
    saveDishes: any;
}