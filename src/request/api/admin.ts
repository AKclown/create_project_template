import http, { httpError, HttpSuccessOrErrorType } from '../http';
export default {
    // $例子
    async get_admin_id_id(_id?: string): Promise<HttpSuccessOrErrorType<unknown>> {
        return await http.get(`/admin/_id/${_id}`, {
        }).catch(err => httpError(err))
    },
}