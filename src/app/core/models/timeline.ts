import { MessageSender, MessageStatus, MessageType } from "@core/enums";
import { MessageText } from "./MessageText";

export class Timeline {
  id: number = 0;
  consultantId?: number;
  leadId!: number;
  messageId!: string;
  messageDate!: Date;
  messageFileId?: number;
  messageTextId?: number;
  readAt?: Date;
  sender!: MessageSender;
  status!: MessageStatus;
  type!: MessageType;
  messageFile: any;
  messageReaction: any;
  message?: MessageText;

  messageDateDivider?: string;
}
