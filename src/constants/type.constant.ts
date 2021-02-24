/***
 * !!! 旧版本的,新版本的需要需要查看是否需要更改
 */

/**
 * Interface for classes with `new` operator and static properties/methods
 */
export interface Class<T> {
    // new MyClass(...args) ==> T
    new(...args: any[]): T;
    // Other static properties/operations
    [property: string]: any;
}

/**
 * Objects with open properties
 */
export interface AnyObject {
    [property: string]: any;
}

/**
 * Any value
 */
export type AnyValue = AnyObject | string | number;

/**
 * Make some properties as required and others properties as optional
 */
export  type RequiredSome<T, K extends keyof T> = Partial<T> & Pick<T, K>;

/**
 * Type for Ajv schema object
 */
export interface SchemaObject {
    nullable: boolean;
    discriminator: {
        propertyName: string;
        mapping: {
            [key: string]: string;
        };
    };
    readOnly: boolean;
    writeOnly: boolean;
    xml: {
        name: string;
        namespace: string;
        prefix: string;
        attribute: boolean;
        wrapped: boolean;
        [extensionName: string]: any;
    };
    externalDocs: {
        description: string;
        url: string;
        [extensionName: string]: any;
    };
    example: any;
    examples: any[];
    deprecated: boolean;
    // $ ["string", "null"] this is nullable string!
    type: string | string[];
    allOf: (SchemaObject | ReferenceObject)[];
    oneOf: (SchemaObject | ReferenceObject)[];
    anyOf: (SchemaObject | ReferenceObject)[];
    not: SchemaObject | ReferenceObject;
    items: SchemaObject | ReferenceObject;
    properties: {
        [propertyName: string]: SchemaObject | ReferenceObject;
    };
    additionalProperties: SchemaObject | ReferenceObject | boolean;
    description: string;
    format: string;
    default: any;
    title: string;
    multipleOf: number;
    maximum: number;
    exclusiveMaximum: boolean;
    minimum: number;
    exclusiveMinimum: boolean;
    maxLength: number;
    minLength: number;
    pattern: string;
    maxItems: number;
    minItems: number;
    uniqueItems: boolean;
    maxProperties: number;
    minProperties: number;
    required: string[];
    enum: any[];
    [extensionName: string]: any;
}

export interface ReferenceObject {
    $ref: string;
}

/**
 * Menu
 */
export  type Menu = {
    // 一级菜单id
    main_group_id: number;
    // 一级菜单名称
    main_group_name: string;
    // 二级菜单数组
    menu_item_slu: Array<{
        // 二级菜单id
        dmi_slu_id: number;
        // 二级菜单名称
        dmi_slu_name: string;
        // 菜单菜品
        menu_item: Array<MenuDish>;
    }>;
    // 大人价格
    normal_price?: number;
    // 小孩价格
    child_price?: number;

}

/**
 * Second Menu
 */
export  type SecondMenu = {
    // 二级菜单id
    dmi_slu_id: number;
    // 二级菜单名称
    dmi_slu_name: string;
    // 菜单菜品
    menu_item: Array<MenuDish>;
}


/**
 * Menu Dish 
 */
