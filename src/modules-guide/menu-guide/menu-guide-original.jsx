/**
 * 메뉴 쇼케이스 원본 파일 (React JSX)
 * - Claude Code Artifact에서 생성한 원본 코드입니다.
 * - 이 파일을 기반으로 Vue 3 + TailwindCSS v4로 변환하여 사용합니다.
 * - 변환 파일: menu-guide-mobile.vue, menu-guide-top.vue, menu-guide-left.vue
 */
import { useState, useRef } from "react";

const menuData = [
  { id: 1, title: "고객", icon: "👤", menus: [
    { id: 11, name: "고객 관리", icon: "📋", children: [
      { id: 111, name: "고객 목록" }, { id: 112, name: "고객 검색" }, { id: 113, name: "고객 히스토리" },
    ]},
  ]},
  { id: 2, title: "상담", icon: "💬", menus: [
    { id: 21, name: "상담 관리", icon: "📝", children: [
      { id: 211, name: "상담 등록" }, { id: 212, name: "알림톡/SMS" }, { id: 213, name: "상담 이력" },
    ]},
  ]},
  { id: 3, title: "업종기능", icon: "🏢", menus: [
    { id: 31, name: "필라테스", icon: "🧘", children: [
      { id: 311, name: "수업 관리" }, { id: 312, name: "멤버십 관리" }, { id: 313, name: "출석 체크" },
    ]},
    { id: 32, name: "부동산", icon: "🏠", children: [
      { id: 321, name: "매물 관리" }, { id: 322, name: "매칭 시스템" },
    ]},
  ]},
  { id: 4, title: "통신", icon: "📞", menus: [
    { id: 41, name: "전화", icon: "☎️", children: [
      { id: 411, name: "통화 이력" }, { id: 412, name: "녹취 청취" },
    ]},
  ]},
  { id: 5, title: "통계/분석", icon: "📊", menus: [
    { id: 51, name: "KPI 모니터링", icon: "📈", children: [] },
    { id: 52, name: "AI 리포트", icon: "🤖", children: [] },
  ]},
];

const PICK = { background: "linear-gradient(135deg, #287dff 0%, #1565d8 100%)", color: "#fff", fontWeight: 700 };
const PICK_BADGE = () => <span style={{ display: "inline-block", padding: "1px 6px", fontSize: 9, background: "#ff6b35", color: "#fff", borderRadius: 8, marginLeft: 6, fontWeight: 700, verticalAlign: "middle" }}>PICK</span>;

// ═══════════════════════════════════════
// MOBILE COMPONENTS
// ═══════════════════════════════════════
const Phone = ({ children, label, isPick }) => (
  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    <div style={{ fontSize: 10, fontWeight: isPick ? 700 : 500, color: isPick ? "#287dff" : "#888", marginBottom: 4 }}>
      {label} {isPick && <PICK_BADGE />}
    </div>
    <div style={{ width: 320, height: 580, borderRadius: 28, border: isPick ? "3px solid #287dff" : "2px solid #ccc", background: "#fff", overflow: "hidden", position: "relative", boxShadow: isPick ? "0 4px 20px rgba(40,125,255,0.2)" : "0 2px 8px rgba(0,0,0,0.08)" }}>
      <div style={{ height: 24, background: "#222", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 50, height: 5, borderRadius: 3, background: "#444" }} />
      </div>
      <div style={{ height: 556, overflow: "hidden", position: "relative" }}>{children}</div>
    </div>
  </div>
);

