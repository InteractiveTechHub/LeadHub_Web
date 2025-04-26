import { MessageSender, MessageStatus, MessageType } from "@core/enums";
import { MessageText } from "./MessageText";
import { MessagFile } from "@core/interfaces/messageFile";

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
  messageFiles?: MessagFile[];
  messageReaction: any;
  message?: MessageText;
  templateName?: string;
  templateId?: number;

  messageDateDivider?: string;
}
