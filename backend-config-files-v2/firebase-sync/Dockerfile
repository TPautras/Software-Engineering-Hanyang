FROM node:20-alpine

WORKDIR /app

# package.json 복사 및 의존성 설치
COPY package.json ./
RUN npm install --production

# 소스코드 복사
COPY src/ ./src/

# 실행
CMD ["node", "src/index.js"]