const MobBar = ({ title, onMenu, right }) => (
  <div style={{ height: 44, background: "#287dff", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 12px", color: "#fff", flexShrink: 0 }}>
    <button onClick={onMenu} style={{ background: "none", border: "none", color: "#fff", fontSize: 20, cursor: "pointer", padding: 4 }}>☰</button>
    <span style={{ fontWeight: 700, fontSize: 14 }}>{title}</span>
    <span style={{ width: 28 }}>{right}</span>
  </div>
);

// PICK: 탭+패널
const MobPick = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [exp, setExp] = useState([]);
  const [active, setActive] = useState(null);
  const toggle = id => setExp(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  return (
    <Phone label="탭 + 패널 분리" isPick>
      <MobBar title="피치CRM" onMenu={() => setOpen(!open)} />
      {open && (
        <div style={{ position: "absolute", inset: 0, top: 44, zIndex: 10 }}>
          <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 280, background: "#fff", display: "flex" }}>
            <div style={{ width: 56, background: "#f5f7fa", borderRight: "1px solid #eee", paddingTop: 6 }}>
              {menuData.map((s, i) => (
                <div key={s.id} onClick={() => setTab(i)} style={{ padding: "12px 0", textAlign: "center", cursor: "pointer", fontSize: 18, background: tab === i ? "#fff" : "transparent", borderRight: tab === i ? "2px solid #287dff" : "2px solid transparent" }}>
                  <div>{s.icon}</div>
                  <div style={{ fontSize: 8, color: tab === i ? "#287dff" : "#999", marginTop: 1 }}>{s.title}</div>
                </div>
              ))}
            </div>
            <div style={{ flex: 1, overflowY: "auto", padding: "6px 0" }}>
              <div style={{ padding: "6px 12px", fontWeight: 700, fontSize: 13, color: "#287dff" }}>{menuData[tab]?.title}</div>
              {menuData[tab]?.menus.map(m => (
                <div key={m.id}>
                  <div onClick={() => m.children?.length ? toggle(m.id) : (setActive(m.name), setOpen(false))} style={{ padding: "9px 12px", fontSize: 12, cursor: "pointer", display: "flex", justifyContent: "space-between" }}>
                    <span>{m.name}</span>
                    {m.children?.length > 0 && <span style={{ fontSize: 8, color: "#bbb" }}>{exp.includes(m.id) ? "▲" : "▼"}</span>}
                  </div>
                  {exp.includes(m.id) && m.children?.map(c => (
                    <div key={c.id} onClick={() => { setActive(c.name); setOpen(false); }} style={{ padding: "7px 12px 7px 22px", fontSize: 11, color: active === c.name ? "#287dff" : "#666", cursor: "pointer" }}>{c.name}</div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <div style={{ padding: 16, fontSize: 12, color: "#999" }}>{active ? `✓ ${active}` : "좌측 탭 + 우측 패널"}</div>
    </Phone>
  );
};

// 모바일 2~10
const MobClassic = () => {
  const [open, setOpen] = useState(false);
  const [e1, setE1] = useState([]);
  const [e2, setE2] = useState([]);
  const [a, setA] = useState(null);
  const t1 = id => setE1(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const t2 = id => setE2(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  return (
    <Phone label="클래식 아코디언">
      <MobBar title="피치CRM" onMenu={() => setOpen(!open)} />
      {open && <div style={{ position: "absolute", inset: 0, top: 44, zIndex: 10 }}>
        <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
        <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 260, background: "#fff", overflowY: "auto" }}>
          {menuData.map(s => (<div key={s.id}>
            <div onClick={() => t1(s.id)} style={{ padding: "9px 14px", fontSize: 12, fontWeight: 600, color: "#287dff", background: "#f8faff", cursor: "pointer", display: "flex", justifyContent: "space-between" }}><span>{s.icon} {s.title}</span><span style={{ fontSize: 9 }}>{e1.includes(s.id)?"▲":"▼"}</span></div>
            {e1.includes(s.id) && s.menus.map(m => (<div key={m.id}>
              <div onClick={() => m.children?.length ? t2(m.id) : setA(m.name)} style={{ padding: "8px 14px 8px 28px", fontSize: 11, cursor: "pointer", display: "flex", justifyContent: "space-between" }}><span>{m.name}</span>{m.children?.length > 0 && <span style={{ fontSize: 8 }}>{e2.includes(m.id)?"▲":"▼"}</span>}</div>
              {e2.includes(m.id) && m.children?.map(c => (<div key={c.id} onClick={() => { setA(c.name); setOpen(false); }} style={{ padding: "6px 14px 6px 42px", fontSize: 11, cursor: "pointer", color: a === c.name ? "#287dff" : "#666" }}>{c.name}</div>))}
            </div>))}
          </div>))}
        </div>
      </div>}
      <div style={{ padding: 16, fontSize: 12, color: "#999" }}>{a || "좌측 드로어 아코디언"}</div>
    </Phone>
  );
};

const MobSlide = () => {
  const [open, setOpen] = useState(false);
  const [d, setD] = useState(0);
  const [s1, setS1] = useState(null);
  const [s2, setS2] = useState(null);
  const [a, setA] = useState(null);
  return (
    <Phone label="슬라이드 네비">
      <MobBar title="피치CRM" onMenu={() => { setOpen(true); setD(0); }} />
      {open && <div style={{ position: "absolute", inset: 0, top: 44, zIndex: 10 }}>
        <div onClick={() => { setOpen(false); setD(0); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
        <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 260, background: "#fff", overflow: "hidden" }}>
          <div style={{ display: "flex", transition: "transform 0.2s", transform: `translateX(-${d*260}px)`, width: 780, height: "100%" }}>
            <div style={{ width: 260, flexShrink: 0, overflowY: "auto" }}>
              <div style={{ padding: "12px 14px", fontWeight: 700, borderBottom: "1px solid #eee", display: "flex", justifyContent: "space-between" }}><span>메뉴</span><button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 16, cursor: "pointer" }}>✕</button></div>
              {menuData.map(s => (<div key={s.id} onClick={() => { setS1(s); setD(1); }} style={{ padding: "12px 14px", borderBottom: "1px solid #f3f3f3", cursor: "pointer", display: "flex", justifyContent: "space-between" }}><span>{s.icon} {s.title}</span><span style={{ color: "#ccc" }}>›</span></div>))}
            </div>
            <div style={{ width: 260, flexShrink: 0, overflowY: "auto" }}>
              <div onClick={() => setD(0)} style={{ padding: "12px 14px", fontWeight: 700, borderBottom: "1px solid #eee", cursor: "pointer", color: "#287dff" }}>‹ {s1?.title}</div>
              {s1?.menus.map(m => (<div key={m.id} onClick={() => { if (m.children?.length) { setS2(m); setD(2); } else { setA(m.name); setOpen(false); setD(0); }}} style={{ padding: "12px 14px", borderBottom: "1px solid #f3f3f3", cursor: "pointer", display: "flex", justifyContent: "space-between" }}><span>{m.name}</span>{m.children?.length > 0 && <span style={{ color: "#ccc" }}>›</span>}</div>))}
            </div>
            <div style={{ width: 260, flexShrink: 0, overflowY: "auto" }}>
              <div onClick={() => setD(1)} style={{ padding: "12px 14px", fontWeight: 700, borderBottom: "1px solid #eee", cursor: "pointer", color: "#287dff" }}>‹ {s2?.name}</div>
              {s2?.children?.map(c => (<div key={c.id} onClick={() => { setA(c.name); setOpen(false); setD(0); }} style={{ padding: "12px 14px", borderBottom: "1px solid #f3f3f3", cursor: "pointer", color: a === c.name ? "#287dff" : "#333" }}>{c.name}</div>))}
            </div>
          </div>
        </div>
      </div>}
      <div style={{ padding: 16, fontSize: 12, color: "#999" }}>{a || "뎁스별 슬라이드"}</div>
    </Phone>
  );
};

const MobBottom = () => {
  const [open, setOpen] = useState(false);
  const [exp, setExp] = useState([]);
  const [a, setA] = useState(null);
  const toggle = id => setExp(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  return (
    <Phone label="바텀시트">
      <MobBar title="피치CRM" onMenu={() => setOpen(!open)} />
      <div style={{ padding: 16, fontSize: 12, color: "#999" }}>{a || "하단 시트 아코디언"}</div>
      {open && <>
        <div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "14px 14px 0 0", maxHeight: "70%", overflowY: "auto", zIndex: 11 }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}><div style={{ width: 32, height: 4, borderRadius: 2, background: "#ddd" }} /></div>
          {menuData.flatMap(s => s.menus).map(m => (<div key={m.id}>
            <div onClick={() => m.children?.length ? toggle(m.id) : (setA(m.name), setOpen(false))} style={{ padding: "11px 18px", display: "flex", justifyContent: "space-between", cursor: "pointer", borderBottom: "1px solid #f5f5f5", fontSize: 13 }}><span>{m.icon} {m.name}</span>{m.children?.length > 0 && <span style={{ fontSize: 9, color: "#aaa" }}>{exp.includes(m.id)?"▲":"▼"}</span>}</div>
            {exp.includes(m.id) && m.children?.map(c => (<div key={c.id} onClick={() => { setA(c.name); setOpen(false); }} style={{ padding: "9px 18px 9px 40px", fontSize: 12, color: a === c.name ? "#287dff" : "#666", cursor: "pointer", borderBottom: "1px solid #fafafa" }}>{c.name}</div>))}
          </div>))}
          <div style={{ height: 16 }} />
        </div>
      </>}
    </Phone>
  );
};

const MobGrid = () => {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);
  const [a, setA] = useState(null);
  return (
    <Phone label="풀스크린 그리드">
      <MobBar title="피치CRM" onMenu={() => { setOpen(!open); setSel(null); }} />
      {open && <div style={{ position: "absolute", inset: 0, top: 44, background: "#fff", zIndex: 10, overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", padding: "6px 10px" }}><button onClick={() => setOpen(false)} style={{ background: "none", border: "none", fontSize: 18, cursor: "pointer" }}>✕</button></div>
        {!sel ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px 16px" }}>
          {menuData.map(s => (<div key={s.id} onClick={() => setSel(s)} style={{ background: "#f8faff", borderRadius: 10, padding: 16, textAlign: "center", cursor: "pointer", border: "1px solid #e8edf5" }}><div style={{ fontSize: 24 }}>{s.icon}</div><div style={{ fontSize: 12, fontWeight: 600, marginTop: 4 }}>{s.title}</div></div>))}
        </div> : <div style={{ padding: "0 16px" }}>
          <div onClick={() => setSel(null)} style={{ color: "#287dff", fontSize: 12, cursor: "pointer", marginBottom: 10 }}>‹ 전체</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>{sel.icon} {sel.title}</div>
          {sel.menus.map(m => (<div key={m.id} style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "#555", marginBottom: 4 }}>{m.name}</div>
            {m.children?.length > 0 ? <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>{m.children.map(c => (<div key={c.id} onClick={() => { setA(c.name); setOpen(false); }} style={{ padding: "8px 10px", background: a === c.name ? "#287dff" : "#f5f5f5", color: a === c.name ? "#fff" : "#333", borderRadius: 6, fontSize: 11, cursor: "pointer", textAlign: "center" }}>{c.name}</div>))}</div> : <div onClick={() => { setA(m.name); setOpen(false); }} style={{ padding: "8px 10px", background: "#f5f5f5", borderRadius: 6, fontSize: 11, cursor: "pointer" }}>{m.name}</div>}
          </div>))}
        </div>}
      </div>}
      <div style={{ padding: 16, fontSize: 12, color: "#999" }}>{a || "그리드 카드 탐색"}</div>
    </Phone>
  );
};

const MobSeg = () => {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(0);
  const [a, setA] = useState(null);
  return (
    <Phone label="세그먼트 탭">
      <MobBar title="피치CRM" onMenu={() => setOpen(!open)} />
      {open && <><div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "#fff", borderRadius: "14px 14px 0 0", maxHeight: "75%", zIndex: 11, overflowY: "auto" }}>
          <div style={{ display: "flex", justifyContent: "center", padding: "8px 0 4px" }}><div style={{ width: 32, height: 4, borderRadius: 2, background: "#ddd" }} /></div>
          <div style={{ display: "flex", gap: 0, padding: "0 10px 6px", overflowX: "auto" }}>
            {menuData.map((s, i) => (<button key={s.id} onClick={() => setTab(i)} style={{ padding: "5px 11px", fontSize: 11, fontWeight: tab === i ? 700 : 400, background: tab === i ? "#287dff" : "#f0f0f0", color: tab === i ? "#fff" : "#666", border: "none", borderRadius: 16, cursor: "pointer", whiteSpace: "nowrap", marginRight: 4 }}>{s.title}</button>))}
          </div>
          {menuData[tab]?.menus.map(m => (<div key={m.id}>
            <div style={{ padding: "5px 14px", fontSize: 10, color: "#999", fontWeight: 600 }}>{m.name}</div>
            {m.children?.length > 0 ? m.children.map(c => (<div key={c.id} onClick={() => { setA(c.name); setOpen(false); }} style={{ padding: "10px 14px 10px 24px", fontSize: 12, cursor: "pointer", borderBottom: "1px solid #f5f5f5", color: a === c.name ? "#287dff" : "#333" }}>{c.name}</div>)) : <div onClick={() => { setA(m.name); setOpen(false); }} style={{ padding: "10px 14px 10px 24px", fontSize: 12, cursor: "pointer", borderBottom: "1px solid #f5f5f5" }}>{m.name} →</div>}
          </div>))}
        </div>
      </>}
      <div style={{ padding: 16, fontSize: 12, color: "#999" }}>{a || "세그먼트 필터 + 리스트"}</div>
    </Phone>
  );
};

const MobBNav = () => {
  const [sel, setSel] = useState(null);
  const [a, setA] = useState(null);
  return (
    <Phone label="바텀 네비">
      <div style={{ height: 44, background: "#287dff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>피치CRM</div>
      <div style={{ height: 456, padding: 16, fontSize: 12, color: "#999" }}>{a || "하단 탭 → 팝업 서브메뉴"}</div>
      {sel && <><div onClick={() => setSel(null)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.15)", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 52, left: 6, right: 6, background: "#fff", borderRadius: 10, boxShadow: "0 -2px 14px rgba(0,0,0,0.1)", zIndex: 11, padding: "10px 0", maxHeight: 260, overflowY: "auto" }}>
          {sel.menus.map(m => (<div key={m.id}>
            <div style={{ padding: "3px 14px", fontSize: 10, color: "#999", fontWeight: 600 }}>{m.name}</div>
            {m.children?.length > 0 ? m.children.map(c => (<div key={c.id} onClick={() => { setA(c.name); setSel(null); }} style={{ padding: "8px 14px 8px 24px", fontSize: 12, cursor: "pointer", color: a === c.name ? "#287dff" : "#333" }}>{c.name}</div>)) : <div onClick={() => { setA(m.name); setSel(null); }} style={{ padding: "8px 14px 8px 24px", fontSize: 12, cursor: "pointer" }}>{m.name}</div>}
          </div>))}
        </div>
      </>}
      <div style={{ height: 52, borderTop: "1px solid #eee", display: "flex", background: "#fff", position: "relative", zIndex: 5 }}>
        {menuData.map(s => (<div key={s.id} onClick={() => setSel(sel?.id === s.id ? null : s)} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: sel?.id === s.id ? "#287dff" : "#999" }}><span style={{ fontSize: 16 }}>{s.icon}</span><span style={{ fontSize: 8, marginTop: 1 }}>{s.title}</span></div>))}
      </div>
    </Phone>
  );
};

const MobSwipe = () => {
  const [idx, setIdx] = useState(0);
  const [a, setA] = useState(null);
  return (
    <Phone label="스와이프 카드">
      <MobBar title="피치CRM" onMenu={() => {}} right="" />
      <div style={{ padding: "10px 14px 4px" }}>
        <div style={{ display: "flex", gap: 5, overflowX: "auto", paddingBottom: 6 }}>
          {menuData.map((s, i) => (<button key={s.id} onClick={() => setIdx(i)} style={{ padding: "5px 12px", fontSize: 11, fontWeight: idx === i ? 700 : 400, background: idx === i ? "#287dff" : "transparent", color: idx === i ? "#fff" : "#888", border: idx === i ? "none" : "1px solid #ddd", borderRadius: 16, cursor: "pointer", whiteSpace: "nowrap" }}>{s.icon} {s.title}</button>))}
        </div>
      </div>
      <div style={{ padding: "0 14px", overflowY: "auto" }}>
        {menuData[idx]?.menus.map(m => (<div key={m.id} style={{ background: "#f9fafb", borderRadius: 10, marginBottom: 8, overflow: "hidden", border: "1px solid #eee" }}>
          <div style={{ padding: "10px 12px", fontWeight: 600, fontSize: 12, borderBottom: m.children?.length ? "1px solid #eee" : "none" }}>{m.icon} {m.name}</div>
          {m.children?.map(c => (<div key={c.id} onClick={() => setA(c.name)} style={{ padding: "8px 12px 8px 28px", fontSize: 11, cursor: "pointer", borderBottom: "1px solid #f3f3f3", color: a === c.name ? "#287dff" : "#555" }}>{c.name}</div>))}
        </div>))}
      </div>
    </Phone>
  );
};

const MobSearch = () => {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [a, setA] = useState(null);
  const all = menuData.flatMap(s => s.menus.flatMap(m => [
    ...(m.children?.length > 0 ? m.children.map(c => ({ label: `${s.title} > ${m.name} > ${c.name}`, name: c.name })) : [{ label: `${s.title} > ${m.name}`, name: m.name }])
  ]));
  const f = q ? all.filter(x => x.label.includes(q)) : all;
  return (
    <Phone label="검색 + 트리">
      <MobBar title="피치CRM" onMenu={() => setOpen(!open)} />
      {open && <div style={{ position: "absolute", inset: 0, top: 44, background: "#fff", zIndex: 10, overflowY: "auto" }}>
        <div style={{ padding: "10px 10px 6px", position: "sticky", top: 0, background: "#fff", borderBottom: "1px solid #eee" }}>
          <input value={q} onChange={e => setQ(e.target.value)} placeholder="메뉴 검색..." style={{ width: "100%", padding: "8px 10px", border: "1px solid #ddd", borderRadius: 6, fontSize: 12, outline: "none", boxSizing: "border-box" }} />
        </div>
        {f.map((x, i) => (<div key={i} onClick={() => { setA(x.name); setOpen(false); }} style={{ padding: "9px 14px", fontSize: 11, borderBottom: "1px solid #f7f7f7", cursor: "pointer", color: a === x.name ? "#287dff" : "#333" }}>{x.label}</div>))}
        <div style={{ padding: 14, textAlign: "center" }}><button onClick={() => setOpen(false)} style={{ padding: "6px 20px", background: "#f0f0f0", border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11 }}>닫기</button></div>
      </div>}
      <div style={{ padding: 16, fontSize: 12, color: "#999" }}>{a || "검색 기반 탐색"}</div>
    </Phone>
  );
};

const MobFAB = () => {
  const [open, setOpen] = useState(false);
  const [sel, setSel] = useState(null);
  const [a, setA] = useState(null);
  return (
    <Phone label="FAB 팝업">
      <div style={{ height: 44, background: "#287dff", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 14 }}>피치CRM</div>
      <div style={{ padding: 16, fontSize: 12, color: "#999" }}>{a || "FAB → 섹션 → 서브메뉴"}</div>
      {open && !sel && <><div onClick={() => setOpen(false)} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 72, right: 14, zIndex: 11, display: "flex", flexDirection: "column", gap: 7, alignItems: "flex-end" }}>
          {menuData.map(s => (<div key={s.id} onClick={() => setSel(s)} style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer" }}><span style={{ background: "#fff", padding: "5px 10px", borderRadius: 6, fontSize: 11, boxShadow: "0 1px 6px rgba(0,0,0,0.1)" }}>{s.title}</span><span style={{ width: 36, height: 36, borderRadius: 18, background: "#287dff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{s.icon}</span></div>))}
        </div>
      </>}
      {sel && <><div onClick={() => { setSel(null); setOpen(false); }} style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)", zIndex: 10 }} />
        <div style={{ position: "absolute", bottom: 72, right: 14, left: 14, background: "#fff", borderRadius: 10, zIndex: 11, padding: 14, boxShadow: "0 4px 18px rgba(0,0,0,0.15)" }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8 }}>{sel.icon} {sel.title}</div>
          {sel.menus.map(m => (<div key={m.id}><div style={{ fontSize: 11, color: "#999", fontWeight: 600, marginTop: 6, marginBottom: 3 }}>{m.name}</div>
            {m.children?.length > 0 ? m.children.map(c => (<div key={c.id} onClick={() => { setA(c.name); setSel(null); setOpen(false); }} style={{ padding: "6px 10px", fontSize: 12, cursor: "pointer", borderRadius: 4, color: a === c.name ? "#287dff" : "#333" }}>{c.name}</div>)) : <div onClick={() => { setA(m.name); setSel(null); setOpen(false); }} style={{ padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>{m.name}</div>}
          </div>))}
        </div>
      </>}
      {!sel && <div onClick={() => setOpen(!open)} style={{ position: "absolute", bottom: 20, right: 14, width: 48, height: 48, borderRadius: 24, background: "#287dff", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, cursor: "pointer", boxShadow: "0 3px 10px rgba(40,125,255,0.4)", zIndex: 5, transform: open ? "rotate(45deg)" : "rotate(0)", transition: "transform 0.2s" }}>+</div>}
    </Phone>
  );
};

const mobileMenus = [
  { c: MobPick, n: "탭+패널", pick: true },
  { c: MobClassic, n: "아코디언" },
  { c: MobSlide, n: "슬라이드" },
  { c: MobBottom, n: "바텀시트" },
  { c: MobGrid, n: "그리드" },
  { c: MobSeg, n: "세그먼트" },
  { c: MobBNav, n: "바텀네비" },
  { c: MobSwipe, n: "카드" },
  { c: MobSearch, n: "검색" },
  { c: MobFAB, n: "FAB" },
];

// ═══════════════════════════════════════
// DESKTOP TOP MENU COMPONENTS
// ═══════════════════════════════════════
const DFrame = ({ children, label, isPick, h = 380 }) => (
  <div style={{ background: "#fff", borderRadius: 8, border: isPick ? "2px solid #287dff" : "1px solid #e0e0e0", overflow: "hidden", height: h, position: "relative", boxShadow: isPick ? "0 2px 12px rgba(40,125,255,0.15)" : "none" }}>
    <div style={{ position: "absolute", top: 5, right: 8, fontSize: 9, color: isPick ? "#287dff" : "#bbb", zIndex: 50, pointerEvents: "none", fontWeight: isPick ? 700 : 400 }}>
      {label} {isPick && "⭐ PICK"}
    </div>
    {children}
  </div>
);

const TopPick = () => {
  const [h1, setH1] = useState(null);
  const [h2, setH2] = useState(null);
  const [a, setA] = useState(null);
  const [dropLeft, setDropLeft] = useState(0);
  const t = useRef(null);
  const e1 = (id, e) => { clearTimeout(t.current); setH1(id); setH2(null); const rect = e.currentTarget.getBoundingClientRect(); const parent = e.currentTarget.closest('[data-topbar]')?.getBoundingClientRect(); setDropLeft(rect.left - (parent?.left || 0)); };
  const lv = () => { t.current = setTimeout(() => { setH1(null); setH2(null); }, 150); };
  const sec = menuData.find(s => s.id === h1);
  const m2 = sec?.menus.find(m => m.id === h2);
  return (
    <DFrame label="클래식 호버 드롭다운" isPick>
      <div data-topbar="true" style={{ height: 42, background: "#287dff", display: "flex", alignItems: "center", padding: "0 14px", position: "relative" }}>
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13, marginRight: 20 }}>피치CRM</span>
        {menuData.map(s => (
          <div key={s.id} onMouseEnter={(e) => e1(s.id, e)} onMouseLeave={lv} style={{ padding: "0 12px", height: 42, display: "flex", alignItems: "center", color: "#fff", fontSize: 12, cursor: "pointer", background: h1 === s.id ? "rgba(255,255,255,0.15)" : "transparent" }}>{s.title}</div>
        ))}
      </div>
      {h1 && sec && <div onMouseEnter={() => { clearTimeout(t.current); }} onMouseLeave={lv} style={{ position: "absolute", top: 42, left: dropLeft, display: "flex", zIndex: 20, boxShadow: "0 4px 16px rgba(0,0,0,0.12)", borderRadius: "0 0 6px 6px" }}>
        <div style={{ background: "#fff", minWidth: 150, borderRight: "1px solid #eee", padding: "5px 0", borderRadius: "0 0 0 6px" }}>
          {sec.menus.map(m => (<div key={m.id} onMouseEnter={() => { clearTimeout(t.current); setH2(m.id); }} onClick={() => !m.children?.length && setA(m.name)} style={{ padding: "7px 12px", fontSize: 12, cursor: "pointer", background: h2 === m.id ? "#f0f5ff" : "transparent", color: h2 === m.id ? "#287dff" : "#333", display: "flex", justifyContent: "space-between" }}>{m.name} {m.children?.length > 0 && <span style={{ color: "#ccc" }}>›</span>}</div>))}
        </div>
        {h2 && m2?.children?.length > 0 && <div style={{ background: "#fff", minWidth: 130, padding: "5px 0", borderRadius: "0 0 6px 0" }}>
          {m2.children.map(c => (<div key={c.id} onClick={() => setA(c.name)} style={{ padding: "7px 12px", fontSize: 12, cursor: "pointer", color: a === c.name ? "#287dff" : "#555" }}>{c.name}</div>))}
        </div>}
      </div>}
      <div style={{ padding: 14, fontSize: 11, color: "#999" }}>{a ? `✓ ${a}` : "hover → 2차 → 3차 순차 패널"}</div>
    </DFrame>
  );
};

const TopMega = () => { const [h,sH]=useState(null);const[a,sA]=useState(null);const t=useRef(null);const sec=menuData.find(s=>s.id===h);return(<DFrame label="메가메뉴"><div style={{height:42,background:"#1a1a2e",display:"flex",alignItems:"center",padding:"0 14px"}}><span style={{color:"#fff",fontWeight:700,fontSize:13,marginRight:20}}>피치CRM</span>{menuData.map(s=>(<div key={s.id} onMouseEnter={()=>{clearTimeout(t.current);sH(s.id)}} onMouseLeave={()=>{t.current=setTimeout(()=>sH(null),150)}} style={{padding:"0 12px",height:42,display:"flex",alignItems:"center",color:h===s.id?"#60a5fa":"#ccc",fontSize:12,cursor:"pointer"}}>{s.title}</div>))}</div>{h&&sec&&<div onMouseEnter={()=>{clearTimeout(t.current);sH(h)}} onMouseLeave={()=>{t.current=setTimeout(()=>sH(null),150)}} style={{position:"absolute",top:42,left:0,right:0,background:"#fff",boxShadow:"0 4px 16px rgba(0,0,0,0.1)",zIndex:20,padding:16,display:"flex",gap:20}}>{sec.menus.map(m=>(<div key={m.id} style={{minWidth:120}}><div style={{fontSize:11,fontWeight:700,color:"#287dff",marginBottom:6,borderBottom:"2px solid #287dff",paddingBottom:3}}>{m.name}</div>{m.children?.length>0?m.children.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{fontSize:11,padding:"4px 0",cursor:"pointer",color:a===c.name?"#287dff":"#555"}}>{c.name}</div>)):<div onClick={()=>sA(m.name)} style={{fontSize:11,padding:"4px 0",cursor:"pointer"}}>{m.name} →</div>}</div>))}</div>}<div style={{padding:14,fontSize:11,color:"#999"}}>{a||"전체 폭 메가 패널"}</div></DFrame>);};

