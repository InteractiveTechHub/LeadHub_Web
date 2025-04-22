import { Component, CUSTOM_ELEMENTS_SCHEMA, input, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';

import 'emoji-picker-element';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';
import { TemplatesPerType, WhatsAppTemplateDto } from '@core/Dtos';
import { ChatMessageService } from '@core/services';
import { PRIME_NG_MODULES } from '@core/utils';
import { MessageText, Timeline } from '@core/models';
import { MessageType } from '@core/enums';

@Component({
  selector: 'app-chat-input-message',
  imports: [...PRIME_NG_MODULES, ReactiveFormsModule, PopoverModule],
  templateUrl: './chat-input-message.component.html',
  styleUrl: './chat-input-message.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatInputMessageComponent implements OnInit {
  @Input() templates?: Array<TemplatesPerType>;

  @ViewChild('emojiPopover') emojiPopover!: Popover;
  @ViewChild('filePopover') filePopover!: Popover;

  chatForm!: FormGroup;
  canSendMessage: boolean = false;
  templateDialogVisible: boolean = false;

  constructor(
    private form: FormBuilder,
    private chatService: ChatMessageService) {
    polyfillCountryFlagEmojis('Twemoji Mozilla');
  }

  ngOnInit(): void {
    this.chatService.chatMessageToolBox$.subscribe(isNotDisabled => {
      this.canSendMessage = isNotDisabled;
    });

    this.buildForm();
  }

  public handleEnterKeyEvent(event: any) : void {
    const messageControl = this.chatForm.get('message');
    if (!messageControl) return;

    const textarea = event.target as HTMLTextAreaElement;
    const cursorPos = textarea.selectionStart; // Posição atual do cursor
    const textBefore = messageControl.value.substring(0, cursorPos);
    const textAfter = messageControl.value.substring(cursorPos);

    const newText = textBefore + '\n' + textAfter;
    messageControl.setValue(newText)

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = cursorPos + 1;
    }, 0);
  }

  public sendTemplate(templateSelected: WhatsAppTemplateDto) {
    const timeline = new Timeline();
    timeline.type = MessageType.template;
    timeline.templateId = templateSelected.id;

    timeline.message = new MessageText();
    timeline.message!.body = templateSelected.templateBodyMirror;

    this.chatService.sendMessage(timeline);

    this.templateDialogVisible = false;
  }

  /**
   * Select emoji
   * @param event
  */
  public onEmojiSelected(event: any) {
    const emoji = event.detail.unicode;
    const messageControl = this.chatForm.get('message');

    if (messageControl) {
      const currentMessage = messageControl.value || '';
      const newMessage = currentMessage + emoji;
      messageControl.setValue(newMessage);
    }

    this.emojiPopover?.toggle(event);
  }

  public sendTextMessage() {
    if (this.chatForm.valid) {
      const message = this.chatForm.get('message')?.value.trim();

      const timeline = new Timeline();
      timeline.type = MessageType.text;

      timeline.message = new MessageText();
      timeline.message!.body = message;

      this.chatService.sendMessage(timeline);
      this.chatForm.reset();
    }
  }

  /**
  * Opens and close emoji popover
  * @param event
  */
  public toggleEmogiPopover(event: any) {
     document.documentElement.style.setProperty('--p-popover-background', 'var(--p-surface-800)');
     this.emojiPopover?.toggle(event);
   }

  /**
   * Open and close file popover
   * @param event
  */
  public toggleFilePopover(event: any) {
    document.documentElement.style.setProperty('--p-popover-background', 'var(--p-surface-800)');
    this.filePopover?.toggle(event);
  }

  public openTemplateDialog(event: any) {
    //document.documentElement.style.setProperty('--p-popover-background', 'var(--p-surface-800)');
    this.templateDialogVisible = true;
  }

  private buildForm() {
    const templateWarn = this.canSendMessage ? 'Atenção! Evie um template para continuar a conversa.' : '';

    this.chatForm = this.form.group({
      message: [templateWarn, [Validators.required, Validators.minLength(1)]]
    });
  }
}
