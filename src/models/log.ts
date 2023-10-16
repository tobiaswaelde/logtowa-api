import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Project } from './project';
import { jsonTransformer } from '../util/db';

@Entity('logs', { orderBy: {} })
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @ManyToOne(() => Project, (p) => p.logs)
  project: Project;

  @Column()
  level: string;

  @Column({ nullable: true, default: null })
  scope?: string;

  @Column()
  message: string;

  @Column('jsonb', { nullable: true, default: null, transformer: jsonTransformer })
  meta?: object;
}