export  type MenuDish = {
    // 过敏源
    allergen: Array<string>;
    // 菜品信息图标
    other_detail_info: Array<string>;
    // 菜品沽清
    bargain_stype: number;
    //
    discount_itemizer: number;
    // 菜品描述
    item_description: string | null;
    // 同类菜品id
    dmi_slu_id: number;
    // 菜品id
    item_id: number;
    // 菜品名称1
    item_name1: string;
    // 菜品名称2
    item_name2: string;
    // 菜品是否参与全局限制 1-参与，0-没参与
    not_joining_global_limit: number;
    // 单价1
    price_1: number;
    // 岗位（大厨，二厨，寿司，出菜口等等, Null/-1代表菜品无需打印或显示）
    print_class: number;
    // 打印机设备
    print_device: Array<PrintDevice>;
    // 数量
    quantity: number;
    // 是否启用 局部规则：菜品数量限制 1-启用，0-关闭
    rule_lnr_enable: number;
    // 是否在超过限制后，仍然可以添加 1-可以，0-不可以
    rule_lnr_limit_enable: number;
    // 超过限制后，菜品价格
    rule_lnr_limit_price: number;
    // 最大点餐数量
    rule_lnr_max_num: number;
    // 最大点餐数量是否与人数挂钩 1-与，0-否
    rule_lnr_max_num_with_customer: number;
    // 同类点餐限制
    category_order_limit: number;
    //
    service_itemizer: number | null;
    // 菜品规格
    unit_1: string | null;
    // 需要输入重量，默认为0
    weight_entry_required: number | null;
    // 食物缩略图片
    foodImage?: string;
    // 食物大图片
    bigFoodImage?: string;
    // 调味品
    condiments?: Array<Condiment>;
    // 顾客
    customers?: string;
    // 菜品报告总数量
    familyDishTotalCount?: number;
    // 菜品锁
    dishesLock?: boolean;
    // 菜品备注
    remarks: string;
    // 额外菜品备注
    ext_dish_info: string;
}

/**
 * Create Order / 创建订单
 */
export  type CreateOrder = {
    // 订单备注
    check_name?: string;
    // 客户数量
    customer_num?: number;
    // 就餐方式: 0:堂吃，1:堂吃打包，2:外送，3:来店自取
    eat_type?: number;
    // 额外费用
    extra_dishes?: Array<ExtraDishes>;
    // 开单员工id
    open_employee_id?: number;
    // 开单员工名称
    open_employee_name?: string;
    // 打印机ID
    pos_device_id?: number;
    // 打印机名
    pos_name?: string;
    // 开台id
    table_id?: number;
    // 开台菜单
    select_menu?: string;
}

/**
 * QOP Create Order / 发送创建订单请求
 */
export  type QopCreateOrder = {
    // 订单备注
    check_name: string,
    // 客户数量
    customer_num: number,
    // 就餐方式: 0:堂吃，1:堂吃打包，2:外送，3:来店自取
    eat_type: number,
    // 开台id
    table_id: number,
    // 开台菜单
    select_menu: string,
    // 大人人数
    adult_number: number,
    // 小孩人数
    child_number: number;
    // 记录的项目名称
    system_type?: string;
}

/**
 * Create Order / 创建订单 不检查桌台状态
 */

export  type CreateOrderNotCheckTable = {
    // 是否创建成功
    ok: boolean;
    // 订单id
    orderId: number;
    // 桌台名称
    table_name: string;
}

/**
 * Extra Dishes / 额外菜品
 */
export  type ExtraDishes = {
    // 实际价格
    actual_price: number;
    auth_id: number;
    auth_name: string;
    check_id: number;
    discount_id: number | null;
    // 就餐方式
    eat_type: number;
    is_discount: number;
    // 菜品状态（Null/0:未制作，1:已制作，2:已上菜，3:暂停制作，5:不可制作，新增：11:已备菜）
    is_make: number | null;
    // 菜品编号
    menu_item_id: number;
    // 菜品名称
    menu_item_name: string;
    n_service_type: number | null;
    // 用于修改，表示当前是删除还是增加
    operateStatus: 'delete' | 'add';
    // 用于修改，若有则是修改，没有就是新增
    order_detail_id: number;
    // 下单员工id
    order_employee_id: number;
    // 下单员工名称
    order_employee_name: string;
    pos_device_id: number;
    pos_name: string;
    // 岗位（大厨，二厨，寿司，出菜口等等, Null/-1代表菜品无需打印或显示）
    print_class: number | null;
    // 菜品单价
    product_price: number;
    // 菜品数量
    quantity: number;
    // 是否催菜（默认：0:未催菜，大于0:已催菜，每催一次会叠加1）
    rush: number;
    // 菜品规格
    unit: string;
    // 打印机字段
    print_device: Array<PrintDevice>;
}
/**
 * Table / 桌台信息
 */
