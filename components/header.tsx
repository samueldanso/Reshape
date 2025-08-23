import { ThemeToggle } from '@/components/theme-toggle'
import { WalletConnect } from '@/components/wallet-connect'

export function Header() {
	return (
		<header>
			<div className="container mx-auto flex h-16 items-center justify-end px-4">
				<div className="flex items-center gap-2">
					<ThemeToggle />
					<WalletConnect />
				</div>
			</div>
		</header>
	)
}
