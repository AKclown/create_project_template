import React from 'react';
import { SnackbarProvider } from 'notistack';
import { SnackbarUtilsConfigurator } from './components/snackbar';
import AppRouter from './router';
import { Button } from '@material-ui/core';
import { CustomerLoading } from './components/loading';
import CloseIcon from '@material-ui/icons/Close';
import { ReduxConnect } from './decorators/redux-connect.decorator';
import { States } from './redux/type';
@ReduxConnect((defaultState: States) => {
    return {
        globalLoading: defaultState?.globalLoading || false
    };
}) 
class APP extends React.Component<Props, State> {
    // notice
    notistackRef: any;

    constructor(props: Props) {
        super(props)
        this.notistackRef = React.createRef();
    }

    state: State = {
    }
    // *********************
    // Default Function
    // *********************

    // *********************
    // Life Cycle Function
    // *********************

    // *********************
    // Service Function
    // *********************

    // close notice
    onClickDismiss = (key: any) => () => {
        this.notistackRef.current.closeSnackbar(key);
    }

    // *********************
    // View
    // *********************

    render() {
        const { globalLoading } = this.props;
        return (
            <div id='App'>
                {/* 全局消息通知 */}
                <SnackbarProvider
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center'
                    }}
                    autoHideDuration={8000}
                    maxSnack={3}
                    ref={this.notistackRef}
                    action={(key) => (
                        <Button className='closeNotice' onClick={this.onClickDismiss(key)}>
                            <CloseIcon className='icon' />
                        </Button>
                    )}
                >
                    <SnackbarUtilsConfigurator />
                    {/* 路由 */}
                    <AppRouter />

                </SnackbarProvider>
                {
                    // 全局loading
                    globalLoading && (
                        <CustomerLoading />
                    )
                }
            </div>
        )
    }
}
export default APP

// *********************
// Props & State
// *********************

type Props = {
    globalLoading?: boolean;
}

type State = {
}