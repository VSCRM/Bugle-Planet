/**
 * Atomic category badge.
 * Pure presentational — no logic, no side-effects.
 */
interface BadgeProps {
	label: string;
}

export function Badge({label}: BadgeProps): React.ReactElement {
	return (
		<span
			style={{
				display: "inline-block",
				background: "var(--color-dark)",
				color: "var(--color-bg)",
				padding: "3px 10px",
				fontFamily: "var(--font-mono)",
				fontSize: 11,
				textTransform: "uppercase",
				letterSpacing: "0.5px",
			}}>
			{label}
		</span>
	);
}
