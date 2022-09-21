import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Franchisee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  franchisee_name: string;
  @Column()
  franchisee_manager: string;
  @Column()
  franchisee_address_city: string;
  @Column()
  franchisee_address_state: string;
  @Column()
  franchisee_address_line: string;
}
