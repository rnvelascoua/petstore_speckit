import { useQuery } from '@tanstack/react-query'
import { getPetById, PetDetail } from '../api/petsApi'

export function usePetDetail(id: string) {
  return useQuery<PetDetail, Error>({
    queryKey: ['pet', id],
    queryFn: () => getPetById(id),
    enabled: !!id,
  })
}
