import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { App } from './app';

@Entity('groups', { orderBy: { name: 'ASC' } })
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Group, (pg) => pg.children, { onDelete: 'SET NULL' })
  parent?: Group;

  @OneToMany(() => Group, (pg) => pg.parent, { onDelete: 'SET NULL' })
  children: Group[];

  @OneToMany(() => App, (p) => p.group)
  apps: App[];
}
