import { Request, Response } from "express";
import { uomRepository } from "../db/repositories/unit.repository";
import { userRepository } from "../db/repositories/user.repository";

/**
 * Get all units of measure for a user or default (null user)
 */
export const getAllUoms = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await userRepository.findUserById((req as any).userId);
    const uoms = user
      ? await uomRepository.findUomsByUser(user)
      : await uomRepository.findAllUoms();
    res.json(uoms);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * Create a new unit of measure
 */
export const createUom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, symbol } = req.body;
    const user = await userRepository.findUserById((req as any).userId);
    const newUom = await uomRepository.createUom(name, symbol, user);
    res.status(201).json(newUom);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 *  Create a new default unit of measure (admins only)
 */
export const createDefaultUom = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { name, symbol } = req.body;
    const newUom = await uomRepository.createDefaultUom(name, symbol);
    res.status(201).json(newUom);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * Update an existing unit of measure
 */
export const updateUom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, symbol } = req.body;
    const updatedUom = await uomRepository.updateUom(Number(id), name, symbol);
    res.json(updatedUom);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * Delete a unit of measure
 */
export const deleteUom = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await uomRepository.deleteUom(Number(id));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};
