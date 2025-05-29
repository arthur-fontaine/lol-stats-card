import { Storage } from "../domain/port/storage"
import { createStorage } from "unstorage"

export const UnstorageImpl = (...params: Parameters<typeof createStorage>) => {
  const storage = createStorage(...params)
  return Storage.of(storage)
}
