export type DemoTable = {
  id: number;
  restaurantId: number;
  title: string;
  capacity: number;
};

const createInitialDemoTables = (): DemoTable[] => [
  { id: -11, restaurantId: -1, title: 'Table Terrasse', capacity: 2 },
  { id: -12, restaurantId: -1, title: 'Table Fenetre', capacity: 4 },
  { id: -13, restaurantId: -1, title: 'Table Patio', capacity: 6 },
  { id: -21, restaurantId: -2, title: 'Table Chef', capacity: 2 },
  { id: -22, restaurantId: -2, title: 'Table Salon', capacity: 4 },
  { id: -23, restaurantId: -2, title: 'Table Jardin', capacity: 8 },
];

export class DemoTablesStore {
  private tables: DemoTable[] = createInitialDemoTables();

  listByRestaurantId(restaurantId: number): DemoTable[] {
    return this.tables.filter((table) => table.restaurantId === restaurantId);
  }

  getById(id: number): DemoTable | undefined {
    return this.tables.find((table) => table.id === id);
  }

  create(dto: { restaurantId: number; title: string; capacity: number }): DemoTable {
    const nextId = this.nextDemoId();
    const table: DemoTable = {
      id: nextId,
      restaurantId: dto.restaurantId,
      title: dto.title,
      capacity: dto.capacity,
    };
    this.tables = [table, ...this.tables];
    return table;
  }

  update(id: number, dto: Partial<{ title: string; capacity: number }>): DemoTable {
    const table = this.getById(id);
    if (!table) {
      throw new Error('Demo table not found');
    }
    const updated: DemoTable = {
      ...table,
      title: dto.title ?? table.title,
      capacity: dto.capacity ?? table.capacity,
    };
    this.tables = this.tables.map((item) => (item.id === id ? updated : item));
    return updated;
  }

  delete(id: number): void {
    this.tables = this.tables.filter((table) => table.id !== id);
  }

  private nextDemoId(): number {
    const minId = this.tables.reduce((min, table) => Math.min(min, table.id), -11);
    return minId - 1;
  }
}
