export type EvidenceState = "COMPLETE" | "PARTIAL" | "CONFLICT" | "MISSING";
export type SourceClass = "客户材料" | "外部独立证据" | "银行内部证据";

export interface TradeDocument {
  id: string;
  name: string;
  shortName: string;
  sourceClass: SourceClass;
  issuer: string;
  format: "pdf" | "json";
  path: string;
  receivedAt: string;
  integrity: "已校验" | "模拟数据";
  fields: Array<[string, string]>;
}

export interface EvidenceFact {
  id: string;
  label: string;
  value: string;
  state: EvidenceState;
  level: "关键" | "一般";
  supporting: string[];
  conflicting?: string[];
  explanation: string;
  nextAction?: string;
}

export const caseSummary = {
  id: "MZG-IMR-20260910-001",
  product: "进口货物贸易跨境汇出汇款",
  applicant: "武汉华源机电设备有限公司",
  beneficiary: "NordWerk Pumps GmbH",
  amount: "USD 800,000.00",
  status: "等待人工例外处置",
  owner: "国际业务中心 · 李经理",
  sla: "01:42:18",
};

export const documents: TradeDocument[] = [
  {
    id: "contract",
    name: "销售合同（模拟）",
    shortName: "合同",
    sourceClass: "客户材料",
    issuer: "交易双方",
    format: "pdf",
    path: "./demo-documents/sales_contract_demo.pdf",
    receivedAt: "2026-09-10 09:12",
    integrity: "模拟数据",
    fields: [["合同号", "NW-WH-2026-0418"], ["总数量", "1,000 PCS"], ["合同总额", "USD 1,000,000"], ["分批装运", "允许"]],
  },
  {
    id: "invoice",
    name: "商业发票（模拟）",
    shortName: "发票",
    sourceClass: "客户材料",
    issuer: "NordWerk Pumps GmbH",
    format: "pdf",
    path: "./demo-documents/commercial_invoice_demo.pdf",
    receivedAt: "2026-09-10 09:13",
    integrity: "模拟数据",
    fields: [["发票号", "INV-2026-0910"], ["数量", "1,000 PCS"], ["金额", "USD 800,000"], ["商品", "NW-80 离心泵"]],
  },
  {
    id: "packing",
    name: "装箱单（模拟）",
    shortName: "装箱单",
    sourceClass: "客户材料",
    issuer: "NordWerk Pumps GmbH",
    format: "pdf",
    path: "./demo-documents/packing_list_demo.pdf",
    receivedAt: "2026-09-10 09:13",
    integrity: "模拟数据",
    fields: [["箱数", "80 CRATES"], ["数量", "1,000 PCS"], ["毛重", "48,600 KGS"], ["唛头", "WH/NW/0910"]],
  },
  {
    id: "bl",
    name: "海运提单（模拟）",
    shortName: "提单",
    sourceClass: "外部独立证据",
    issuer: "OceanBridge Lines",
    format: "pdf",
    path: "./demo-documents/bill_of_lading_demo.pdf",
    receivedAt: "2026-09-10 09:14",
    integrity: "已校验",
    fields: [["提单号", "OBLHAMSHA260817"], ["装船数量", "800 PCS / 64 CRATES"], ["装运港", "Hamburg"], ["目的港", "Shanghai"]],
  },
  {
    id: "origin",
    name: "原产地证（模拟）",
    shortName: "原产地证",
    sourceClass: "外部独立证据",
    issuer: "Hamburg Chamber of Commerce",
    format: "pdf",
    path: "./demo-documents/certificate_of_origin_demo.pdf",
    receivedAt: "2026-09-10 09:14",
    integrity: "已校验",
    fields: [["证书号", "CO-DE-2026-88317"], ["原产国", "Germany"], ["数量", "800 PCS"], ["签发日期", "2026-08-19"]],
  },
  {
    id: "customs",
    name: "海关申报回执（合成 API）",
    shortName: "报关回执",
    sourceClass: "外部独立证据",
    issuer: "单一窗口 Mock API",
    format: "json",
    path: "./demo-data/customs-declaration.json",
    receivedAt: "2026-09-10 09:16",
    integrity: "模拟数据",
    fields: [["报关单号", "223120260918001734"], ["申报数量", "800 PCS"], ["申报金额", "USD 800,000"], ["放行状态", "RELEASED"]],
  },
  {
    id: "payment",
    name: "汇款申请与账户指令（合成）",
    shortName: "付款指令",
    sourceClass: "银行内部证据",
    issuer: "核心系统 Mock API",
    format: "json",
    path: "./demo-data/payment-instruction.json",
    receivedAt: "2026-09-10 09:17",
    integrity: "模拟数据",
    fields: [["付款金额", "USD 800,000"], ["收款人", "NordWerk Pumps GmbH"], ["收款行", "DEUTDEFFXXX"], ["合同号", "NW-WH-2026-0418"]],
  },
];

