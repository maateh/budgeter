import { UUID } from "crypto"
import { z } from "zod"

// interfaces
import { IBudgetAPI } from "@/services/api/interfaces"

// types
import { Budget, BudgetNote, Transaction } from "@/services/api/types"

// validations
import { BudgetNoteValidation, BudgetValidation } from "@/lib/validation"

// storage
import StorageHelper from "@/services/storage/StorageHelper"
import TransactionStorageAPI from "@/services/storage/TransactionStorageAPI"

class BudgetStorageAPI implements IBudgetAPI {
  private static _instance: BudgetStorageAPI

  private storage: StorageHelper<Budget>
  private noteStorage: StorageHelper<BudgetNote>
  private transactionStorageApi: TransactionStorageAPI

  private constructor() {
    this.storage = new StorageHelper()
    this.noteStorage = new StorageHelper()
    this.transactionStorageApi = TransactionStorageAPI.getInstance()
  }

  public static getInstance(): BudgetStorageAPI {
    if (!BudgetStorageAPI._instance) {
      BudgetStorageAPI._instance = new BudgetStorageAPI()
    }
    return BudgetStorageAPI._instance
  }

  public async get(): Promise<Budget[]> {
    return await this.storage.find('budgets')
  }

  public async getById(id: UUID): Promise<Budget> {
    return await this.storage.findById('budgets', id)
  }

  public async create(data: z.infer<typeof BudgetValidation>): Promise<Budget> {
    return await this.storage.save('budgets', {
      id: crypto.randomUUID(),
      name: data.name,
      type: data.type as Budget['type'],
      balance: data.balance,
      theme: data.theme
    })
  }

  public async update(id: UUID, data: z.infer<typeof BudgetValidation>): Promise<Budget> {
    const budget = await this.storage.findById('budgets', id)

    return await this.storage.save('budgets', {
      ...budget,
      ...data,
      type: data.type as Budget['type']
    })
  }

  public async delete(id: UUID): Promise<Budget> {
    const budget = await this.storage.findById('budgets', id)
    await this.storage.delete('budgets', id)

    const notes = await this.getNotes(id)
    await this.noteStorage.bulkDelete('notes', notes.map(note => note.id))

    const transactions = await this.transactionStorageApi.getByBudget(id) // FIXME: make transaction type optional
    await this.storage.bulkDelete('transactions', transactions.map(tr => tr.id))

    return budget
  }

  public async getNotes(budgetId: UUID): Promise<BudgetNote[]> {
    return await this.noteStorage
      .find('notes', (note) => note.budgetId === budgetId)
  }

  public async createNote(budgetId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote> {
    return await this.noteStorage.save('notes', {
      id: crypto.randomUUID(),
      budgetId,
      text: data.text,
      status: 'open',
      createdAt: new Date()
    })
  }

  public async updateNoteText(_budgetId: UUID, noteId: UUID, data: z.infer<typeof BudgetNoteValidation>): Promise<BudgetNote> {
    const note = await this.noteStorage.findById('notes', noteId)

    return await this.noteStorage.save('notes', {
      ...note,
      text: data.text
    })
  }

  public async updateNoteStatus(_budgetId: UUID, noteId: UUID, status: BudgetNote['status']): Promise<BudgetNote> {
    const note = await this.noteStorage.findById('notes', noteId)

    return await this.noteStorage.save('notes', {
      ...note,
      status
    })
  }

  public async deleteNote(_budgetId: UUID, noteId: UUID): Promise<BudgetNote> {
    const note = await this.noteStorage.findById('notes', noteId)

    await this.noteStorage.delete('notes', noteId)
    return note
  }

  // helpers
  async managePayments(budgetId: UUID, payments: Transaction['payment'][], action: 'execute' | 'undo') {
    const budget = await this.storage.findById('budgets', budgetId)

    payments.forEach((payment) => {
      const amountToAdd = payment.type === '+'
        ? payment.amount
        : -payment.amount

      budget.balance.current += action === 'execute'
        ? amountToAdd
        : -amountToAdd
    })

    await this.storage.save('budgets', budget)
  }
}

export default BudgetStorageAPI
