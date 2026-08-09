import { memo, useEffect, useCallback } from "react"
import { useDirectoryPathsStore, resolveDirectoryPath } from "@/stores/directoryPaths.store"

/**
 * Original location of a trashed item, resolved lazily from its parent directory UUID.
 * The list is virtualized so only visible rows trigger a lookup; resolved paths land in the
 * shared directory-paths store, which also feeds sorting by location.
 */
export const Location = memo(({ parent }: { parent: string }) => {
	const path = useDirectoryPathsStore(useCallback(state => state.paths[parent], [parent]))

	useEffect(() => {
		resolveDirectoryPath(parent)
	}, [parent])

	if (!path) {
		return null
	}

	return (
		<p
			className="dragselect-start-disallowed truncate min-w-0 text-muted-foreground"
			title={path}
		>
			{path}
		</p>
	)
})

export default Location