const TopRibbon = () => { const[tab,sT]=useState(0);const[a,sA]=useState(null);return(<DFrame label="리본 스타일"><div style={{height:34,background:"#287dff",display:"flex",alignItems:"center",padding:"0 14px"}}><span style={{color:"#fff",fontWeight:700,fontSize:12}}>피치CRM</span></div><div style={{display:"flex",borderBottom:"1px solid #ddd",background:"#fafafa"}}>{menuData.map((s,i)=>(<div key={s.id} onClick={()=>sT(i)} style={{padding:"7px 14px",fontSize:11,cursor:"pointer",fontWeight:tab===i?700:400,color:tab===i?"#287dff":"#666",borderBottom:tab===i?"2px solid #287dff":"2px solid transparent"}}>{s.title}</div>))}</div><div style={{display:"flex",gap:12,padding:"8px 14px",borderBottom:"1px solid #eee"}}>{menuData[tab]?.menus.map(m=>(<div key={m.id} style={{display:"flex",flexDirection:"column",gap:3,padding:"3px 6px",borderRight:"1px solid #f0f0f0"}}><div style={{fontSize:9,color:"#999",fontWeight:600}}>{m.name}</div><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{m.children?.length>0?m.children.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"3px 8px",fontSize:10,background:a===c.name?"#287dff":"#f0f0f0",color:a===c.name?"#fff":"#555",borderRadius:3,cursor:"pointer"}}>{c.name}</div>)):<div onClick={()=>sA(m.name)} style={{padding:"3px 8px",fontSize:10,background:"#f0f0f0",borderRadius:3,cursor:"pointer"}}>{m.name}</div>}</div></div>))}</div><div style={{padding:14,fontSize:11,color:"#999"}}>{a||"탭 → 리본 툴바"}</div></DFrame>);};