export  type Table = {
    // 订单备注
    check_name?: string | null;
    // 客户数量
    customer_num?: number | null;
    // 外卖信息
    delivery_info?: string | null;
    // 桌台描述
    description?: string | null;
    // 当前订单点菜数量 菜品id:菜品数量
    dishes_number?: {
        [key: string]: number;
    };
    // 外卖时间
    kds_time?: Date | null;
    // 订单号
    order_head_id?: number | null;
    // 本回合已点菜品数量
    rule_gnr_num?: number | null;
    // 本回合开始时间
    rule_gnr_time_start?: Date | null;
    // 回合数
    rule_gnr_turn?: string | null;
    // 区域id
    rvc_center_id?: number | null;
    // 区域名称
    rvc_center_name?: string | null;
    // 座位数
    seat_num?: number | null;
}
/**
 * TableStatus / 返回的桌台状态
 */
export  type TableStatus = {
    // 订单id
    order_head_id: number;
    // 桌台id
    table_id?: number;
    // 桌台名称
    table_name?: string;
    // 桌台状态 1.空台；2.开台；3.已送厨；4.已打预结单但未付款；5.付款超时；6.停用
    table_status: number | null | undefined;
    // 如果开台，审核状态 0 审核中 1审核通过 
    cor_status?: number;
    // 如果开台 选中的菜单
    select_menu?: string;
    customer_num: number;
    child_number: number;
    adult_number: number;
}

/**
 * Order / 订单信息
 */
export  type Order = {
    // 订单备注
    check_name: string;
    // 订餐用户id
    customer_id: number;
    // 订餐用户名称+电话号码
    customer_name: string;
    // 用餐客户数量
    customer_num: number;
    // 外卖信息
    delivery_info: string;
    // 当前订单点菜数量 菜品id:菜品数量
    dishes_number: {
        [key: string]: number;
    };
    // 就餐方式: 0:堂吃，1:堂吃打包，2:外送，3:来店自取
    eat_type: number;
    // 外卖时间
    kds_time: Date;
    // 订单号
    order_head_id: number;
    // 创建订单时间
    order_start_time: Date;
    // 最早的点菜时间
    order_time: Date | null;
    // 厨师当前进行的轮次
    rule_gnr_chef_turn: string;
    // 本回合已点菜品数量
    rule_gnr_num: number | null;
    // 本回合开始时间
    rule_gnr_time_start: Date | null;
    // 回合数
    rule_gnr_turn: string | null;
    // 订单总金额
    should_amount: number | null;
    status: 0;
    // 桌台id
    table_id: number | null;
    // 桌台名称
    table_name: string | null;
    // 桌台状态 1.空台；2.开台；3.已送厨；4.已打预结单但未付款；5.付款超时；6.停用
    table_status: number;
}

/**
 * Condiment / 调味品
 */
export  type Condiment = {
    // 过敏源
    allergen: string | null;
    // 调尾品组名
    comdiment_groups_name: string;
    // 调味品描述
    item_description: string | null;
    // 调味品id
    item_id: number;
    // 调味品名称1
    item_name1: string;
    // 调味品名称2
    item_name2: string;
    // 调味品是否参与全局限制 1-参与，0-没参与
    not_joining_global_limit: number;
    // 调味品单价
    price_1: number;
    // 调味品组id
    scomdiment_groups_id: number;
    // 调味品规格
    unit_1: string;
    // 是否免费
    free: boolean;
    // 描述性文本
    other_detail_info: string;
}

/**
 * TurnInfo / 轮次规则
 */
