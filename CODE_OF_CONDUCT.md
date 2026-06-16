# Code of Conduct / 行為準則

## 我們的承諾 / Our pledge

為了營造開放、友善的協作環境，本專案的維護者與貢獻者承諾，讓參與本專案
（提 issue、送 PR、討論）的每個人都能免於騷擾，不因年齡、體型、身心障礙、
族群、性別認同與表達、經驗深淺、國籍、外貌、種族、宗教或性傾向而受到差別待遇。

We pledge to make participation in this project a harassment-free experience for
everyone, regardless of personal background or identity.

## 規範 / Standards

鼓勵：友善、尊重不同觀點、優雅地接受建設性批評、以社群最大利益為重。
不可接受：人身攻擊、騷擾、歧視性言論、公開或私下散布他人隱私資訊。

## ⚠️ 健康資料 / Protected health information

本專案處理真實民眾的健康資料。**在任何公開場合（issue、PR、討論、截圖、測試
資料、附件）一律不得貼出真實的個人健康資訊**，包含但不限於：

- 真實身分證字號、姓名、出生日期、病歷號
- 真實的健康存摺截圖、匯出的 FHIR bundle、API 回應原文
- 足以識別個人的「醫院 + 日期 + 診斷／用藥」組合

重現問題時請改用**完全合成、checksum 無效**的假資料（見
[`CONTRIBUTING.md`](CONTRIBUTING.md) 與 [`docs/DEMO_SYNTHETIC_BUNDLE.md`](docs/DEMO_SYNTHETIC_BUNDLE.md)）。
維護者會直接移除任何含真實 PHI 的內容，必要時聯絡相關平台協助清除。

This project handles real people's health data. **Never post real PHI in any
public place** (issues, PRs, screenshots, test data, attachments). Reproduce
issues with fully synthetic, checksum-invalid placeholder data. Maintainers will
remove any content containing real PHI on sight.

## 通報 / Reporting

如遇違反本準則的行為，或發現公開內容含真實 PHI，請私下聯絡維護者：

- Email: <voho0000@gmail.com>
- 安全弱點：見 [SECURITY.md](SECURITY.md)

維護者會在合理時間內審視並處理，並為通報者保密。

## 致謝 / Attribution

本準則精神參考 [Contributor Covenant](https://www.contributor-covenant.org) v2.1
（CC BY 4.0），並針對本專案的健康資料情境加上 PHI 條款。
