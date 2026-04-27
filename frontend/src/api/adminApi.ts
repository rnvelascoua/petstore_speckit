import axios from 'axios'
import { PetDetail } from './petsApi'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export interface CreatePetPayload {
  name: string
  category: 'DOG' | 'CAT' | 'BIRD' | 'FISH'
  breed: string
  ageMonths: number
  description: string
  price: number | null
  available: boolean
  photos: { url: string; isPrimary: boolean }[]
}

export async function createPet(payload: CreatePetPayload): Promise<PetDetail> {
  const { data } = await axios.post<PetDetail>(`${BASE_URL}/api/admin/pets`, payload)
  return data
}

export async function updatePet(id: string, payload: CreatePetPayload): Promise<PetDetail> {
  const { data } = await axios.put<PetDetail>(`${BASE_URL}/api/admin/pets/${id}`, payload)
  return data
}

export async function deletePet(id: string): Promise<void> {
  await axios.delete(`${BASE_URL}/api/admin/pets/${id}`)
}