export  type TurnInfo = {
    // 订单备注
    check_name?: string;

    // 当前轮客户点菜数量 客户名：数量
    customer_dish_num: {
        [key: string]: number;
    };
    // 每一轮点菜的数量 轮数：{ 菜品id: 数量}
    dishes_number?: {
        [key: string]: {
            [key: string]: number;
        };
    };
    // 同类点餐限制
    slu_dishes_number: {
        [cutomer_name: number]: {
            [dmi_slu_id: number]: number
        }
    };
    // 开台备注
    remark?: string | null;
    // 当前轮点菜数量
    rule_gnr_num: number | null;
    // 当前轮开始时间
    rule_gnr_time_start: string;
    // 当前点餐轮数
    rule_gnr_turn: string | null;
}

/**
 * CommitDishes / 提交购物车
 */
export  type CommitDishes = {
    dishes: Array<{
        // 实际价格
        actual_price: number;
        auth_id: number;
        auth_name: string;
        check_id: number;
        // 调味品
        condiments: Array<{
            // 是否免费 true-免费，false-付费
            free: boolean;
            // 调味品id
            item_id: number;
            // 调味品名称
            item_name1: string;
            // 调味品原始数据
            orignData: Condiment;
            // 调味品价格
            price_1: number;
        }>;
        // 点餐的客户名称
        customer_name: string;
        //
        discount_id: number | null;
        // 菜品规则
        dish_rule: {
            // 是否超额
            is_over_limit: boolean;
            // 菜品是否参与全局限制 1-参与，0-没参与
            not_joining_global_limit: number;
            // 是否启用 局部规则：菜品数量限制 1-启用，0-关闭
            rule_lnr_enable: number;
            // 是否在超过限制后，仍然可以添加 1-可以，0-不可以
            rule_lnr_limit_enable: number;
            // 超过限制后，菜品价格
            rule_lnr_limit_price: number;
            // 最大点餐数量
            rule_lnr_max_num: number;
            // 最大点餐数量是否与人数挂钩 1-与，0-否
            rule_lnr_max_num_with_customer: number;
        };
        // 打印参数
        print_device?: Array<{
            // 打印的菜品名
            item_name1: string
            item_name2: string
            type: string
            interface: string
            // 打印的桌台名
            table_name: string
            // 打印菜品备注
            check_name: string
            // 打印开台备注
            remark: string | null
            // 打印订单号
            order_head_id: string
            // 打印的人数
            customer_number: number
        }>
        // 就餐方式: 0:堂吃，1:堂吃打包，2:外送，3:来店自取
        eat_type: number;
        //
        is_discount: number;
        // 菜品状态（Null/0:未制作，1:已制作，2:已上菜，3:暂停制作，5:不可制作，新增：11:已备菜）
        is_make: number | null;
        // 菜品单号
        menu_item_id: number;
        // 菜品名称
        menu_item_name: string;
        //
        n_service_type: number | null;
        // 下单员工id
        order_employee_id: number | string;
        // 下单员工名称
        order_employee_name: number | string;
        // 下单时间
        order_time: Date;
        pos_device_id: number;
        pos_name: string;
        // 岗位（大厨，二厨，寿司，出菜口等等, Null/-1代表菜品无需打印或显示）
        print_class: number;
        // 菜品单价
        product_price: number;
        // 菜品数量
        quantity: number;
        // 菜品备注
        remarks: string;
        // 催菜
        rush: number;
        // 菜品规格
        unit: string;
    }>;
    totalCount: number;
    rule: {
        // 打印规则
        'send-order-print-dish-name-type': number | object;
        // 送出单
        'delivery-kitchen-head-empty-line': number | object;
        // 自主点餐S
        'rule-autonomous': {
            // 是否开启
            open: boolean;
            // 点餐人数
            peopleNum: number;
        };
        // 全局菜品数量轮数限制
        'rule-global-turn-limit': {
            // 是否成功初始化
            init: boolean;
            // 是否启用
            enable: boolean;
            // 每轮次分钟数
            turn_mins: number;
            // 每轮次最大点餐数量
            turn_dishes: number;
        };
        // 局部菜品数量限制
        'rule-local-dish-limit': {
            // 是否成功初始化
            init: boolean;
            // 是否启用
            enable: boolean;
        };
        // 一菜一单打印
        'rule-one-dish-one-order': {
            printer: Array<{
                // 打印机id
                print_device_id: number;
                // 打印机名称
                print_device_name: string;
            }>;
        };
        // 自主点菜分单打印
        'rule-print-auto-order': {
            status: boolean;
        };
        // 送厨单的打印字体大小 需要改变字体的栏位：改变的大小
        'rule-printer-font-size': {
            item_name1: number;
            item_name2: number;
            quantity: number;
            table: number;
            [key: string]: number;
        };
    };
    role?: string;
    now_date: Date;
    isPrint: boolean;
    printType: 'sendorder' | 'takeaway';
    orderHeadId?: number;
}
/**
 * OrderInfo / 订单详情
 */
