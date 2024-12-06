import type { Config } from "tailwindcss";
/** @type {import('tailwindcss').Config} */
const config: Config = {
    darkMode: ["class"],
    content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
		      // scale down font sizes to 90% of default
      fontSize: {
        "2xs": "0.5625rem",
        xs: "0.675rem",
        sm: "0.7875rem",
        base: "0.9rem",
        lg: "1.0125rem",
        xl: "1.125rem",
        "2xl": "1.35rem",
        "3xl": "1.6875rem",
        "4xl": "2.25rem",
        "5xl": "2.7rem",
        "6xl": "3.375rem",
        "7xl": "4.05rem",
        "8xl": "5.4rem",
        "9xl": "7.2rem",
      },
      // scale down spacing to 90% of default
      padding: {
        0: "0",
        0.5: "0.1125rem",
        1: "0.225rem",
        1.5: "0.3375rem",
        2: "0.45rem",
        2.5: "0.5625rem",
        3: "0.675rem",
        3.5: "0.7875rem",
        4: "0.9rem",
        5: "1.125rem",
        6: "1.35rem",
        7: "1.575rem",
        8: "1.8rem",
        9: "2.025rem",
        10: "2.25rem",
        11: "2.475rem",
        12: "2.7rem",
        16: "3.6rem",
        20: "4.5rem",
        24: "5.4rem",
        32: "7.2rem",
        40: "9rem",
        48: "10.8rem",
        56: "12.6rem",
        64: "14.4rem",
        72: "16.2rem",
        80: "18rem",
        96: "21.6rem",
        "page-x": "1.35rem",
        "page-y": "1.35rem",
      },
      margin: {
        0: "0",
        0.5: "0.1125rem",
        1: "0.225rem",
        1.5: "0.3375rem",
        2: "0.45rem",
        2.5: "0.5625rem",
        3: "0.675rem",
        3.5: "0.7875rem",
        4: "0.9rem",
        5: "1.125rem",
        6: "1.35rem",
        7: "1.575rem",
        8: "1.8rem",
        9: "2.025rem",
        10: "2.25rem",
        11: "2.475rem",
        12: "2.7rem",
        16: "3.6rem",
        20: "4.5rem",
        24: "5.4rem",
        32: "7.2rem",
        40: "9rem",
        48: "10.8rem",
        56: "12.6rem",
        64: "14.4rem",
        72: "16.2rem",
        80: "18rem",
        96: "21.6rem",
      },
      space: {
        0: "0",
        0.5: "0.1125rem",
        1: "0.225rem",
        1.5: "0.3375rem",
        2: "0.45rem",
        2.5: "0.5625rem",
        3: "0.675rem",
        3.5: "0.7875rem",
        4: "0.9rem",
        5: "1.125rem",
        6: "1.35rem",
        7: "1.575rem",
        8: "1.8rem",
        9: "2.025rem",
        10: "2.25rem",
        11: "2.475rem",
        12: "2.7rem",
        16: "3.6rem",
        20: "4.5rem",
        24: "5.4rem",
        32: "7.2rem",
        40: "9rem",
        48: "10.8rem",
        56: "12.6rem",
        64: "14.4rem",
        72: "16.2rem",
        80: "18rem",
        96: "21.6rem",
      },
      gap: {
        0: "0",
        0.5: "0.1125rem",
        1: "0.225rem",
        1.5: "0.3375rem",
        2: "0.45rem",
        2.5: "0.5625rem",
        3: "0.675rem",
        3.5: "0.7875rem",
        4: "0.9rem",
        5: "1.125rem",
        6: "1.35rem",
        7: "1.575rem",
        8: "1.8rem",
        9: "2.025rem",
        10: "2.25rem",
        11: "2.475rem",
        12: "2.7rem",
        16: "3.6rem",
        20: "4.5rem",
        24: "5.4rem",
        32: "7.2rem",
        40: "9rem",
        48: "10.8rem",
        56: "12.6rem",
        64: "14.4rem",
        72: "16.2rem",
        80: "18rem",
        96: "21.6rem",
      },
  		colors: {
        backdrop: 'hsl(var(--backdrop))',
        placeholder: 'hsl(var(--placeholder))',
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			},
  			sidebar: {
  				DEFAULT: 'hsl(var(--sidebar-background))',
  				foreground: 'hsl(var(--sidebar-foreground))',
  				primary: 'hsl(var(--sidebar-primary))',
  				'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
  				accent: 'hsl(var(--sidebar-accent))',
  				'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
  				border: 'hsl(var(--sidebar-border))',
  				ring: 'hsl(var(--sidebar-ring))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			'accordion-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-accordion-content-height)'
  				}
  			},
  			'accordion-up': {
  				from: {
  					height: 'var(--radix-accordion-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			},
  			'collapsible-down': {
  				from: {
  					height: '0'
  				},
  				to: {
  					height: 'var(--radix-collapsible-content-height)'
  				}
  			},
  			'collapsible-up': {
  				from: {
  					height: 'var(--radix-collapsible-content-height)'
  				},
  				to: {
  					height: '0'
  				}
  			}
  		},
  		animation: {
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out',
  			'collapsible-down': 'collapsible-down 0.2s ease-out',
  			'collapsible-up': 'collapsible-up 0.2s ease-out'
  		}
  	}
  },
  plugins: [
	require("tailwindcss-animate"),
	require('tailwind-scrollbar'),

  ],
};
export default config;
