# LOINC 正確性 Audit — 2026-06-13

承 2026-05-19 audit 與 0.18.10「尿黏液 panel-on-analyte」事件,做一次**完整**(非 spot-check)的 LOINC 對應審查。專門掃這四類 silent bug:**panel 碼當單項、檢體錯、scale 錯(Qn/Ord)、分析物錯**。

## 方法與覆蓋

- 7 個並行 agent,把 `NHI_TO_LOINC`(104 條)+ `PANEL_LOINC_MAP`(28 個不重複 LOINC)逐碼 WebFetch loinc.org,核對 Component/Property/System/Scale/Method + 是否為 panel。
- **每個被 flag 的修正碼,由主流程再次 WebFetch 親自複驗**(rule #5)。複驗時抓到 agent 兩次建議錯碼(CD8 的 8124-0 其實是 CD3、KCO 的 19992-7 其實是吸入氣氧氣)—— 證明「替代碼也要驗」的必要。
- 覆蓋 ~132 個不重複 LOINC。`LOINC_MAP`(143 條全域關鍵字)未納入本批,列為後續。

---

## A. 已修正(WebFetch 驗證後套用)

| 健保碼 / key | 原碼 | 問題 | 改為 | 驗證 |
|---|---|---|---|---|
| α1-globulin (09065B) | `2867-3` | **碼不存在**(check digit 錯) | `2865-4` | Alpha 1 globulin, S/P, EP ✓ |
| α2-globulin | `2868-1` | **碼不存在** | `2868-8` | Alpha 2 globulin, S/P, EP ✓ |
| β-globulin | `2869-9` | **碼不存在** | `2871-2` | Beta globulin, S/P, EP ✓ |
| γ-globulin | `2871-5` | **碼不存在** | `2874-6` | Gamma globulin, S/P, EP ✓ |
| CD8 (12204B) | `8128-1` | **deprecated** 且實為 CD4/100 cells | `8101-8` | CD3+CD8+ suppressor T cells/cells ✓ |
| DLCO (17009B) | `24341-0` | 那是**動脈血氣 panel**(panel-as-analyte+檢體錯) | `19911-7` | Diffusion capacity.CO ✓ |
| DLCO/VA = KCO | `19911-7` | 那是純 DLCO,不是 ratio | `19914-1` | DLCO/Alveolar volume by SB ✓ |
| VA 肺泡容積 | `19850-7` | 那是**吸氣容積**(Inspiratory capacity) | **留空**(無乾淨單碼,rule #7) | — |
| 17009B panel 預設 | `24341-0` | 同上血氣 panel | `19911-7` | (DR panel 層用) |

LOINC_DISPLAY 對應文字一併修正(globulin 改官方 LCN、19911-7/19914-1 補正確 LCN、移除 24341-0 / 19850-7 殘留)。回歸測試已從「斷言舊錯碼」翻成新碼(observation-mapper.test.ts、bundle-quality.test.ts)。

---

## B. 已確認錯,但修正需先確認「NHI 該碼實際 billing 什麼」(待你定)

bridge 不該臆測 —— 這幾個 loinc.org 對不上,但**正確替代碼取決於健保支付標準該碼的項目名稱**,請你對一下 NHI 目錄再決定:

| 健保碼 | 中文名 | 現碼 | 問題 | 候選 / 需確認 |
|---|---|---|---|---|
| **14066C** | 流感 A | `80383-3` | 那是流感 **B** 抗原(A/B 對調) | A-only → `80382-5`;若該碼是 A+B 合檢需 combined 碼 |
| **12195B** | Her-2/neu | `18474-7`(IHC) | 註解寫 **ISH**(基因擴增),碼是 IHC(蛋白) | 確認 12195B 是 ISH 還 IHC;ISH 需基因 copy 碼 |
| 14032C | HBsAg | `5196-1`(Presence/Ord) | 註解寫「Mass/vol」量化,碼是質性 | 該碼定性→現碼OK(成人健檢確實定性);若定量需 Qn 碼 |
| 27021B | 睪固酮 RIA | `2991-8`(**free**) | 中文名沒寫 free | 若 billing 總量 → `2986-8` |
| 12160B | κ/λ ratio | `15189-4` | 註解「IgG κ/λ」不精確(碼是總 light chain) | 確認是否 IgG-subclass 特異 |

---

## C. 已確認錯,但暫無有信心的替代碼(待研究 / 或留空)

| 碼 / key | 問題 | 方向 |
|---|---|---|
| **12103B** 免疫電泳 → `95801-7` | 對到**尿液** free-LC+IFE panel(免疫電泳應是血清) | 找血清 IFE 碼,或留空 |
| **12204B** 白血球表面標記 → `20584-9` | 對到「自動白血球計數」(應是淋巴球免疫表型) | 多半留空(無單一 panel 碼);CD 子項已各自對 |
| **`sf color`** → `5778-6` | 對到**尿液**顏色(體液應另碼) | 找體液 color 碼,或留空 |
| **`sf lympho`** → `13046-8` | 對到**血液變異**淋巴球 | 找體液淋巴球碼,或留空 |
| **`sf neutrophil`** → `10328-6` | **碼不存在** | 找體液 neutrophil 碼,或留空 |
| **VA 肺泡容積** | (已留空,見 A) | 若找到單碼可補 |

---

## D. Advisory — 分析物對,但 LOINC 本身 deprecated/discouraged 或顆粒度(可選遷移)

| 健保碼 | 現碼 | 狀態 | 建議 |
|---|---|---|---|
| 08079B | `30240-6` D-dimer | **deprecated**(FEU/DDU 單位歧義) | 換 48065-7(FEU)或 48066-5(DDU)—— 需先確認 NHI 單位 |
| 08011C | `24317-0` CBC panel | **discouraged** | 換 `58410-2`(CBC panel by Auto count) |
| 08008C | `14196-0` 網織紅血球絕對數 | 顆粒度 | 若 NHI 報 %/100 RBC → `4679-7` |

---

## 結論

- **A 段 9 項已修並測試鎖定**(含 4 個根本無效的碼,會被任何 LOINC validator 打槍)。
- **B/C 段需你確認 NHI scope 或進一步查碼** —— bridge 不臆測。
- D 段為可選的現代化遷移。
- 整體 ~132 個不重複 LOINC 中,絕大多數(化學、電解質、酵素、腫瘤標記、肝炎、血型、免疫球蛋白等)**正確無誤**。問題集中在低頻的肺功能(DLCO)、流式 CD、蛋白電泳、體液(sf)、與少數方法/檢體混淆。

**流程教訓(已寫入 rule #5)**:agent 找「錯碼」很可靠,但**建議的「正確替代碼」不可盡信,必須親自 WebFetch 複驗**(這次就抓到 2 個 agent 建議的替代碼是錯的)。

---

## E. 2026-06-14 後續處理(B/C 段收尾)

病人(探針病例)實際只有 35 筆檢驗,B/C 段這些低頻專科碼**都不在其健保存摺**,故無法用真實 row 反查 NHI 項目名稱。改以 loinc.org 親自複驗 + 臨床判斷處理,逐碼自驗替代碼(rule #5):

| 項目 | 原碼 | 改為 | 驗證 / 理由 | commit |
|---|---|---|---|---|
| 14066C 流感A | `80383-3` | `80382-5` | 80383-3 是流感 **B**(A/B 對調);80382-5 = Influenza A Ag rapid IA ✓ | `d619f3a` |
| 27021B 睪固酮 | `2991-8`(free) | `2986-8` | NHI 名稱無「free/游離」→ unqualified = 總量;2986-8 Testosterone [Mass/vol] S/P ✓ | (本批) |
| 12103B 免疫電泳 | `95801-7`(尿 free-LC panel) | `25700-6` | 血清 IFE → Immunofixation for Ser/Plas, Nom ✓ | (本批) |
| sf color (16008C) | `5778-6`(尿色) | `6824-7` | Color of Body fluid, Nom ✓ | (本批) |
| sf lympho | `13046-8`(**血液**變異淋巴) | `11031-2` | Lymphocytes/Leukocytes in Body fluid, NFr% ✓(雙軸皆錯,親驗確認) | (本批) |
| sf neutrophil | `10328-6`(**不存在**) | `26513-2` | Neutrophils/Leukocytes in Body fluid, NFr% ✓(validator 必掛的硬錯) | (本批) |

**未改(現碼可接受)**:
- **14032C HBsAg `5196-1`** — 成人健檢 HBsAg 確為定性(Presence/Ord),現碼正確,僅舊註解誤寫「Mass/vol」。不動。
- **12160B κ/λ `15189-4`** — 總 light-chain ratio,作為 κ/λ 比值的合理預設;無 NHI 確認 IgG-subclass 特異前不臆測。不動。
- **12204B 白血球表面標記 `20584-9`** — 已是 panel(CD3/4/8/19/56 子項各自正確對碼,含 CD8 8101-8 修正);20584-9 僅 panel-level 被抑制 fallback,不進 per-analyte 輸出。不動。

**12195B Her-2/neu — 改為留空(unmapped)**:現碼 `18474-7` 是 HER2 **IHC**(蛋白染色),但 bridge 註解寫 **ISH**(基因擴增)—— 兩者是不同 LOINC,而健保存摺無此 row 可確認 NHI 實際 billing 哪一種。依使用者原則「**不確定正確性寧可不發 LOINC**」(2026-06-14),移除 `18474-7`,落到 NHI-code-only + 原始顯示。待 NHI 項目名稱(ISH vs IHC)確認後再補。