const Top2Row = () => { const[tab,sT]=useState(0);const[a,sA]=useState(null);return(<DFrame label="2단 내비"><div style={{height:38,background:"#287dff",display:"flex",alignItems:"center",padding:"0 14px"}}><span style={{color:"#fff",fontWeight:700,fontSize:12,marginRight:20}}>피치CRM</span>{menuData.map((s,i)=>(<div key={s.id} onClick={()=>sT(i)} style={{padding:"0 10px",height:38,display:"flex",alignItems:"center",color:"#fff",fontSize:11,cursor:"pointer",background:tab===i?"rgba(255,255,255,0.2)":"transparent",borderRadius:"5px 5px 0 0"}}>{s.icon} {s.title}</div>))}</div><div style={{height:30,background:"#f8f9fa",display:"flex",alignItems:"center",padding:"0 14px",gap:3,borderBottom:"1px solid #eee"}}>{menuData[tab]?.menus.flatMap(m=>m.children?.length>0?m.children:[m]).map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"3px 10px",fontSize:10,cursor:"pointer",color:a===c.name?"#287dff":"#666",fontWeight:a===c.name?600:400,borderRadius:3,background:a===c.name?"#e8f0fe":"transparent"}}>{c.name}</div>))}</div><div style={{padding:14,fontSize:11,color:"#999"}}>{a||"1차 탭 → 2줄째 서브"}</div></DFrame>);};

