import { memo } from "react"
import { useQuery } from "@tanstack/react-query"
import worker from "@/lib/worker"

/**
 * Original location of a trashed item, resolved lazily from its parent directory UUID.
 * The list is virtualized so only visible rows trigger a lookup, and the worker caches
 * resolved paths per parent UUID (trashed siblings share the same parent).
 */
export const Location = memo(({ parent }: { parent: string }) => {
	const query = useQuery({
		queryKey: ["directoryUUIDToPath", parent],
		queryFn: () => worker.directoryUUIDToPath({ uuid: parent })
	})

	if (!query.isSuccess || !query.data) {
		return null
	}

	return (
		<p
			className="dragselect-start-disallowed truncate min-w-0 text-muted-foreground"
			title={query.data}
		>
			{query.data}
		</p>
	)
})

export default Location
