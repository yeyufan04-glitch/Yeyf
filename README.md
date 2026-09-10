# 贸证贯通｜可信贸易作业平台（0910）

这是面向 2026 届工行杯金融科技竞赛的可交互 PoC。系统把成熟智能单证能力作为底层，把两项核心机制放在主线：

- `TEG-ESE`：围绕单笔 Trade Case 组织证据，输出 COMPLETE / PARTIAL / CONFLICT / MISSING。
- `CAV`：按任务校准模型可靠度，验证每条 AI Claim，在动作执行前经过 Bank Policy Shield。

系统默认完全离线运行，无 API Key、数据库或真实银行接口也能完成整条演示。

## 公开归档范围

本仓库公开保存可运行源码、合成演示单据、公开规则资料、来源清单及设计文档；不提交依赖目录、构建产物、临时文件、环境变量或内部部署关联文件。第三方资料与原创代码的权利边界见 [NOTICE.md](NOTICE.md)。

## 最快运行

```bash
npm install
npm run preview:cn
```

打开终端显示的本地地址。若要开发调试：

```bash
npm run dev
```

## 免后端静态包

```bash
npm run build:cn
```

产物在 `dist-cn/`。其中使用 Hash 路由，可直接部署到普通静态托管。`dist-cn` 已包含全部合成 PDF、JSON、社交预览图和前端代码。

## 演示路线

1. `案件总览`：先看自动流转为何被拦截，以及人工只需处理的两项例外。
2. `单证事实`：查看合同、发票、装箱单、提单、原产地证、报关与付款指令。
3. `交易证据`：选择“本批实际装运数量”，查看 1,000 件与 800 件冲突及来源。
4. `可信执行`：切换 Calibration、Audit、Verify，查看可靠度门槛、Claim 审查与策略门禁。
5. `可信凭证`：下载 JSON 版本 AI Assurance Certificate。
6. `人工处置`：完成三项确认，生成补正请求并保持付款暂停。
7. `规则与来源`：说明监管规则、ICC 条件性规则、UNVTD 开放标准和 Demo 内部策略的差异。

完整口播见 `docs/demo_script.md`。

## 核心合成案例

- 合同：1,000 件，合同总额 USD 1,000,000，允许分批装运。
- 发票、装箱单：仍写 1,000 件；发票金额为 USD 800,000。
- 提单、原产地证、报关回执：本批实际数量均为 800 件。
- 付款指令：USD 800,000，保持人工复核暂停。

系统能证实“数量不一致”和“合同允许分批”，只能支持“可能为分批履约”，不能把“发票笔误”当作事实。因此 `AUTO_REMIT` 与 `AUTO_APPROVE` 均被禁止。

## 文件结构

```text
app/
  components/DemoApp.tsx     # 全部可交互页面
  mock/trustCase.ts          # TEG、ESE、CAV 演示数据
  globals.css                # 视觉与响应式样式
public/
  demo-documents/            # 5 份本任务生成的合成 PDF
  demo-data/                 # 报关、付款、案件与凭证 JSON
  og.png                     # 社交预览图
materials/
  regulations/               # SAFE 官方监管 PDF
  open-standards/unvtd/      # CC BY 4.0 的 UNVTD 示例与 Schema 子集
  design/                    # 用户提供的产品设计源稿
  regulation_register.md     # 规则适用边界
  source_manifest.csv        # 来源、授权与状态清单
docs/
  architecture_and_logic.md  # 技术机制与生产边界
  demo_script.md             # 3 分钟演示脚本
output/pdf/                  # 生成 PDF 的归档副本
scripts/generate_demo_pdfs.py
```

## 严格边界

- 全部企业、金额、单据、接口记录、阈值与 Benchmark 数字均为合成。
- 系统未连接海关、单一窗口、承运人或工商银行核心系统。
- TEG、ESE、CAV 和 AI Assurance Certificate 是本项目设计，不是监管条文，也不代表工商银行已采用。
- UCP 600 / ISBP 821 不直接适用于本 Demo 的普通进口汇款，只登记为信用证场景的条件性参考。
- 系统不认定虚假贸易、违规交易或可疑交易；银行人员保留最终业务判断权。
- 真实落地需经过银行内部规则审批、数据授权、Shadow Mode、生产 Benchmark 和不可改写审计存储建设。

## 验证

```bash
npm test
```

测试会重新生成静态包并检查页面标识、关键术语、PDF/JSON 资产和合成数据声明。