export  type OrderInfo = {
    // 订单备注
    check_name: string | null;
    // 客户id
    customer_id: string;
    // 点餐客户名称
    customer_name: string;
    // 客户数量
    customer_num: number;
    // 已点菜的客户
    customers: Array<string>;
    // 外卖信息
    delivery_info: string | null;
    // 每轮点的菜品 轮次：菜品数组
    dishes_by_turn: {
        [key: string]: Array<Dish>;
    };
    // 当前订单点菜数量 菜品id:菜品数量
    dishes_number: {
        [key: string]: number;
    };
    // 额外费用
    extra_dishes: Array<Dish>;
    // 外卖时间
    kds_time: Date | null;
    // 订单号
    order_head_id: number | null;
    // 创建订单时间
    order_start_time: Date | null;

    remark: string | null;
    // 厨师当前进行的轮次
    rule_gnr_chef_turn: string | null;
    // 本回合已点菜品数量
    rule_gnr_num: number | null;
    // 本回合开始时间
    rule_gnr_time_start: Date | null;
    // 回合数
    rule_gnr_turn: string | null;
    // 订单总金额
    should_amount: number | null;
    // 桌台id
    table_id: number | null;
    // 桌台名称
    table_name: string | null;
    // 选择的菜单
    select_menu: string | null;
    // 区分顾客和服务员的轮次历史记录
    dishes_history: {
        customer: {
            [key: string]: Array<Dish>;
        },
        waiter: {
            [key: string]: Array<Dish>;
        },
    };
}

/**
 * 菜品详细信息
 */
