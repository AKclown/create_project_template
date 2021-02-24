/***
 * !!! 旧版本的,新版本的需要需要查看是否需要更改
 */

import { CartMetaData, CartDish, FamilyDishesReport, MinimizeDish, CartDishDetail, MinimizeCondiment, AnalysisReport, UpdateActionResult, HistoryDishNumMetaData, HistoryDishRulesMetaData, HistoryCategoryDishLimit } from "./type";
import _ from "lodash";
import { v4 as uuidv4 } from 'uuid';
import { Condiment, RequiredSome } from "../../constants/type.constant";
import i18n from "../../locales/i18n";

export class CartModule {
    // $ Meta Data
    // 购物车数据源
    public metaData: CartMetaData = { 0: {} };
    // 历史记录数据源
    public historyDishNumMetaData: HistoryDishNumMetaData = {};
    // 历史菜品的规则
    public historyDishRulesMetaData: HistoryDishRulesMetaData = {};
    // 历史同类点餐数量
    public historyCategoryDishLimit: HistoryCategoryDishLimit = {}

    // $ Basic
    // 顾客数量
    public customerNum: number = 1;

    // $ Rules Switches
    // 全局轮次限制规则
    public GLOBAL_ROUND_LIMIT_RULE: boolean = true;
    // 全局自助点餐规则
    public GLOBAL_SELF_ORDER_RULE: boolean = true;
    // 局部菜品数量规则
    public LOCAL_DISH_COUNT_LIMIT_RULE: boolean = true;

    // $ Global Round Limit Rule
    // 本轮次开始时间
    public globalRoundStartDate: Date | null = null;
    // 每轮次时间间隔
    public globalRoundDurationMs: number = 60000 * 10;
    // 每轮次最大点餐数量
    public globalRoundMaxOrder: number = 100;
    // 轮次最大回合数
    public globalRoundMax: number = 10;
    // 当前轮次
    public globalRound: number = 1;

    // *********************
    // Tool Functions
    // *********************

    /**
     * 判断两个菜品的调味品和备注是否完全相等。
     * 判断调味品时，不考虑顺序，只判断`item_id`。
     * 判断备注时，若备注字段不存在或为非法，则视为`''`。
     * @param dishA 
     * @param dishB 
     */
    private comparisonCondimentsAndRemarks(dishA: any, dishB: any): boolean {
        let matchedCount: number = 0;
        for (let index = 0; index < dishA.condiments.length; index++) {
            if (dishB.condiments.findIndex((dishBCondiment: Condiment) => dishBCondiment.item_id === dishA.condiments[index].item_id) !== -1)
                matchedCount++;
            else break;
        }
        return matchedCount === dishA.condiments.length && matchedCount === dishB.condiments.length && ((dishA.remarks || '') === (dishB.remarks || ''));
    }

    /**
     * 删除当前购物车里所有非法菜品，满足如下某一条件即为非法菜品：
     * 
     * - 数量为0或负数
     * 
     * 注意：此函数会更新`metaData`,其中部分菜品的`index`可能会与之前不同
     */
    private deleteInvalidDishes(round: number, customer: string) {
        let indexNeedToBePulled: number[] = [];
        if (_.has(this.metaData, `${round}.${customer}`)) {
            this.findFromMetaDataByPath<CartDish[]>(`${round}.${customer}`).forEach((dish, index) => {
                let dishTotalCount = dish.count + dish.excessCount;
                if (dishTotalCount <= 0) indexNeedToBePulled.push(index);
            });
        }
        indexNeedToBePulled.forEach(i => _.pullAt(this.findFromMetaDataByPath<CartDish[]>(`${round}.${customer}`), i));
    }

    /**
     * 获取目标占总体的半分比（小数点精度为2）
     * @param target 目标
     * @param total 整体
     */
    private getPercentage(target: number, total: number): number {
        let percentage: number = 0;
        if (target <= 0) percentage = 0;
        else percentage = target / total;
        return parseFloat(percentage.toFixed(2));
    }

    // *********************
    // Family Dishes Functions
    // *********************

