import { useMemo, useCallback } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"
import useIsMobile from "./useIsMobile"

export type DriveListResizableColumn = "location" | "size" | "modified"

export const driveListColumnDefaults: Record<DriveListResizableColumn, number> = {
	location: 300,
	size: 100,
	modified: 250
}

export const DRIVE_LIST_COLUMN_MIN_WIDTH = 60
export const DRIVE_LIST_COLUMN_MAX_WIDTH = 800

/**
 * Pixel widths for the drive list's trailing columns (location / size / modified / more). The leading "name" column is NOT
 * sized here — it fills the remaining space via flexbox (`flex-1 min-w-0`) in the row and headers, which truncates reliably
 * across Chromium versions. (Previously the name width was derived by measuring the list container with
 * `useElementDimensions`, which raced under newer Chromium and collapsed some rows' names to a single character + ellipsis.)
 *
 * location / size / modified are user-resizable via drag handles in the header; widths persist in localStorage and sync to
 * every row through the storage event `useLocalStorage` dispatches. Mobile keeps fixed compact widths — resizing is
 * mouse-driven and there is no room anyway.
 */
export default function useDriveListColumnSize() {
	const isMobile = useIsMobile()
	const [widths, setWidths] = useLocalStorage<Partial<Record<DriveListResizableColumn, number>>>("driveListColumnWidths", {})

	const setWidth = useCallback(
		(column: DriveListResizableColumn, width: number) => {
			setWidths(prev => ({
				...prev,
				[column]: Math.min(DRIVE_LIST_COLUMN_MAX_WIDTH, Math.max(DRIVE_LIST_COLUMN_MIN_WIDTH, Math.round(width)))
			}))
		},
		[setWidths]
	)

	const sizes = useMemo(() => {
		return {
			location: isMobile ? 0 : (widths.location ?? driveListColumnDefaults.location),
			size: isMobile ? 50 : (widths.size ?? driveListColumnDefaults.size),
			modified: isMobile ? 100 : (widths.modified ?? driveListColumnDefaults.modified),
			more: isMobile ? 0 : 30
		}
	}, [isMobile, widths])

	return useMemo(
		() => ({
			...sizes,
			setWidth
		}),
		[sizes, setWidth]
	)
}
