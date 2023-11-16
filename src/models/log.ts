import { Column, Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { App } from './app';
import { jsonTransformer } from '../util/db';

@Entity('logs', { orderBy: { timestamp: 'DESC', ns: 'DESC' } })
export class Log {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('timestamp', { default: () => 'CURRENT_TIMESTAMP' })
  timestamp: Date;

  @Column('integer')
  ns: number;

  @ManyToOne(() => App, (p) => p.logs)
  app: App;

  @Column()
  @Column({ length: 255 })
  level: string;

  @Column({ nullable: true, default: null })
  @Column({ nullable: true, default: null, length: 255 })
  scope?: string;

  @Column()
  message: string;

  @Column('jsonb', { nullable: true, default: null, transformer: jsonTransformer })
  meta?: object;
}