    /**
     * 获取所有同族菜品。可以添加筛选器进行过滤。
     * @param targetDish 目标菜品（参与比对的菜品，即此函数会查找此菜品的所有同族菜品）
     * @param filter 过滤器（当数组为空时，视为不进行过滤）
     * @同族菜品
     * - `_id`一致
     * - `item_id`一致
     * - `condiments`一致（内部对象的`item_id`全部一致）
     */
    private findFamilyDishes(
        targetDish: MinimizeDish & Partial<Pick<CartDish, '_id'>>,
        filter: { rounds: number[]; customers: string[]; } = { rounds: [], customers: [] },
    ): FamilyDishesReport {
        // 初始化
        let report: FamilyDishesReport = {
            // 元信息
            _origin: targetDish,
            // 同`id`菜品
            _iPath: null,
            _iTarget: null,
            // 次菜品在历史记录中的数量
            historyCount: 0,
            // 同`item_id`且不同`condiments`菜品
            irMap: {},
            irCount: 0,
            irExcessCount: 0,
            irTotalPrice: 0,
            // 同类点餐数量
            irCategoryDishCount: 0,
            irExcessTotalPrice: 0,
            irCondimentsTotalPrice: 0,
            // 同`item_id`且同`condiments`菜品
            cirMap: {},
            cirCount: 0,
            cirExcessCount: 0,
            cirTotalPrice: 0,
            cirExcessTotalPrice: 0,
            cirCondimentsTotalPrice: 0
        };
        // 从历史记录中获取数量
        filter.customers.forEach(customer => {
            if (_.has(this.historyDishNumMetaData, `${targetDish.item_id}.all.${customer}`))
                report.historyCount += _.get(this.historyDishNumMetaData, `${targetDish.item_id}.all.${customer}`) || 0;
        });

        // 使用其他函数进行遍历
        this.iterateDishByConditions(
            filter.rounds,
            filter.customers,
            (round: number, customer: string, dish: CartDish, dishPath: string) => {

                // > 注意：这里判断`_id`和`item_id`并不冲突，需要两个都判断都加入报告
                // 是否`_id`相等
                if (dish._id === targetDish._id) {
                    report._iPath = dishPath;
                    report._iTarget = dish;
                }

                // 是否`item_id`相等
                if (dish._origin.item_id === targetDish.item_id) {
                    // 是否`condiments`相等
                    if (this.comparisonCondimentsAndRemarks(dish, targetDish)) {
                        // 设置
                        if (!_.has(report.cirMap, `${round}`)) _.set(report.cirMap, `${round}`, []);
                        report.cirMap[round].push({ path: dishPath, target: dish });
                        report.cirCount += dish.count;
                        report.cirExcessCount += dish.excessCount;
                        report.cirTotalPrice += (dish.price || 0) * (dish.count || 0);
                        report.cirExcessTotalPrice += (dish.excessPrice || 0) * (dish.excessCount || 0);
                        report.cirCondimentsTotalPrice += (dish.condimentsTotalPrice || 0);
                    }
                    // 只有`item_id`相等
                    // 设置
                    if (!_.has(report.irMap, `${round}`)) _.set(report.irMap, `${round}`, []);
                    report.irMap[round].push({ path: dishPath, target: dish });
                    report.irCount += dish.count;
                    report.irExcessCount += dish.excessCount;
                    report.irTotalPrice += (dish.price || 0) * (dish.count || 0);
                    report.irExcessTotalPrice += (dish.excessPrice || 0) * (dish.excessCount || 0);
                    report.irCondimentsTotalPrice += (dish.condimentsTotalPrice || 0);
                }
            }
        );
        return report;
    }

    /**
     * 将当前轮次的所有同族菜品的数量重置
     */
    private resetFamilyDishesCountFields(fdReport: FamilyDishesReport): void {
        // init
        let report = {
            allRoundsTotalCount: 0,
            otherRoundsTotalCount: 0,
            currentRoundTotalCount: 0
        };

        // 分析数量
        Object.keys(fdReport.irMap).forEach((round: any) => {
            (fdReport.irMap[round] || []).forEach(t => report.currentRoundTotalCount += (t.target.count + t.target.excessCount));
        });
        report.allRoundsTotalCount = fdReport.irCount + fdReport.irExcessCount + fdReport.historyCount;
        report.otherRoundsTotalCount = report.allRoundsTotalCount - report.currentRoundTotalCount;

        // 依次修改数量 (局部菜品数量限制规则 且 允许超额)
        if (
            fdReport._origin.rule_lnr_enable === 1 &&
            fdReport._origin.rule_lnr_limit_enable === 1
        ) {

            // $ 判断自主点餐模式
            let ruleMaxCount = this.GLOBAL_SELF_ORDER_RULE ? parseInt(`${fdReport._origin.rule_lnr_max_num}`) : parseInt(`${fdReport._origin.rule_lnr_max_num}`) * this.customerNum;
            let unExcessCountNum = ruleMaxCount - report.otherRoundsTotalCount;
            Object.keys(fdReport.irMap).forEach((round: any) => {
                (fdReport.irMap[round] || []).forEach(detail => {
                    // 初始化
                    let dishTotalCount = detail.target.count + detail.target.excessCount;
                    // 检查此菜品是否为零或负数
                    if (dishTotalCount > 0) {
                        let newCount: number = 0;
                        let newExcessCount: number = 0;
                        for (let num = 0; num < dishTotalCount; num++) {
                            // 非超额名额未空
                            if (unExcessCountNum > 0) {
                                newCount++;
                                unExcessCountNum--;
                            }
                            // 非超额名额已空
                            else {
                                newExcessCount++;
                                unExcessCountNum--;
                            }
                        }
                        // 更新菜品数量
                        this.findFromMetaDataByPath<CartDish>(detail.path).excessCount = newExcessCount;
                        this.findFromMetaDataByPath<CartDish>(detail.path).count = newCount;
                    }
                });
            });

        }
        // 依次修改数量 (普通菜品)
        else {
            Object.keys(fdReport.irMap).forEach((round: any) => {
                (fdReport.irMap[round] || []).forEach(detail => {
                    // 初始化
                    let dishTotalCount = detail.target.count + detail.target.excessCount;
                    // 更新菜品数量
                    this.findFromMetaDataByPath<CartDish>(detail.path).excessCount = 0;
                    this.findFromMetaDataByPath<CartDish>(detail.path).count = dishTotalCount;
                });
            });
        }

    }

