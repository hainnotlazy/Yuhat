import { Exclude } from "class-transformer";
import { MaxLength, MinLength } from "class-validator";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

enum GenderTypes {
  MALE = "male",
  FEMALE = "female",
  OTHER = "other"
}

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

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
  fullname: string;

  @Column({ nullable: true })
  age: number;

  @Column({ nullable: true })
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

  @Column({ default: false })
  emailVerified: boolean;

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ nullable: true })
  github: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}