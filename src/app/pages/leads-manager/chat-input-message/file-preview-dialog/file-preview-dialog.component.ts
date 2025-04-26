import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChatMessageService } from '@core/services';
import { PRIME_NG_MODULES } from '@core/utils';
import { PrimeNG } from 'primeng/config';

@Component({
  selector: 'app-file-preview-dialog',
  imports: [...PRIME_NG_MODULES, FormsModule],
  templateUrl: './file-preview-dialog.component.html',
  styleUrl: './file-preview-dialog.component.scss'
})
export class FilePreviewDialogComponent {
  @Input() showModal!: boolean;
  @Input() leadId!: number;

  files = [];
  totalSize : number = 0;
  totalSizePercent : number = 0;

  constructor(private config: PrimeNG, private chatService: ChatMessageService) {}

  chooseFileCallback: () => void = () => {};

  choose(event: any, callback: any) {
      callback();
  }

  uploadEvent(callback: any) {
    callback();
}

  onRemoveTemplatingFile(event: any, file: any, removeFileCallback: any, index: any) {
      removeFileCallback(event, index);
      this.totalSize -= parseInt(this.formatSize(file.size));
      this.totalSizePercent = this.totalSize / 10;
  }

  onClearTemplatingUpload(clear: any) {
      clear();
      this.totalSize = 0;
      this.totalSizePercent = 0;
  }

  onTemplatedUpload(event: any) {
    this.chatService.sendFiles(event.files);
  }

  onSelectedFiles(event: any) {
    for (let file of event.currentFiles) {
      const reader = new FileReader();
      const isImage = file.type.startsWith('image');
      const isVideo = file.type.startsWith('video');

      reader.onload = (e: any) => {
        file.previewUrl = e.target.result;
        file.caption = '';
        file.isImage = isImage;
        file.isVideo = isVideo;
        file.progress = 0;
      };

      reader.readAsDataURL(file);
    }
  }

  formatSize(bytes: any) {
      const k = 1024;
      const dm = 3;
      const sizes = this.config.translation.fileSizeTypes;
      if (bytes === 0) {
          return `0 ${sizes![0]}`;
      }

      const i = Math.floor(Math.log(bytes) / Math.log(k));
      const formattedSize = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));

      return `${formattedSize} ${sizes![i]}`;
  }

  saveChooseCallback(callback: () => void): boolean {
    this.chooseFileCallback = callback;
    return true;
  }
}