const TopCmd = () => { const[q,sQ]=useState("");const[f,sF]=useState(false);const[a,sA]=useState(null);const all=menuData.flatMap(s=>s.menus.flatMap(m=>m.children?.length>0?m.children.map(c=>({...c,path:`${s.title} > ${m.name} > ${c.name}`})):[{...m,path:`${s.title} > ${m.name}`}]));const fl=q?all.filter(x=>x.path.includes(q)):all;return(<DFrame label="커맨드바"><div style={{height:42,background:"#287dff",display:"flex",alignItems:"center",padding:"0 14px",gap:10}}><span style={{color:"#fff",fontWeight:700,fontSize:12}}>피치CRM</span><div style={{flex:1,maxWidth:320,position:"relative"}}><input value={q} onChange={e=>sQ(e.target.value)} onFocus={()=>sF(true)} onBlur={()=>setTimeout(()=>sF(false),200)} placeholder="검색... (⌘K)" style={{width:"100%",padding:"5px 10px",borderRadius:5,border:"none",fontSize:11,background:"rgba(255,255,255,0.2)",color:"#fff",outline:"none",boxSizing:"border-box"}} />{f&&<div style={{position:"absolute",top:30,left:0,right:0,background:"#fff",borderRadius:6,boxShadow:"0 4px 16px rgba(0,0,0,0.15)",maxHeight:220,overflowY:"auto",zIndex:30}}>{fl.map(c=>(<div key={c.id} onMouseDown={()=>sA(c.name)} style={{padding:"7px 12px",fontSize:11,cursor:"pointer",borderBottom:"1px solid #f5f5f5"}}><span style={{color:"#bbb",fontSize:9}}>{c.path}</span></div>))}</div>}</div></div><div style={{padding:14,fontSize:11,color:"#999"}}>{a||"검색 통합 네비"}</div></DFrame>);};

const TopTab = () => { const[tab,sT]=useState(0);const[h,sH]=useState(null);const[a,sA]=useState(null);const t=useRef(null);return(<DFrame label="탭+드롭다운"><div style={{height:42,background:"#fff",display:"flex",alignItems:"center",padding:"0 14px",borderBottom:"1px solid #eee"}}><span style={{fontWeight:700,fontSize:13,color:"#287dff",marginRight:20}}>피치CRM</span>{menuData.map((s,i)=>(<div key={s.id} onMouseEnter={()=>{clearTimeout(t.current);sT(i);sH(s.id)}} onMouseLeave={()=>{t.current=setTimeout(()=>sH(null),150)}} style={{padding:"0 12px",height:42,display:"flex",alignItems:"center",fontSize:11,cursor:"pointer",color:tab===i?"#287dff":"#666",borderBottom:tab===i?"2px solid #287dff":"2px solid transparent",position:"relative",fontWeight:tab===i?600:400}}>{s.title}{h===s.id&&<div onMouseEnter={()=>{clearTimeout(t.current);sH(s.id)}} onMouseLeave={()=>{t.current=setTimeout(()=>sH(null),150)}} style={{position:"absolute",top:42,left:0,background:"#fff",minWidth:160,boxShadow:"0 4px 14px rgba(0,0,0,0.1)",borderRadius:"0 0 6px 6px",zIndex:20,padding:"5px 0"}}>{s.menus.map(m=>(<div key={m.id}><div style={{padding:"3px 12px",fontSize:9,color:"#aaa",fontWeight:600}}>{m.name}</div>{m.children?.length>0?m.children.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"5px 12px 5px 20px",fontSize:11,cursor:"pointer",color:a===c.name?"#287dff":"#444"}}>{c.name}</div>)):<div onClick={()=>sA(m.name)} style={{padding:"5px 12px 5px 20px",fontSize:11,cursor:"pointer"}}>{m.name} →</div>}</div>))}</div>}</div>))}</div><div style={{padding:14,fontSize:11,color:"#999"}}>{a||"탭 hover → 드롭다운"}</div></DFrame>);};

const TopSlide = () => { const[o,sO]=useState(null);const[a,sA]=useState(null);const sec=menuData.find(s=>s.id===o);return(<DFrame label="슬라이딩 패널"><div style={{height:42,background:"#111827",display:"flex",alignItems:"center",padding:"0 14px"}}><span style={{color:"#fff",fontWeight:700,fontSize:12,marginRight:20}}>피치CRM</span>{menuData.map(s=>(<div key={s.id} onClick={()=>sO(o===s.id?null:s.id)} style={{padding:"0 10px",height:42,display:"flex",alignItems:"center",color:o===s.id?"#60a5fa":"#9ca3af",fontSize:11,cursor:"pointer"}}>{s.title} <span style={{fontSize:7,marginLeft:3}}>{o===s.id?"▲":"▼"}</span></div>))}</div>{o&&sec&&<div style={{background:"#f8fafc",borderBottom:"1px solid #e2e8f0",padding:"10px 14px",display:"flex",gap:24}}>{sec.menus.map(m=>(<div key={m.id}><div style={{fontSize:10,fontWeight:700,color:"#64748b",marginBottom:5}}>{m.name}</div>{m.children?.length>0?m.children.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"3px 0",fontSize:11,cursor:"pointer",color:a===c.name?"#287dff":"#475569"}}>{c.name}</div>)):<div onClick={()=>sA(m.name)} style={{padding:"3px 0",fontSize:11,cursor:"pointer"}}>{m.name} →</div>}</div>))}</div>}<div style={{padding:14,fontSize:11,color:"#999"}}>{a||"클릭 → 하방 패널"}</div></DFrame>);};

const TopBread = () => { const[d1,sD1]=useState(false);const[d2,sD2]=useState(false);const[d3,sD3]=useState(false);const[s1,sS1]=useState(menuData[0]);const[s2,sS2]=useState(menuData[0].menus[0]);const[s3,sS3]=useState(null);const[a,sA]=useState(null);return(<DFrame label="브레드크럼 체인"><div style={{height:42,background:"#287dff",display:"flex",alignItems:"center",padding:"0 14px"}}><span style={{color:"#fff",fontWeight:700,fontSize:12}}>피치CRM</span></div><div style={{height:32,background:"#f9fafb",display:"flex",alignItems:"center",padding:"0 14px",gap:4,borderBottom:"1px solid #eee"}}><div style={{position:"relative"}}><div onClick={()=>{sD1(!d1);sD2(false);sD3(false)}} style={{padding:"3px 8px",fontSize:11,background:"#e8f0fe",borderRadius:3,cursor:"pointer",color:"#287dff",fontWeight:600}}>{s1.title} ▾</div>{d1&&<div style={{position:"absolute",top:26,left:0,background:"#fff",borderRadius:5,boxShadow:"0 2px 10px rgba(0,0,0,0.1)",zIndex:20,minWidth:100,padding:"3px 0"}}>{menuData.map(s=>(<div key={s.id} onClick={()=>{sS1(s);sS2(s.menus[0]);sS3(null);sD1(false)}} style={{padding:"5px 10px",fontSize:11,cursor:"pointer",color:s1.id===s.id?"#287dff":"#333"}}>{s.title}</div>))}</div>}</div><span style={{color:"#ccc",fontSize:11}}>/</span><div style={{position:"relative"}}><div onClick={()=>{sD2(!d2);sD1(false);sD3(false)}} style={{padding:"3px 8px",fontSize:11,background:"#f0f0f0",borderRadius:3,cursor:"pointer"}}>{s2.name} ▾</div>{d2&&<div style={{position:"absolute",top:26,left:0,background:"#fff",borderRadius:5,boxShadow:"0 2px 10px rgba(0,0,0,0.1)",zIndex:20,minWidth:100,padding:"3px 0"}}>{s1.menus.map(m=>(<div key={m.id} onClick={()=>{sS2(m);sS3(null);sD2(false)}} style={{padding:"5px 10px",fontSize:11,cursor:"pointer"}}>{m.name}</div>))}</div>}</div>{s2.children?.length>0&&<><span style={{color:"#ccc",fontSize:11}}>/</span><div style={{position:"relative"}}><div onClick={()=>{sD3(!d3);sD1(false);sD2(false)}} style={{padding:"3px 8px",fontSize:11,background:"#f0f0f0",borderRadius:3,cursor:"pointer"}}>{s3?.name||"선택..."} ▾</div>{d3&&<div style={{position:"absolute",top:26,left:0,background:"#fff",borderRadius:5,boxShadow:"0 2px 10px rgba(0,0,0,0.1)",zIndex:20,minWidth:100,padding:"3px 0"}}>{s2.children.map(c=>(<div key={c.id} onClick={()=>{sS3(c);sA(c.name);sD3(false)}} style={{padding:"5px 10px",fontSize:11,cursor:"pointer",color:s3?.id===c.id?"#287dff":"#333"}}>{c.name}</div>))}</div>}</div></>}</div><div style={{padding:14,fontSize:11,color:"#999"}}>{a||"단계별 드롭다운 셀렉터"}</div></DFrame>);};

