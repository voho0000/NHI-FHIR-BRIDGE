<!-- 感謝貢獻！送出前請確認下列項目。 -->

## 這個 PR 做了什麼 / What does this PR do?

<!-- 簡述變更與動機；若修 bug 請描述重現方式（用合成資料）。 -->

## 相關 issue / Related issue

<!-- 例：Closes #123 -->

## 檢查清單 / Checklist

- [ ] **沒有真實 PHI**：diff、測試、fixtures、截圖、描述裡**沒有**真實身分證／
      姓名／生日／病歷號／健康存摺截圖／真實匯出 bundle。測試資料一律
      checksum **無效**的合成碼（見 `CONTRIBUTING.md`）。
- [ ] 通過 `npm test`（backend + extension）與 `tsc --noEmit`、`biome check`。
- [ ] 若動到 mapper／observation／coding／resource 建構：已依
      [`DEVELOPMENT_RULES.md`](../DEVELOPMENT_RULES.md) 的 FHIR R4 檢查表自我
      稽核（LOINC 對應有 WebFetch loinc.org 查證）。
- [ ] 若改動使用者可見的 UI 或文字：附上截圖或說明。
- [ ] 文件（README／docs／CHANGELOG）已同步更新（如適用）。

## 截圖 / Screenshots（UI 變更才需要，務必用合成資料）

<!-- 拖曳圖片到這裡。再次提醒：不要貼真實病人資料的截圖。 -->
