import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { Group } from './group';
import { Log } from './log';

@Entity('apps')
export class App {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Group, (pg) => pg.apps, { onDelete: 'SET NULL' })
  group: Group;

  @Column({ nullable: true, default: null, length: 255 })
  name: string;

  @Column({ nullable: true, default: null, length: 2000 })
  repoUrl?: string;

  @Column({ nullable: false, default: 60 * 60 * 24 * 30 })
  retentionSeconds: number;

  @OneToMany(() => Log, (l) => l.app, { onDelete: 'CASCADE' })
  logs: Log[];
}
