import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, signal, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatMessageService } from '@core/services/chat-message.service';
import { PRIME_NG_MODULES } from '@core/utils';

import { Popover } from 'primeng/popover';
import { PopoverModule } from 'primeng/popover';

import 'emoji-picker-element';
import { polyfillCountryFlagEmojis } from 'country-flag-emoji-polyfill';

@Component({
  selector: 'app-chat-input-message',
  imports: [...PRIME_NG_MODULES, ReactiveFormsModule, PopoverModule],
  templateUrl: './chat-input-message.component.html',
  styleUrl: './chat-input-message.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ChatInputMessageComponent implements OnInit {
  @ViewChild('popover') popover!: Popover;

  chatForm!: FormGroup;

  constructor(
    private form: FormBuilder,
    private chatService: ChatMessageService) {
    polyfillCountryFlagEmojis('Twemoji Mozilla');
  }

  ngOnInit(): void {
    this.buildForm();
  }

  toggleEmogiPopover(event: any) {
    this.popover?.toggle(event);
  }

  onEmojiSelected(event: any) {
    const emoji = event.detail.unicode;
    const messageControl = this.chatForm.get('message');

    if (messageControl) {
      const currentMessage = messageControl.value || '';
      const newMessage = currentMessage + emoji;
      messageControl.setValue(newMessage);
    }
  }

  sendMessage() {
    if (this.chatForm.valid) {
      const message = this.chatForm.get('message')?.value.trim();

      this.chatService.sendMessage(message);
      this.chatForm.reset();
    }
  }

  private buildForm() {
    this.chatForm = this.form.group({
      message: ['', [Validators.required, Validators.minLength(1)]]
    });
  }
}
