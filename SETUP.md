# 🚀 설치 및 실행 가이드

## 1단계: 의존성 설치

프로젝트 루트에서 다음 명령어를 실행하세요:

\`\`\`bash
npm install
\`\`\`

## 2단계: shadcn/ui 컴포넌트 추가

다음 명령어를 **순서대로** 실행하세요:

\`\`\`bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add progress
npx shadcn@latest add dialog
\`\`\`

각 명령어 실행 시 기본 설정을 사용하면 됩니다.

## 3단계: 환경변수 설정 (선택사항)

프로젝트 루트에 \`.env.local\` 파일을 생성하세요:

\`\`\`bash
touch .env.local
\`\`\`

그리고 다음 내용을 추가하세요 (나중에 설정 가능):

\`\`\`env

# Google Analytics (나중에 설정)

# NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# AdSense (나중에 설정)

# NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

\`\`\`

## 4단계: 개발 서버 실행

\`\`\`bash
npm run dev
\`\`\`

브라우저에서 http://localhost:3000 을 열어 확인하세요.

## 5단계: 빌드 및 배포

### 로컬 빌드 테스트

\`\`\`bash
npm run build
npm run start
\`\`\`

### Vercel 배포

1. Vercel CLI 설치 (처음만):
   \`\`\`bash
   npm i -g vercel
   \`\`\`

2. 배포:
   \`\`\`bash
   vercel
   \`\`\`

3. 프로덕션 배포:
   \`\`\`bash
   vercel --prod
   \`\`\`

## 📝 추가 설정

### Teachable Machine 모델 추가 (나중에)

1. Teachable Machine에서 모델 학습
2. 모델 내보내기 (TensorFlow.js)
3. \`/public/models/teachable/\` 폴더에 파일 복사
4. \`src/features/inference/lib/inference-engine.ts\` 파일에서 실제 모델 로딩 코드 활성화

### Google Analytics 설정

1. GA4 속성 생성
2. 측정 ID 확인 (G-XXXXXXXXXX)
3. \`.env.local\` 파일에 추가:
   \`\`\`
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
   \`\`\`

### AdSense 설정

1. AdSense 계정 생성 및 승인 대기
2. 광고 단위 생성
3. 클라이언트 ID 확인
4. \`src/components/ad-slot.tsx\` 파일에서 주석 처리된 코드 활성화

## ⚠️ 주의사항

- **여성 이미지**: 현재 5종류만 있습니다 (미소, 설탕, 소금, 소스, 올리브오일). 나머지 이미지를 추가할 예정이면 같은 명명 규칙을 따라주세요.
- **모델 파일**: 현재는 더미 데이터로 작동합니다. 실제 Teachable Machine 모델을 추가해야 합니다.
- **환경변수**: GA4와 AdSense는 선택사항이며, 없어도 앱은 정상 작동합니다.

## 🐛 문제 해결

### 포트가 이미 사용 중인 경우

\`\`\`bash
npm run dev -- -p 3001
\`\`\`

### 캐시 문제

\`\`\`bash
rm -rf .next
npm run dev
\`\`\`

### 타입 오류

\`\`\`bash
npm run build
\`\`\`

빌드 시 타입 오류가 나타나면 수정 후 다시 빌드하세요.

---

문제가 있으면 이슈를 등록해주세요!