    /**
     * 将当前轮次的所有同族菜品的非关键性字段重置
     */
    private resetFamilyDishesOtherFields(fdReport: FamilyDishesReport) {
        Object.keys(fdReport.irMap).forEach((round: any) => {
            ((fdReport.irMap[round]) || []).forEach(detail => {
                // $ init
                let targetDish = this.findFromMetaDataByPath<CartDish>(detail.path);

                // $ rebuild all price fields
                targetDish.totalPrice = targetDish.count * targetDish.price;
                targetDish.excessTotalPrice = targetDish.excessCount * targetDish.excessPrice;
                // $ rebuild all price fields with condiments
                targetDish.condimentsTotalPrice = 0;
                if (Array.isArray(targetDish.condiments) && targetDish.condiments.length > 0) {
                    targetDish.condiments.forEach(condiment => {
                        if (condiment.free !== true && condiment.price_1 > 0) targetDish.condimentsTotalPrice += (condiment.price_1 * (targetDish.count + targetDish.excessCount));
                    });
                }
                // $ rebuild all for view fields
                // rebuild `excessPriceAndCondimentsPriceForView` field
                let excessPriceString = targetDish.excessTotalPrice > 0 ? `Ext. ${targetDish.excessPrice.toFixed(2)} × ${targetDish.excessCount}` : '';
                let condimentsPriceString = targetDish.condimentsTotalPrice > 0 ? `Con. ${targetDish.condimentsTotalPrice.toFixed(2)}` : '';
                targetDish.excessPriceAndCondimentsPriceForView = `${excessPriceString} ${condimentsPriceString}`.trim();

            });
        });
    }

    /**
     * 执行所有更新类操作时，都会返回此结果
     * @param fdReport 
     */
    private buildUpdateActionResult(fdReport: FamilyDishesReport): UpdateActionResult {
        // $ init
        let result: UpdateActionResult = {
            // summary
            familyDishTotalCount: 0,
            familyDishTotalPrice: 0
        };
        // $ rebuild all summary fields
        result.familyDishTotalCount = fdReport.irCount + fdReport.irExcessCount;
        result.familyDishTotalPrice = fdReport.irTotalPrice + fdReport.irExcessTotalPrice + fdReport.irCondimentsTotalPrice;
        // $ return
        return result;
    }

    // *********************
    // Rule Checker Functions
    // *********************

    /**
     * 判断局部菜品数量限制规则
     * @param customer 目标顾客
     * @param dish 目标菜品
     * @param totalCount 经过更新行为后，目标菜品的总数量（该菜品在所有轮次中的数量）
     */
    private checkLocalDishNumLimitRule(
        customer: string,
        dish: RequiredSome<MinimizeDish, 'rule_lnr_enable' | 'rule_lnr_limit_enable'>,
        totalCount: number
    ) {
        if (
            // 规则开启
            this.LOCAL_DISH_COUNT_LIMIT_RULE &&
            // 菜品参与局部菜品数量限制规则
            dish.rule_lnr_enable === 1 &&
            // 菜品不允许超额
            dish.rule_lnr_limit_enable !== 1
        ) {
            // 从历史记录中获取数量
            let historyCount: number = _.get(this.historyDishNumMetaData, `${dish.item_id}.all.${customer}`) || 0;
            // 如果自助点餐规则开启（不需要乘以人数）
            if (this.GLOBAL_SELF_ORDER_RULE) {
                if ((totalCount + historyCount) > dish.rule_lnr_max_num!)
                    throw new Error(i18n.t('order_cart_page_text_round_max_number_exceed'));
            }
            // 如果自助点餐规则未开启（需要乘以人数）
            else {
                if ((totalCount + historyCount) > this.customerNum * dish.rule_lnr_max_num!)
                    throw new Error(i18n.t('order_cart_page_text_round_max_number_exceed'));
            }
        }
    }

