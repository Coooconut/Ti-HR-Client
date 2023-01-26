# Ti-HR-Client 鈦專業人資系統 前端程式碼
## 專案簡述
本專案為人資系統網站的前端程式碼，目前版本可提供使用者GPS定位打卡、二維碼打卡、人資管理者查閱打卡記錄等功能。<br>專案核心技術為 Vue3，並使用官方推薦工具，如 create-vue、Pinia、Vue Router 等。<br>透過本專案驅動伺服器與使用者互動，並將使用者的請求傳向後端伺服器，可實現前後端分離開發及整合應用。
## 產品規格
本專案之產品規格揭示於本儲存庫的 [Wiki 頁面](https://github.com/PigeonShogi/Ti-HR-Client/wiki/產品規格)
##### 本專案後端 repo
* https://github.com/PigeonShogi/Ti-HR
##### 前後端專案整合 demo
* https://ti-hr-client.vercel.app/
##### Demo 帳號
* 管理者
  帳號：admin
  密碼：tiadmin
* 一般使用者
  帳號：user
  密碼：titaner
## 重要開發工具
##### 前端框架
* vue 3.2.45
##### 狀態管理
* pinia 2.0.28
##### 路由控制
* vue-router 4.1.6
##### 資料驗證
* vee-validate 4.7.3
##### CSS框架
* bootstrap 5.3.0

## 專案設定
1. 將本專案下載至本地
```
$ git clone https://github.com/PigeonShogi/Ti-HR-Client
```
2. 進入專案資料夾
```
$ cd Ti-HR-Client
```
3. 安裝所需套件
```
$ npm install
```
4. 建立檔案 .env 並設定環境變數
```
環境變數設定可參考 .env.example
```
5. 啟動伺服器 
```
$ npm run dev
// 若終端機顯示「VITE v4.0.3  ready in xxxx ms」字樣，表示啟動成功。
```
## 後端API 文件
* https://internal-heath-a13.notion.site/API-6e83aeda11ef4d0aac006da57be4ff80