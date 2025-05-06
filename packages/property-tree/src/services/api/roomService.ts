import { Room } from '../types'
import { GET } from './baseApi'

export const roomService = {
  async getByResidenceId(residenceId: string): Promise<Room[]> {
    const { data, error } = await GET('/rooms', {
      params: {
        query: {
          residenceId,
        },
      },
    })
    if (error) throw error
    return data?.content || []
  },

  async getById(id: string): Promise<Room> {
    const { data, error } = await GET('/rooms/{id}', {
      params: { path: { id } },
    })
    if (error) throw error
    return data
  },
}
