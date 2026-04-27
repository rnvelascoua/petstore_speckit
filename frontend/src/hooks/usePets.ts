import { useQuery } from '@tanstack/react-query'
import { getPets, PetPage } from '../api/petsApi'

export function usePets(categories: string[], page: number, size = 12) {
  return useQuery<PetPage, Error>({
    queryKey: ['pets', categories, page, size],
    queryFn: () => getPets(categories, page, size),
    placeholderData: (prev) => prev,
  })
}