    /**
     * 判断全局轮次限制规则
     * @param round 目标轮次
     * @param customer 目标顾客
     * @param dish 目标菜品
     * @param totalCount 目标菜品的更新的数量（可能为负数）
     */
    private checkGlobalRoundLimitRule(
        round: number,
        customer: string,
        dish: RequiredSome<MinimizeDish, 'not_joining_global_limit'>,
        count: number
    ) {
        if (
            // 规则开启
            this.GLOBAL_ROUND_LIMIT_RULE &&
            // 菜品不被全局轮次限制忽略
            dish.not_joining_global_limit !== 1
        ) {
            // init
            let currentRoundCount: number = count;
            let roundDishMaxCount: number = this.globalRoundMaxOrder;

            // 从历史记录中获取数量
            let historyCount: number = 0;
            Object.keys(this.historyDishNumMetaData).forEach((itemKey) => {
                if (_.has(this.historyDishRulesMetaData, `${itemKey}`)) {
                    if (_.get(this.historyDishNumMetaData, `${itemKey}.${round}.${customer}`)) {
                        historyCount += _.get(this.historyDishNumMetaData, `${itemKey}.${round}.${customer}`);
                    }

                }
            })
            // 如果自助点餐规则开启（不需要乘以人数）
            if (!this.GLOBAL_SELF_ORDER_RULE) roundDishMaxCount = this.customerNum * roundDishMaxCount;
            // 获取所有当前轮次购物车的菜品
            this.findFromMetaDataByPath<CartDish[]>(`${round}.${customer}`).forEach(dish => {
                if (_.get(dish, `_origin.not_joining_global_limit`) !== 1) {
                    currentRoundCount += dish.count + dish.excessCount;
                }
            });

            // console.log(`currentRoundCount:${currentRoundCount},historyCount：${historyCount}`);
            // console.log(`roundDishMaxCount:${roundDishMaxCount}`);

            // 检查是否超过
            if ((currentRoundCount + historyCount) > roundDishMaxCount) throw new Error(i18n.t('order_cart_page_text_complete_order'));
        }
    }

    /**
     * 同类菜品限制规则
     * @param round 目标轮次
     * @param customer 目标顾客
     * @param dish 目标菜品
     * @param totalCount 目标菜品的更新的数量（可能为负数）
     */
    public checkCategoryDishLimitRule(
        round: number,
        customer: string,
        dish: MinimizeDish,
        count: number
    ) {

        // init
        let categoryCount: number = count;
        let historyCategoryDishLimit = _.get(this.historyCategoryDishLimit, `${customer}.${dish.dmi_slu_id}`) || 0;
        let categoryDishLimitCount = dish.category_order_limit ? dish.category_order_limit : 0;

        // 如果自助点餐规则开启（不需要乘以人数）
        if (!this.GLOBAL_SELF_ORDER_RULE) categoryDishLimitCount = this.customerNum * categoryDishLimitCount;
        // 获取所有当前轮次购物车的菜品
        this.findFromMetaDataByPath<CartDish[]>(`${round}.${customer}`).forEach(dishes => {
            if (dishes._origin.dmi_slu_id === dish.dmi_slu_id) categoryCount += dishes.count + dishes.excessCount;
        });
        // 检查是否超过
        if ((categoryCount + historyCategoryDishLimit) > categoryDishLimitCount) throw new Error(i18n.t('order_cart_page_text_similar_dish_number_exceed'));
    }
    // *********************
    // Public Functions
    // *********************

    /**
     * 根据基于`metaData`的路径获取对象
     */
    public findFromMetaDataByPath<T = any>(path: string | string[]): T {
        return _.get(this.metaData, path);
    }

    /**
     * 根据条件遍历元数据内的所有菜品，每次都会调用回调函数。
     * @param cb 回调函数，可以用于实现自定义业务。（回调函数默认无返回值，若返回为`'BREAK'`，则会立刻终止查找）
     * @回调函数的参数
     * - `round`: 轮次
     * - `customer`: 顾客
     * - `dish`: 目标菜品
     * - `dishPath`: 目标菜品，相对于`metaData`的路径
     * @备注
     * 如果在`Deep Loop`中使用了`break`或`continue`等关键字，会导致后续的回调函数无法被正确触发。
     */
    public iterateDishByConditions(
        rounds: number[],
        customers: string[],
        cb: (round: number, customer: string, dish: CartDish, dishPath: string) => void | 'BREAK'
    ) {
        try {
            // 初始化
            const isFilterRound: boolean = rounds.length > 0;
            const isFilterCustomer: boolean = customers.length > 0;
            // 依次遍历每个轮次

            for (let round = 0; round <= this.globalRound; round++) {
                // 轮次是否存在
                if (!_.has(this.metaData, `${round}`)) { }
                else {
                    // 轮次过滤器
                    // 未匹配到目标轮次
                    if (isFilterRound && rounds.findIndex(t => t === round) === -1) { }
                    // 匹配到目标轮次
                    else {
                        // 获取并所有顾客
                        const roundCustomers = Object.keys(this.metaData[round]);

                        // 依次遍历每个顾客
                        roundCustomers.forEach((customer: string) => {
                            // 顾客过滤器
                            // 未匹配到目标顾客
                            if (isFilterCustomer && customers.findIndex(t => t === customer) === -1) { }
                            // 匹配到目标顾客
                            else {

                                // 依次遍历此顾客的所有菜品
                                this.findFromMetaDataByPath<CartDish[]>(`${round}.${customer}`).forEach((dish: CartDish, dishIndex: number) => {
                                    const cbResult = cb(round, `${customer}`, _.cloneDeep([dish])[0], `${round}.${customer}[${dishIndex}]`);
                                    // 检查回调函数中的`BREAK`终止字符串
                                    if (cbResult === 'BREAK') throw new Error('BREAK');
                                });
                            }
                        });
                    }
                }
            }
        } catch (error) {
            if (_.get(error, 'message') !== 'BREAK') throw error;
        }
    }

