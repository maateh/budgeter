import { z } from "zod"

// interfaces
import { IBudgetNoteAPI } from "@/services/api/interfaces"

// types
import { Budget, BudgetNote, Pagination, QueryOptions } from "@/services/api/types"

// validations
import { noteFormSchema } from "@/lib/validations"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import { BudgetStorageAPI } from "@/services/storage/collections"

// utils
import { paginate } from "@/utils"

class BudgetNoteStorageAPI implements IBudgetNoteAPI {
  private static _instance: BudgetNoteStorageAPI

  private storage: StorageHelper<BudgetNote>

  private constructor() {
    this.storage = new StorageHelper('notes')
  }

  public static getInstance() {
    if (!this._instance) {
      this._instance = new BudgetNoteStorageAPI()
    }
    return this._instance
  }

  public async getByIdWithBudget(_: string, noteId: string): Promise<BudgetNote & { budget: Budget }> {
    const note = await this.storage.findById(noteId)
    const budget = await BudgetStorageAPI.getInstance().getById(note.budgetId)
    return { ...note, budget }
  }

  public async get({ params, filterBy }: QueryOptions<BudgetNote> = {}): Promise<Pagination<BudgetNote>> {
    const notes = await this.storage.find(filterBy)
    return paginate(notes, params)
  }

  public async create(budgetId: string, data: z.infer<typeof noteFormSchema>): Promise<BudgetNote> {
    return await this.storage.save({
      id: crypto.randomUUID(),
      budgetId,
      text: data.text,
      status: 'open',
      createdAt: new Date()
    })
  }

  public async updateText(_: string, noteId: string, data: z.infer<typeof noteFormSchema>): Promise<BudgetNote> {
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