export const facts: EvidenceFact[] = [
  { id: "party", label: "交易主体", value: "华源机电 ↔ NordWerk", state: "COMPLETE", level: "关键", supporting: ["合同", "发票", "付款指令"], explanation: "申请人、收款人及合同相互关联，收款账户名称与卖方一致。" },
  { id: "goods", label: "商品身份", value: "NW-80 离心泵", state: "COMPLETE", level: "关键", supporting: ["合同", "发票", "提单", "报关回执"], explanation: "四个来源的型号和商品描述可归一至同一商品。" },
  { id: "orderQty", label: "合同订购数量", value: "1,000 PCS", state: "COMPLETE", level: "一般", supporting: ["合同", "发票", "装箱单"], explanation: "客户控制材料对合同订购数量表述一致。" },
  { id: "shipmentQty", label: "本批实际装运数量", value: "800 PCS", state: "CONFLICT", level: "关键", supporting: ["提单", "原产地证", "报关回执"], conflicting: ["发票 1,000 PCS", "装箱单 1,000 PCS"], explanation: "三个独立来源支持 800 PCS，但两份客户材料仍写 1,000 PCS。", nextAction: "要求客户更正发票与装箱单，或补充分批履约说明。" },
  { id: "amount", label: "本次付款金额", value: "USD 800,000", state: "COMPLETE", level: "关键", supporting: ["发票", "报关回执", "付款指令"], explanation: "付款金额与发票、报关申报金额一致。" },
  { id: "partial", label: "分批履约依据", value: "合同允许分批装运", state: "PARTIAL", level: "关键", supporting: ["合同条款 11.2"], explanation: "合同允许分批装运，但客户尚未提交本批 800 件与剩余 200 件安排的正式说明。", nextAction: "补充分批履约确认函。" },
  { id: "route", label: "运输路线", value: "Hamburg → Shanghai", state: "COMPLETE", level: "一般", supporting: ["提单", "报关回执"], explanation: "装运港、目的港和入境口岸逻辑一致。" },
  { id: "origin", label: "原产地", value: "Germany", state: "COMPLETE", level: "一般", supporting: ["原产地证", "报关回执"], explanation: "独立证书与申报信息一致。" },
  { id: "timeline", label: "关键事件时序", value: "合同 → 装运 → 申报 → 付款", state: "COMPLETE", level: "关键", supporting: ["合同", "提单", "报关回执", "付款指令"], explanation: "事件顺序符合本 Demo 的进口汇款模板。" },
  { id: "receipt", label: "境内收货确认", value: "尚未提供", state: "MISSING", level: "一般", supporting: [], explanation: "货物已放行，但当前资料包没有企业入库或签收证明。", nextAction: "如银行内部策略要求，补充入库单或签收回执。" },
];

export const calibrationTasks = [
  { task: "金额/币种字段提取", sample: 180, accuracy: "99.4%", lower: "97.0%", threshold: "95%", result: "PASS" },
  { task: "数量跨源一致性", sample: 146, accuracy: "98.6%", lower: "95.1%", threshold: "95%", result: "PASS" },
  { task: "日期与时序规则", sample: 112, accuracy: "97.3%", lower: "92.4%", threshold: "90%", result: "PASS" },
  { task: "分批履约语义解释", sample: 28, accuracy: "85.7%", lower: "68.5%", threshold: "85%", result: "FAIL" },
];

export const claims = [
  { id: "CLM-01", claim: "发票/装箱单数量与独立装运证据不一致", type: "事实", result: "VERIFIED", proof: "确定性字段规则 + 三个独立来源" },
  { id: "CLM-02", claim: "合同允许分批装运", type: "事实", result: "VERIFIED", proof: "合同第 11.2 条" },
  { id: "CLM-03", claim: "本次业务可能属于分批履约", type: "解释", result: "SUPPORTED", proof: "800/1,000 数量关系 + 合同允许分批" },
  { id: "CLM-04", claim: "发票数量属于客户笔误", type: "解释", result: "UNSUPPORTED", proof: "没有客户确认或更正文件" },
];

export const rules = [
  { id: "SAFE-2023-01", title: "银行外汇展业管理办法（试行）", issuer: "国家外汇管理局", scope: "客户尽调、差异化办理、信息可追溯与不可篡改", active: true, link: "https://www.safe.gov.cn/safe/2023/1229/23744.html" },
  { id: "SAFE-E-DOC", title: "货物贸易外汇收支电子单证审核问答", issuer: "国家外汇管理局", scope: "电子单证、展业三原则与真实性/合规性审核", active: true, link: "https://www.safe.gov.cn/safe/file/file/20170725/149ad9a70d384f5a80cd495e9c16bd82.pdf" },
  { id: "POL-IMR-V1", title: "进口汇款证据模板（竞赛模拟）", issuer: "贸证贯通 Demo", scope: "COMPLETE 条件、关键冲突与人工复核门槛", active: true, link: "./demo-data/policy-imr-v1.json" },
  { id: "ICC-UCP600", title: "UCP 600", issuer: "ICC", scope: "仅在信用证明确适用时生效；本案为普通汇款，不作为执行规则", active: false, link: "https://library.iccwbo.org/content/tfb/RULES/tfb-ucp600-rules.htm" },
  { id: "ICC-ISBP821", title: "ISBP 821", issuer: "ICC", scope: "信用证项下审单实务；本案不直接适用", active: false, link: "https://library.iccwbo.org/content/tfb/RULES/tfb-isbp-2023-rules.htm" },
  { id: "UNVTD", title: "UN/CEFACT Verifiable Trade Documents", issuer: "UNECE", scope: "数据结构与可验证来源设计，不是银行合规规则", active: false, link: "https://unvtd.unece.org/overview/" },
];