    /**
     * 返回目标菜品的分析报告
     * @param targetDish 目标菜品（参与比对的菜品，即此函数会查找此菜品的所有同族菜品）
     * @param filter 过滤器（当数组为空时，视为不进行过滤）
     */
    public getDishAnalysis(
        targetDish: RequiredSome<MinimizeDish, 'item_id'>,
        filter: { rounds: number[]; customers: string[]; } = { rounds: [], customers: [] },
    ): AnalysisReport {
        // $ 初始化
        let report: AnalysisReport = {
            // 菜品的占比率
            countPercentage: { 'all': 0 },
            // 菜品的顾客采用率
            customerPercentage: 0,
            // 菜品的顾客采用率
            roundDishTotalCountMap: {},
            // 每个顾客当前菜品数量统计
            customerRoundDishCountMap: {}
        }
        let reportData: {
            roundDishCountMap: { [round_name: number]: { targetDishCount: number; othersDishCount: number; } } & { 'history': { targetDishCount: number; othersDishCount: number; } };
            customerDishCountMap: { [customer_name: string]: boolean };
            customerRoundDishCountMap: { [customer_name: string]: number };
        } = {
            // 菜品的占比率
            roundDishCountMap: { history: { targetDishCount: 0, othersDishCount: 0 } },
            // 菜品的顾客采用率
            customerDishCountMap: {},
            // 每个顾客当前菜品数量统计
            customerRoundDishCountMap: {}
        }
        // 当前所有菜品的总数
        let totalDishCount: number = 0;
        // 当前目标菜品的数量
        let totalTargetDishCount: number = 0;
        // 每个用户对应的点餐数
        let customerTargetDishCount: number = 0;
        // $ 遍历目标区域
        this.iterateDishByConditions(
            filter.rounds,
            filter.customers,
            (round: number, customer: string, dish: CartDish, dishPath: string) => {
                // 添加所有数量
                totalDishCount += dish.count + dish.excessCount;
                // 初始化
                if (!_.has(reportData, `roundDishCountMap.${round}`)) {
                    _.set(reportData, `roundDishCountMap.${round}`, {
                        othersDishCount: 0,
                        targetDishCount: 0
                    });
                }
                if (!_.has(reportData, `customerDishCountMap.${customer}`)) {
                    _.set(reportData, `customerDishCountMap.${customer}`, false);
                }
                if (!_.has(reportData, `customerRoundDishCountMap.${customer}`)) {
                    _.set(reportData, `customerRoundDishCountMap.${customer}`, 0);
                }

                // 是否为同一个用户
                if (customer === dish._origin.customers) {
                    customerTargetDishCount = _.get(reportData, `customerRoundDishCountMap.${customer}`)
                    customerTargetDishCount += dish.count + dish.excessCount;
                    _.set(reportData, `customerRoundDishCountMap.${customer}`, customerTargetDishCount)
                }
                // 是否`item_id`相等
                if (dish._origin.item_id === targetDish.item_id) {
                    // 添加所有数量
                    totalTargetDishCount += dish.count + dish.excessCount;
                    // 更新分析数据
                    _.get(reportData, `roundDishCountMap.${round}`).targetDishCount += dish.count + dish.excessCount;
                    _.set(reportData, `customerDishCountMap.${customer}`, true);
                    // 从历史记录中获取数量
                    if (_.has(this.historyDishNumMetaData, `${dish._origin.item_id}.${round}.${customer}`)) {
                        _.get(reportData, `roundDishCountMap.${round}`).targetDishCount += _.get(this.historyDishNumMetaData, `${dish._origin.item_id}.${round}.${customer}`) || 0;
                        _.set(reportData, `customerDishCountMap.${customer}`, true);
                    }
                }
                else {
                    // 更新分析数据
                    _.get(reportData, `roundDishCountMap.${round}`).othersDishCount += dish.count + dish.excessCount;
                    // 从历史记录中获取此顾客是否已经点过此菜品
                    if (_.has(this.historyDishNumMetaData, `${dish._origin.item_id}.${round}.${customer}`)) {
                        _.get(reportData, `roundDishCountMap.${round}`).othersDishCount += _.get(this.historyDishNumMetaData, `${dish._origin.item_id}.${round}.${customer}`) || 0;
                        _.set(reportData, `customerDishCountMap.${customer}`, true);
                    }
                }
            }
        );

        // $ 遍历所有历史记录菜品
        Object.keys((this.historyDishNumMetaData || {})).forEach(dishItemId => {
            let isTargetDish: boolean = (`${dishItemId}` === `${targetDish.item_id}`);
            Object.keys(_.get(this.historyDishNumMetaData, `${dishItemId}`) || {}).forEach((roundLevelData: any) => {
                if (roundLevelData !== 'all') {
                    Object.keys(_.get(this.historyDishNumMetaData, `${dishItemId}.${roundLevelData}`) || {}).forEach((customerLevelData: any) => {
                        if (!_.has(reportData, `roundDishCountMap.${roundLevelData}`)) {
                            _.set(reportData, `roundDishCountMap.${roundLevelData}`, {
                                othersDishCount: 0,
                                targetDishCount: 0
                            });
                        }
                        if (isTargetDish)
                            _.get(reportData, `roundDishCountMap.history`).targetDishCount += _.get(this.historyDishNumMetaData, `${dishItemId}.${roundLevelData}.${customerLevelData}`);
                        else
                            _.get(reportData, `roundDishCountMap.history`).othersDishCount += _.get(this.historyDishNumMetaData, `${dishItemId}.${roundLevelData}.${customerLevelData}`);
                    });
                }
            });
        });
        // $ 制作报告
        // 菜品的占比率

        _.set(report, `countPercentage.all`, this.getPercentage(totalTargetDishCount, totalDishCount));
        Object.keys(reportData.roundDishCountMap).forEach(round => {
            // 初始化report
            if (!_.has(report, `countPercentage.${round}`)) _.set(report, `countPercentage.${round}`, {});
            let currentData = _.get(reportData, `roundDishCountMap.${round}`);
            _.set(report, `countPercentage.${round}`, this.getPercentage(currentData.targetDishCount, currentData.targetDishCount + currentData.othersDishCount));
        });
        // 菜品的顾客采用率
        const customers = Object.keys(reportData.customerDishCountMap);
        let customerTotalCount: number = this.customerNum;
        let customerOrderedCount: number = 0;
        customers.forEach(customer => {
            if (_.get(reportData, `customerDishCountMap.${customer}`)) customerOrderedCount++;
        });

        _.set(report, `customerPercentage`, this.getPercentage(customerOrderedCount, customerTotalCount));
        // 轮次的菜品总数量地图
        _.set(report, `roundDishTotalCountMap`, reportData.roundDishCountMap);
        // 每个顾客当前菜品数量
        _.set(report, `customerRoundDishCountMap`, reportData.customerRoundDishCountMap);
        // $ 返回报告
        return report;
    }

