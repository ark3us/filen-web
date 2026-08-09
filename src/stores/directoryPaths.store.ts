import { create } from "zustand"
import worker from "@/lib/worker"

/**
 * Resolved full paths of directories, keyed by UUID. Used by the trash view to display and sort by
 * an item's original location: rows resolve their parent lazily when visible, and enabling
 * location sorting resolves every distinct parent so the comparator has data for all items.
 * Filling the store re-renders subscribers, so the list re-sorts as paths arrive.
 */
export type DirectoryPathsStore = {
	paths: Record<string, string>
	setPath: (uuid: string, path: string) => void
}

export const useDirectoryPathsStore = create<DirectoryPathsStore>(set => ({
	paths: {},
	setPath(uuid, path) {
		set(state => ({
			paths: {
				...state.paths,
				[uuid]: path
			}
		}))
	}
}))

const inflight = new Map<string, Promise<void>>()

/**
 * Resolve a directory's full path into the store, deduplicating concurrent requests for the same
 * UUID (trashed siblings share their parent). Failures are swallowed so a later call can retry.
 */
export async function resolveDirectoryPath(uuid: string): Promise<void> {
	if (useDirectoryPathsStore.getState().paths[uuid] !== undefined) {
		return
	}

	const existing = inflight.get(uuid)

	if (existing) {
		return existing
	}

	const promise = worker
		.directoryUUIDToPath({ uuid })
		.then(path => {
			if (path) {
				useDirectoryPathsStore.getState().setPath(uuid, path)
			}
		})
		.catch(console.error)
		.finally(() => {
			inflight.delete(uuid)
		})

	inflight.set(uuid, promise)

	return promise
}
