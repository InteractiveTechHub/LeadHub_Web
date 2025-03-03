import { BaseResponse } from "./baseResponse";

export class Response<T> extends BaseResponse {
    model?: T;
    responseData: Array<T> = new Array<T>;
    totalAvailableItems: number = 0;
}
