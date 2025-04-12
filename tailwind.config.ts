
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				folder: {
					purple: '#9b87f5',
					blue: '#33C3F0',
					green: '#6E59A5',
					yellow: '#FEF7CD',
					orange: '#FEC6A1',
					pink: '#FFDEE2',
					red: '#ea384c',
					teal: '#4ecdc4',
					indigo: '#6610f2',
					lime: '#d4e157',
					amber: '#ffca28',
					cyan: '#00bcd4',
				}
			},
			fontFamily: {
				'poppins': ['Poppins', 'sans-serif'],
				'classic': ['Poppins', 'sans-serif'],
				'sans': ['Poppins', 'system-ui', 'sans-serif'],
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				"accordion-down": {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				"accordion-up": {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				"slide-in": {
					from: { transform: 'translateX(-100%)' },
					to: { transform: 'translateX(0)' },
				},
				"fade-in": {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				"bounce-in": {
					"0%": { transform: 'scale(0.8)', opacity: '0' },
					"70%": { transform: 'scale(1.05)', opacity: '1' },
					"100%": { transform: 'scale(1)', opacity: '1' },
				},
				"float": {
					"0%, 100%": { transform: 'translateY(0)' },
					"50%": { transform: 'translateY(-10px)' },
				},
			},
			animation: {
				"accordion-down": 'accordion-down 0.2s ease-out',
				"accordion-up": 'accordion-up 0.2s ease-out',
				"slide-in": 'slide-in 0.4s ease-out',
				"fade-in": 'fade-in 0.4s ease-out',
				"bounce-in": 'bounce-in 0.5s ease-out',
				"float": 'float 3s ease-in-out infinite',
			},
			backgroundImage: {
				'dotted-pattern': 'radial-gradient(circle, rgba(0, 0, 0, 0.1) 1px, transparent 1px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
