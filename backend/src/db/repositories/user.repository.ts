import { AppDataSource } from "../db";
import { User } from "../entities/user";
import { Repository } from "typeorm";

export class UserRepository {
  private repo: Repository<User>;

  constructor() {
    this.repo = AppDataSource.getRepository(User);
  }

  /**
   * Find one user by email or username
   */
  async findOneByEmailOrUsername(
    email: string,
    username: string
  ): Promise<User | null> {
    // "where: [{ email }, { username }]" means it will find a user
    // that matches either condition. If none found, returns null.
    const existingUser = await this.repo.findOne({
      where: [{ email }, { username }],
    });
    return existingUser ?? null;
  }

  /**
   * Find a user by username
   */
  async findUserByUsername(username: string): Promise<User | null> {
    const user = await this.repo.findOneBy({ username });
    return user ?? null;
  }

  /**
   * (Optional) Find a user by email
   */
  async findUserByEmail(email: string): Promise<User | null> {
    const user = await this.repo.findOneBy({ email });
    return user ?? null;
  }

  /**
   * (Optional) Find a user by ID
   */
  async findUserById(id: number): Promise<User | null> {
    const user = await this.repo.findOneBy({ id });
    return user ?? null;
  }

  /**
   * Create and save a new user
   */
  async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<User> {
    const newUser = new User();
    newUser.username = username;
    newUser.email = email;
    newUser.password = password; // hashed already in controller
    return this.repo.save(newUser);
  }
}

export const userRepository = new UserRepository();
