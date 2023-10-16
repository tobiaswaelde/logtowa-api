import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, OneToMany } from 'typeorm';
import { ProjectGroup } from './project-group';
import { Log } from './log';

@Entity('projects')
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => ProjectGroup, (pg) => pg.projects, { onDelete: 'SET NULL' })
  parentGroup: ProjectGroup;

  @Column({ nullable: true, default: null })
  displayName?: string;

  @Column({ nullable: true, default: null })
  repoUrl?: string;

  @OneToMany(() => Log, (l) => l.project, { onDelete: 'CASCADE' })
  logs: Log[];
}
