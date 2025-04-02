import { TemplateType } from "@core/enums";
import { WhatsAppTemplateDto } from "./whatsAppTemplateDto";

export class TemplatesPerType {
    templateType!: TemplateType;
    templates!: WhatsAppTemplateDto[];
    isAppointmentTemplate!: boolean;
    isCustomerFeedBackTemplate!: boolean;
    isFollowUpTemplate!: boolean;
    isWelcomeMessage!: boolean;
}
