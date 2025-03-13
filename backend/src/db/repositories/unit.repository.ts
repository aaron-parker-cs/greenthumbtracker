import { Repository } from "typeorm";
import { UnitOfMeasure } from "../entities/unit";
import { AppDataSource } from "../db";
import { User } from "../entities/user";

export class UomRepository {
  private repo: Repository<UnitOfMeasure>;

  constructor() {
    this.repo = AppDataSource.getRepository(UnitOfMeasure);
  }

  /**
   * Find a unit of measure by ID
   */
  async findUomById(id: number): Promise<UnitOfMeasure | null> {
    const uom = await this.repo.findOneBy({ id });
    return uom ?? null;
  }

  /**
   * Find all units of measure
   */
  async findAllUoms(): Promise<UnitOfMeasure[]> {
    return this.repo.find();
  }

  /**
   * Create and save a new unit of measure
   */
  async createUom(
    name: string,
    symbol: string,
    createdUser: User | null
  ): Promise<UnitOfMeasure> {
    const newUom = new UnitOfMeasure();
    newUom.name = name;
    newUom.symbol = symbol;
    newUom.createdUser = createdUser;
    return this.repo.save(newUom);
  }

  /**
   * Find all units of measure created by a user
   */
  async findUomsByUser(user: User): Promise<UnitOfMeasure[]> {
    return this.repo
      .createQueryBuilder("uom")
      .where("uom.createdUser = :user OR uom.createdUser IS NULL", {
        user: user.id,
      })
      .getMany();
  }

  /**
   * Create and save a default unit of measure for any user
   */
  async createDefaultUom(name: string, symbol: string): Promise<UnitOfMeasure> {
    return this.createUom(name, symbol, null);
  }

  /**
   * Update a unit of measure
   */
  async updateUom(
    id: number,
    name: string,
    symbol: string
  ): Promise<UnitOfMeasure> {
    const uom = await this.findUomById(id);
    if (!uom) throw new Error("Unit of measure not found");

    uom.name = name;
    uom.symbol = symbol;
    return this.repo.save(uom);
  }

  /**
   * Delete a unit of measure
   */
  async deleteUom(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}

export const uomRepository = new UomRepository();
