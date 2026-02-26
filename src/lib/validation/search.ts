import { z } from "zod"

export const SearchParamsSchema = z.object({
  q: z.string().nullish(),
})

export type SearchParams = z.infer<typeof SearchParamsSchema>
