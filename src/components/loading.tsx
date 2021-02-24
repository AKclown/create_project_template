import React from 'react';
import { CircularProgress } from '@material-ui/core';

// 自定义全局loading
export function CustomerLoading(
) {
    // *********************
    // View
    // *********************

    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#f1f4f870',
                zIndex: 9999
            }}>
            <CircularProgress style={{color:'#cc3333'}} />
        </div >
    )
}