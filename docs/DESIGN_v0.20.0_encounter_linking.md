# v0.20.0 設計稿 — 就醫(Encounter)關聯重構

狀態:**已實作並發布(v0.20.0–v0.20.4)**。本文保留為設計史;最終落地方式見下方「實作結果」—— §3 的原始診斷比對提案已被**就醫型別(visit-class)比對**取代(原因見 §實作結果)。
日期:2026-06-15(設計)/ 2026-06-16(標記為已實作)
觸發:長庚嘉義 5/18 案例稽核(住院 R04.2 咳血 + 同日急診 K92.0 吐血)

---

## 1. 問題

健保存摺真的有一筆「5/18 西醫(實為急診)K92.0 吐血」的就醫,有自己的用藥(Takepron×1/1天、氯化鈉×1)與檢驗(CBC/PT/APTT/BUN/Cr/Na/K…),它正是「病人來看診 → 醫師發現要收住院」的源頭就醫。但目前 bundle:

1. **這筆就醫 Encounter 整個不見了** —— 被 `dedupAdmissionDayAmb` 當「住院的帳務分身」刪除。
2. 它的用藥/檢驗被錯掛到住院 Encounter(link 只靠 (院所, 日期) 猜,分不出來)。
3. 它其實是**急診**,卻因 `hosp_DATA_TYPE_NAME="西醫"` 被分類成門診(AMB)。

---

## 2. 根因(本 session 已查證)

### 2.1 `dedupAdmissionDayAmb` 前提是錯的
- 函式假設:就醫清單(IHKE3303)裡含住院 → 跟住院紀錄(IHKE3309)重複,故刪入院當天同院的 AMB。
- 實際:**IHKE3303 = 門診/急診/藥局,不含住院**;住院來自 IHKE3309。兩者不重疊,沒有重複可刪。
- 入院當天有門診/急診是日常(那就是被收治住院的源頭就醫)。函式從不抓到真重複,只會誤殺真就醫。
- 補強事實:Encounter id = `stableId(patient, date, class, hospital)`,**class 在 id 裡**。所以即使 IHKE3303 哪天真吐一筆住院,正確分類成 IMP 後會自動跟 IHKE3309 的 IMP 以 id 合併 —— 仍不需要這個函式。

### 2.2 關聯資訊明明在 raw 裡,卻被丟掉
IHKE3303S02 就醫 detail 每筆就醫**內含**(與診斷同層,目前已抓回,只是沒讀):
- `sp_IHKE3302S04_data` — 該次就醫的**用藥**(`order_code` / `drug_name` / `order_drug_day` / `order_qty`)
- `sp_IHKE3302S05` — 該次的**處置/診察費**(`order_code` 如 `00203B 急診檢傷分類第三級診察費`)
- `sp_IHKE3302S07_data` — 該次的**檢驗醫令**(`order_CODE` / `cure_CNAME` / `cure_ENAME` / `order_SEQ_NO` / `row_id`)

bridge 目前對這些 `sp_IHKE3302*` 的引用數 = **0**。改用 (院所, 日期) 重新猜 → 同日就醫互撞。

### 2.3 檢驗結果端沒有就醫 key,但採檢日可分
IHKE3409S01(檢驗值)欄位(live 查證):
`rownum, orI_TYPE, ordeR_CODE, assaY_VALUE, uniT_DATA, consulT_VALUE, hosP_ABBR, hosP_ID, funC_DATE, assaY_UPLOAD_DATE, reaL_INSPECT_DATE, assaY_MARK`
- **沒有** `func_SEQ_NO` / `row_id` / 採檢時間 → 無法對單筆檢驗值做精準 join。
- **但 `reaL_INSPECT_DATE`(採檢日)是天然分隔器**,bridge 早已用它當 `effectiveDateTime`。
- 真實證據(5/18 那 4 筆 Na = 2 次測量 × A/B 管道):

  | 管道 | 值 | funC_DATE | **reaL_INSPECT_DATE** |
  |---|---|---|---|
  | A/B | 141 | 5/18 | **5/18**(急診那次) |
  | A/B | 141 | 5/18 | **5/20**(住院第 3 天) |

  兩次 `funC_DATE` 都是 5/18(住院就醫日=入院日),但採檢日 5/18 vs 5/20 把急診與住院乾淨分開。

---

## 實作結果(2026-06-15 初版 → 2026-06-16 修正為 visit-class)
不需收割內嵌清單,也不需跨批次 persistence —— 精準關聯所需資訊**已在資源上**。

