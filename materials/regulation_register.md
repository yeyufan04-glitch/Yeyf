# 贸证贯通 V1 规则与标准登记

更新日期：2026-09-10

## 先说明适用边界

本 Demo 的业务范围是“进口货物贸易跨境汇出汇款”，不是信用证开立或信用证项下交单。因此：

- 国家外汇管理局的外汇展业与货物贸易电子单证要求，是本案业务设计的主要外部依据。
- UCP 600 与 ISBP 821 只在信用证明确适用时，才成为信用证项下审单依据；它们不应被误写成普通进口汇款的直接执行规则。
- UN/CEFACT UNVTD 用于贸易单据的数据结构、来源签名与可验证交换设计，但不是银行合规规则。
- `POL-IMR-V1.3` 是竞赛 Demo 的内部模拟策略，不代表工商银行真实制度。

## 已确认的外部依据

| 编号 | 来源 | 在本系统中的使用 | 本地留存 |
|---|---|---|---|
| SAFE-2023-01 | 国家外汇管理局《银行外汇展业管理办法（试行）》 | 外汇展业全过程尽调、差异化措施、信息准确完整和可追溯、档案留存与不可篡改 | `SAFE_bank_fx_practice_trial.pdf` |
| SAFE-E-DOC | 国家外汇管理局货物贸易电子单证审核问答 | 电子单证办理仍需落实了解客户、了解业务、尽职审查，并由银行审慎建立内控条件 | `SAFE_goods_trade_e_document_QA.pdf` |
| ICC-UCP600 | ICC Uniform Customs and Practice for Documentary Credits | 条件性规则；仅信用证文本明确纳入时适用 | 仅保存官方链接，不复制付费出版物 |
| ICC-ISBP821 | ICC International Standard Banking Practice 821 | 信用证项下单据审核实务；本案不直接执行 | 仅保存官方链接，不复制付费出版物 |
| UNVTD | UN/CEFACT Verifiable Trade Documents | 结构化字段、Schema、来源可验证和数据互操作参考 | 保存 CC BY 4.0 的示例 JSON 与 Schema YAML |

## 官方入口

- SAFE《银行外汇展业管理办法（试行）》：https://www.safe.gov.cn/safe/2023/1229/23744.html
- SAFE 货物贸易电子单证审核问答：https://www.safe.gov.cn/safe/file/file/20170725/149ad9a70d384f5a80cd495e9c16bd82.pdf
- ICC UCP 600：https://library.iccwbo.org/content/tfb/RULES/tfb-ucp600-rules.htm
- ICC ISBP 821：https://library.iccwbo.org/content/tfb/RULES/tfb-isbp-2023-rules.htm
- UNECE UNVTD：https://unvtd.unece.org/overview/

## Demo 内部策略 `POL-IMR-V1.3`

某一关键事实进入 `COMPLETE`，至少满足：必要业务证据存在；达到模板要求的独立来源支持；不存在未解决的关键冲突；关键事件时序符合业务模板。

强制转人工条件包括：

1. 任一关键事实为 `CONFLICT`；
2. 关键解释型 Claim 为 `UNSUPPORTED`；
3. 当前任务的保守可靠度下界低于模拟门槛；
4. 动作属于 Demo 策略明令禁止的自动动作。

以上条件仅为产品机制演示，不是监管原文，也不是工商银行真实规则。