    /**
     * 修改购物车中的菜品的数量。若操作数量不小于零且菜品不存在，则会创建菜品。
     * @param round 目标轮次
     * @param customer 目标顾客
     * @param dish 目标菜品
     * @param num 操作数量（正数为添加、负数为减少）
     */
    public updateDishCountInCart(
        round: number,
        customer: string,
        num: number,
        dish: MinimizeDish,
        options?: {
            isApplyRules: boolean;
            isApplyRefactor: boolean;
        }
    ): UpdateActionResult {
        // $ 准备阶段
        // 初始化
        let fdReport: FamilyDishesReport;
        options = options || {
            isApplyRules: true,
            isApplyRefactor: true
        };
        let resetRound = round
        // console.log('round:', resetRound, this.globalRoundMax);
        // 检查目标轮次是否超过最大轮次数
        if (resetRound > this.globalRoundMax) {
            // $ 超过最大轮次后, 将限制在最大规则轮次下点餐
            if (dish.not_joining_global_limit !== 1) {
                throw new Error(i18n.t('order_cart_page_text_max_rounds_exceed'));
            }
        }
        // 检查轮次是否存在
        if (!_.has(this.metaData, `${resetRound}`)) _.set(this.metaData, `${resetRound}`, {});
        // 检查顾客是否存在
        if (!_.has(this.metaData, `${resetRound}.${customer}`)) _.set(this.metaData, `${resetRound}.${customer}`, []);

        // 获取报告
        fdReport = this.findFamilyDishes(dish, { rounds: [], customers: [customer] });
        // $ 检查规则阶段
        if (options.isApplyRules) {
            // 全局轮次限制规则
            this.checkGlobalRoundLimitRule(resetRound, customer, dish, num);
            // 局部菜品数量限制规则
            this.checkLocalDishNumLimitRule(customer, dish, fdReport.irCount + fdReport.irExcessCount + num);
            // 同类菜品数量限制规则
            this.checkCategoryDishLimitRule(resetRound, customer, dish, num);
        }
        // $ 直接修改购物车阶段
        // 如果操作是添加类行为

        if (num >= 0) {
            // 此菜品不存在
            if (!_.get(fdReport, `cirMap.${resetRound}`) || _.get(fdReport, `cirMap.${resetRound}.length`) <= 0) {
                // 添加菜品
                this.findFromMetaDataByPath<CartDish[]>(`${resetRound}.${customer}`).push({
                    // meta data
                    _id: uuidv4(),
                    _origin: dish,
                    // basic
                    count: num,
                    price: dish.price_1 >= 0 ? dish.price_1 : 0,
                    totalPrice: 0,
                    // excess
                    excessCount: 0,
                    excessPrice: dish.rule_lnr_limit_price ? parseInt(`${dish.rule_lnr_limit_price}`) : 0,
                    excessTotalPrice: 0,
                    // condiment
                    condiments: Array.isArray(dish.condiments) ? dish.condiments : [] as any,
                    condimentsTotalPrice: 0,
                    // remarks
                    remarks: dish.remarks || '',
                    // for view fields
                    excessPriceAndCondimentsPriceForView: ''
                });
            }
            // 此菜品存在，直接修改数量即可
            else this.findFromMetaDataByPath<CartDish>(fdReport.cirMap[resetRound][0].path).count += num;
        }
        // 如果操作是减少类行为
        else {
            // 如果菜品不存在
            if (!_.get(fdReport, `cirMap.${resetRound}`) || _.get(fdReport, `cirMap.${resetRound}.length`) <= 0) throw new Error(i18n.t('order_cart_page_text_dish_not_exists'));
            // 此菜品存在，直接修改数量即可
            else this.findFromMetaDataByPath<CartDish>(fdReport.cirMap[resetRound][0].path).count += num;
        }
        // $ 重构购物车阶段
        if (options.isApplyRefactor) {
            // 删除所有非法菜品
            this.deleteInvalidDishes(resetRound, customer);
            // 重新获取报告
            fdReport = this.findFamilyDishes(dish, { rounds: [], customers: [customer] });
            // 调整当前轮次同族菜品数量
            this.resetFamilyDishesCountFields(fdReport);
            // 更新非必要字段
            this.resetFamilyDishesOtherFields(fdReport);
        }
        // $ 返回
        return this.buildUpdateActionResult(fdReport);
    }