export  type Dish = {
    // 实际价格
    actual_price: number;
    // 过敏源
    allergen: string;

    check_id: number;

    // 订单备注
    check_name: string;
    // 菜品ID，当前付费调味品属于哪个菜品
    condiment_belong_item: number;
    // 调味品
    condiments: Array<Partial<Condiment>>;
    // 订单客户id
    customer_id: number;
    // 点菜客户名
    customer_name: string;
    // 客户数量
    customer_num: number;
    // 外卖信息
    delivery_info: string | null;
    // 菜品做法备注/免费调味品备注（单品备注）
    description: string;
    // 点菜数量
    dish_number: string;
    // 就餐方式: 0:堂吃，1:堂吃打包，2:外送，3:来店自取
    eat_type: number;
    // 最后次菜品状态更新时间
    end_time: Date | null;
    // 菜品的报表子类别，用于区分菜品的分类，比如冷菜，热菜，寿司等(跟family_group表关联: family_group_id, family_group_name)
    family_group: number;
    // 订单的客户信息，客户名+客户电话号码
    head_custom_name: string;
    // 菜品状态（Null/0:未制作，1:已制作，2:已上菜，3:暂停制作，5:不可制作，新增：11:已备菜）
    is_make: number;
    // 是否为退菜（0:非退菜，1:为退菜）
    is_return_item: { type: 'Buffer'; data: Array<number> };
    // 是否已送厨（Null/0:未送厨，1:已送厨）
    is_send: { type: 'Buffer'; data: Array<number> };
    // 菜品描述
    item_description: string | null;
    // 菜品编号
    item_id: number;
    // 菜品名称1
    item_name1: string;
    // 菜品名称2
    item_name2: string;
    // 外卖时间
    kds_time: Date | null;
    // 一级菜单id
    main_group_id: number | null;
    // 菜品编号
    menu_item_id: number;
    // 菜品名称
    menu_item_name: string;
    // 菜品是否参与全局限制 1-参与，0-没参与
    not_joining_global_limit: number;
    // 是否需要打印（0:需要打印，1:无需打印）
    not_print: number;
    // 菜品订单id
    order_detail_id: number;
    // 下单员工id
    order_employee_id: number;
    // 下单员工名称
    order_employee_name: string;
    // 订单号
    order_head_id: number;
    // 订单开始时间
    order_start_time: Date;
    // 菜品下单时间
    order_time: Date;
    // 岗位（大厨，二厨，寿司，出菜口等等, Null/-1代表菜品无需打印或显示）
    print_class: number;
    // 菜品单价
    product_price: number;
    // 菜品数量
    quantity: number;
    // 此字段弃用，暂无法满足业务需求
    ready_qty: number;
    //
    remark: string | null;
    // 退菜原因
    return_reason: string | null;
    // 退菜时间
    return_time: Date | null;
    // 厨师当前进行的轮次
    rule_gnr_chef_turn: string | null;
    // 本回合已点菜品数量
    rule_gnr_num: number | null;
    // 本回合开始时间
    rule_gnr_time_start: Date | null;
    // 回合数
    rule_gnr_turn: string | null;
    // 是否催菜（默认：0:未催菜，大于0:已催菜，每催一次会叠加1）
    rush: number;
    // 座位数（默认为0）
    seat_num: number | null;
    // 订单总金额
    should_amount: number | null;
    // 桌台id
    table_id: number | null;
    // 桌台名称
    table_name: string;
    // 点菜的轮次
    turn: string | null;
    // 菜品规格
    unit: string;

    // 菜品价格
    price_1: string;
    // 是否启用 局部规则：菜品数量限制 1-启用，0-关闭
    rule_lnr_enable: number;
    // 是否在超过限制后，仍然可以添加 1-可以，0-不可以
    rule_lnr_limit_enable: number;
    // 超过限制后，菜品价格
    rule_lnr_limit_price: number;
    // 最大点餐数量
    rule_lnr_max_num: number;
    // 最大点餐数量是否与人数挂钩 1-与，0-否 
    // rule_lnr_max_num_with_customer: number;
}

/**
 * 历史订单菜品详细信息
 */
