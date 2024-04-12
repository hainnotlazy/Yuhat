import { Injectable } from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";
import { count } from 'console';

@Injectable()
export class UploadFileService {
  private readonly RESOURCES_PATH = "./resources";

  constructor(

  ) {}

  async saveUserAvatar(avatar: Express.Multer.File) {

  }

  saveChatAttachments(roomChatId: string, files: Array<Express.Multer.File>) {
    const folderPath = `${this.RESOURCES_PATH}/${roomChatId}`;

    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    if (files.length == 0) {
      return [];
    }

    const savedFilesPath = [];
    files.forEach(file => {
      const originalFileName = file.originalname;
      let filePath = `${folderPath}/${originalFileName}`;

      if (fs.existsSync(filePath)) {
        filePath = this.resolveDuplicateFileNames(filePath);
      }

      fs.writeFileSync(filePath, file.buffer);
      savedFilesPath.push(filePath);
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