const TopInline = () => { const[e,sE]=useState(null);const[a,sA]=useState(null);return(<DFrame label="인라인 토글"><div style={{height:42,background:"#287dff",display:"flex",alignItems:"center",padding:"0 14px"}}><span style={{color:"#fff",fontWeight:700,fontSize:12}}>피치CRM</span></div><div style={{borderBottom:"1px solid #eee"}}><div style={{display:"flex",background:"#fafafa"}}>{menuData.map(s=>(<div key={s.id} onClick={()=>sE(e===s.id?null:s.id)} style={{padding:"8px 12px",fontSize:11,cursor:"pointer",color:e===s.id?"#287dff":"#666",fontWeight:e===s.id?700:400,background:e===s.id?"#fff":"transparent",borderBottom:e===s.id?"2px solid #287dff":"none"}}>{s.title}</div>))}</div>{e&&(()=>{const sec=menuData.find(s=>s.id===e);return(<div style={{padding:"6px 14px",background:"#fff",display:"flex",gap:16}}>{sec.menus.map(m=>(<div key={m.id} style={{display:"flex",alignItems:"center",gap:6}}><span style={{fontSize:9,color:"#aaa"}}>{m.name}:</span>{m.children?.length>0?m.children.map(c=>(<span key={c.id} onClick={()=>sA(c.name)} style={{padding:"2px 7px",fontSize:10,background:a===c.name?"#287dff":"#f0f0f0",color:a===c.name?"#fff":"#555",borderRadius:3,cursor:"pointer"}}>{c.name}</span>)):<span onClick={()=>sA(m.name)} style={{padding:"2px 7px",fontSize:10,background:"#f0f0f0",borderRadius:3,cursor:"pointer"}}>{m.name}</span>}</div>))}</div>);})()}</div><div style={{padding:14,fontSize:11,color:"#999"}}>{a||"탭 → 인라인 확장"}</div></DFrame>);};

const topMenus = [
  { c: TopPick, n: "클래식 호버", pick: true },
  { c: TopMega, n: "메가메뉴" }, { c: TopRibbon, n: "리본" }, { c: Top2Row, n: "2단 내비" },
  { c: TopCmd, n: "커맨드바" }, { c: TopTab, n: "탭+드롭" }, { c: TopSlide, n: "슬라이딩" },
  { c: TopBread, n: "브레드크럼" }, { c: TopInline, n: "인라인" },
];

// ═══════════════════════════════════════
// DESKTOP LEFT MENU COMPONENTS
// ═══════════════════════════════════════
const LFrame = ({ children, label, isPick }) => (
  <div style={{ background: "#f5f6f8", borderRadius: 8, border: isPick ? "2px solid #287dff" : "1px solid #e0e0e0", overflow: "hidden", height: 420, position: "relative", display: "flex", flexDirection: "column", boxShadow: isPick ? "0 2px 12px rgba(40,125,255,0.15)" : "none" }}>
    <div style={{ height: 34, background: "#287dff", display: "flex", alignItems: "center", padding: "0 12px", flexShrink: 0 }}>
      <span style={{ color: "#fff", fontWeight: 700, fontSize: 11 }}>피치CRM</span>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 8, marginLeft: 6 }}>{label} {isPick && "⭐ PICK"}</span>
    </div>
    <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>{children}</div>
  </div>
);
const LContent = ({ a }) => <div style={{ flex: 1, background: "#fff", padding: 14, fontSize: 11, color: "#999" }}>{a ? `✓ ${a}` : "메뉴 선택"}</div>;