**最終落地(v0.20.3–v0.20.4)—— 用 NHI 申報就醫型別(visit-class),不用診斷**:
- **用藥靠就醫型別**:每筆 med 由 NHI `ori_TYPE_NAME`(住院/門診/藥局)決定 class,掛到同 (院所,日期) 中對應 class 的 encounter。住院藥→IMP;門診藥→AMB **或** EMER(NHI 用藥端沒有「急診」型別,急診開的藥被報成門診,故門診型別可掛同日 AMB 或 EMER gateway)。唯一命中才掛。
- **為何放棄診斷比對(§3 原始提案)**:同一天的門診與住院**可以是同一個診斷碼**(因肺炎就醫 → 因肺炎收住院,2/11 J18.9、1/28 U07.1 都實測到),診斷分不開 gateway 與住院。voho0000 直接指正:「就不能用診斷來區分,當天門診跟住院可以是同個診斷碼啊」。
- **檢驗靠採檢日 + 單日 gateway 優先**:lab 以 `effectiveDateTime`(採檢日)對就醫;入院當天同時撞 gateway(門診/急診單日)+ 住院時,優先掛 gateway(入院當天 workup 屬源頭就醫);住院後續日無同日 gateway → 走 IMP 區間。
- 兩條路徑一致(extension all-in-memory / backend 對 DB encounters),都只在「唯一倖存者」時才掛。

> 初版(2026-06-15)曾用 med `reasonCode` 診斷比對(ER 藥=K92.0、住院藥=R04.2),在 5/18 樣本可行,但 2/11 / 1/28 同診斷住院樣本證明會失效 → 改 visit-class。此段保留作為設計演進紀錄。

**與 voho0000 §3.4 規則的差異(誠實標記)**:實作的是「入院當天檢驗 → gateway」的簡化版,**未**做「第 n_er 筆 / 急診沒開的→住院」的逐筆 first-subsequent 切分。原因:(a) 後者需收割內嵌清單 + backend 跨批次留存(複雜、雙路徑易分歧);(b) 真實資料中同採檢日跨就醫碰撞並未發生(住院首批檢驗在 5/19)。完整規則列為**待真實碰撞樣本出現再做**的後續項。

## 3. 設計(原始提案,保留供參)

### 3.1 移除 `dedupAdmissionDayAmb`
- 刪 `packages/mapper/src/link.ts` 的函式 + export。
- 移除呼叫點:`extension/src/background/bundle.ts`、`backend-ts/src/api/sync.ts`。
- 移除 `backend-ts/tests/unit/link.test.ts` 的 `dedupAdmissionDayAmb` describe 區塊。
- 效果:急診/門診源頭就醫救回,與健保存摺 UI 一致。真住院重複仍由 encounter-id(含 class)自動合併。

### 3.2 急診分類修正(EMER)
- 目前 `s02-detail.ts` 只看 `hosp_DATA_TYPE_NAME`:含「急」→ EMER,否則 AMB。急診常被報成「西醫」→ 誤判 AMB。
- 強化:若該次就醫的 `sp_IHKE3302S05` 處置含**急診檢傷分類**家族碼(如 `00203B`/`00250B`「急診(按檢傷分類)…診察費/護理費」),升級 class AMB→EMER。
- 待確認:急診訊號碼的完整集合(用 prefix 還是列舉?需多看幾筆 raw)。

### 3.3 用藥 → 就醫:精準掛載(用內嵌清單)
- 從 IHKE3303S02 收割 `sp_IHKE3302S04_data`,對每筆就醫建 `(order_code, date, hospital, qty, days) → encounterId` 索引。
- MedicationRequest 以 `(code, date, hospital, qty, days)` 比對該索引 → 掛回正確就醫。
- 例:吐血急診 Takepron(BC25246243/qty1/1天)→ 急診;住院 Takepron(qty2/－)→ 住院。同日不混。
- 找不到精準匹配時,退回現有 (院所, 日期) 容錯掛載;再不行就留空。
- 待確認:IHKE3303 內嵌的 qty/days 與 IHKE3306(用藥)端對同一次就醫是否一致(本案一致:都 qty1/1天)。

### 3.4 檢驗 → 就醫:採檢日 + 內嵌醫令 + 先後順序
**主分隔(多數情況)**:Observation 以 `(hospital, reaL_INSPECT_DATE 採檢日)` 比對就醫精確日 / 住院區間 `[admit, discharge]`。不同採檢日直接分:
- 急診 Na(採檢 5/18)→ 急診就醫(5/18)
- 住院 Na(採檢 5/20)→ 住院(5/18~5/22 涵蓋)

**同採檢日同醫令跨「急診/門診 + 住院入院當天」時 —— voho0000 規則(2026-06-15):**
1. 先收 A/B 管道對(現有 `dedupNhiCrossChannelPairs`),得當天該醫令的 distinct 測量數,按排序訊號(rownum / `assaY_UPLOAD_DATE`)由先到後排。
2. 讀急診/門診的內嵌 `sp_IHKE3302S07_data`,看它開了幾次該醫令(`n_er`,通常 1)。
3. **前 `n_er` 筆 → 急診/門診;其餘 → 住院。**
4. **急診/門診沒開的醫令 → 當天全部掛住院。**

理由:臨床當天是「先看急診/門診 → 才被收住院」,先後 = 時序,所以「第一筆給門診急診、後續給住院」站得住腳。