    /**
     * 修改购物车中的指定菜品的调味品信息和备注信息。
     * @param round 目标轮次
     * @param customer 目标顾客
     * @param condiments 调味品数组（变动后的）
     * @param remarks 备注（变动后的）
     * @param dish 目标菜品
     */
    public updateDishCondimentsAndRemarksInCart(
        round: number,
        customer: string,
        condiments: Array<MinimizeCondiment>,
        remarks: string,
        dish: MinimizeDish,
        options?: {
            isApplyRules: boolean;
            isApplyRefactor: boolean;
        }
    ): UpdateActionResult | null {

        // $ 准备阶段
        // 初始化
        let oldFdReport: FamilyDishesReport;
        let newFdReport: FamilyDishesReport;
        options = options || {
            isApplyRules: true,
            isApplyRefactor: true
        };
        let oldDishDetail: CartDishDetail;
        // 创建修改后的菜品对象
        let newDish = _.cloneDeep([dish])[0];
        _.set(newDish, 'condiments', condiments);
        _.set(newDish, 'remarks', remarks);
        let resetRound = round
        // 检查目标轮次是否超过最大轮次数
        if (resetRound > this.globalRoundMax) {
            // $ 超过最大轮次后, 将限制在最大规则轮次下点餐
            if (dish.not_joining_global_limit !== 1) {
                throw new Error(i18n.t('order_cart_page_text_max_rounds_exceed'));
            }
            // resetRound = this.globalRoundMax
        }
        // 检查轮次是否存在
        if (!_.has(this.metaData, `${resetRound}`)) _.set(this.metaData, `${resetRound}`, {});
        // 检查顾客是否存在
        if (!_.has(this.metaData, `${resetRound}.${customer}`)) _.set(this.metaData, `${resetRound}.${customer}`, []);
        // 获取报告
        oldFdReport = this.findFamilyDishes(dish, { rounds: [], customers: [customer] });
        // $ 找到菜品
        // 如果菜品不存在

        if (!_.get(oldFdReport.cirMap, `${resetRound}[0].target`)) throw new Error(i18n.t('order_cart_page_text_dish_not_exists'));
        oldDishDetail = _.get(oldFdReport.cirMap, `${resetRound}[0]`);
        // 查看是否修改前后调味品一致

        if (this.comparisonCondimentsAndRemarks(oldDishDetail.target, newDish)) return null;
        // $ 检查规则阶段
        if (options.isApplyRules) {
            // 全局轮次限制规则
            this.checkGlobalRoundLimitRule(resetRound, customer, dish, 0);
            // 局部菜品数量限制规则
            this.checkLocalDishNumLimitRule(customer, dish, oldFdReport.irCount + oldFdReport.irExcessCount);
        }
        // $ 获取新报告
        newFdReport = this.findFamilyDishes(newDish, { rounds: [], customers: [customer] });
        let dishEqualToNewDishDetail: CartDishDetail = _.get(newFdReport.cirMap, `${round}[0]`);
        // $ 直接修改购物车阶段
        // 如果修改调味品后，当前购物车有调味品相同的同族菜品（删除调味品相同的同族菜品，将其数量转移至当前操作的菜品）
        if (dishEqualToNewDishDetail) {
            // 修改当前操作的菜品的调味品和备注
            this.findFromMetaDataByPath<CartDish>(oldDishDetail.path).condiments = condiments;
            this.findFromMetaDataByPath<CartDish>(oldDishDetail.path).remarks = remarks;
            // 修改当前操作的菜品的数量
            let dishEqualToNewDishCount = dishEqualToNewDishDetail.target.count;
            let dishEqualToNewDishExcessCount = dishEqualToNewDishDetail.target.excessCount;
            this.findFromMetaDataByPath<CartDish>(oldDishDetail.path).count += dishEqualToNewDishCount;
            this.findFromMetaDataByPath<CartDish>(oldDishDetail.path).excessCount += dishEqualToNewDishExcessCount;
            // 将调味品相同的同族菜品的数量均设为0
            this.findFromMetaDataByPath<CartDish>(dishEqualToNewDishDetail.path).count = 0;
            this.findFromMetaDataByPath<CartDish>(dishEqualToNewDishDetail.path).excessCount = 0;
        }
        // 如果修改调味品后，当前购物车无调味品相同的同族菜品（直接修改旧的菜品的调味品即可）
        else {
            this.findFromMetaDataByPath<CartDish>(oldDishDetail.path).condiments = condiments;
            this.findFromMetaDataByPath<CartDish>(oldDishDetail.path).remarks = remarks;
        }
        // $ 重构购物车阶段
        if (options.isApplyRefactor) {
            // 删除所有非法菜品
            this.deleteInvalidDishes(resetRound, customer);
            // 重新获取报告
            newFdReport = this.findFamilyDishes(newDish, { rounds: [], customers: [customer] });
            // 调整当前轮次同族菜品数量
            this.resetFamilyDishesCountFields(newFdReport);
            // 更新非必要字段
            this.resetFamilyDishesOtherFields(newFdReport);
        }
        // $ 返回
        return this.buildUpdateActionResult(newFdReport);
    }

