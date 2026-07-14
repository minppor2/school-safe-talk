export type Role = 'guardian' | 'student' | 'teacher' | 'department' | 'admin'
export type CaseStatus = '접수 완료' | '분류 중' | '확인 중' | '처리 중' | '추가 정보 요청' | '답변 완료' | '종결'

export interface UserProfile {
  id: string
  name: string
  role: Role
  label: string
}

export interface CaseItem {
  id: string
  title: string
  category: string
  department: string
  status: CaseStatus
  createdAt: string
  updatedAt: string
  author: string
  student?: string
  body: string
  urgency: '일반' | '주의' | '긴급 검토'
  shareLevel: string
}
