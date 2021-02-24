// $ The configuration of the message bar (do not change at will) can be used in any component and method, the official one is only used in the component
import React from 'react'
import { useSnackbar, WithSnackbarProps, OptionsObject } from 'notistack';

interface IProps {
    setUseSnackbarRef: (showSnackbar: WithSnackbarProps) => void
}

const InnerSnackbarUtilsConfigurator: React.FC<IProps> = (props: IProps) => {
    props.setUseSnackbarRef(useSnackbar())
    return null
}

let useSnackbarRef: WithSnackbarProps
const setUseSnackbarRef = (useSnackbarRefProp: WithSnackbarProps) => {
    useSnackbarRef = useSnackbarRefProp
}

export const SnackbarUtilsConfigurator = () => {
    return <InnerSnackbarUtilsConfigurator setUseSnackbarRef={setUseSnackbarRef} />
}

export default {
    success(message: string) {
        try {
            this.notification(`${message}`, { variant: 'success' });
        }
        // tslint:disable-next-line:no-empty
        catch (err) { }
    },
    warning(message: string) {
        try {
            this.notification(`${message}`, { variant: 'warning' });
        }
        // tslint:disable-next-line:no-empty
        catch (err) { }
    },
    info(message: string) {
        try {
            this.notification(`${message}`, { variant: 'info' });

        }
        // tslint:disable-next-line:no-empty
        catch (error) { }
    },
    error(message: string) {
        try {
            this.notification(`${message}`, { variant: 'error' });
        }
        // tslint:disable-next-line:no-empty
        catch (error) { }
    },
    notification(message: string, options?: OptionsObject) {
        try {
            useSnackbarRef.enqueueSnackbar(message, { ...options });
        }
        // tslint:disable-next-line:no-empty
        catch (error) { }
    }
}