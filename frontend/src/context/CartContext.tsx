import { createContext, useContext, useState, ReactNode } from 'react'
import { PetSummary } from '../api/petsApi'

export interface CartItem {
  id: string
  name: string
  price: number
  photoUrl: string
  category: 'DOG' | 'CAT' | 'BIRD' | 'FISH'
  quantity: number
}

interface CartContextValue {
  items: CartItem[]
  addItem: (pet: PetSummary) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])

  const addItem = (pet: PetSummary) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.id === pet.id)
      if (existing) {
        return prev.map((i) =>
          i.id === pet.id ? { ...i, quantity: Math.min(i.quantity + 1, 10) } : i
        )
      }
      return [
        ...prev,
        {
          id: pet.id,
          name: pet.name,
          price: pet.price ?? 0,
          photoUrl: pet.primaryPhotoUrl,
          category: pet.category,
          quantity: 1,
        },
      ]
    })
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id))
  }

  const updateQuantity = (id: string, quantity: number) => {
    const clamped = Math.max(1, Math.min(quantity, 10))
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, quantity: clamped } : i)))
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, subtotal }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
