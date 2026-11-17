import { createClient } from '@supabase/supabase-js'

const table = 'commons_records'
const projectUrl = import.meta.env.VITE_SUPABASE_URL?.trim() ?? ''
const publicKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()
  || import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()
  || ''

export const sharedDemoMisconfigured = Boolean(projectUrl || publicKey) && !(projectUrl && publicKey)
export const sharedDemoEnabled = Boolean(projectUrl && publicKey)

export const sharedDemoClient = sharedDemoEnabled
  ? createClient(projectUrl, publicKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    })
  : null

function toRows(listings, requests) {
  return [
    ...listings.map((data) => ({ id: data.id, kind: 'listing', data })),
    ...requests.map((data) => ({ id: data.id, kind: 'request', data })),
  ]
}

export async function readSharedRecords() {
  const { data, error } = await sharedDemoClient.from(table)
    .select('id,kind,data,created_at')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function seedSharedRecords(listings, requests) {
  const { error } = await sharedDemoClient.from(table).upsert(toRows(listings, requests), { onConflict: 'id' })
  if (error) throw error
}

export async function saveSharedChanges(previousListings, nextListings, previousRequests, nextRequests) {
  const changedRows = []
  for (const [previous, next, kind] of [[previousListings, nextListings, 'listing'], [previousRequests, nextRequests, 'request']]) {
    const oldById = new Map(previous.map((record) => [record.id, record]))
    for (const data of next) {
      if (JSON.stringify(oldById.get(data.id)) !== JSON.stringify(data)) changedRows.push({ id: data.id, kind, data })
    }
  }
  if (!changedRows.length) return
  const { error } = await sharedDemoClient.from(table).upsert(changedRows, { onConflict: 'id' })
  if (error) throw error
}

export async function resetSharedRecords(listings, requests) {
  // Postgres safety rules reject unfiltered DELETE statements inside RPCs.
  // IDs are non-null by schema, so this explicit predicate clears the board.
  const { error: deleteError } = await sharedDemoClient.from(table)
    .delete()
    .not('id', 'is', null)
  if (deleteError) throw deleteError

  const rows = toRows(listings, requests)
  const { error: insertError } = await sharedDemoClient.from(table).insert(rows)
  if (insertError) throw insertError
  return readSharedRecords()
}

export function subscribeToSharedRecords(onChange, onStatus) {
  return sharedDemoClient.channel('commons-shared-demo')
    .on('postgres_changes', { event: '*', schema: 'public', table }, onChange)
    .subscribe(onStatus)
}
