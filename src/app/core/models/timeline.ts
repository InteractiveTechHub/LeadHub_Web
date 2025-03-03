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
  sender!: number;
  status!: number;
  type!: number;
  messageFile: any;
  messageReaction: any;
  message?: MessageText;

  messageDateDivider?: string;
}
