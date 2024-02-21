import { UUID } from "crypto"
import { z } from "zod"

// interfaces
import { INewBudgetAPI } from "@/services/api/interfaces"

// types
import { Budget, BudgetNote } from "@/services/api/types"
import { StorageCollection } from "@/services/storage/types"

// storage
import StorageHelper from "@/services/storage/StorageHelper"

// validations
import { BudgetNoteValidation, BudgetValidation } from "@/lib/validation"

class BudgetStorageAPI implements INewBudgetAPI {
  private static _instance: BudgetStorageAPI
  private storage: StorageHelper<Budget>

  private constructor() {
    this.storage = new StorageHelper()
  }

  public static getInstance(): BudgetStorageAPI {
    if (!BudgetStorageAPI._instance) {
      BudgetStorageAPI._instance = new BudgetStorageAPI()
    }
    return BudgetStorageAPI._instance
  }

  async get(id: UUID): Promise<Budget> {
    return await this.storage.findById('budgets', id)
  }

  async getAll(): Promise<StorageCollection<Budget>> {
    return await this.storage.find('budgets')
  }

  async create(data: z.infer<typeof BudgetValidation>): Promise<Budget> {
    const budget: Budget = {
      id: crypto.randomUUID(),
      notes: {},
      ...data
    }

    return await this.storage.save('budgets', budget)
  }

  async update(id: UUID, data: z.infer<typeof BudgetValidation>): Promise<Budget> {
    const budget = {
      ...await this.storage.findById('budgets', id),
      ...data
    }

    return await this.storage.save('budgets', budget)
  }

  async delete(id: UUID): Promise<void> {
    await this.storage.delete('budgets', id)
  }
  
  async addNote(budgetId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote> {
    const budget = await this.storage.findById('budgets', budgetId)

    const noteId = crypto.randomUUID()
    const note = {
      id: noteId, text: data.text,
      date: {
        created: new Date()
      }
    }

    budget.notes[noteId] = note
    await this.storage.save('budgets', budget)
    return note
  }

  async editNoteText(budgetId: UUID, noteId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote> {
    const budget = await this.storage.findById('budgets', budgetId)
    
    const note = budget.notes[noteId]
    note.text = data.text
    note.date.edited = new Date()

    budget.notes[noteId] = note
    await this.storage.save('budgets', budget)
    return note
  }

  async changeNoteStatus(budgetId: string, noteId: string, status: "open" | "closed"): Promise<BudgetNote> {
    const budget = await this.storage.findById('budgets', budgetId)

    const note = budget.notes[noteId]
    note.date.closed = status === 'open'
      ? undefined
      : new Date()

    budget.notes[noteId] = note
    await this.storage.save('budgets', budget)
    return note
  }

  async removeNote(budgetId: string, noteId: string): Promise<void> {
    const budget = await this.storage.findById('budgets', budgetId)

    delete budget.notes[noteId]
    await this.storage.save('budgets', budget)
  }
}

export default BudgetStorageAPI
