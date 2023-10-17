import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { ProjectGroup } from './project-group';
import { Log } from './log';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProjectGroup, (pg) => pg.projects, { onDelete: 'SET NULL' })
  group: ProjectGroup;

  @Column({ nullable: true, default: null, length: 255 })
  name: string;

  @Column({ nullable: true, default: null, length: 2000 })
  repoUrl?: string;

  @OneToMany(() => Log, (l) => l.project, { onDelete: 'CASCADE' })
  logs: Log[];
}
