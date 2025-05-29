import { Context } from "effect"
import type { Storage as Unstorage } from 'unstorage'

export class Storage extends Context.Tag("Storage")<
  Storage,
  Unstorage
>() { }
