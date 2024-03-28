import { z } from "zod"

// interfaces
import { IBudgetNoteAPI } from "@/services/api/interfaces"

// types
import { Budget, BudgetNote, Pagination, PaginationParams } from "@/services/api/types"

// validations
import { budgetNoteSchema } from "@/components/form/budget-note/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import BudgetStorageAPI from "@/services/storage/BudgetStorageAPI"

// utils
import { paginate } from "@/utils"

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

  public async getByIdWithBudget(_: string, noteId: string): Promise<BudgetNote & { budget: Budget }> {
    const note = await this.storage.findById(noteId)
    const budget = await BudgetStorageAPI.getInstance().getById(note.budgetId)
    return { ...note, budget }
  }

  public async getPaginated(params: PaginationParams, filterBy?: Partial<BudgetNote>): Promise<Pagination<BudgetNote>> {
    const notes = await this.storage.find(filterBy)
    return paginate(notes, params)
  }

  public async create(budgetId: string, data: z.infer<typeof budgetNoteSchema>): Promise<BudgetNote> {
    return await this.storage.save({
      id: crypto.randomUUID(),
      budgetId,
      text: data.text,
      status: 'open',
      createdAt: new Date()
    })
  }

  public async updateText(_: string, noteId: string, data: z.infer<typeof budgetNoteSchema>): Promise<BudgetNote> {
    const note = await this.storage.findById(noteId)

    return await this.storage.save({
      ...note,
      text: data.text,
      editedAt: new Date()
    })
  }

  public async updateStatus(_: string, noteId: string, status: BudgetNote['status']): Promise<BudgetNote> {
    const note = await this.storage.findById(noteId)

    return await this.storage.save({
      ...note,
      status,
      closedAt: status === 'closed' ? new Date() : undefined
    })
  }

  public async delete(_: string, noteId: string): Promise<BudgetNote> {
    const note = await this.storage.findById(noteId)

    await this.storage.deleteById(noteId)
    return note
  }

  // helpers
  public getStorage() {
    return this.storage
  }
}

export default BudgetNoteStorageAPI
