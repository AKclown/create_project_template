import { MapStateToPropsParam, connect, Options } from 'react-redux';
import { Class } from '../constants';

/**
 * An overload decorator of `Redux @connect()` ([offical doc](https://react-redux.js.org/api/connect)).
 * The purpose of this decorator is to avoid `ts(1238)` error, origin post
 * in [TypeScript/issues/9365](https://github.com/microsoft/TypeScript/issues/9365#issue-162331957).
 * @param mapStateToProps
 * @param options optional
 */
// tslint:disable-next-line: function-name
export function ReduxConnect<TStateProps = {}, no_dispatch = {}, TOwnProps = {}, State = {}>(
    mapStateToProps: MapStateToPropsParam<TStateProps, TOwnProps, State>,
    options: Options<State, TStateProps, TOwnProps> = {}
): any {
    return (target: Class<React.Component>) =>
        connect(mapStateToProps, null, null, options)(target);
}
