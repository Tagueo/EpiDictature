import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { isolSchema } from "../../types/isolSchema";

const adapter = new FileSync<isolSchema>('isolations.json')
export const isolations = low(adapter)

import { isolate } from './isolate';
import { deisolate } from './deisolate';
import { list } from './list';
import { checkForExpiredIsolation } from './checkForExpiredIsolation';

export default { isolate, deisolate, list, checkForExpiredIsolation }