.PHONY: dev
dev: css
	node index

css: static/css/tailwind.css

static/css/tailwind.css: tailwind.config.js $(wildcard static/*.html)
	NODE_ENV=production npx tailwindcss-cli@latest build -o ./static/css/tailwind.css