// PICK: Notion 스타일
const LeftPick = () => {
  const [e1, sE1] = useState([1, 2]);
  const [e2, sE2] = useState([11]);
  const [a, sA] = useState(null);
  const t1 = id => sE1(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  const t2 = id => sE2(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);
  return (
    <LFrame label="Notion 스타일" isPick>
      <div style={{ width: 210, background: "#fbfbfa", borderRight: "1px solid #e8e8e5", overflowY: "auto", flexShrink: 0, padding: "5px 0" }}>
        {menuData.map(sec => (
          <div key={sec.id}>
            <div onClick={() => t1(sec.id)} style={{ padding: "4px 9px", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#91918e" }}>
              <span style={{ fontSize: 8, width: 14, textAlign: "center", display: "inline-block", transform: e1.includes(sec.id) ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.15s" }}>▶</span>
              <span style={{ fontWeight: 600 }}>{sec.title}</span>
            </div>
            {e1.includes(sec.id) && sec.menus.map(m => (
              <div key={m.id}>
                <div onClick={() => m.children?.length ? t2(m.id) : sA(m.name)} style={{ padding: "4px 9px 4px 22px", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 4, color: "#37352f", borderRadius: 3 }}>
                  {m.children?.length > 0 && <span style={{ fontSize: 8, width: 14, textAlign: "center", display: "inline-block", transform: e2.includes(m.id) ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.15s" }}>▶</span>}
                  {!m.children?.length && <span style={{ width: 14 }} />}
                  <span>{m.icon} {m.name}</span>
                </div>
                {e2.includes(m.id) && m.children?.map(c => (
                  <div key={c.id} onClick={() => sA(c.name)} style={{ padding: "4px 9px 4px 48px", fontSize: 11, cursor: "pointer", color: a === c.name ? "#287dff" : "#37352f", background: a === c.name ? "#f0f0ef" : "transparent", borderRadius: 3, margin: "0 4px" }}>
                    {c.name}
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
      <LContent a={a} />
    </LFrame>
  );
};

const LeftClassic = () => { const[e,sE]=useState([11]);const[a,sA]=useState(null);const tg=id=>sE(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);return(<LFrame label="클래식 아코디언"><div style={{width:180,background:"#fafbfc",borderRight:"1px solid #eee",overflowY:"auto",flexShrink:0}}>{menuData.map(s=>(<div key={s.id}><div style={{padding:"7px 10px",fontSize:9,color:"#999",fontWeight:700}}>{s.title}</div>{s.menus.map(m=>(<div key={m.id}><div onClick={()=>m.children?.length?tg(m.id):sA(m.name)} style={{padding:"6px 10px",fontSize:11,cursor:"pointer",display:"flex",justifyContent:"space-between",color:"#444",background:e.includes(m.id)?"#f0f4ff":"transparent"}}><span>{m.icon} {m.name}</span>{m.children?.length>0&&<span style={{fontSize:7}}>{e.includes(m.id)?"▲":"▼"}</span>}</div>{e.includes(m.id)&&m.children?.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"5px 10px 5px 28px",fontSize:10,cursor:"pointer",color:a===c.name?"#287dff":"#666",borderLeft:a===c.name?"2px solid #287dff":"2px solid transparent"}}>{c.name}</div>))}</div>))}</div>))}</div><LContent a={a}/></LFrame>);};

const LeftCompact = () => { const[h,sH]=useState(null);const[a,sA]=useState(null);const t=useRef(null);return(<LFrame label="컴팩트 플로팅"><div style={{width:56,background:"#1e293b",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:6,flexShrink:0}}>{menuData.flatMap(s=>s.menus).map(m=>(<div key={m.id} onMouseEnter={()=>{clearTimeout(t.current);sH(m.id)}} onMouseLeave={()=>{t.current=setTimeout(()=>sH(null),150)}} style={{width:40,height:40,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",cursor:"pointer",borderRadius:6,marginBottom:3,background:h===m.id?"#334155":"transparent"}}><span style={{fontSize:14}}>{m.icon}</span><span style={{fontSize:6,color:"#94a3b8"}}>{m.name.slice(0,3)}</span></div>))}</div>{h&&(()=>{const m=menuData.flatMap(s=>s.menus).find(x=>x.id===h);return m&&<div onMouseEnter={()=>{clearTimeout(t.current);sH(h)}} onMouseLeave={()=>{t.current=setTimeout(()=>sH(null),150)}} style={{position:"absolute",left:56,top:34,background:"#fff",minWidth:140,boxShadow:"2px 2px 10px rgba(0,0,0,0.1)",borderRadius:"0 6px 6px 0",zIndex:20,padding:"6px 0"}}><div style={{padding:"3px 10px",fontSize:10,fontWeight:700,color:"#287dff"}}>{m.name}</div>{m.children?.length>0?m.children.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"5px 10px",fontSize:11,cursor:"pointer",color:a===c.name?"#287dff":"#555"}}>{c.name}</div>)):<div onClick={()=>sA(m.name)} style={{padding:"5px 10px",fontSize:11,cursor:"pointer"}}>바로가기</div>}</div>})()}<LContent a={a}/></LFrame>);};

const LeftTree = () => { const[e1,sE1]=useState([1,3]);const[e2,sE2]=useState([11]);const[a,sA]=useState(null);const t1=id=>sE1(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);const t2=id=>sE2(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);return(<LFrame label="트리뷰"><div style={{width:190,background:"#1e1e2e",overflowY:"auto",flexShrink:0,padding:"3px 0"}}>{menuData.map(s=>(<div key={s.id}><div onClick={()=>t1(s.id)} style={{padding:"4px 7px",fontSize:10,color:"#cdd6f4",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:7,width:11,textAlign:"center"}}>{e1.includes(s.id)?"▾":"▸"}</span><span style={{fontWeight:600}}>{s.title}</span></div>{e1.includes(s.id)&&s.menus.map(m=>(<div key={m.id}><div onClick={()=>m.children?.length?t2(m.id):sA(m.name)} style={{padding:"3px 7px 3px 18px",fontSize:10,color:"#a6adc8",cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><span style={{fontSize:7,width:11,textAlign:"center"}}>{m.children?.length>0?(e2.includes(m.id)?"▾":"▸"):" "}</span>{m.icon} {m.name}</div>{e2.includes(m.id)&&m.children?.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"2px 7px 2px 36px",fontSize:10,cursor:"pointer",color:a===c.name?"#89b4fa":"#7f849c",background:a===c.name?"rgba(137,180,250,0.1)":"transparent"}}>{c.name}</div>))}</div>))}</div>))}</div><LContent a={a}/></LFrame>);};

const LeftDual = () => { const[s,sS]=useState(0);const[a,sA]=useState(null);return(<LFrame label="듀얼 패널"><div style={{width:48,background:"#f1f5f9",borderRight:"1px solid #e2e8f0",display:"flex",flexDirection:"column",alignItems:"center",paddingTop:4,flexShrink:0}}>{menuData.map((x,i)=>(<div key={x.id} onClick={()=>sS(i)} style={{width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center",borderRadius:6,cursor:"pointer",marginBottom:3,background:s===i?"#287dff":"transparent",fontSize:14}}><span style={{filter:s===i?"brightness(10)":"none"}}>{x.icon}</span></div>))}</div><div style={{width:150,background:"#fff",borderRight:"1px solid #eee",overflowY:"auto",flexShrink:0,padding:"6px 0"}}><div style={{padding:"3px 10px",fontSize:11,fontWeight:700,color:"#287dff",marginBottom:3}}>{menuData[s]?.title}</div>{menuData[s]?.menus.map(m=>(<div key={m.id}><div style={{padding:"2px 10px",fontSize:9,color:"#aaa",fontWeight:600,marginTop:3}}>{m.name}</div>{m.children?.length>0?m.children.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"4px 10px 4px 16px",fontSize:10,cursor:"pointer",color:a===c.name?"#287dff":"#555"}}>• {c.name}</div>)):<div onClick={()=>sA(m.name)} style={{padding:"4px 10px 4px 16px",fontSize:10,cursor:"pointer"}}>{m.name}</div>}</div>))}</div><LContent a={a}/></LFrame>);};

const LeftCollapse = () => { const[e,sE]=useState([1]);const[a,sA]=useState(null);const tg=id=>sE(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);return(<LFrame label="접이식 그룹"><div style={{width:190,background:"#fff",borderRight:"1px solid #eee",overflowY:"auto",flexShrink:0}}>{menuData.map(s=>(<div key={s.id}><div onClick={()=>tg(s.id)} style={{padding:"8px 10px",fontSize:11,fontWeight:700,cursor:"pointer",background:"#f8f9fa",borderBottom:"1px solid #eee",display:"flex",justifyContent:"space-between",color:e.includes(s.id)?"#287dff":"#444"}}><span>{s.icon} {s.title}</span><span style={{fontSize:12,display:"inline-block",transform:e.includes(s.id)?"rotate(180deg)":"rotate(0)"}}>⌄</span></div>{e.includes(s.id)&&s.menus.map(m=>(<div key={m.id}>{m.children?.length>0?<><div style={{padding:"3px 10px 1px",fontSize:8,color:"#bbb",fontWeight:600}}>{m.name}</div>{m.children.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"5px 10px 5px 18px",fontSize:10,cursor:"pointer",color:a===c.name?"#287dff":"#555",background:a===c.name?"#eef4ff":"transparent"}}>{c.name}</div>))}</>:<div onClick={()=>sA(m.name)} style={{padding:"6px 10px 6px 14px",fontSize:10,cursor:"pointer"}}>{m.icon} {m.name}</div>}</div>))}</div>))}</div><LContent a={a}/></LFrame>);};

const LeftToggle = () => { const[w,sW]=useState(true);const[e,sE]=useState([11]);const[a,sA]=useState(null);const[h,sH]=useState(null);const t=useRef(null);const tg=id=>sE(p=>p.includes(id)?p.filter(x=>x!==id):[...p,id]);return(<LFrame label="미니↔확장"><div style={{width:w?180:56,background:"#fafbfc",borderRight:"1px solid #eee",overflowY:"auto",overflowX:"hidden",flexShrink:0,transition:"width 0.2s",position:"relative"}}><div onClick={()=>sW(!w)} style={{padding:"6px 0",textAlign:"center",cursor:"pointer",fontSize:12,borderBottom:"1px solid #eee"}}>{w?"◁":"▷"}</div>{w?menuData.map(s=>(<div key={s.id}><div style={{padding:"5px 8px",fontSize:8,color:"#aaa",fontWeight:700}}>{s.title}</div>{s.menus.map(m=>(<div key={m.id}><div onClick={()=>m.children?.length?tg(m.id):sA(m.name)} style={{padding:"5px 8px",fontSize:10,cursor:"pointer",display:"flex",justifyContent:"space-between",color:"#444"}}><span>{m.icon} {m.name}</span>{m.children?.length>0&&<span style={{fontSize:7}}>{e.includes(m.id)?"▲":"▼"}</span>}</div>{e.includes(m.id)&&m.children?.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"4px 8px 4px 26px",fontSize:10,cursor:"pointer",color:a===c.name?"#287dff":"#666"}}>{c.name}</div>))}</div>))}</div>)):menuData.flatMap(s=>s.menus).map(m=>(<div key={m.id} onMouseEnter={()=>{clearTimeout(t.current);sH(m.id)}} onMouseLeave={()=>{t.current=setTimeout(()=>sH(null),150)}} style={{padding:"8px 0",textAlign:"center",cursor:"pointer",position:"relative"}}><span style={{fontSize:14}}>{m.icon}</span>{h===m.id&&<div onMouseEnter={()=>{clearTimeout(t.current);sH(m.id)}} onMouseLeave={()=>{t.current=setTimeout(()=>sH(null),150)}} style={{position:"absolute",left:56,top:0,background:"#fff",minWidth:130,boxShadow:"2px 2px 8px rgba(0,0,0,0.1)",borderRadius:5,zIndex:20,padding:"4px 0"}}><div style={{padding:"2px 8px",fontSize:9,fontWeight:700,color:"#287dff"}}>{m.name}</div>{m.children?.length>0?m.children.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"4px 8px",fontSize:10,cursor:"pointer",color:a===c.name?"#287dff":"#555"}}>{c.name}</div>)):<div onClick={()=>sA(m.name)} style={{padding:"4px 8px",fontSize:10,cursor:"pointer"}}>바로가기</div>}</div>}</div>))}</div><LContent a={a}/></LFrame>);};

const LeftFlat = () => { const[f,sF]=useState(null);const[a,sA]=useState(null);const fl=f?menuData.filter(s=>s.id===f):menuData;return(<LFrame label="플랫 + 필터"><div style={{width:190,background:"#fff",borderRight:"1px solid #eee",display:"flex",flexDirection:"column",flexShrink:0}}><div style={{display:"flex",gap:2,padding:"6px 5px",flexWrap:"wrap",borderBottom:"1px solid #f0f0f0"}}><div onClick={()=>sF(null)} style={{padding:"1px 7px",fontSize:8,borderRadius:6,cursor:"pointer",background:!f?"#287dff":"#f0f0f0",color:!f?"#fff":"#888"}}>전체</div>{menuData.map(s=>(<div key={s.id} onClick={()=>sF(s.id)} style={{padding:"1px 7px",fontSize:8,borderRadius:6,cursor:"pointer",background:f===s.id?"#287dff":"#f0f0f0",color:f===s.id?"#fff":"#888"}}>{s.icon}</div>))}</div><div style={{flex:1,overflowY:"auto"}}>{fl.flatMap(s=>s.menus.flatMap(m=>m.children?.length>0?m.children.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"6px 10px",fontSize:10,cursor:"pointer",borderBottom:"1px solid #fafafa",color:a===c.name?"#287dff":"#444"}}><span style={{fontSize:8,color:"#ccc"}}>{s.title}›</span> {c.name}</div>)):[<div key={m.id} onClick={()=>sA(m.name)} style={{padding:"6px 10px",fontSize:10,cursor:"pointer",borderBottom:"1px solid #fafafa"}}><span style={{fontSize:8,color:"#ccc"}}>{s.title}›</span> {m.name}</div>]))}</div></div><LContent a={a}/></LFrame>);};

const LeftCard = () => { const[s,sS]=useState(null);const[a,sA]=useState(null);return(<LFrame label="카드 네비"><div style={{width:200,background:"#f8fafc",borderRight:"1px solid #e2e8f0",overflowY:"auto",flexShrink:0,padding:6}}>{!s?<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>{menuData.map(x=>(<div key={x.id} onClick={()=>sS(x)} style={{background:"#fff",borderRadius:6,padding:"10px 6px",textAlign:"center",cursor:"pointer",border:"1px solid #e2e8f0"}}><div style={{fontSize:18}}>{x.icon}</div><div style={{fontSize:9,color:"#555",marginTop:2}}>{x.title}</div></div>))}</div>:<><div onClick={()=>sS(null)} style={{fontSize:10,color:"#287dff",cursor:"pointer",marginBottom:6,padding:3}}>‹ 전체</div><div style={{fontSize:12,fontWeight:700,marginBottom:6,padding:"0 3px"}}>{s.icon} {s.title}</div>{s.menus.map(m=>(<div key={m.id} style={{background:"#fff",borderRadius:6,marginBottom:5,border:"1px solid #e2e8f0",overflow:"hidden"}}><div style={{padding:"5px 8px",fontSize:9,fontWeight:600,color:"#64748b",background:"#f1f5f9"}}>{m.name}</div>{m.children?.length>0?m.children.map(c=>(<div key={c.id} onClick={()=>sA(c.name)} style={{padding:"5px 8px",fontSize:10,cursor:"pointer",borderTop:"1px solid #f1f5f9",color:a===c.name?"#287dff":"#475569"}}>{c.name}</div>)):<div onClick={()=>sA(m.name)} style={{padding:"5px 8px",fontSize:10,cursor:"pointer",borderTop:"1px solid #f1f5f9"}}>{m.name} →</div>}</div>))}</>}</div><LContent a={a}/></LFrame>);};

const leftMenus = [
  { c: LeftPick, n: "Notion", pick: true },
  { c: LeftClassic, n: "아코디언" }, { c: LeftCompact, n: "컴팩트" }, { c: LeftTree, n: "트리뷰" },
  { c: LeftDual, n: "듀얼" }, { c: LeftCollapse, n: "접이식" }, { c: LeftToggle, n: "미니↔확장" },
  { c: LeftFlat, n: "플랫" }, { c: LeftCard, n: "카드" },
];

// ═══════════════════════════════════════
// MAIN APP
// ═══════════════════════════════════════
export default function App() {
  const [section, setSection] = useState("mobile");
  const [mIdx, setMIdx] = useState(0);
  const [tIdx, setTIdx] = useState(0);
  const [lIdx, setLIdx] = useState(0);

  const sections = [
    { id: "mobile", label: "📱 모바일", count: 10 },
    { id: "top", label: "🖥️ 상단 메뉴", count: 9 },
    { id: "left", label: "📐 좌측 메뉴", count: 9 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f0f2f5", fontFamily: "-apple-system, BlinkMacSystemFont, sans-serif" }}>
      {/* Header */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e0e0e0", padding: "14px 0", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 16px" }}>
          <h1 style={{ fontSize: 16, fontWeight: 800, margin: 0, textAlign: "center" }}>피치CRM 3-Depth 메뉴 시스템 쇼케이스</h1>
          <p style={{ fontSize: 10, color: "#888", textAlign: "center", margin: "4px 0 10px" }}>PRD 기반 · PICK 표시 = 채택 패턴</p>
          <div style={{ display: "flex", justifyContent: "center", gap: 6 }}>
            {sections.map(s => (
              <button key={s.id} onClick={() => setSection(s.id)} style={{ padding: "6px 16px", fontSize: 12, fontWeight: section === s.id ? 700 : 400, background: section === s.id ? "#287dff" : "#f5f5f5", color: section === s.id ? "#fff" : "#666", border: "none", borderRadius: 20, cursor: "pointer" }}>
                {s.label} ({s.count})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "16px 16px 40px" }}>
        {/* Mobile Section */}
        {section === "mobile" && <>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, marginBottom: 14 }}>
            {mobileMenus.map((m, i) => (
              <button key={i} onClick={() => setMIdx(i)} style={{ padding: "3px 10px", fontSize: 10, background: mIdx === i ? (m.pick ? "#287dff" : "#555") : "#fff", color: mIdx === i ? "#fff" : m.pick ? "#287dff" : "#666", border: m.pick ? "2px solid #287dff" : mIdx === i ? "none" : "1px solid #ddd", borderRadius: 12, cursor: "pointer", fontWeight: m.pick ? 700 : 400 }}>
                {m.pick && "⭐ "}{m.n}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            {(() => { const C = mobileMenus[mIdx].c; return <C />; })()}
          </div>
        </>}

        {/* Top Menu Section */}
        {section === "top" && <>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, marginBottom: 14 }}>
            {topMenus.map((m, i) => (
              <button key={i} onClick={() => setTIdx(i)} style={{ padding: "3px 10px", fontSize: 10, background: tIdx === i ? (m.pick ? "#287dff" : "#555") : "#fff", color: tIdx === i ? "#fff" : m.pick ? "#287dff" : "#666", border: m.pick ? "2px solid #287dff" : tIdx === i ? "none" : "1px solid #ddd", borderRadius: 12, cursor: "pointer", fontWeight: m.pick ? 700 : 400 }}>
                {m.pick && "⭐ "}{m.n}
              </button>
            ))}
          </div>
          {(() => { const C = topMenus[tIdx].c; return <C />; })()}
        </>}

        {/* Left Menu Section */}
        {section === "left" && <>
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 4, marginBottom: 14 }}>
            {leftMenus.map((m, i) => (
              <button key={i} onClick={() => setLIdx(i)} style={{ padding: "3px 10px", fontSize: 10, background: lIdx === i ? (m.pick ? "#287dff" : "#555") : "#fff", color: lIdx === i ? "#fff" : m.pick ? "#287dff" : "#666", border: m.pick ? "2px solid #287dff" : lIdx === i ? "none" : "1px solid #ddd", borderRadius: 12, cursor: "pointer", fontWeight: m.pick ? 700 : 400 }}>
                {m.pick && "⭐ "}{m.n}
              </button>
            ))}
          </div>
          {(() => { const C = leftMenus[lIdx].c; return <C />; })()}
        </>}

        {/* Summary */}
        <div style={{ marginTop: 20, background: "#fff", borderRadius: 8, padding: 14, fontSize: 11, lineHeight: 1.7 }}>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 8, color: "#287dff" }}>⭐ PICK 채택 패턴 요약</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
            <div style={{ background: "#f0f5ff", borderRadius: 8, padding: 10, border: "1px solid #d0e0ff" }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: "#287dff", marginBottom: 4 }}>📱 모바일</div>
              <div style={{ fontWeight: 700 }}>탭 + 패널 분리</div>
              <div style={{ color: "#777", fontSize: 10 }}>좌측 아이콘 탭으로 섹션 전환, 우측 콘텐츠 패널에서 2차/3차 아코디언</div>
            </div>
            <div style={{ background: "#f0f5ff", borderRadius: 8, padding: 10, border: "1px solid #d0e0ff" }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: "#287dff", marginBottom: 4 }}>🖥️ 상단 메뉴</div>
              <div style={{ fontWeight: 700 }}>클래식 호버 드롭다운</div>
              <div style={{ color: "#777", fontSize: 10 }}>mouseenter/leave 기반 1차→2차→3차 순차 패널. PRD 기본 패턴</div>
            </div>
            <div style={{ background: "#f0f5ff", borderRadius: 8, padding: 10, border: "1px solid #d0e0ff" }}>
              <div style={{ fontWeight: 700, fontSize: 11, color: "#287dff", marginBottom: 4 }}>📐 좌측 메뉴</div>
              <div style={{ fontWeight: 700 }}>Notion 스타일</div>
              <div style={{ color: "#777", fontSize: 10 }}>인덴트 + 삼각형 토글. 미니멀 문서 탐색기 스타일</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}