export  type HistoryDish = {
    // 菜品订单id
    order_detail_id: number;
    // 订单号
    order_head_id: number | null;
    check_id: number;
    // 菜品编号
    menu_item_id: number;
    // 菜品名称
    menu_item_name: string;
    // 菜品名称2
    item_name2: string;
    // 菜品单价
    product_price: number;
    is_discount: { type: 'Buffer'; data: Array<number> };

    original_price: null;
    discount_id: number;
    // 实际价格
    actual_price: number;
    // 是否为退菜（0:非退菜，1:为退菜）
    is_return_item: { type: 'Buffer'; data: Array<number> };
    // 下单员工id
    order_employee_id: number;
    // 下单员工名称
    order_employee_name: string;
    // 打印机ID
    pos_device_id: number;
    // 打印机名
    pos_name: string;
    // 菜品下单时间
    order_time: Date | null;
    // 退菜原因
    return_reason: string | null;
    // 退菜时间
    return_time: Date | null;
    // 菜品规格
    unit: string;
    // 是否已送厨（Null/0:未送厨，1:已送厨）
    is_send: { type: 'Buffer'; data: Array<number> };
    // 菜品ID，当前付费调味品属于哪个菜品
    condiment_belong_item: number;
    // 菜品数量
    quantity: number;
    // 就餐方式: 0:堂吃，1:堂吃打包，2:外送，3:来店自取
    eat_type: number;
    // 超额菜品描述
    excess_price_and_condiments_price_for_view: string;
    is_reprice: number;
    // 调味品总价
    condiment_price: number;
    // 超额价格
    excess_price: number;
    // 超额数量
    excess_count: number;
    // 正常价格
    price: number;
    // 正常数量
    count: number;
    auth_id: number;
    auth_name: string;
    // 需要输入重量，默认为0
    weight_entry_required: number | null;
    // 菜品做法备注/免费调味品备注（单品备注）
    description: string;
    n_service_type: number | null;
    // 是否需要打印（0:需要打印，1:无需打印）
    not_print: number;
    // 座位数
    seat_num?: number | null;
    discount_price: 0
    sales_amount: 0
    // 菜品状态（Null/0:未制作，1:已制作，2:已上菜，3:暂停制作，5:不可制作，新增：11:已备菜）
    is_make: number | null;
    // 岗位（大厨，二厨，寿司，出菜口等等, Null/-1代表菜品无需打印或显示）
    print_class: number;
    // 是否催菜（默认：0:未催菜，大于0:已催菜，每催一次会叠加1）
    rush: number;
    // 此字段弃用，暂无法满足业务需求
    ready_qty: number;
    // 最后次菜品状态更新时间
    end_time: Date | null;
    the_cook_id: 0
    split_number: null
    // 点菜的轮次
    turn: string | null;
    // 菜品是否参与全局限制 1-参与，0-没参与
    not_joining_global_limit: number;
    // 是否启用 局部规则：菜品数量限制 1-启用，0-关闭
    rule_lnr_enable: number;
    // 最大点餐数量
    rule_lnr_max_num: number;
    // 最大点餐数量是否与人数挂钩 1-与，0-否
    rule_lnr_max_num_with_customer: number;
    // 是否在超过限制后，仍然可以添加 1-可以，0-不可以
    rule_lnr_limit_enable: number;
    // 超过限制后，菜品价格
    rule_lnr_limit_price: number;
    // 调味品
    condiments: Array<Partial<Condiment>>;
    // 菜品备注
    remarks: string
    // 付费调味品
    condiments_description: string
}

/**
* PrintDevice / 打印
*/
export  type PrintDevice = {
    // 打印机id
    print_device_id: number;
    // 打印机名称
    print_device_name: string;
    print_table_number: number;
    // 打印机地址
    printer_name: string;
    redirection_device_id: number;
    trailer: number;

    // 打印的菜品名
    item_name1: string;
    item_name2: string;

    backup_device_id: string;
    baud_rate: number;
    beep: number;
    check_info_print: number;
    com_port: number;
    device_id: number;
    flow_control: number;
    header: number;
    is_print_note: number;
    num_data_bit: number;
    num_stop_bits: number;
    paper_width: number;
    parity_type: number;
}

/**
 * 呼叫服务资源
 */
export  type CallService = Array<{
    // 呼叫服务资源 ID
    id: number;
    // 国际化词句设置
    title_cn: string;
    title_en: string;
    title_it: string;
    value_cn: string;
    value_en: string;
    value_it: string;
}>

/**
 * SettingInfo / 点餐基础规则参数
 */
export  type SettingInfo = {
    // 设置的id
    id: number;
    // 设置的名称
    name: string;
    // 设置的内容
    value: any;
}
/**
 * 获取所有轮次的历史数据
 */
