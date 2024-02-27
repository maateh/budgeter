import { UUID } from "crypto"
import { z } from "zod"

// interfaces
import { IBudgetNoteAPI } from "@/services/api/interfaces"

// types
import { BudgetNote } from "@/services/api/types"

// validations
import { BudgetNoteValidation } from "@/lib/validation"

// storage
import StorageHelper from "@/services/storage/StorageHelper"

class BudgetNoteStorageAPI implements IBudgetNoteAPI {
  private static _instance: BudgetNoteStorageAPI

  private storage: StorageHelper<BudgetNote>

  private constructor() {
    this.storage = new StorageHelper('notes')
  }

  public static getInstance(): BudgetNoteStorageAPI {
    if (!BudgetNoteStorageAPI._instance) {
      BudgetNoteStorageAPI._instance = new BudgetNoteStorageAPI()
    }
    return BudgetNoteStorageAPI._instance
  }

  public async getByStatus(budgetId: UUID, status: BudgetNote['status']): Promise<BudgetNote[]> {
    return await this.storage
      .find((note) => note.budgetId === budgetId && note.status === status)
  }

  public async create(budgetId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote> {
    return await this.storage.save({
      id: crypto.randomUUID(),
      budgetId,
      text: data.text,
      status: 'open',
      createdAt: new Date()
    })
  }

  public async updateText(_budgetId: UUID, noteId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote> {
    const note = await this.storage.findById(noteId)

    return await this.storage.save({
      ...note,
      text: data.text,
      editedAt: new Date()
    })
  }

  public async updateStatus(_budgetId: UUID, noteId: UUID, status: BudgetNote['status']): Promise<BudgetNote> {
    const note = await this.storage.findById(noteId)

    return await this.storage.save({
      ...note,
      status,
      closedAt: status === 'closed' ? new Date() : undefined
    })
  }

  public async delete(_budgetId: UUID, noteId: UUID): Promise<BudgetNote> {
    const note = await this.storage.findById(noteId)

    await this.storage.delete(noteId)
    return note
  }

  // helpers
  public getStorage() {
    return this.storage
  }
}

export default BudgetNoteStorageAPI