**實作要釘的細節**:
- 排序訊號哪個穩:`rownum` vs `assaY_UPLOAD_DATE`(急診即時 A 管道通常先上傳)—— 需多看 raw 確認。
- panel 要以「整次抽血 / 醫令層」算 `n_er`,不是逐分析物(CBC 08011C 在 `sp_IHKE3302S07_data` 只列一次,卻展開 8 個 analyte)。需把同次抽血的 analyte 群組起來再套先後規則。

---

## 4. 待你拍板的決策

| # | 決策 | 狀態 |
|---|---|---|
| A | 用藥 link key 含 qty+days? | **是**(同藥同日靠它分) |
| B | 同採檢日模糊的檢驗 | ✅ **已定**:不留空,改用 §3.4 先後順序規則歸位(voho0000 2026-06-15) |
| C | 急診升級的處置碼集合 | 先列舉急診檢傷家族,逐步擴充(需多看 raw) |
| D | 內嵌「誰開的」當檢驗 tiebreaker | ✅ **是** —— 就是 B 的規則(內嵌 `sp_IHKE3302S07_data` 的 `n_er` + 先後) |
| E | 分階段還是一起? | 見 §7 |

---

## 5. 風險 / 取捨
- **Encounter 數會增加**(救回源頭就醫)—— 忠實、與健保存摺 UI 一致。
- **部分入院當天的藥/檢驗會變「不掛 encounter」**(模糊時)—— 資料仍在 bundle(有日期/院所/值),只是不綁特定就醫。優於現在「整個急診就醫被刪、藥被錯掛住院」。
- 用藥精準匹配若 IHKE3303 與 IHKE3306 的 qty/days 偶有不一致 → 該筆退回容錯掛載(不會錯掛,頂多留空)。

---

## 6. 測試計畫(CI invariants)
- 住院 + 同日不同診斷的急診 → **兩筆 Encounter 都在**;急診 class=EMER。
- 同藥同日不同 qty/診斷 → 各自掛到正確 Encounter。
- 檢驗:急診(採檢 5/18)與住院(採檢 5/20)同項目 → 分別掛各自就醫(採檢日分隔)。
- 同採檢日跨就醫的同項目(急診開 1 次、住院當天也驗)→ **前 1 筆掛急診、其餘掛住院**(§3.4 規則);急診沒開的醫令當天全掛住院。
- 真住院重複(IHKE3303 萬一吐住院列)→ id-class 合併,不重出。

---

## 7. 分階段建議
- **Phase 1(低風險,可先發 v0.20.0)**:移除 `dedupAdmissionDayAmb` + 急診分類修正。立即把源頭就醫救回、分類正確。藥/檢驗暫用現有 (院所, 日期) 掛載(同日撞就留空)。
- **Phase 2(v0.20.1)**:收割內嵌清單 → 用藥精準掛載 + 檢驗改採檢日掛載 + (可選)tiebreaker。

兩階段都先過 CI + 你用真實 bundle 驗,確認沒同意不 release。

---

## 8. 查證結果(2026-06-15 live,長庚嘉義 5/18 案例)
1. ✅ **IHKE3309S02(住院 detail)無 S04/S05/S07 醫令清單**(只有 `sp_IHKE3302S10/S11_data`)。→ 住院端不自帶清單;設計以「ER/門診 內嵌清單為錨,其餘當天/區間 → 住院」,本來就不需住院清單。
2. ⏳ ER 內嵌 `sp_IHKE3302S04_data` = `BC25246243/q1/d1`、`NA15737277/q1/d1`,與 bundle 一致;與 IHKE3306 端的一致性仍需多驗幾筆(本案一致)。
3. ✅ **急診偵測**:`sp_IHKE3302S05` 的 `cure_CNAME` 含「急診」(本案 `00203B/00250B 急診(按檢傷分類)…診察費/護理費`)。用關鍵字「急診」判 EMER。
4. ⏳ 門診(非急診)收治住院的 detail 待見樣本(可後補)。
5. ⚠️ **排序訊號**:`rownum` 在同管道內大致依採檢日遞增,但跨 A/B 管道分段(A 段在前、B 段在後)。須先收 A/B 對再排。**真實資料中同採檢日同項目跨就醫的碰撞並未出現**(住院第一批檢驗在 5/19,急診在 5/18),故先後規則目前無真實樣本可驗 → 實作以合成測試覆蓋,標記「待真實碰撞樣本驗證」。
6. ✅ **panel 群組**:CBC(08011C)的 analyte 連續 `rownum` + 同 `ordeR_CODE` + 同 `reaL_INSPECT_DATE` + 同 `orI_TYPE` = 一次抽血。

### 對實作的影響(重要)
- **檢驗主力分隔 = `reaL_INSPECT_DATE`**:5/18(急診 64 筆)vs 5/19~5/22(住院)。移除 dedup 後,以 (院所, 採檢日) 對就醫精確日/住院區間即可分。§3.4 的先後規則只在「同採檢日 + 同項目 + 撞 ER+住院當天」時觸發 —— 真實少見,以合成測試覆蓋。
- **threading**:ER/門診 的內嵌 S04(藥)+ S07(檢驗醫令)需從 IHKE3303S02 收割,在 link 階段可用。住院不需要。
