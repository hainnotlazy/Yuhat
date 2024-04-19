import { Exclude } from "class-transformer";
import { MaxLength, MinLength } from "class-validator";
import { BeforeInsert, Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { RoomChatParticipant } from "./room-chat-participant.entity";
import { Message } from "./message.entity";

enum GenderTypes {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // FIXME: typeorm doesn't have min-maxlength
  @Column({ unique: true })
  @MinLength(5)
  @MaxLength(50)
  username: string;

  @Column()
  @MinLength(8)
  @MaxLength(100)
  @Exclude()
  password: string;

  @Column({ nullable: true })
  @MinLength(3)
  @MaxLength(255)
  fullname: string;

  @Column({ nullable: true, type: "date" })
  dob: Date;

  @Column({ nullable: true })
  @MaxLength(255)
  bio: string;

  @Column({
    type: "enum",
    enum: GenderTypes,
    default: GenderTypes.OTHER
  })
  gender: string;

  @Column({ nullable: true })
  avatar: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  @Exclude()
  forgetPasswordCode: number;

  @Column({ default: null })
  @Exclude()
  emailVerificationCode: number;

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ nullable: true })
  availableTimeVerifyEmail: Date;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  github: string;

  @OneToMany(() => RoomChatParticipant, participants => participants.user)
  participants: RoomChatParticipant[];

  @OneToMany(() => Message, messages => messages.sender)
  messages: Message[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @BeforeInsert()
  generateFullnameIfNotProvided() {
    if (!this.fullname) {
      this.fullname = `Unnamed user ${Math.floor(Math.random() * 100000)}`;
    }
  }

  @BeforeInsert()
  generateEmailVerificationCode() {
    if (this.email && !this.emailVerified) {
      this.emailVerificationCode = Math.floor(100000 + Math.random() * 900000);
    }
  }
}