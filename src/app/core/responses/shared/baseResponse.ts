import { Message } from "@core/models/message";

export class BaseResponse {
    messages: Array<Message> = new Array<Message>();
}