import type { CaseItem, UserProfile } from '../types'

export const demoUsers: UserProfile[] = [
  { id: 'guardian-1', name: '김하늘', role: 'guardian', label: '학부모' },
  { id: 'student-1', name: '이로운', role: 'student', label: '학생' },
  { id: 'teacher-1', name: '서영 선생님', role: 'teacher', label: '담임교사' },
  { id: 'department-1', name: '박지원 선생님', role: 'department', label: '담당교사' },
  { id: 'admin-1', name: '학교 관리자', role: 'admin', label: '관리자' },
]

export const initialCases: CaseItem[] = [
  {
    id: 'SST-2026-0714-018', title: '친구와의 반복적인 말다툼에 관해 상담하고 싶습니다',
    category: '학생 간 갈등', department: '학생생활지원부', status: '처리 중',
    createdAt: '2026.07.14 09:12', updatedAt: '2026.07.14 10:05', author: '김하늘', student: '김민준',
    body: '최근 같은 반 친구와 말다툼이 반복되고 있어 학교에서 상황을 확인하고 중재해 주시길 바랍니다.',
    urgency: '주의', shareLevel: '처리 결과 공유',
  },
  {
    id: 'SST-2026-0713-014', title: '방학 중 도서관 이용 시간을 알고 싶어요',
    category: '단순 문의', department: '교육연구부', status: '답변 완료',
    createdAt: '2026.07.13 16:20', updatedAt: '2026.07.14 08:30', author: '이로운',
    body: '여름방학 중 학교 도서관 이용 가능 시간과 대출 가능 권수를 알고 싶습니다.',
    urgency: '일반', shareLevel: '공유 불필요',
  },
  {
    id: 'SST-2026-0712-009', title: '급식 알레르기 정보 변경 요청',
    category: '급식·보건', department: '보건실', status: '추가 정보 요청',
    createdAt: '2026.07.12 13:40', updatedAt: '2026.07.13 11:10', author: '김하늘', student: '김민준',
    body: '최근 병원 검사 결과에 따라 알레르기 정보를 변경하고 싶습니다.',
    urgency: '주의', shareLevel: '민감정보 최소 공유',
  },
]
