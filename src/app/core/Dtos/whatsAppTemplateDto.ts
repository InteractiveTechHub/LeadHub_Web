import { TemplateType } from "@core/enums";

export class WhatsAppTemplateDto {
  id!: number;
  name!: string;
  templateBodyMirror!: string;
  templateType!: TemplateType;
}
