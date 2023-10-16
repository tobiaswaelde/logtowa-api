import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Project } from './project';

@Entity('projectgroups', { orderBy: { name: 'ASC' } })
export class ProjectGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => ProjectGroup, (pg) => pg.children, { onDelete: 'SET NULL' })
  parent?: ProjectGroup;

  @OneToMany(() => ProjectGroup, (pg) => pg.parent, { onDelete: 'SET NULL' })
  children: ProjectGroup[];

  @OneToMany(() => Project, (p) => p.parentGroup)
  projects: Project[];
}
