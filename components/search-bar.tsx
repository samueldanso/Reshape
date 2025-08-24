'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

export const SearchBar = () => {
	const [query, setQuery] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node) &&
				!inputRef.current?.contains(event.target as Node)
			) {
				setIsOpen(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setQuery(value)
		setIsOpen(value.trim().length > 0)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Escape') {
			setIsOpen(false)
			inputRef.current?.blur()
		}
	}

	return (
		<div className="relative w-full max-w-sm">
			<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
			<Input
				ref={inputRef}
				type="text"
				placeholder="Search.."
				value={query}
				onChange={handleInputChange}
				onKeyDown={handleKeyDown}
				onFocus={() => query.trim().length > 0 && setIsOpen(true)}
				className="h-9 w-full rounded-full bg-muted/50 text-foreground pl-9 pr-4 placeholder:text-muted-foreground border-0 focus:bg-background focus:ring-2 focus:ring-ring transition-all"
			/>

			{/* Search Results Dropdown */}
			{isOpen && (
				<div
					ref={dropdownRef}
					className="absolute left-0 top-12 z-50 max-h-80 w-full overflow-y-auto rounded-lg border border-border bg-popover shadow-lg"
				>
					<div className="p-4 text-center text-muted-foreground">
						Search functionality coming soon...
					</div>
				</div>
			)}
		</div>
	)
}
