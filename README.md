# 학교소통안심함

학생·학부모의 문의와 학교생활 갈등을 적절한 담당 부서에 비공개로 연결하고, 담임교사의 민원 응대 부담을 줄이기 위한 웹앱 프로토타입입니다.

## 현재 구현된 기능

- 학부모·학생용 홈, 비공개 문의 3단계 접수, 내 접수 목록·상세
- AI FAQ 대화 데모 및 맞춤법·표현 순화 데모
- 담임교사용 최소 공유함
- 담당교사용 배정 목록, 상태 변경, 답변 작성 화면
- 관리자용 접수 통계와 운영 설정 화면
- 역할 전환 데모
- 모바일 반응형 UI와 접근성 기본 처리
- Firebase Auth·Firestore·Storage 연결 준비
- Firestore·Storage 보안 규칙 초안
- Vercel/Firebase Hosting SPA 설정

현재는 데모 데이터를 사용하며 새로고침하면 작성 내용이 초기화됩니다.

## 로컬 실행

```bash
npm install
npm run dev
```

## Firebase 연결

1. Firebase 프로젝트와 웹 앱을 생성합니다.
2. Authentication에서 사용할 로그인 제공자를 활성화합니다.
3. Firestore Database와 Storage를 생성합니다.
4. `.env.example`을 `.env.local`로 복사하고 Firebase 웹 설정값을 입력합니다.
5. `VITE_USE_FIREBASE=true`로 변경합니다.
6. Firebase CLI 로그인 후 규칙과 인덱스를 배포합니다.

```bash
firebase deploy --only firestore:rules,firestore:indexes,storage
```

`src/lib/firebase.ts`에 초기 연결 코드가 준비되어 있습니다. 실제 데이터 연결 시 `src/data/mockData.ts`를 Firestore 서비스 모듈로 교체하면 됩니다.

## Vercel 배포

GitHub 저장소를 Vercel에 연결하고 다음 값을 사용합니다.

- Framework Preset: Vite
- Build Command: `npm run build`
- Output Directory: `dist`
- 환경변수: `.env.example`의 Firebase 항목

`vercel.json`에 SPA 라우팅과 기본 보안 헤더가 포함되어 있습니다.

## GitHub 연결

```bash
git init
git add .
git commit -m "feat: 학교소통안심함 초기 프로토타입"
git branch -M main
git remote add origin <저장소 URL>
git push -u origin main
```

## 운영 전 필수 검토

- Firebase 보안 규칙은 초안입니다. 실제 학교 계정·부서·담임 공유 구조에 맞춰 서버 측 권한 검증을 보강해야 합니다.
- AI 기능은 현재 로컬 데모입니다. 학생 개인정보를 외부 AI에 보내기 전 비식별화와 학교·교육청의 개인정보 검토가 필요합니다.
- 학교폭력, 자해, 성폭력, 아동학대 등 위기 사안은 AI가 자동 판정하거나 종결해서는 안 됩니다.
- 파일 업로드는 화면만 준비되어 있으며 악성 파일 검사와 메타데이터 제거 절차가 추가로 필요합니다.
- 완전한 익명 게시판이 아니라 학교 구성원 인증 기반으로 운영하는 것을 권장합니다.

## 주요 폴더

```text
src/
├─ data/          데모 데이터
├─ lib/           Firebase 초기화
├─ App.tsx        전체 화면과 상호작용
├─ styles.css     디자인 시스템과 반응형 스타일
└─ types.ts       공통 타입
```
