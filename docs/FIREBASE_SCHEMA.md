# Firebase 데이터 설계 초안

## 컬렉션

### users/{uid}

- name: string
- role: guardian | student | teacher | department | admin
- departmentId: string | null
- classIds: string[]
- linkedStudentIds: string[]
- active: boolean
- createdAt, updatedAt: timestamp

### cases/{caseId}

- authorId: string
- studentId: string | null
- category: string
- title: string
- body: string
- status: string
- urgency: normal | caution | urgent_review
- department: string
- assigneeId: string | null
- sharedWith: string[]
- shareLevel: string
- createdAt, updatedAt: timestamp
- dueAt: timestamp | null

### cases/{caseId}/timeline/{entryId}

- type: created | assigned | transferred | note | request_info | answered | closed
- actorId: string
- visibility: author | staff | shared_teacher
- message: string
- createdAt: timestamp

### departments/{departmentId}

- name: string
- managerIds: string[]
- memberIds: string[]
- backupAssigneeIds: string[]
- active: boolean

### faq/{faqId}

- question: string
- answer: string
- sourceTitle: string
- sourceUrl: string | null
- departmentId: string
- published: boolean
- reviewedAt: timestamp

### auditLogs/{logId}

- actorId: string
- action: read | assign | transfer | download | answer | permission_change
- targetType: string
- targetId: string
- reason: string | null
- createdAt: timestamp

## Cloud Functions 권장 업무

- 새 접수의 담당 부서 추천 및 관리자 알림
- 긴급 후보 알림과 대체 담당자 단계별 재알림
- 처리 기한 임박·초과 알림
- 감사 로그의 변경 불가능한 서버 기록
- 알림 메시지에서 민감한 본문 제거
- 파일 업로드 후 악성 파일 검사 및 이미지 메타데이터 제거
- AI 호출 전 개인정보 마스킹과 호출 이력 기록
