import { Injectable } from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";
import { Attachment } from 'src/chat/dtos/attachment.dto';

@Injectable()
export class UploadFileService {
  private readonly RESOURCES_PATH = "./resources";
  private readonly SERVE_PATH = "public"

  constructor(

  ) {}

  async saveUserAvatar(avatar: Express.Multer.File) {

  }

  saveChatAttachments(roomChatId: string, files: Attachment[]) {
    const folderPath = `${this.RESOURCES_PATH}/${roomChatId}`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    if (files.length == 0) {
      return [];
    }

    const savedFilesPath = [];
    files.forEach(file => {
      const originalFileName = file.name;
      let filePath = `${folderPath}/${originalFileName}`;

      if (fs.existsSync(filePath)) {
        filePath = this.resolveDuplicateFileNames(filePath);
      }

      fs.writeFileSync(filePath, file.buffer);
      savedFilesPath.push(filePath.replace(this.RESOURCES_PATH, this.SERVE_PATH));
    })

    return savedFilesPath;
  }

  removeFiles(filesPath: string[]) {
    for (let filePath of filesPath) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
  }

  private resolveDuplicateFileNames(filePath: string) {
    let counter = 1;
    const fileExtension = path.extname(filePath);
    const fileName = filePath.replace(fileExtension, "");
    
    while (fs.existsSync(`${fileName} (${counter})${fileExtension}`)) {
      counter ++;
    }

    return `${fileName} (${counter})${fileExtension}`;
  }
}
