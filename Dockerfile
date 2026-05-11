FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY . .

# Build the production Next.js bundle at image build time
RUN npm run build

EXPOSE 3000

# Serve the built output (production mode)
CMD ["npm", "run", "start"]