export  type HistoryData = {
    // 轮次 -> 顾客 -> 菜品
    round_customer_dish_data: {
        [round_name: number]: {
            [cutomer_name: string]: Array<HistoryDish>;
        }
    };
    // 菜品id -> 轮次 -> 顾客：点餐数量
    //  & -> 所有的 -> 顾客：点餐数量 & 总数
    dish_round_customer_data: {
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
    // 角色 -> 轮次 -> 顾客：菜品数据
    type_round_dish: {
        all: {
            [round_name: string]: Array<HistoryDish>
        },
        customer: {
            [round_name: number]: Array<HistoryDish>
        },
    }
    // 菜品id -> 菜品规则
    dishRuleData: {
        [item_id: number]: {
            not_joining_global_limit: number
            rule_lnr_enable: number
            rule_lnr_max_num: number
            rule_lnr_max_num_with_customer: number
            rule_lnr_limit_enable: number
            rule_lnr_limit_price: number
        }
    }
    additionalCharges: {
        total: Array<HistoryDish>
    }
}

// ****************
//  $ POST返回参数
// *****************

/**
 * 提交购物车
 */
export  type CommitDishesResult = {
    status: number;
    data: {
        turn: null | string;
        turnStartTime: null | string;
        orderId: string;
    }
}

/**
 * 测试打印机
 */
export  type PrinterTest = {
    ok: number
}
/**
 * 测试服务器
 */
export  type ServerTest = {
    ok: number
}

export  type Login = {
    // 用户id
    employee_id?: number;
    // 登录密码
    password_id?: string;
    // 用户名
    employee_last_name?: string;
}
/**
 * 打印小票
 */
export  type PrintCartTip = {
    // 
    data: Array<{
        ok: boolean;
        // 打印机设备名
        print_device_name: string;
        print_devices?: any;
    }>;
    // 状态码
    status: number
}
/**
 * 修改额外费用
 */
export  type UpdateExtra = Array<{
    [key: number]: number;
}>

/**
 * 更新订单
 */
export  type UpdateOrders = {
    fieldCount?: number;
    // 影响行数
    affectedRows?: number;
    // 新增数据后的主键ID
    insertId?: number;
    // 服务器状态
    serverStatus?: number;
    // 警告
    warningCount?: number;
    // 信息
    message?: string;
    // 协议
    protocol41?: boolean;
    // 改变的行数
    changedRows?: number;
}

/**
 * 更新桌台状态
 */
export  type UpdateTabStatus = {
    data: {
        [key: string]: any
    };
    status: number
}

/**
 * 校验购物车
 */
export  type CheckCart = {
    // 校验返回的状态
    status: boolean;
    // 校验返回信息
    message?: string;
}

export  type CurrentBusinessMenu = {
    id: number,
    start_time: string,
    end_time: string,
    preferred_menu: string,
    alternative_menu: string,
}

// 获取自动生成的客户名称
export  type GenerateCustomerName = {
    now_customer_name: number | null,
    auto_customer_name: Array<string>,
    identifier: Array<string>
}


/**
 * 首页公告资源
 */
export  type Bulletin = {
    id: number;
    // 标题名称
    name: string;
    // 公告内容
    value: string;
}
/**
 * 特色菜数据
 */
export  type SpecialDishes = {
    id: number;
    menu_item_id: number;
    item_name1: string;
    item_name2: string;
};

/**
 * 营业时间
 */
export  type Schedule = {
    id: number;
    week: string;
    time_24_hours: string;
    takeaway_status: string;
    selftake_status: string;
    scheduleTimeRanges: Array<{
        id: number;
        start_time: string;
        end_time: string;
        takeaway_status_range: string;
        selftake_status_range: string;
        week: number;
    }>
};
/**
 * 营业时间资源
 */
export  type BusinessMenu = {
    id: number
    alternative_menu: string;
    end_time: string;
    preferred_menu: string;
    start_time: string;
}

/**
 * 其他分享平台
 */
export  type Propaganda = {
    id: number;
    name: string;
    url: string;
};

/**
 * 餐馆信息
 */
export  type RestaurantInfo = {
    restaurant_id: number;
    restaurant_name: string
};

