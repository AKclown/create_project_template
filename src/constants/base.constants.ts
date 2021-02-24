// 获取某个类型下的某个元素的类型
export declare type PropType<T, P extends keyof T> = T[P];
