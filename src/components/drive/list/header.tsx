import { memo, useCallback, useRef } from "react"
import { useLocalStorage } from "@uidotdev/usehooks"
import useRouteParent from "@/hooks/useRouteParent"
import { useTranslation } from "react-i18next"
import { ArrowUp, ArrowDown } from "lucide-react"
import { useDriveItemsStore } from "@/stores/drive.store"
import { cn } from "@/lib/utils"
import useDriveListColumnSize, { driveListColumnDefaults, type DriveListResizableColumn } from "@/hooks/useDriveListColumnSize"
import useDriveURLState from "@/hooks/useDriveURLState"

const iconSize = 14

export type DriveSortBy = Record<
	string,
	"nameAsc" | "nameDesc" | "sizeAsc" | "sizeDesc" | "lastModifiedAsc" | "lastModifiedDesc" | "locationAsc" | "locationDesc"
>

export const Header = memo(() => {
	const [driveSortBy, setDriveSortBy] = useLocalStorage<DriveSortBy>("driveSortBy", {})
	const routeParent = useRouteParent()
	const { t } = useTranslation()
	const items = useDriveItemsStore(useCallback(state => state.items, []))
	const driveListColumnSize = useDriveListColumnSize()
	const driveURLState = useDriveURLState()

	// A resize drag ends with a click on the header cell, which would also toggle sorting. The flag is
	// cleared on the next tick so that trailing click is ignored but real clicks keep working.
	const resizingRef = useRef<boolean>(false)

	const startResize = useCallback(
		(column: DriveListResizableColumn) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.preventDefault()
			e.stopPropagation()

			resizingRef.current = true

			const startX = e.clientX
			const startWidth = driveListColumnSize[column]
			let raf = 0

			const onMouseMove = (ev: MouseEvent) => {
				cancelAnimationFrame(raf)

				raf = requestAnimationFrame(() => {
					driveListColumnSize.setWidth(column, startWidth + (startX - ev.clientX))
				})
			}

			const onMouseUp = () => {
				cancelAnimationFrame(raf)

				document.removeEventListener("mousemove", onMouseMove)
				document.removeEventListener("mouseup", onMouseUp)

				setTimeout(() => {
					resizingRef.current = false
				}, 0)
			}

			document.addEventListener("mousemove", onMouseMove)
			document.addEventListener("mouseup", onMouseUp)
		},
		[driveListColumnSize]
	)

	const resetWidth = useCallback(
		(column: DriveListResizableColumn) => (e: React.MouseEvent<HTMLDivElement>) => {
			e.preventDefault()
			e.stopPropagation()

			driveListColumnSize.setWidth(column, driveListColumnDefaults[column])
		},
		[driveListColumnSize]
	)

	const name = useCallback(() => {
		if (resizingRef.current) {
			return
		}

		setDriveSortBy(prev => ({
			...prev,
			[routeParent]: prev[routeParent] === "nameDesc" ? "nameAsc" : "nameDesc"
		}))
	}, [setDriveSortBy, routeParent])

	const size = useCallback(() => {
		if (resizingRef.current) {
			return
		}

		setDriveSortBy(prev => ({
			...prev,
			[routeParent]: prev[routeParent] === "sizeDesc" ? "sizeAsc" : "sizeDesc"
		}))
	}, [setDriveSortBy, routeParent])

	const locationSort = useCallback(() => {
		if (resizingRef.current) {
			return
		}

		setDriveSortBy(prev => ({
			...prev,
			[routeParent]: prev[routeParent] === "locationDesc" ? "locationAsc" : "locationDesc"
		}))
	}, [setDriveSortBy, routeParent])

	const modified = useCallback(() => {
		if (resizingRef.current) {
			return
		}

		setDriveSortBy(prev => ({
			...prev,
			[routeParent]: prev[routeParent] === "lastModifiedDesc" ? "lastModifiedAsc" : "lastModifiedDesc"
		}))
	}, [setDriveSortBy, routeParent])

	if (items.length === 0) {
		return null
	}

	return (
		<div className="flex flex-row text-sm">
			<div className="flex flex-row w-full h-8 items-center select-none gap-3 px-3">
				<div
					className="flex flex-row flex-1 min-w-0 items-center cursor-pointer"
					onClick={name}
				>
					<div
						className={cn(
							"flex flex-row gap-2 items-center",
							!driveSortBy[routeParent] || driveSortBy[routeParent] === "nameAsc" || driveSortBy[routeParent] === "nameDesc"
								? "text-primary"
								: "text-muted-foreground"
						)}
					>
						<p className="dragselect-start-disallowed line-clamp-1 text-ellipsis">{t("drive.header.name")}</p>
						{(!driveSortBy[routeParent] || driveSortBy[routeParent] === "nameAsc") && <ArrowUp size={iconSize} />}
						{driveSortBy[routeParent] === "nameDesc" && <ArrowDown size={iconSize} />}
					</div>
				</div>
				{driveURLState.trash && (
					<div
						className="relative hidden md:flex flex-row items-center cursor-pointer shrink-0"
						onClick={locationSort}
						style={{
							width: driveListColumnSize.location
						}}
					>
						<div
							className="absolute -left-2 -top-1.5 -bottom-1.5 w-3 cursor-col-resize rounded-sm hover:bg-secondary dragselect-start-disallowed"
							onMouseDown={startResize("location")}
							onDoubleClick={resetWidth("location")}
						/>
						<div
							className={cn(
								"flex flex-row gap-2 items-center",
								driveSortBy[routeParent] === "locationAsc" || driveSortBy[routeParent] === "locationDesc"
									? "text-primary"
									: "text-muted-foreground"
							)}
						>
							<p className="dragselect-start-disallowed line-clamp-1 text-ellipsis">{t("drive.header.location")}</p>
							{driveSortBy[routeParent] === "locationAsc" && <ArrowUp size={iconSize} />}
							{driveSortBy[routeParent] === "locationDesc" && <ArrowDown size={iconSize} />}
						</div>
					</div>
				)}
				<div
					className="relative flex flex-row items-center cursor-pointer shrink-0"
					onClick={size}
					style={{
						width: driveListColumnSize.size
					}}
				>
					<div
						className="absolute -left-2 -top-1.5 -bottom-1.5 w-3 cursor-col-resize rounded-sm hover:bg-secondary dragselect-start-disallowed"
						onMouseDown={startResize("size")}
						onDoubleClick={resetWidth("size")}
					/>
					<div
						className={cn(
							"flex flex-row gap-2 items-center",
							driveSortBy[routeParent] === "sizeAsc" || driveSortBy[routeParent] === "sizeDesc"
								? "text-primary"
								: "text-muted-foreground"
						)}
					>
						<p className="dragselect-start-disallowed line-clamp-1 text-ellipsis">{t("drive.header.size")}</p>
						{driveSortBy[routeParent] === "sizeAsc" && <ArrowUp size={iconSize} />}
						{driveSortBy[routeParent] === "sizeDesc" && <ArrowDown size={iconSize} />}
					</div>
				</div>
				<div
					className="relative flex flex-row items-center cursor-pointer shrink-0"
					onClick={modified}
					style={{
						width: driveListColumnSize.modified
					}}
				>
					<div
						className="absolute -left-2 -top-1.5 -bottom-1.5 w-3 cursor-col-resize rounded-sm hover:bg-secondary dragselect-start-disallowed"
						onMouseDown={startResize("modified")}
						onDoubleClick={resetWidth("modified")}
					/>
					<div
						className={cn(
							"flex flex-row gap-2 items-center",
							driveSortBy[routeParent] === "lastModifiedAsc" || driveSortBy[routeParent] === "lastModifiedDesc"
								? "text-primary"
								: "text-muted-foreground"
						)}
					>
						<p className="dragselect-start-disallowed line-clamp-1 text-ellipsis">{t("drive.header.modified")}</p>
						{driveSortBy[routeParent] === "lastModifiedAsc" && <ArrowUp size={iconSize} />}
						{driveSortBy[routeParent] === "lastModifiedDesc" && <ArrowDown size={iconSize} />}
					</div>
				</div>
				<div
					className="flex flex-row shrink-0"
					style={{
						width: driveListColumnSize.more
					}}
				>
					&nbsp;
				</div>
			</div>
		</div>
	)
})

export default Header
