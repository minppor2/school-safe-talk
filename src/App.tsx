import { useMemo, useState } from 'react'
import { Routes, Route, NavLink, useNavigate, useParams } from 'react-router-dom'
import {
  Bell, Bot, CheckCircle2, ChevronRight, CircleHelp, Clock3, FileText, HeartHandshake,
  Home, Inbox, LayoutDashboard, LockKeyhole, LogOut, Menu, MessageCircleMore, Paperclip,
  Search, Send, Settings, ShieldCheck, Sparkles, Users, X, AlertTriangle, Building2,
} from 'lucide-react'
import { demoUsers, initialCases } from './data/mockData'
import type { CaseItem, CaseStatus, Role, UserProfile } from './types'

const roleHomes: Record<Role, string> = {
  guardian: '/', student: '/', teacher: '/teacher', department: '/staff', admin: '/admin',
}

function Logo() {
  return <div className="logo"><span className="logo-mark"><HeartHandshake size={23} /></span><span>학교소통안심함<small>마음을 잇고, 함께 해결해요</small></span></div>
}

function App() {
  const [user, setUser] = useState<UserProfile>(demoUsers[0])
  const [cases, setCases] = useState<CaseItem[]>(initialCases)
  const [mobileOpen, setMobileOpen] = useState(false)
  const navigate = useNavigate()

  const changeRole = (id: string) => {
    const next = demoUsers.find((item) => item.id === id)!
    setUser(next)
    navigate(roleHomes[next.role])
  }

  const addCase = (item: CaseItem) => setCases((prev) => [item, ...prev])
  const updateCase = (id: string, status: CaseStatus) => setCases((prev) => prev.map((item) => item.id === id ? { ...item, status, updatedAt: '방금 전' } : item))

  return (
    <div className="app-shell">
      <Header user={user} changeRole={changeRole} toggleMenu={() => setMobileOpen(!mobileOpen)} />
      <div className="app-body">
        <Sidebar role={user.role} open={mobileOpen} close={() => setMobileOpen(false)} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage cases={cases} user={user} />} />
            <Route path="/new" element={<NewCase addCase={addCase} />} />
            <Route path="/cases" element={<CaseList cases={cases} title="내 접수 내역" />} />
            <Route path="/cases/:id" element={<CaseDetail cases={cases} updateCase={updateCase} user={user} />} />
            <Route path="/ai" element={<AiHelp />} />
            <Route path="/teacher" element={<TeacherPage cases={cases} />} />
            <Route path="/staff" element={<StaffPage cases={cases} updateCase={updateCase} />} />
            <Route path="/admin" element={<AdminPage cases={cases} />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="*" element={<HomePage cases={cases} user={user} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function Header({ user, changeRole, toggleMenu }: { user: UserProfile; changeRole: (id: string) => void; toggleMenu: () => void }) {
  return <header className="topbar">
    <button className="icon-button mobile-menu" onClick={toggleMenu} aria-label="메뉴 열기"><Menu /></button>
    <Logo />
    <div className="top-actions">
      <span className="demo-label">화면 체험</span>
      <select value={user.id} onChange={(e) => changeRole(e.target.value)} aria-label="사용자 역할 변경">
        {demoUsers.map((item) => <option key={item.id} value={item.id}>{item.label} · {item.name}</option>)}
      </select>
      <button className="icon-button notification" aria-label="알림 2개"><Bell size={20} /><i>2</i></button>
      <div className="avatar">{user.name.slice(0, 1)}</div>
    </div>
  </header>
}

function Sidebar({ role, open, close }: { role: Role; open: boolean; close: () => void }) {
  const base = [
    { to: '/', icon: Home, label: '홈' },
    { to: '/new', icon: MessageCircleMore, label: '문의하기' },
    { to: '/ai', icon: Sparkles, label: 'AI에게 물어보기' },
    { to: '/cases', icon: Inbox, label: '내 접수 내역' },
    { to: '/faq', icon: CircleHelp, label: '자주 묻는 질문' },
  ]
  const work = role === 'teacher' ? [{ to: '/teacher', icon: Users, label: '담임 공유함' }]
    : role === 'department' ? [{ to: '/staff', icon: LayoutDashboard, label: '담당 업무함' }]
    : role === 'admin' ? [{ to: '/admin', icon: LayoutDashboard, label: '운영 대시보드' }] : []
  return <>
    {open && <button className="sidebar-backdrop" onClick={close} aria-label="메뉴 닫기" />}
    <aside className={`sidebar ${open ? 'open' : ''}`}>
      <button className="sidebar-close" onClick={close} aria-label="닫기"><X /></button>
      <nav>{[...base, ...work].map(({ to, icon: Icon, label }) =>
        <NavLink key={to} to={to} onClick={close} className={({ isActive }) => isActive ? 'active' : ''}><Icon size={19} />{label}</NavLink>)}</nav>
      <div className="sidebar-bottom">
        <a href="#privacy"><ShieldCheck size={18} />개인정보 보호 안내</a>
        <a href="#settings"><Settings size={18} />환경 설정</a>
        <a href="#logout"><LogOut size={18} />로그아웃</a>
      </div>
    </aside>
  </>
}

function HomePage({ cases, user }: { cases: CaseItem[]; user: UserProfile }) {
  const navigate = useNavigate()
  const open = cases.filter((item) => !['종결', '답변 완료'].includes(item.status)).length
  return <div className="page home-page">
    <section className="hero">
      <div className="hero-copy"><span className="eyebrow"><ShieldCheck size={17} /> 안전한 학교 소통 창구</span>
        <h1>걱정되는 일이 있다면,<br /><em>편안하게 이야기해 주세요.</em></h1>
        <p>문의와 학교생활의 어려움을 알맞은 담당 부서가 확인하고 함께 해결합니다. 담임선생님에게는 꼭 필요한 내용만 공유됩니다.</p>
        <div className="hero-actions"><button className="button primary" onClick={() => navigate('/new')}><MessageCircleMore />문의하기</button><button className="button secondary" onClick={() => navigate('/ai')}><Sparkles />AI에게 먼저 물어보기</button></div>
        <small><LockKeyhole size={14} /> 작성한 내용은 담당자만 안전하게 확인할 수 있어요.</small>
      </div>
      <div className="hero-visual" aria-hidden="true">
        <div className="conversation-card c1"><span className="mini-avatar coral">학</span><p>어디에 물어봐야 할지<br />모르겠어요.</p></div>
        <div className="connection"><HeartHandshake size={56} /><span>알맞은 담당자에게<br />안전하게 연결</span></div>
        <div className="conversation-card c2"><span className="mini-avatar green">교</span><p>확인 후 차근차근<br />도와드릴게요.</p></div>
        <i className="dot d1" /><i className="dot d2" /><i className="dot d3" />
      </div>
    </section>

    <section className="section-heading"><div><span className="eyebrow">MY REQUESTS</span><h2>{user.role === 'guardian' || user.role === 'student' ? '내 문의 현황' : '오늘의 업무 현황'}</h2></div><button className="text-button" onClick={() => navigate('/cases')}>전체 보기 <ChevronRight size={17} /></button></section>
    <div className="stats-grid">
      <Stat icon={Inbox} label="진행 중" value={open} tone="sage" />
      <Stat icon={Clock3} label="추가 확인 필요" value={cases.filter((x) => x.status === '추가 정보 요청').length} tone="coral" />
      <Stat icon={CheckCircle2} label="답변 완료" value={cases.filter((x) => x.status === '답변 완료').length} tone="cream" />
    </div>
    <section className="recent-card"><div className="card-title"><h3>최근 접수</h3><span>{cases.length}건</span></div>{cases.slice(0, 3).map((item) => <CaseRow key={item.id} item={item} />)}</section>
    <section className="process-section"><span className="eyebrow">HOW IT WORKS</span><h2>안심하고 요청하세요</h2><div className="process-grid">
      <Process n="01" icon={FileText} title="차분하게 작성해요" text="AI가 맞춤법과 표현을 부드럽게 정리해 드려요." />
      <Process n="02" icon={Building2} title="담당 부서가 확인해요" text="사안에 맞는 담당자가 직접 확인하고 처리해요." />
      <Process n="03" icon={CheckCircle2} title="과정을 알려드려요" text="접수부터 답변까지 진행 상황을 확인할 수 있어요." />
    </div></section>
    <div className="privacy-strip" id="privacy"><ShieldCheck /><div><strong>개인정보는 꼭 필요한 담당자에게만 공유됩니다.</strong><span>열람·배정·처리 기록을 안전하게 관리합니다.</span></div><button className="text-button">자세히 보기 <ChevronRight size={17} /></button></div>
    <div className="emergency"><AlertTriangle size={18} /><span><strong>지금 위험한 상황인가요?</strong> 이 서비스는 실시간 신고 수단이 아닙니다. 즉시 도움이 필요하면 112·119 또는 학교로 연락해 주세요.</span></div>
  </div>
}

function Stat({ icon: Icon, label, value, tone }: { icon: typeof Inbox; label: string; value: number; tone: string }) {
  return <div className={`stat-card ${tone}`}><span className="stat-icon"><Icon /></span><div><strong>{value}<small>건</small></strong><span>{label}</span></div><ChevronRight /></div>
}
function Process({ n, icon: Icon, title, text }: { n: string; icon: typeof Inbox; title: string; text: string }) {
  return <article className="process-card"><span className="step-number">{n}</span><span className="process-icon"><Icon /></span><h3>{title}</h3><p>{text}</p></article>
}
function StatusPill({ status }: { status: CaseStatus }) { return <span className={`status status-${status.replaceAll(' ', '-')}`}>{status}</span> }
function CaseRow({ item }: { item: CaseItem }) { const navigate = useNavigate(); return <button className="case-row" onClick={() => navigate(`/cases/${item.id}`)}><span className="category">{item.category}</span><span className="case-main"><strong>{item.title}</strong><small>{item.id} · {item.updatedAt}</small></span><StatusPill status={item.status} /><ChevronRight size={18} /></button> }

function NewCase({ addCase }: { addCase: (item: CaseItem) => void }) {
  const navigate = useNavigate(); const [step, setStep] = useState(1); const [category, setCategory] = useState('학생 간 갈등'); const [title, setTitle] = useState(''); const [body, setBody] = useState(''); const [refined, setRefined] = useState(false)
  const refine = () => { if (!body) return; setBody(body.replace(/너무 화가 나고/g, '걱정되는 마음이 크고').replace(/당장 해결해 주세요/g, '상황을 확인하고 도움을 부탁드립니다')); setRefined(true) }
  const submit = () => { const now = new Date(); const id = `SST-${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}-${String(Math.floor(Math.random()*90)+10)}`; addCase({ id, title: title || '새로운 학교생활 문의', category, department: category === '학생 간 갈등' ? '학생생활지원부' : '운영 담당', status: '접수 완료', createdAt: '방금 전', updatedAt: '방금 전', author: '김하늘', student: '김민준', body, urgency: '일반', shareLevel: '분류 후 결정' }); setStep(3) }
  const categories = ['학생 간 갈등','학교폭력 우려','생활지도·안전','출결·학적','수업·평가','급식·보건','시설·환경','교육활동 제안','단순 문의','기타']
  return <div className="page narrow-page"><PageTitle eyebrow="NEW REQUEST" title="학교에 도움을 요청해요" text="작성한 내용은 공개되지 않으며 알맞은 담당 부서에서 확인합니다." />
    <div className="stepper"><span className={step>=1?'active':''}>1 <i>유형 선택</i></span><b /><span className={step>=2?'active':''}>2 <i>내용 작성</i></span><b /><span className={step>=3?'active':''}>3 <i>접수 완료</i></span></div>
    {step === 1 && <section className="form-card"><h2>어떤 도움이 필요한가요?</h2><p>가장 가까운 항목을 선택해 주세요. 접수 후 담당자가 다시 확인합니다.</p><div className="category-grid">{categories.map((item) => <button key={item} className={category===item?'selected':''} onClick={() => setCategory(item)}><MessageCircleMore />{item}<CheckCircle2 /></button>)}</div><div className="form-actions"><button className="button primary" onClick={() => setStep(2)}>다음 단계 <ChevronRight /></button></div></section>}
    {step === 2 && <section className="form-card"><div className="field"><label>제목</label><input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="문의 내용을 한 문장으로 적어주세요" maxLength={80} /><small>{title.length}/80</small></div><div className="field"><label>내용</label><textarea value={body} onChange={(e)=>setBody(e.target.value)} placeholder="언제, 어디서, 어떤 일이 있었는지와 바라는 점을 적어주세요." rows={9} /><small>다른 학생의 실명이나 연락처는 꼭 필요한 경우에만 입력해 주세요.</small></div><button className="ai-refine" onClick={refine}><Sparkles />AI로 맞춤법과 표현 다듬기<span>{refined ? '문장을 정리했어요' : '원문과 비교 후 적용할 수 있어요'}</span></button><label className="file-upload"><Paperclip />사진이나 문서 첨부하기<input type="file" hidden /></label><div className="consent"><LockKeyhole /><span>제출하면 담당 부서와 필요한 관계자만 내용을 확인합니다.</span></div><div className="form-actions split"><button className="button ghost" onClick={()=>setStep(1)}>이전</button><button className="button primary" onClick={submit} disabled={!body.trim()}><Send />비공개로 접수하기</button></div></section>}
    {step === 3 && <section className="success-card"><span><CheckCircle2 /></span><h2>안전하게 접수되었어요</h2><p>담당 부서를 확인한 뒤 진행 상황을 알려드릴게요.</p><button className="button primary" onClick={()=>navigate('/cases')}>접수 내역 확인하기</button><button className="button ghost" onClick={()=>navigate('/')}>홈으로 돌아가기</button></section>}
  </div>
}

function PageTitle({ eyebrow, title, text }: { eyebrow: string; title: string; text: string }) { return <div className="page-title"><span className="eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div> }

function CaseList({ cases, title }: { cases: CaseItem[]; title: string }) {
  const [query, setQuery] = useState(''); const filtered = cases.filter((item)=>`${item.title}${item.category}${item.id}`.includes(query))
  return <div className="page"><PageTitle eyebrow="MY REQUESTS" title={title} text="접수한 내용과 처리 과정을 확인할 수 있어요." /><div className="toolbar"><div className="search"><Search /><input value={query} onChange={(e)=>setQuery(e.target.value)} placeholder="제목, 유형, 접수번호 검색" /></div><select><option>전체 상태</option><option>처리 중</option><option>답변 완료</option></select></div><section className="list-card">{filtered.map((item)=><CaseRow key={item.id} item={item} />)}{!filtered.length && <div className="empty">검색 결과가 없습니다.</div>}</section></div>
}

function CaseDetail({ cases, updateCase, user }: { cases: CaseItem[]; updateCase: (id: string, status: CaseStatus) => void; user: UserProfile }) {
  const { id } = useParams(); const item = cases.find((x)=>x.id===id); if (!item) return <div className="page">접수 내역을 찾을 수 없습니다.</div>
  return <div className="page"><div className="detail-header"><div><span className="eyebrow">{item.id}</span><h1>{item.title}</h1><div className="meta"><span>{item.category}</span><span>{item.department}</span><span>{item.createdAt}</span></div></div><StatusPill status={item.status} /></div><div className="detail-grid"><section className="detail-card"><h3>접수 내용</h3><p className="body-copy">{item.body}</p><div className="detail-info"><div><span>긴급도</span><strong>{item.urgency}</strong></div><div><span>담임 공유</span><strong>{item.shareLevel}</strong></div></div></section><section className="detail-card timeline"><h3>처리 과정</h3><ol><li className="done"><i /><div><strong>접수 완료</strong><span>{item.createdAt}</span><p>비공개 글이 안전하게 접수되었습니다.</p></div></li><li className="done"><i /><div><strong>담당 부서 배정</strong><span>{item.department}</span><p>사안에 맞는 담당 부서에서 확인하고 있습니다.</p></div></li><li className="current"><i /><div><strong>{item.status}</strong><span>{item.updatedAt}</span><p>처리 과정에 변경이 있으면 알림으로 안내합니다.</p></div></li></ol></section></div>{['department','admin'].includes(user.role) && <div className="staff-actions"><strong>담당자 처리</strong><button className="button secondary" onClick={()=>updateCase(item.id,'추가 정보 요청')}>추가 정보 요청</button><button className="button primary" onClick={()=>updateCase(item.id,'답변 완료')}>답변 완료 처리</button></div>}</div>
}

function AiHelp() {
  const [messages, setMessages] = useState([{who:'bot', text:'안녕하세요. 학교생활에 관해 궁금한 점을 알려주세요. 학교 FAQ를 바탕으로 먼저 안내해 드릴게요.'}]); const [input,setInput]=useState('')
  const send=()=>{if(!input.trim())return; const q=input; setInput(''); setMessages(m=>[...m,{who:'me',text:q},{who:'bot',text:q.includes('도서관')?'방학 중 도서관 운영 시간은 학교 공지에서 확인할 수 있어요. 정확한 일정이 등록되지 않았다면 공식 문의로 연결해 드릴게요.':'이 내용은 담당자의 확인이 필요해 보여요. 공식 문의로 접수하면 알맞은 부서에 안전하게 연결해 드릴게요.'}])}
  return <div className="page narrow-page"><PageTitle eyebrow="AI GUIDE" title="AI에게 먼저 물어보세요" text="학교가 등록한 FAQ를 기준으로 안내하며, AI 답변은 학교의 공식 답변이 아닙니다." /><section className="chat-card"><div className="chat-head"><span><Bot /></span><div><strong>안심 안내봇</strong><small>개인정보를 입력하지 마세요</small></div></div><div className="messages">{messages.map((m,i)=><div key={i} className={`message ${m.who}`}><span>{m.who==='bot'?<Bot size={18}/>: '나'}</span><p>{m.text}</p></div>)}</div><div className="chat-input"><input value={input} onChange={(e)=>setInput(e.target.value)} onKeyDown={(e)=>e.key==='Enter'&&send()} placeholder="궁금한 점을 입력하세요" /><button onClick={send} aria-label="보내기"><Send /></button></div></section><div className="ai-notice"><Sparkles /><p><strong>AI가 해결하지 못했나요?</strong><span>공식 접수로 이어서 작성하면 내용을 다시 입력하지 않도록 연결할 예정입니다.</span></p></div></div>
}

function TeacherPage({ cases }: { cases: CaseItem[] }) { return <div className="page"><PageTitle eyebrow="HOMEROOM SHARE" title="담임 공유함" text="담임 협조가 필요한 사안과 학생 지도에 필요한 결과만 표시됩니다." /><div className="notice-card"><LockKeyhole /><p><strong>담임은 기본 민원 처리자가 아닙니다.</strong><span>담당 부서가 요청한 사실 확인이나 처리 결과만 확인해 주세요.</span></p></div><div className="dashboard-grid"><Stat icon={Users} label="협조 요청" value={1} tone="coral"/><Stat icon={CheckCircle2} label="결과 공유" value={2} tone="sage"/><Stat icon={Clock3} label="확인 대기" value={1} tone="cream"/></div><section className="list-card"><div className="card-title"><h3>공유된 사안</h3><span>필요 최소 정보</span></div>{cases.filter(x=>x.shareLevel!=='공유 불필요').map(item=><CaseRow key={item.id} item={item}/>)}</section></div> }

function StaffPage({ cases, updateCase }: { cases: CaseItem[]; updateCase: (id:string,status:CaseStatus)=>void }) {
  const [selected,setSelected]=useState(cases[0]?.id); const item=cases.find(x=>x.id===selected)
  return <div className="page"><PageTitle eyebrow="DEPARTMENT DESK" title="담당 업무함" text="배정된 사안을 확인하고 처리 상태와 답변을 관리합니다."/><div className="dashboard-grid four"><Stat icon={Inbox} label="새 배정" value={2} tone="sage"/><Stat icon={Clock3} label="기한 임박" value={1} tone="coral"/><Stat icon={MessageCircleMore} label="처리 중" value={3} tone="cream"/><Stat icon={CheckCircle2} label="오늘 완료" value={4} tone="sage"/></div><div className="workbench"><section className="queue"><div className="card-title"><h3>배정 목록</h3><button className="icon-button"><Search/></button></div>{cases.map(x=><button key={x.id} className={selected===x.id?'selected':''} onClick={()=>setSelected(x.id)}><span className="category">{x.category}</span><strong>{x.title}</strong><small>{x.id} · {x.updatedAt}</small><StatusPill status={x.status}/></button>)}</section>{item&&<section className="case-work"><div className="case-work-head"><div><span className="eyebrow">{item.id}</span><h2>{item.title}</h2></div><StatusPill status={item.status}/></div><p className="body-copy">{item.body}</p><div className="info-banner"><ShieldCheck/><span>열람 및 처리 이력이 기록됩니다. 업무상 필요한 범위에서만 확인해 주세요.</span></div><div className="field"><label>공식 답변 초안</label><textarea rows={7} defaultValue="안녕하세요. 접수해 주신 내용을 담당 부서에서 확인하고 있습니다. 사실관계 확인 후 처리 결과를 안내드리겠습니다."/></div><div className="form-actions split"><button className="button ghost">다른 부서로 이관</button><div><button className="button secondary" onClick={()=>updateCase(item.id,'처리 중')}>임시 저장</button><button className="button primary" onClick={()=>updateCase(item.id,'답변 완료')}>답변 발송</button></div></div></section>}</div></div>
}

function AdminPage({ cases }: { cases: CaseItem[] }) {
  const categories = useMemo(()=>Object.entries(cases.reduce<Record<string,number>>((a,c)=>{a[c.category]=(a[c.category]||0)+1;return a},{})).sort((a,b)=>b[1]-a[1]),[cases]); const max=Math.max(...categories.map(x=>x[1]),1)
  return <div className="page"><PageTitle eyebrow="ADMIN CONSOLE" title="운영 대시보드" text="미배정·지연·긴급 사안을 우선 확인하고 전체 처리 흐름을 관리합니다."/><div className="dashboard-grid four"><Stat icon={Inbox} label="오늘 접수" value={cases.length} tone="sage"/><Stat icon={AlertTriangle} label="긴급 검토" value={0} tone="coral"/><Stat icon={Clock3} label="기한 초과" value={1} tone="cream"/><Stat icon={CheckCircle2} label="완료율" value={67} tone="sage"/></div><div className="admin-grid"><section className="chart-card"><div className="card-title"><h3>유형별 접수 현황</h3><span>최근 30일</span></div><div className="bars">{categories.map(([label,value])=><div key={label}><span>{label}</span><i><b style={{width:`${value/max*100}%`}}/></i><strong>{value}</strong></div>)}</div></section><section className="settings-card"><div className="card-title"><h3>운영 설정</h3></div>{[['접수 유형·담당 부서','14개 유형'],['처리 기한·알림','기본 2업무일'],['FAQ·학교 규정','32개 문서'],['사용자·권한','184명 활성'],['감사 로그','오늘 26건']].map(([a,b])=><button key={a}><span><strong>{a}</strong><small>{b}</small></span><ChevronRight/></button>)}</section></div><section className="list-card"><div className="card-title"><h3>주의가 필요한 사안</h3><span>기한·이관·긴급 기준</span></div>{cases.slice(0,2).map(item=><CaseRow key={item.id} item={item}/>)}</section></div>
}

function FaqPage() { const faqs=['학교폭력으로 접수되는 기준은 무엇인가요?','결석할 때 어떤 서류를 제출해야 하나요?','문의 내용은 담임선생님도 모두 볼 수 있나요?','답변까지 얼마나 걸리나요?','접수한 글을 삭제할 수 있나요?']; const [open,setOpen]=useState(0); return <div className="page narrow-page"><PageTitle eyebrow="FREQUENTLY ASKED" title="자주 묻는 질문" text="많이 궁금해하는 내용을 먼저 확인해 보세요."/><div className="search large"><Search/><input placeholder="질문 검색"/></div><section className="faq-list">{faqs.map((q,i)=><button key={q} onClick={()=>setOpen(open===i?-1:i)} className={open===i?'open':''}><span><strong>Q</strong>{q}</span><ChevronRight/>{open===i&&<p>{i===2?'아니요. 담임교사는 모든 글을 자동으로 볼 수 없습니다. 담당 부서가 학생 지도에 필요하다고 판단한 접수 사실·요약·협조 요청·처리 결과만 정해진 범위에서 공유합니다.':'학교 운영 기준에 따른 안내가 표시되는 영역입니다. 관리자 화면에서 실제 답변과 관련 규정을 등록할 수 있습니다.'}</p>}</button>)}</section></div> }

export default App
