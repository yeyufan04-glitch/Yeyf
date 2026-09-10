"use client";

import { useEffect, useMemo, useState } from "react";
import { calibrationTasks, caseSummary, claims, documents, facts, rules, type EvidenceFact, type TradeDocument } from "../mock/trustCase";

type Page = "cockpit" | "documents" | "evidence" | "cav" | "certificate" | "review" | "sources";

const navItems: Array<{ id: Page; label: string; hint: string; icon: string }> = [
  { id: "cockpit", label: "案件总览", hint: "Case cockpit", icon: "⌂" },
  { id: "documents", label: "单证事实", hint: "Document AI", icon: "▤" },
  { id: "evidence", label: "交易证据", hint: "TEG · ESE", icon: "⌘" },
  { id: "cav", label: "可信执行", hint: "C · A · V", icon: "◇" },
  { id: "certificate", label: "可信凭证", hint: "Certificate", icon: "✓" },
  { id: "review", label: "人工处置", hint: "Human review", icon: "⚑" },
  { id: "sources", label: "规则与来源", hint: "Rule register", icon: "§" },
];

function pageFromHash(): Page {
  if (typeof window === "undefined") return "cockpit";
  const value = window.location.hash.replace(/^#\/?/, "") as Page;
  return navItems.some((item) => item.id === value) ? value : "cockpit";
}

export function DemoApp() {
  const [page, setPage] = useState<Page>("cockpit");
  const [running, setRunning] = useState(false);
  const [runStep, setRunStep] = useState("规则与模型版本已锁定");
  const [reviewed, setReviewed] = useState(false);

  useEffect(() => {
    const sync = () => setPage(pageFromHash());
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const navigate = (next: Page) => {
    window.location.hash = `/${next}`;
    setPage(next);
  };

  const rerun = () => {
    if (running) return;
    setRunning(true);
    const steps = ["读取 7 份材料与 2 个模拟接口", "TEG 重建 10 项关键事实", "ESE 评估证据充分性", "CAV 审查 4 条 AI Claim", "Policy Shield 已拦截自动流转"];
    steps.forEach((step, index) => window.setTimeout(() => setRunStep(step), 480 * (index + 1)));
    window.setTimeout(() => setRunning(false), 2900);
  };

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">证</div>
          <div><strong>贸证贯通</strong><span>可信贸易作业平台</span></div>
        </div>
        <div className="environment"><i /> 竞赛离线演示环境</div>
        <nav aria-label="主导航">
          {navItems.map((item) => (
            <button key={item.id} className={page === item.id ? "active" : ""} onClick={() => navigate(item.id)}>
              <b>{item.icon}</b><span>{item.label}<small>{item.hint}</small></span>
              {item.id === "review" && <em>2</em>}
            </button>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="operator-avatar">李</div>
          <div><strong>李经理</strong><span>国际业务中心</span></div>
          <button aria-label="更多">···</button>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <span className="breadcrumb">进口汇款 / {caseSummary.id}</span>
            <h1>{navItems.find((item) => item.id === page)?.label}</h1>
          </div>
          <div className="top-actions">
            <span className="sla">处理时限 <b>{caseSummary.sla}</b></span>
            <button className="outline" onClick={() => navigate("sources")}>规则依据</button>
            <button className="primary" onClick={rerun} disabled={running}>{running ? "正在核验…" : "重新运行可信核验"}</button>
          </div>
        </header>

        <div className="workarea">
          {running && <div className="run-strip"><span className="spinner" />{runStep}<div className="run-progress"><i /></div></div>}
          {page === "cockpit" && <Cockpit navigate={navigate} />}
          {page === "documents" && <Documents />}
          {page === "evidence" && <Evidence />}
          {page === "cav" && <Cav />}
          {page === "certificate" && <Certificate />}
          {page === "review" && <Review reviewed={reviewed} setReviewed={setReviewed} />}
          {page === "sources" && <Sources />}
        </div>
        <footer>竞赛 PoC · 全部企业、单据与外部接口数据均为合成材料 · 系统不认定可疑交易，银行人员保留最终判断权</footer>
      </main>
    </div>
  );
}

function Cockpit({ navigate }: { navigate: (page: Page) => void }) {
  return (
    <div className="stack">
      <section className="case-banner">
        <div className="case-main">
          <span className="label">当前业务</span>
          <h2>{caseSummary.product}</h2>
          <p>{caseSummary.applicant} <b>→</b> {caseSummary.beneficiary}</p>
        </div>
        <div className="case-amount"><span>本次汇款金额</span><strong>{caseSummary.amount}</strong></div>
        <div className="case-status"><span className="status-dot" />{caseSummary.status}</div>
      </section>

      <section className="decision-alert">
        <div className="decision-icon">!</div>
        <div>
          <span className="overline">BANK POLICY SHIELD · V 阶段</span>
          <h2>自动流转已拦截</h2>
          <p>本批实际装运数量存在关键跨源冲突，且“发票笔误”解释没有证据支持。系统仅允许补充材料或人工复核。</p>
        </div>
        <button onClick={() => navigate("review")}>处理 2 项例外 <span>→</span></button>
      </section>

      <section className="metric-grid">
        <Metric label="已接收材料" value="7" unit="份" note="5 份单据 + 2 个模拟接口" tone="blue" />
        <Metric label="交易事实" value="10" unit="项" note="7 完整 · 1 部分 · 1 冲突 · 1 缺失" tone="green" />
        <Metric label="AI Claims" value="4" unit="条" note="2 已验证 · 1 有支持 · 1 无支持" tone="amber" />
        <Metric label="可自动执行动作" value="0" unit="项" note="关键冲突触发人工复核" tone="red" />
      </section>

      <section className="panel">
        <div className="panel-head">
          <div><span className="overline">ONE CASE · ONE EVIDENCE CHAIN</span><h3>从单证到可信执行</h3></div>
          <button className="text-button" onClick={() => navigate("evidence")}>查看完整证据链 →</button>
        </div>
        <div className="flow">
          <FlowStep number="01" title="智能单证作业" text="识别、抽取、确定性核验" meta="43 项标准检查已完成" state="done" />
          <FlowStep number="02" title="TEG · ESE" text="组织证据、识别缺口与冲突" meta="1 CONFLICT · 1 MISSING" state="warn" />
          <FlowStep number="03" title="AI 业务分析" text="形成可验证的 Claim" meta="1 条解释缺乏证据" state="warn" />
          <FlowStep number="04" title="CAV 可信执行" text="校准、审查、策略验证" meta="AUTO_REMIT 被禁止" state="block" />
          <FlowStep number="05" title="人工例外处置" text="只判断机器无法证明的部分" meta="等待客户补正" state="wait" />
        </div>
      </section>

      <div className="two-column">
        <section className="panel exception-panel">
          <div className="panel-head"><div><span className="overline">PRIORITY EXCEPTION</span><h3>本批装运数量冲突</h3></div><Status state="CONFLICT" /></div>
          <div className="compare-row">
            <div><span>客户材料</span><strong>1,000 <small>PCS</small></strong><em>发票 · 装箱单</em></div>
            <b>≠</b>
            <div><span>外部独立证据</span><strong>800 <small>PCS</small></strong><em>提单 · 原产地证 · 报关</em></div>
          </div>
          <p className="system-language"><b>系统业务语言：</b>独立装运与申报证据无法覆盖客户材料所述的全部 1,000 件。</p>
          <button className="primary" onClick={() => navigate("evidence")}>定位证据</button>
        </section>

        <section className="panel attention-panel">
          <div className="panel-head"><div><span className="overline">HUMAN ATTENTION</span><h3>只需处理这两件事</h3></div></div>
          <ol>
            <li><span>01</span><div><strong>确认是否为分批履约</strong><p>合同允许分批，但缺少本批与剩余批次说明。</p></div></li>
            <li><span>02</span><div><strong>更正客户控制材料</strong><p>发票、装箱单数量应与实际本批装运相符。</p></div></li>
          </ol>
          <button className="outline" onClick={() => navigate("review")}>进入人工处置台</button>
        </section>
      </div>
    </div>
  );
}

function Metric({ label, value, unit, note, tone }: { label: string; value: string; unit: string; note: string; tone: string }) {
  return <div className={`metric ${tone}`}><span>{label}</span><strong>{value}<small>{unit}</small></strong><p>{note}</p></div>;
}

function FlowStep({ number, title, text, meta, state }: { number: string; title: string; text: string; meta: string; state: string }) {
  return <div className={`flow-step ${state}`}><span className="flow-num">{number}</span><div><h4>{title}</h4><p>{text}</p><em>{meta}</em></div></div>;
}

function Status({ state }: { state: string }) {
  const labels: Record<string, string> = { COMPLETE: "完整", PARTIAL: "部分", CONFLICT: "冲突", MISSING: "缺失", VERIFIED: "已验证", SUPPORTED: "有支持", UNSUPPORTED: "无支持", PASS: "通过", FAIL: "不足" };
  return <span className={`status ${state.toLowerCase()}`}><i />{state}<small>{labels[state]}</small></span>;
}

function Documents() {
  const [active, setActive] = useState<TradeDocument>(documents[0]);
  const [filter, setFilter] = useState("全部来源");
  const visible = documents.filter((doc) => filter === "全部来源" || doc.sourceClass === filter);
  return (
    <div className="stack">
      <section className="page-intro">
        <div><span className="overline">DOCUMENT AI · FACT EXTRACTION</span><h2>材料不再是附件，而是可追溯事实</h2><p>每个字段保留来源、签发方和证据类别；合成数据与已校验来源明确标识。</p></div>
        <div className="segmented">{["全部来源", "客户材料", "外部独立证据", "银行内部证据"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item}</button>)}</div>
      </section>
      <div className="document-layout">
        <section className="panel doc-list">
          <div className="doc-summary"><b>{visible.length}</b><span>份材料</span><em>全部完整载入</em></div>
          {visible.map((doc) => <button key={doc.id} className={active.id === doc.id ? "active" : ""} onClick={() => setActive(doc)}>
            <span className={`file-type ${doc.format}`}>{doc.format.toUpperCase()}</span>
            <div><strong>{doc.name}</strong><small>{doc.issuer} · {doc.receivedAt}</small></div>
            <em className={`source-tag ${doc.sourceClass === "客户材料" ? "customer" : doc.sourceClass === "外部独立证据" ? "external" : "bank"}`}>{doc.sourceClass}</em>
          </button>)}
        </section>
        <section className="panel doc-detail">
          <div className="panel-head"><div><span className="overline">SOURCE ANCHOR · {active.id.toUpperCase()}</span><h3>{active.name}</h3></div><a className="outline link-button" href={active.path} target="_blank" rel="noreferrer">打开原文件 ↗</a></div>
          <div className="document-meta"><span>签发方 <b>{active.issuer}</b></span><span>证据类型 <b>{active.sourceClass}</b></span><span>完整性 <b>{active.integrity}</b></span></div>
          <div className="field-grid">{active.fields.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong><small>已定位来源</small></div>)}</div>
          {active.format === "pdf" ? <iframe title={active.name} src={active.path} className="document-frame" /> : <JsonPreview document={active} />}
        </section>
      </div>
    </div>
  );
}

function JsonPreview({ document }: { document: TradeDocument }) {
  const json = useMemo(() => Object.fromEntries(document.fields.map(([key, value]) => [key, value])), [document]);
  return <div className="json-preview"><div><span>GET</span>{document.path}</div><pre>{JSON.stringify({ source: document.issuer, verified: false, synthetic: true, payload: json }, null, 2)}</pre></div>;
}

function Evidence() {
  const [selectedId, setSelectedId] = useState("shipmentQty");
  const selected = facts.find((fact) => fact.id === selectedId) ?? facts[0];
  return (
    <div className="stack">
      <section className="page-intro">
        <div><span className="overline">TEG · ESE</span><h2>这笔交易的关键事实，由什么证据支持？</h2><p>TEG 组织来源关系；ESE 只输出 COMPLETE、PARTIAL、CONFLICT、MISSING，不伪造“真实性分数”。</p></div>
        <div className="legend"><Status state="COMPLETE" /><Status state="PARTIAL" /><Status state="CONFLICT" /><Status state="MISSING" /></div>
      </section>
      <section className="panel evidence-map">
        <div className="source-column">
          <h4>客户控制材料</h4>
          {["合同", "发票", "装箱单"].map((item) => <span key={item}>{item}<i /></span>)}
        </div>
        <div className="graph-lines" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="trade-core"><small>TRADE CASE</small><strong>{caseSummary.id}</strong><span>{caseSummary.amount}</span><em>进口货物贸易汇款</em></div>
        <div className="graph-lines right" aria-hidden="true"><i /><i /><i /><i /><i /><i /></div>
        <div className="source-column right">
          <h4>独立 / 银行证据</h4>
          {["提单 · 原产地证", "报关回执", "付款指令"].map((item) => <span key={item}><i />{item}</span>)}
        </div>
      </section>
      <div className="evidence-layout">
        <section className="panel fact-list">
          <div className="panel-head"><div><span className="overline">EVIDENCE STATE</span><h3>10 项交易事实</h3></div><span className="fact-count">7 / 10 完整</span></div>
          <div className="table-head"><span>交易事实</span><span>规范值</span><span>证据状态</span></div>
          {facts.map((fact) => <button key={fact.id} className={selected.id === fact.id ? "active" : ""} onClick={() => setSelectedId(fact.id)}>
            <span><i className={fact.level === "关键" ? "critical" : ""} />{fact.label}<small>{fact.level}事实</small></span><b>{fact.value}</b><Status state={fact.state} />
          </button>)}
        </section>
        <FactDetail fact={selected} />
      </div>
    </div>
  );
}

function FactDetail({ fact }: { fact: EvidenceFact }) {
  return <section className={`panel fact-detail state-${fact.state.toLowerCase()}`}>
    <div className="panel-head"><div><span className="overline">FACT · {fact.id.toUpperCase()}</span><h3>{fact.label}</h3></div><Status state={fact.state} /></div>
    <div className="canonical"><span>当前规范值</span><strong>{fact.value}</strong></div>
    <h4>支持证据</h4>
    <div className="evidence-chips">{fact.supporting.length ? fact.supporting.map((item) => <span key={item}>✓ {item}</span>) : <em>尚无支持证据</em>}</div>
    {fact.conflicting && <><h4>冲突来源</h4><div className="evidence-chips conflict">{fact.conflicting.map((item) => <span key={item}>! {item}</span>)}</div></>}
    <div className="explanation"><span>机器可解释结论</span><p>{fact.explanation}</p></div>
    {fact.nextAction && <div className="next-action"><span>建议的受控动作</span><strong>{fact.nextAction}</strong></div>}
    <p className="boundary">边界：该状态描述证据充分性，不直接等于交易真实/虚假结论。</p>
  </section>;
}

function Cav() {
  const [tab, setTab] = useState<"calibration" | "audit" | "verify">("verify");
  return (
    <div className="stack">
      <section className="page-intro">
        <div><span className="overline">CAV · TRUSTED EXECUTION</span><h2>不是问“AI 看起来聪不聪明”，而是问“这次能不能采用”</h2><p>校准任务可靠度、审查具体 Claim、在执行前调用银行策略门禁。</p></div>
      </section>
      <div className="cav-tabs">
        <button className={tab === "calibration" ? "active" : ""} onClick={() => setTab("calibration")}><b>C</b><span>Calibration<small>任务可靠度</small></span><em>3 通过 · 1 不足</em></button>
        <button className={tab === "audit" ? "active" : ""} onClick={() => setTab("audit")}><b>A</b><span>Audit<small>Claim 证据审查</small></span><em>1 条无支持</em></button>
        <button className={tab === "verify" ? "active" : ""} onClick={() => setTab("verify")}><b>V</b><span>Verify<small>业务策略验证</small></span><em>自动动作被拦截</em></button>
      </div>
      {tab === "calibration" && <Calibration />}
      {tab === "audit" && <Audit />}
      {tab === "verify" && <Verify />}
    </div>
  );
}

function Calibration() {
  return <section className="panel data-table"><div className="panel-head"><div><span className="overline">TASK RELIABILITY MATRIX</span><h3>按任务，而不是按模型笼统评分</h3></div><span className="model-tag">MZG-DocAI v0.9 · Mock benchmark</span></div>
    <div className="table-row heading"><span>任务类型</span><span>样本量</span><span>观察准确率</span><span>Wilson 下界</span><span>门槛</span><span>结果</span></div>
    {calibrationTasks.map((item) => <div className="table-row" key={item.task}><strong>{item.task}</strong><span>{item.sample}</span><span>{item.accuracy}</span><b>{item.lower}</b><span>≥ {item.threshold}</span><Status state={item.result} /></div>)}
    <div className="method-note"><b>演示边界：</b>样本量与准确率是合成 Benchmark，不是工行实测数据；Wilson 下界用于表现样本不足时的保守门禁逻辑。</div>
  </section>;
}

function Audit() {
  return <section className="panel claim-list"><div className="panel-head"><div><span className="overline">CLAIM-LEVEL AUDIT</span><h3>把“事实”与“解释”拆开验证</h3></div></div>
    {claims.map((item) => <div className="claim" key={item.id}><span className="claim-id">{item.id}</span><div><span className="claim-type">{item.type}</span><strong>{item.claim}</strong><small>验证依据：{item.proof}</small></div><Status state={item.result} /></div>)}
    <div className="audit-summary"><span>审查结论</span><p>“数量不一致”和“合同允许分批”已证实；“本批可能为分批履约”有证据支持但仍需客户确认；“发票笔误”不得作为事实进入正式流程。</p></div>
  </section>;
}

function Verify() {
  return <div className="verify-grid">
    <section className="panel shield-panel">
      <div className="shield-icon">V</div><span className="overline">BANK POLICY SHIELD</span><h3>AUTO_REMIT</h3><div className="blocked-word">BLOCKED</div><p>禁止自动流转付款指令</p>
      <div className="shield-reasons"><span>关键事实存在 CONFLICT</span><span>语义解释任务可靠度不足</span><span>存在 UNSUPPORTED Claim</span></div>
    </section>
    <section className="panel policy-list">
      <div className="panel-head"><div><span className="overline">RUNTIME DECISION</span><h3>当前允许与禁止动作</h3></div></div>
      <div className="policy-action denied"><span>×</span><div><strong>AUTO_REMIT</strong><small>自动提交跨境汇款</small></div><em>禁止</em></div>
      <div className="policy-action denied"><span>×</span><div><strong>AUTO_APPROVE</strong><small>自动审核通过</small></div><em>禁止</em></div>
      <div className="policy-action allowed"><span>✓</span><div><strong>REQUEST_SUPPLEMENT</strong><small>请求客户补充或更正材料</small></div><em>允许</em></div>
      <div className="policy-action allowed"><span>✓</span><div><strong>HUMAN_REVIEW</strong><small>转人工例外复核</small></div><em>允许</em></div>
      <p className="policy-foot">策略版本 POL-IMR-V1.3 · 2026-09-10 · 竞赛模拟规则</p>
    </section>
  </div>;
}

function Certificate() {
  const download = () => {
    const payload = { certificateId: "MZG-CERT-20260910-0001", caseId: caseSummary.id, issuedAt: "2026-09-10T09:18:24+08:00", verdict: "HUMAN_REVIEW_REQUIRED", model: "MZG-DocAI-v0.9-mock", policy: "POL-IMR-V1.3", evidence: { complete: 7, partial: 1, conflict: 1, missing: 1 }, claims: { verified: 2, supported: 1, unsupported: 1 }, allowedActions: ["REQUEST_SUPPLEMENT", "HUMAN_REVIEW"], prohibitedActions: ["AUTO_REMIT", "AUTO_APPROVE"], integrityHash: "sha256:7f28a9e8c6d0c4a1e36f9e0d58211e95e3094d54f7a4b3dcb719646ccd210910", synthetic: true };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a"); anchor.href = url; anchor.download = "MZG-CERT-20260910-0001.json"; anchor.click(); URL.revokeObjectURL(url);
  };
  return <div className="certificate-wrap"><section className="certificate-card">
    <div className="cert-top"><div className="cert-seal">证</div><div><span>AI ASSURANCE CERTIFICATE</span><h2>银行 AI 可信决策凭证</h2><p>Certificate ID · MZG-CERT-20260910-0001</p></div><Status state="CONFLICT" /></div>
    <div className="cert-verdict"><span>本次可信执行结论</span><strong>需要人工复核</strong><p>模型输出未获得自动执行资格，当前仅允许请求补充材料或转人工处置。</p></div>
    <div className="cert-grid">
      <div><span>案件编号</span><strong>{caseSummary.id}</strong></div><div><span>签发时间</span><strong>2026-09-10 09:18:24 CST</strong></div>
      <div><span>模型版本</span><strong>MZG-DocAI v0.9 · Mock</strong></div><div><span>策略版本</span><strong>POL-IMR-V1.3</strong></div>
      <div><span>证据状态</span><strong>7 完整 / 1 部分 / 1 冲突 / 1 缺失</strong></div><div><span>Claim 审查</span><strong>2 验证 / 1 支持 / 1 无支持</strong></div>
    </div>
    <div className="cert-actions"><div><span>允许动作</span><b>REQUEST_SUPPLEMENT · HUMAN_REVIEW</b></div><div><span>禁止动作</span><b>AUTO_REMIT · AUTO_APPROVE</b></div></div>
    <div className="hash"><span>SHA-256 INTEGRITY CHAIN</span><code>7f28a9e8 c6d0c4a1 e36f9e0d 58211e95 e3094d54 f7a4b3dc b719646c cd210910</code><small>竞赛 Demo 使用确定性样例哈希；生产环境应写入银行不可改写审计存储。</small></div>
    <div className="cert-sign"><span>贸证贯通可信执行引擎</span><b>C · A · V VERIFIED</b></div>
  </section><div className="certificate-side"><h3>凭证记录什么？</h3><ol><li>当时使用的模型与规则版本</li><li>每项事实的证据状态与来源</li><li>已验证和未支持的 AI Claim</li><li>策略允许、禁止的执行动作</li><li>人工最终处置与完整性校验</li></ol><button className="primary" onClick={download}>下载 JSON 凭证</button><a href="./demo-data/assurance-certificate.json" target="_blank" rel="noreferrer">查看随包留存版本 ↗</a></div></div>;
}

function Review({ reviewed, setReviewed }: { reviewed: boolean; setReviewed: (value: boolean) => void }) {
  const [checks, setChecks] = useState([false, false, false]);
  const [message, setMessage] = useState("");
  const all = checks.every(Boolean);
  const toggle = (index: number) => setChecks((current) => current.map((value, i) => i === index ? !value : value));
  const finish = () => { setReviewed(true); setMessage("已记录人工决定：请求客户更正发票/装箱单并补充分批履约说明。案件保持暂停，不执行付款。"); };
  return <div className="review-layout"><section className="panel review-main">
    <div className="panel-head"><div><span className="overline">EXCEPTION WORKBENCH</span><h2>人工只判断机器无法证明的部分</h2></div><span className="review-count">2 项待处理</span></div>
    <div className="review-case"><div><span className="priority">高重要性</span><h3>客户材料数量与独立装运证据冲突</h3><p>请确认本次付款是否对应 800 件分批货物，并决定是否要求客户更正发票、装箱单。</p></div><Status state="CONFLICT" /></div>
    <div className="review-evidence">
      <div><span>客户材料</span><strong>发票 1,000 PCS</strong><strong>装箱单 1,000 PCS</strong></div>
      <div><span>独立证据</span><strong>提单 800 PCS</strong><strong>报关回执 800 PCS</strong><strong>原产地证 800 PCS</strong></div>
      <div><span>合同依据</span><strong>允许分批装运</strong><strong>总量 1,000 PCS</strong></div>
    </div>
    <h4>复核确认</h4>
    {["我已核对独立装运与申报证据均为 800 PCS", "我确认“发票笔误”当前没有客户证据支持", "我确认应先取得更正材料及分批履约说明，再决定是否继续"].map((label, index) => <label className="check-row" key={label}><input type="checkbox" checked={checks[index]} onChange={() => toggle(index)} /><span>{checks[index] ? "✓" : ""}</span>{label}</label>)}
    {message && <div className="success-message">✓ {message}</div>}
    <div className="review-actions"><button className="outline" onClick={() => setMessage("案件已保持暂停，尚未发送任何外部请求。")}>暂存</button><button className="primary" disabled={!all || reviewed} onClick={finish}>{reviewed ? "处置已记录" : "生成补正请求并保持暂停"}</button></div>
  </section>
  <aside className="panel review-side"><span className="overline">AI BOUNDARY</span><h3>AI 可以做什么</h3><ul><li>定位冲突字段和原文</li><li>列出支持与反对证据</li><li>说明允许的受控动作</li><li>记录人工决定与依据</li></ul><h3>AI 不应做什么</h3><ul className="negative"><li>将差异直接认定为虚假贸易</li><li>替银行人员作最终合规判断</li><li>在关键冲突未解决时自动付款</li></ul></aside></div>;
}

function Sources() {
  return <div className="stack"><section className="page-intro"><div><span className="overline">RULE & SOURCE REGISTER</span><h2>规则、标准与产品策略必须分层</h2><p>本案是普通进口汇款，不是信用证项下审单。UCP 600 / ISBP 821 仅登记为条件性参考，不应错误地作为本案直接执行规则。</p></div></section>
    <section className="panel source-table"><div className="table-row heading"><span>编号</span><span>来源与标题</span><span>在本系统中的作用</span><span>本案状态</span><span>来源</span></div>
      {rules.map((rule) => <div className="table-row" key={rule.id}><code>{rule.id}</code><div><strong>{rule.title}</strong><small>{rule.issuer}</small></div><p>{rule.scope}</p><span className={rule.active ? "active-rule" : "reference-rule"}>{rule.active ? "执行中" : "仅参考"}</span><a href={rule.link} target="_blank" rel="noreferrer">查看 ↗</a></div>)}
    </section>
    <div className="source-notes"><section className="panel"><span className="overline">CONFIRMED</span><h3>已确认的外部依据</h3><p>国家外汇管理局要求银行在外汇展业全过程履行了解客户、了解业务和尽职审查职责，并强调信息准确完整、可追溯及档案留存。</p></section><section className="panel"><span className="overline">DESIGN INFERENCE</span><h3>由规则推导的产品设计</h3><p>TEG、ESE、CAV 和凭证留痕是本项目的产品实现方案，不是监管条文原文，也不代表工行已采用。</p></section><section className="panel"><span className="overline">UNVERIFIED / MOCK</span><h3>暂不能声称的内容</h3><p>外部 API 接口、银行内部阈值、模型准确率与效率提升均为模拟或待试点验证，不得包装成真实银行指标。</p></section></div>
  </div>;
}
