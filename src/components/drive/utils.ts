import { type DriveCloudItem } from "."

export function parseNumbersFromString(string: string): number {
	return parseInt(string.replace(/\D/g, ""))
}

export function orderItemsByType({
	items,
	type,
	directoryPaths
}: {
	items: DriveCloudItem[]
	type:
		| "nameAsc"
		| "sizeAsc"
		| "dateAsc"
		| "typeAsc"
		| "lastModifiedAsc"
		| "nameDesc"
		| "sizeDesc"
		| "dateDesc"
		| "typeDesc"
		| "lastModifiedDesc"
		| "uploadDateAsc"
		| "uploadDateDesc"
		| "locationAsc"
		| "locationDesc"
	// Resolved directory paths by UUID, required only for location sorting (trash view). Items whose
	// parent path is not resolved yet sort as "" and reorder as resolutions land in the store.
	directoryPaths?: Record<string, string>
}): DriveCloudItem[] {
	if (type === "nameAsc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return a.name.localeCompare(b.name, "en", {
				numeric: true
			})
		})
	} else if (type === "sizeAsc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return a.size - b.size
		})
	} else if (type === "dateAsc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return (
				parseFloat(`${a.timestamp}.${parseNumbersFromString(a.uuid)}`) -
				parseFloat(`${b.timestamp}.${parseNumbersFromString(b.uuid)}`)
			)
		})
	} else if (type === "dateDesc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return (
				parseFloat(`${b.timestamp}.${parseNumbersFromString(b.uuid)}`) -
				parseFloat(`${a.timestamp}.${parseNumbersFromString(a.uuid)}`)
			)
		})
	} else if (type === "typeAsc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return a.name.localeCompare(b.name, "en", {
				numeric: true
			})
		})
	} else if (type === "nameDesc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return b.name.localeCompare(a.name, "en", {
				numeric: true
			})
		})
	} else if (type === "sizeDesc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return b.size - a.size
		})
	} else if (type === "typeDesc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return b.name.localeCompare(a.name, "en", {
				numeric: true
			})
		})
	} else if (type === "lastModifiedAsc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return (
				parseFloat(`${a.lastModified}.${parseNumbersFromString(a.uuid)}`) -
				parseFloat(`${b.lastModified}.${parseNumbersFromString(b.uuid)}`)
			)
		})
	} else if (type === "lastModifiedDesc") {
		return items
			.map(item => ({
				...item,
				lastModified: parseFloat(`${item.lastModified}.${parseNumbersFromString(item.uuid)}`)
			}))
			.sort((a, b) => {
				if (a.type !== b.type) {
					return a.type === "directory" ? -1 : 1
				}

				return b.lastModified - a.lastModified
			})
	} else if (type === "locationAsc" || type === "locationDesc") {
		return items.sort((a, b) => {
			const pathA = directoryPaths?.[a.parent] ?? ""
			const pathB = directoryPaths?.[b.parent] ?? ""

			if (pathA !== pathB) {
				return type === "locationAsc"
					? pathA.localeCompare(pathB, "en", {
							numeric: true
						})
					: pathB.localeCompare(pathA, "en", {
							numeric: true
						})
			}

			// Same original folder: keep the usual directories-first, then name ordering.
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return a.name.localeCompare(b.name, "en", {
				numeric: true
			})
		})
	} else if (type === "uploadDateAsc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return (
				parseFloat(`${a.timestamp}.${parseNumbersFromString(a.uuid)}`) -
				parseFloat(`${b.timestamp}.${parseNumbersFromString(b.uuid)}`)
			)
		})
	} else if (type === "uploadDateDesc") {
		return items.sort((a, b) => {
			if (a.type !== b.type) {
				return a.type === "directory" ? -1 : 1
			}

			return (
				parseFloat(`${b.timestamp}.${parseNumbersFromString(b.uuid)}`) -
				parseFloat(`${a.timestamp}.${parseNumbersFromString(a.uuid)}`)
			)
		})
	}

	return items.sort((a, b) => {
		if (a.type !== b.type) {
			return a.type === "directory" ? -1 : 1
		}

		return a.name.localeCompare(b.name, "en", { numeric: true })
	})
}