    /**
     * 修改购物车中的指定菜品的价格信息。
     * @param round 目标轮次
     * @param customer 目标顾客
     * @param price 未超额单价（变动后的）
     * @param excessPrice 超额单价（变动后的）
     * @param dish 目标菜品
     */
    public updateDishPriceInCart(
        round: number,
        customer: string,
        price: number,
        excessPrice: number,
        dish: MinimizeDish,
        options?: {
            isApplyRefactor: boolean;
        }
    ): UpdateActionResult | null {
        // $ 准备阶段
        // 初始化
        let fdReport: FamilyDishesReport;
        options = options || { isApplyRefactor: true };
        price = price < 0 ? 0 : price;
        excessPrice = excessPrice < 0 ? 0 : excessPrice;
        let resetRound = round
        // 检查目标轮次是否超过最大轮次数
        if (resetRound > this.globalRoundMax) {
            // $ 超过最大轮次后, 将限制在最大规则轮次下点餐
            if (dish.not_joining_global_limit !== 1) {
                throw new Error(i18n.t('order_cart_page_text_max_rounds_exceed'));
            }
        }
        // 检查轮次是否存在
        if (!_.has(this.metaData, `${resetRound}`)) _.set(this.metaData, `${resetRound}`, {});
        // 检查顾客是否存在
        if (!_.has(this.metaData, `${resetRound}.${customer}`)) _.set(this.metaData, `${resetRound}.${customer}`, []);
        // 获取报告
        fdReport = this.findFamilyDishes(dish, { rounds: [], customers: [customer] });
        // $ 直接修改购物车阶段
        // 此菜品不存在
        if (!_.get(fdReport, `cirMap.${resetRound}`) || _.get(fdReport, `cirMap.${resetRound}.length`) <= 0) throw new Error(i18n.t('order_cart_page_text_dish_not_exists'));
        // 此菜品存在，直接修改价格即可
        else {
            this.findFromMetaDataByPath<CartDish>(fdReport.cirMap[resetRound][0].path).price = price;
            this.findFromMetaDataByPath<CartDish>(fdReport.cirMap[resetRound][0].path).excessPrice = excessPrice;
        }
        // $ 重构购物车阶段
        if (options.isApplyRefactor) {
            // 删除所有非法菜品
            this.deleteInvalidDishes(resetRound, customer);
            // 重新获取报告
            fdReport = this.findFamilyDishes(dish, { rounds: [], customers: [customer] });
            // 调整当前轮次同族菜品数量
            this.resetFamilyDishesCountFields(fdReport);
            // 更新非必要字段
            this.resetFamilyDishesOtherFields(fdReport);
        }
        // $ 返回
        return this.buildUpdateActionResult(fdReport);
    }

    /**
     * 清空购物车
     * @param round 目标轮次
     * @param customer 目标顾客
     */
    public clearCart(round: number, customer: string) {
        _.set(this.metaData, `${round}.${customer}`, []);
        _.set(this.metaData, `1.${customer}`, []);
    }

    /**
     * 清除购物车选中的菜品
     * @param round 目标轮次
     * @param customer 目标顾客
     * @param dishesId 选中的菜品
     */
    public clearSelectedDish(round: number, customer: string, dishesId: Array<string> = []) {
        const obtainDishes: CartDish[] = _.get(this.metaData, `${round}.${customer}`);
        const targetDishes = _.cloneDeep(obtainDishes)
        if (targetDishes) {
            dishesId.forEach((_id: string) => {
                _.remove(targetDishes, (item) => {
                    return item._id === _id
                })
            })
        }
        _.set(this.metaData, `${round}.${customer}`, targetDishes);
    }

}
