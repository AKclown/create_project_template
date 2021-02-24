// Unified package axios instance
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import _ from 'lodash';
import snackbar from '../components/snackbar';
import i18n from '../locales/i18n';

//  $ base url (Three different environments：dev、stable、release)
const URL = process.env.REACT_APP_BASE_URL ?? 'http://8.209.81.113:9100';

const BASE_URL = `${URL}`;

// $ Create axios object
const instant: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 6000,
    headers: { 'authorization-type': 'BASIC_AUTH' }
})

//  Request interceptor
const requestConfig = (config: AxiosRequestConfig) => {

    config = config || {};

    // get token
    // let token = SC.getCaching('token') || {};

    // // Configure the auth information in the request header
    // config.headers['Authorization'] = `Bearer ${_.get(token, 'accessToken') ?? ''}`;

    return {
        ...config
    }
}

// request error
const requestError = (error: any) => {
    return Promise.reject(error);
}

// Response interceptor
const responseConfig = (config: AxiosResponse): AxiosResponse => {
    const { data, status, statusText } = config;
    return { data, status, statusText } as AxiosResponse;
}

// response error
const responseError = (error: { message?: string; }) => {
    // $ request timeout
    if (error?.message?.search(/timeout/) !== -1) {
        snackbar.error(`${i18n.t('http_message_network_request_timed_out')}`);
    }
    return Promise.reject(error);
}

// add interceptor
instant.interceptors.request.use(requestConfig, requestError);
instant.interceptors.response.use(responseConfig, responseError);

// Return interface error message directly
export const httpError = (error: { response: { data: unknown; status: number; statusText: string; } }) => {
    return {
        data: error?.response?.data,
        status: error?.response?.status,
        statusText: error?.response?.statusText
    }
}

// $ 再次考虑此类型（此T可能是正在考虑的数组类型）
export type HttpSuccessOrErrorType<T> = {
    data: any;
    status: number;
    statusText: string;
    error?: HttpErrorType;
}


export type HttpErrorType = {
    code?: number;
    details?: object;
    message?: string;
    statusCode?: number;
}

export default instant;