/***
 * !!! 旧版本的,新版本的需要需要查看是否需要更改
 */
import io from 'socket.io-client';
import { EventEmitter } from 'events';
import { EventObject } from './type';
import _ from 'lodash';
import { v4 as uuidv4 } from 'uuid';
import { GlobalConfig } from '../gconfig';

// *********************
// Websocket Client
// *********************

export class WebsocketClientClass extends EventEmitter {

    private socket: SocketIOClient.Socket = {} as any;
    private tableId: number | null = null;

    /**
     * 初始化客户端
     */
    public init(url: string = GlobalConfig.WEBSOCKET_SERVER_URL) {
        // init
        this.socket = io(url, {
            transportOptions: {
                polling: {
                    extraHeaders: {
                        'origin': `QOP####${uuidv4()}`
                    }
                }
            }
        });

        // init default events
        this.socket.on('connect', (data: any) => {
            this.emit('CONNECT', data);
        });
        this.socket.on('disconnect', (data: any) => {
            this.emit('DISCONNECT', data);
        });

        // init services events
        this.socket.on('JOIN_SUCCESS_MESSAGE', (data: any) => {
        });
        this.socket.on('LEAVE_SUCCESS_MESSAGE', (data: any) => {
        });
        this.socket.on('ERROR_MESSAGE', (data: any) => {
        });
    }

    /**
     * 连接`Websocket`服务器
     * @注意
     * 调用此方法前，必须要运行过一次`init()`。
     */
    public connect() {
        this.socket.connect();
    }

    /**
     * 加入一个订单
     * @注意
     * 调用此方法前，必须要运行过一次`init()`和`connect()`。
     */
    public joinOrder(tableId: number) {
        this.tableId = tableId;
        
        this.socket.emit('JOIN_ROOM', `QOP_TABLE_ID_${this.tableId}`);
        this.socket.on(`CHAT_MESSAGE`, (data: { content: EventObject }) => {

            if (_.get(data, 'content.event')) {
                switch (_.get(data, 'content.event')) {
                    // $ Create Order Request Events
                    case 'CREATE_ORDER_REQUEST_SUCCESSED': {
                        this.emit('CREATE_ORDER_REQUEST_SUCCESSED', data.content);
                        break;
                    }
                    case 'CREATE_ORDER_REQUEST_FAILED': {
                        this.emit('CREATE_ORDER_REQUEST_FAILED', data.content);
                        break;
                    }
                    case 'SEND_ORDER_REQUEST': {
                        this.emit('SEND_ORDER_REQUEST', data.content);
                        break;
                    }
                    case 'RESEND_ORDER_REQUEST': {
                        this.emit('RESEND_ORDER_REQUEST', data.content);
                        break;
                    }

                    // $ Service Events
                    case 'CART_COMMIT_OTHER': {
                        this.emit('CART_COMMIT_OTHER', data.content);
                        break;
                    }
                    case 'CART_COMMIT': {
                        this.emit('CART_COMMIT', data.content);
                        break;
                    }
                    case 'ADD_DISH_LOCK': {
                        this.emit('ADD_DISH_LOCK', data.content);
                        break;
                    }
                    case 'REMOVE_DISH_LOCK': {
                        this.emit('REMOVE_DISH_LOCK', data.content);
                        break;
                    }
                    case 'ADD_DISH_COUNT': {
                        this.emit('ADD_DISH_COUNT', data.content);
                        break;
                    }
                    case 'REMOVE_DISH_COUNT': {
                        this.emit('REMOVE_DISH_COUNT', data.content);
                        break;
                    }
                    case 'MODIFY_DISH': {
                        this.emit('MODIFY_DISH', data.content);
                        break;
                    }
                    case 'CREATE_DISH': {
                        this.emit('CREATE_DISH', data.content);
                        break;
                    }
                    case 'DELETE_DISH': {
                        this.emit('DELETE_DISH', data.content);
                        break;
                    }
                    case 'UPDATE_DISH': {
                        this.emit('UPDATE_DISH', data.content);
                        break;
                    }
                    case 'UPDATE_RESET_DISH': {
                        this.emit('UPDATE_RESET_DISH', data.content);
                        break;
                    }
                    case 'DISH_REPORT': {
                        this.emit('DISH_REPORT', data.content);
                        break;
                    }
                    case 'TABLE_STATUS': {
                        this.emit('TABLE_STATUS', data.content);
                        break;
                    }
                    case 'DISTRIBUTION_ID':{
                        this.emit('DISTRIBUTION_ID', data.content);
                        break;
                    }
                    case 'CUSTOMER_ID': {
                        this.emit('CUSTOMER_ID', data.content);
                        break;
                    }
                    case 'UPDATE_DISH_COUNT': {
                        this.emit('UPDATE_DISH_COUNT', data.content);
                        break;
                    }
                    case 'UPDATE_TURNRULES': {
                        this.emit('UPDATE_TURNRULES', data.content);
                        break;
                    }
                    case 'FIRST_JOIN': {
                        this.emit('FIRST_JOIN', data.content);
                        break;
                    }
                    case 'COUNT_DOWN_DISH': {
                        this.emit('COUNT_DOWN_DISH', data.content);
                        break;
                    }
                    case 'SET_NEXT_TURN_DISH': {
                        this.emit('SET_NEXT_TURN_DISH', data.content);
                        break;
                    }
                    case 'UPDATE_CONDIMENTS': {
                        this.emit('UPDATE_CONDIMENTS', data.content);
                        break;
                    }
                    case 'ADD_COMMIT_LOCK': {
                        this.emit('ADD_COMMIT_LOCK', data.content);
                        break;
                    }case 'REMOVE_COMMIT_LOCK': {
                        this.emit('REMOVE_COMMIT_LOCK', data.content);
                        break;
                    }
                    
                    default: { break; }
                }
                delete (data.content as any).event;
            }
        });
    }

    /**
     * 离开一个订单
     * @注意
     * 调用此方法前，必须要运行过一次`init()`和`connect()`。
     */
    public leaveOrder() {
        this.socket.emit('LEAVE_ROOM', `QOP_TABLE_ID_${this.tableId}`);
        this.tableId = null;
    }

    /**
     * 断开`Websocket`服务器
     */
    public disconnect() {
        this.socket.close();
        this.socket.disconnect();
    }

    /**
     * 往所有加入此订单的客户端发送消息
     * @注意
     * 调用此方法前，必须要运行过一次`init()`、`connect()`和`joinOrder()`。
     */
    public emitOrderClients(
        data: EventObject,
        callback: Function = () => { }
    ) {
        this.socket.emit(
            'SEND_IN_ROOM',
            {
                room: `QOP_TABLE_ID_${this.tableId}`,
                title: null,
                content: data
            },
            callback
        );
    }

}

export const WebsocketClient = new WebsocketClientClass();