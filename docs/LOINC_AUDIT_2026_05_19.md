# LOINC 對映表 Audit — 2026-05-19

## 為什麼要做這次 audit

`packages/mapper/src/loinc-tables.ts` 是這個 bridge 在每一筆 lab observation 上標 LOINC code
的唯一來源。下游 SMART 臨床 app 是**靠 LOINC** 把檢驗值路由進病歷的對應欄位，所以 LOINC 標錯
不是顯示瑕疵——它會把值靜默地路由到錯誤的臨床欄位（EMR 看起來有資料，但實際讀數沒出現在該
出現的地方）。

這個專案先前已經有兩次 dual-reviewer audit 抓到了相同 pattern 的 copy-paste 錯誤：

1. **FSH (09125C) 和 Estradiol (09127C)** 曾經被誤標成 TSH / LH 的 LOINC（早一輪 audit 已
   修正；可看 source 裡 `NHI_TO_LOINC["09125C"]` 附近的 inline comment）。
2. **Free T4 (09106C)** 最近被 commit
   [`9da5e5b`](https://github.com/voho0000/NHI-FHIR-BRIDGE/commit/9da5e5b) 從 3024-7 改成
   14920-3，理由是「3024-7 其實是 Total T4」。**本次 audit 發現該前提是反的**——見下方 F 點。

這次 audit 對初步掃描所標記的每個 LOINC code 都直接到 [loinc.org](https://loinc.org)
(source of truth) 確認過，找到 **7 筆 critical wrong-analyte mapping**、3 筆 high-severity
wrong-domain / wrong-specimen mapping、4 筆顯示字串機械性損壞，以及最近 Free T4 commit
的 1 個前提錯誤。

## 方法與信心度

- 下面 A 段每一筆 flagged code 都個別 fetch `https://loinc.org/<code>/` 並讀取
  Long Common Name / Component / Property 欄位確認。
- A 段 7 筆都獨立驗證過（flagging agent 8/8 命中率——agent 找 wrong LOINC 很可靠）。
- Agent 給的「**建議替代 LOINC**」並不可靠（spot-check 顯示 2/3 也是錯的：2686-4 是
  Orotate-Urine 不是 Ammonia；2459-6 是 IgA monoclonal 不是 IgM）。所以這份 audit **不**
  提議新 LOINC 給被刪除的 entry——那個決策留給 project owner，且需要 loinc.org 確認過的證據
  才能用。
- 這次 audit **不是**對全部 ~115 筆 NHI_TO_LOINC entry 做完整人工掃描。它做的是：
  (a) 驗證所有被 flag 的命中，以及 (b) spot-check 一部分被列為「verified correct」的 entry
  （AST 1920-8、Leukocytes 6690-2、HbA1c 4548-4、TSH 3016-3、PSA 83112-3、Free PSA 83113-1
  ——全都確認正確）。不在 flag 清單上的 entry 推測為正確，但沒有逐一 fetch 確認。

## 發現

### A. NHI_TO_LOINC — 整個分析物（analyte）完全錯（CRITICAL）— 本次已刪除

每一列：NHI 醫令碼 → 目前的 LOINC → loinc.org 實際說該 LOINC 是什麼。

| NHI 醫令碼 | 檔案內 NHI comment | LOINC | loinc.org Long Common Name | 證據 |
|---|---|---|---|---|
| 14004B | CMV IgG — Ab S/P | 7849-3 | **Taenia solium larva IgM Ab [Presence] in Serum**（豬肉絛蟲 IgM 抗體） | https://loinc.org/7849-3/ |
| 14048B | CMV IgM — Ab S/P | 7850-1 | **Taenia solium larva Ab [Units/volume] in Serum** | https://loinc.org/7850-1/ |
| 13013C | TB Culture | 31952-5 | **Rinderpest virus Ag [Presence] in Exudate**（牛瘟病毒，cattle morbillivirus） | https://loinc.org/31952-5/ |
| 09037C | Ammonia — Plasma | 1827-5 | **Alpha 1 antitrypsin MS [Mass/volume] in Serum or Plasma** | https://loinc.org/1827-5/ |
| 12028B | IgM 單向免疫擴散 | 14002-0 | **IgM [Units/volume] in Cord blood**（新生兒臍帶血檢體） | https://loinc.org/14002-0/ |
| 12029B | IgM 免疫比濁法 | 14002-0 | （同 12028B） | https://loinc.org/14002-0/ |
| 12069B | Cryptococcus Ag — Mass/vol S/P | 5132-6 | **DNA single strand Ab [Units/volume] in Serum**（anti-ssDNA、紅斑性狼瘡 serology） | https://loinc.org/5132-6/ |

**已採取的動作**（commit `fix(mapper): remove 7 NHI codes mapped to clinically unrelated LOINCs`）：
每一筆都從 `NHI_TO_LOINC` 刪掉，並用與檔案內現有 13007C / 16008C 同樣風格的 inline
`// previously mapped to … which is actually …` 註解取代。Bridge 現在對這 7 個 NHI 醫令碼會 fall
back 到「只發 NHI 碼編碼」（不再帶 `http://loinc.org` system entry）——這條 fallback 路徑跟
13007C 和 16008C 在 production 已經跑了幾個月一樣。對應的 regression test 也加進
[`backend-ts/tests/unit/observation-mapper.test.ts`](../backend-ts/tests/unit/observation-mapper.test.ts)，
確保這些錯誤 LOINC 不會悄悄回來。

**後續補回（commit `fix(mapper): restore CMV IgM 14048B → 7853-5 and B2M 12052B → 1952-1`）**：
其中 1 筆（14048B CMV IgM）在後續 audit pass 找到了 loinc.org 驗證過的正確替代 LOINC，已
restored：

| NHI 醫令碼 | 新 LOINC | loinc.org Long Common Name | 證據 |
|---|---|---|---|
| 14048B | **7853-5** | Cytomegalovirus IgM Ab [Units/volume] in Serum or Plasma | https://loinc.org/7853-5/ |

regression test 已從 `.not.toBe("7850-1")` 升級成 `.toBe("7853-5")`。

剩下 6 筆（14004B / 13013C / 09037C / 12028B / 12029B / 12069B）目前**仍維持未對映狀態**——
找替代 LOINC 的工作做了，但每個候選都被 loinc.org 證實是錯的分析物（見下方
「Out-of-scope」段落列出已試過、已驗證為錯的候選）。

### B. NHI_TO_LOINC — wrong domain / wrong specimen (HIGH)

| NHI 醫令碼 | 檔案內 NHI comment | 原 LOINC | loinc.org 原 LOINC 實際意義 | 證據 | 狀態 |
|---|---|---|---|---|---|
| 22001C | 純音聽力檢查 | 45498-3 | **Hearing [Minimum Data Set]**——MDS-3 LTC 功能評估，不是純音聽力檢查結果 | https://loinc.org/45498-3/ | **未改**，留給 owner |
| 22015B | 詐聾聽力檢查 | 45498-3 | （同 22001C） | https://loinc.org/45498-3/ | **未改**，留給 owner |
| 22025B | 自記聽力檢查 | 46530-2 | **Sensory status - hearing and ability to understand spoken language [OASIS]**——居家照護評估，不是 audiometry | https://loinc.org/46530-2/ | **未改**，留給 owner |
| 12052B | β2-微球蛋白 | 10873-8 | **Beta-2-Microglobulin [Mass/time] in 24 hour Urine**——24 小時尿液收集 | https://loinc.org/10873-8/ | **已修**：remap 到 1952-1（Serum or Plasma，已驗證 loinc.org/1952-1/） |

**12052B 已解決**（commit `fix(mapper): restore CMV IgM 14048B → 7853-5 and B2M 12052B → 1952-1`）：
台灣 12052B 計價通常對應血清 B2M（lab 最常見），所以從 24 小時尿液 LOINC 10873-8 改成驗證過
的血清 LOINC **1952-1**（Component=Beta-2-Microglobulin, Property=MCnc, Serum or Plasma），
含對應 regression test。

**聽力檢查 (22001C / 22015B / 22025B) 仍未改**：嘗試了多組候選 LOINC（71039-4 audiometry、
其他 8696-* / 71039-* family），多數 fetch 都拿到 HTTP 500。正確的替代要看健保署 audiometry
billing 在下游 SMART app 端到底是怎麼呈現（pure-tone threshold table？單一整體狀態？procedure
tag？）。這需要 owner 跟管 audiology workflow 的人對過再採用。

### C. LOINC_DISPLAY — `#` 字元損壞 (LOW)— 本次已修

有 4 個 entry 把標準的 `#/volume` 寫成 `,  // /volume`——幾乎可確定是過去某次跑 sed 沒處理好
（`#` 在 TypeScript 字串裡是有效字元，根本不需要 escape）：

| LOINC | 原本（錯） | 修正成 |
|---|---|---|
| 6690-2 | `Leukocytes [,  // /volume] in Blood by Automated count` | `Leukocytes [#/volume] in Blood by Automated count` |
| 777-3 | `Platelets [,  // /volume] in Blood by Automated count` | `Platelets [#/volume] in Blood by Automated count` |
| 789-8 | `Erythrocytes [,  // /volume] in Blood by Automated count` | `Erythrocytes [#/volume] in Blood by Automated count` |
| 711-2 | `Eosinophils [,  // /volume] in Blood by Automated count` | `Eosinophils [#/volume] in Blood by Automated count` |

**已採取的動作**（commit `fix(mapper): repair # corruption in 4 LOINC_DISPLAY entries`）：
每筆 `[,  // /volume]` 都換成 `[#/volume]`。純顯示字串——這幾條會放在 SMART app 端收到的
`Observation.code.coding[].display` 上；對路由（routing）沒影響。

### D. LOINC_DISPLAY — 與 F 點相關的內容錯誤——本次已修

| LOINC | 原本（錯） | 修正成（loinc.org 標準名） |
|---|---|---|
| 3024-7 | `Thyroxine (T4) [Mass/volume] in Serum or Plasma`（漏寫 "free"） | `Thyroxine (T4) free [Mass/volume] in Serum or Plasma` |
| 14920-3 | `Thyroxine (T4) free [Mass/volume] in Serum or Plasma`（Mass 是寫錯的） | `Thyroxine (T4) free [Moles/volume] in Serum or Plasma` |

與下方 F 點一起修。

### F. Free T4 (09106C) 情況——本次已解決（RESOLVED）

Commit
[`9da5e5b`](https://github.com/voho0000/NHI-FHIR-BRIDGE/commit/9da5e5b)
（"fix(mapper): Free T4 LOINC was wrong (3024-7 is Total T4, not Free T4)"）把 `09106C`
從 3024-7 改成了 14920-3。

**該 commit 的前提是反的**。loinc.org 上兩個 code 都是 Free T4——兩個頁面的 Component 欄
位都字面寫著 `Thyroxine.free`：

- **[3024-7](https://loinc.org/3024-7/)**——Component `Thyroxine.free`、Property **MCnc**
  （Mass concentration，質量濃度）。Long Common Name：*"Thyroxine (T4) free [Mass/volume] in
  Serum or Plasma"*。單位：ng/dL。
- **[14920-3](https://loinc.org/14920-3/)**——Component `Thyroxine.free`、Property **SCnc**
  （Substance concentration，亦即莫耳濃度）。Long Common Name：*"Thyroxine (T4) free
  [Moles/volume] in Serum or Plasma"*。單位：pmol/L。

所以 3024-7 跟 14920-3 都是 Free T4。原本的對映本來就是對的；那次「fix」把
mass-concentration 的 Free T4 LOINC 換成 molar 的 Free T4 LOINC。台灣 lab 報告 Free T4
壓倒性是用 ng/dL（質量濃度），所以**原本的對映**反而是與 bridge 實際送出的資料單位
較一致的選擇。

**本次採取的動作**（commit
`fix(mapper): revert 09106C Free T4 to 3024-7 (Mass conc — matches Taiwan ng/dL)`）：

- `NHI_TO_LOINC["09106C"]` 改回 `3024-7`（mass conc，匹配台灣 ng/dL 報告）。
- `loinc-tables.ts` 中 09106C 附近的 inline comment 重寫，準確描述兩個 LOINC 各自的意義和
  unit-system 邏輯。
- LOINC_DISPLAY 中 3024-7 和 14920-3 兩條都修正（見 D 段）。
- 對應 regression test
  [`Free T4 (NHI 09106C) maps to LOINC 3024-7`](../backend-ts/tests/unit/observation-mapper.test.ts)
  改寫成 assert 09106C → 3024-7，並把 MCnc/SCnc 邏輯寫在 test comment 裡。

### 已 spot-check 為「正確」的 entry 範例

`1920-8` AST、`6690-2` Leukocytes、`4548-4` HbA1c、`3016-3` TSH、`83112-3` PSA、`83113-1`
Free PSA——都對照過 loinc.org，臨床意義與 NHI comment 相符。

如上所述，這次 audit 不是 100% 全表掃描；它驗證每一條 flagged hit，並 spot-check 一部分
agent 標為「verified correct」的 entry。沒在 flag 清單上的 entry 雖然推測為正確，但並沒有
個別 fetch 確認。

## Out-of-scope / 後續待處理項目

本次 audit 沒有處理的：

1. **替剩下 6 筆被刪 entry 找正確的替代 LOINC**（A 段除 14048B 外）。後續 audit pass 試了
   很多候選，但因 loinc.org 上號碼分配並非按分析物分群、加上 loinc.org 不時 HTTP 500，hit
   rate 非常低。下列為**已試過、已驗證為錯**的候選——後續千萬不要再用這些：

   | 想找的分析物 | 已驗證為錯的候選 | loinc.org 實際是什麼 |
   |---|---|---|
   | CMV IgG (14004B) | 5126-8 | Cytomegalovirus IgM Ab（這是 IgM 不是 IgG） |
   | CMV IgG (14004B) | 5125-0 | CMV IgG Ab [Titer] by Immunofluorescence（只是 titer 不是 quantitative） |
   | Ammonia (09037C) | 1825-9 | Alpha 1 antitrypsin（也是 antitrypsin，不是 ammonia） |
   | Ammonia (09037C) | 32683-5 | Hemoglobin S/Hemoglobin.total |
   | Ammonia (09037C) | 2686-4 | Orotate Urine |
   | Ammonia (09037C) | 32624-9 | Race（這個是人口統計欄位） |
   | IgM 血清 (12028B/12029B) | 2459-6 | IgA monoclonal |
   | IgM 血清 (12028B/12029B) | 2467-9 | IgG subclass 2 |
   | IgM 血清 (12028B/12029B) | 2469-5 | IgG subclass 4 |
   | IgM 血清 (12028B/12029B) | 2475-2 | Indicans Urine |
   | TB Culture (13013C) | 530-6 | Viomycin Susceptibility |
   | TB Culture (13013C) | 11268-0 | Streptococcus pyogenes Throat culture |
   | TB Culture (13013C) | 14127-5 | Neisseria gonorrhoeae Anal culture |
   | TB Culture (13013C) | 33717-0 | Cervical/vaginal cytology |
   | TB Culture (13013C) | 13950-1 | Hepatitis A virus IgM Ab |
   | Cryptococcus Ag (12069B) | 31703-2 | West Nile virus IgM Ab CSF |
   | Cryptococcus Ag (12069B) | 26641-1 | Deprecated Histoplasma capsulatum Ab |

   建議下次找替代時的方法：先確認分析物的 canonical LOINC，可用 loinc.org 站內搜尋
   (`https://loinc.org/search/?t=1&s=<term>`)；也可參考健保署或 TWNHIFHIR PAS ConceptMap
   是否有後續更新。**不要從推測或號碼鄰近性挑候選**——LOINC 編號不是分群分配的。
2. **B 段（聽力檢查 22001C / 22015B / 22025B）**：仍未改。需要 audiology workflow 的 owner
   給方向。
3. ~~D + F 段：解決 Free T4 對映問題並修正兩個 LOINC_DISPLAY entry。~~ **本次已解決**——見
   F 段。
4. **全面掃描**：對沒被 flag 的所有 NHI_TO_LOINC entry 做逐條 loinc.org 驗證。本次 audit
   是被動式（驗證被 flag 的）——不保證整表 100% 覆蓋。

## Pattern 觀察

這個 repo 歷史上三組 LOINC bug 都是同一個形狀：

- FSH/Estradiol 混淆（誤把 TSH / LH 的 LOINC 貼在開發者當下腦中想的那組荷爾蒙上）。
- Free T4 (3024-7) → 用錯前提去「修正」成 14920-3。
- A 段 7 筆（CMV / TB / Ammonia / IgM / Cryptococcus）——表裡的 LOINC code 跟對的差幾位
  數，看起來像 fat-finger 或從某張排序表的鄰列複製錯位。

**未來新增 NHI_TO_LOINC entry 的建議**：任何新加的 entry，commit message 都應該附上一次
`WebFetch`（或 curl）`https://loinc.org/<code>/` 的驗證連結——跟這次 audit 和上一次
FSH/Estradiol audit 採取的 evidence pattern 一致。
