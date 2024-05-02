import { Injectable } from '@nestjs/common';
import * as path from "path";
import * as fs from "fs";
import { Attachment } from 'src/chat/dtos/attachment.dto';

@Injectable()
export class UploadFileService {
  private readonly RESOURCES_PATH = "./resources";
  private readonly AVATAR_PATH = "./resources/avatars"
  private readonly SERVE_PATH = "public"

  constructor(

  ) {}

  async saveAvatar(avatar: Express.Multer.File) {
    if (!fs.existsSync(this.AVATAR_PATH)) {
      fs.mkdirSync(this.AVATAR_PATH, { recursive: true });
    }
    const randomName = `${Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')}${path.extname(avatar.originalname)}`;
    const filePath = `${this.AVATAR_PATH}/${randomName}`;

    fs.writeFileSync(filePath, avatar.buffer);
    return filePath.replace(this.AVATAR_PATH, `${this.SERVE_PATH}/avatars`);
  }

  removeOldAvatar(avatarPath: string) {
    if (avatarPath.includes("default-avatar.jpg")) return;
    const actualAvatarPath = avatarPath.replace(this.SERVE_PATH, this.RESOURCES_PATH);
    if (fs.existsSync(actualAvatarPath)) {
      fs.unlinkSync(actualAvatarPath);
    }
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
