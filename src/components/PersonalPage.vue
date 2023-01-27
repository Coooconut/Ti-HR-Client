<template>
  <div id="tools">
    <button class="btn btn-primary mb-3 mx-2" @click.prevent="getMyPunches">
      我的打卡記錄
    </button>
    <button
      class="btn btn-primary mb-3 mx-2"
      @click.prevent="toggleChangePasswordForm"
    >
      更改密碼
    </button>
  </div>
  <!-- 個人打卡記錄表單 -->
  <div id="punch-table">
    <div class="punch-table" v-if="punchTable.data !== null">
      <button
        class="mx-5 btn btn-secondary position-absolute end-0"
        @click.prevent="closePunchTable"
      >
        關閉表單
      </button>
      <h3>出勤記錄表</h3>
      <select
        class="form-select"
        aria-label="Change search criteria"
        @change="punchesOption"
      >
        <option selected="all">請選擇檢索條件（預設檢索所有記錄）</option>
        <option value="all">顯示所有記錄</option>
        <option value="absence">只顯示缺勤記錄</option>
      </select>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">打卡編號</th>
            <th scope="col">日期</th>
            <th scope="col">員工編號</th>
            <th scope="col">姓名</th>
            <th scope="col">出勤時數</th>
            <th scope="col">狀態</th>
            <th scope="col">上班打卡時間</th>
            <th scope="col">下班打卡時間</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(punch, index) in punchTable.data" :key="punch.id">
            <td>{{ punch.id }}</td>
            <td>{{ punch.workingDay }}</td>
            <td>{{ punch.Employee.code }}</td>
            <td>{{ punch.Employee.full_name }}</td>
            <td>{{ punch.workingHours }}</td>
            <td>{{ punch.state }}</td>
            <td>{{ punch.createdAt }}</td>
            <td>{{ punch.updatedAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div class="container" v-if="punchTable.data !== null">
      <paginate
        v-model="punchTable.page"
        :page-count="punchTable.page_sum"
        :page-range="20"
        :click-handler="getMyPunches"
        :prev-text="'上一頁'"
        :next-text="'下一頁'"
        :container-class="'pagination'"
      ></paginate>
    </div>
  </div>
  <!-- 更改密碼表單 -->
  <vee-form
    v-bind:validation-schema="schema"
    v-on:submit="changPassword"
    v-if="passwordForm === true"
  >
    <h3 class="mt-3 mb-3">更改密碼申請表</h3>
    <!-- 舊密碼 -->
    <div class="mb-3">
      <label for="password" class="form-label">舊密碼</label>
      <vee-field
        type="password"
        name="password"
        class="form-control"
        id="password"
        placeholder="Enter your employee code."
      />
      <ErrorMessage class="form-validate-error" name="password" />
    </div>
    <!-- 新密碼 -->
    <div class="mb-3">
      <label for="new_password" class="form-label">新密碼</label>
      <vee-field
        type="password"
        name="new_password"
        class="form-control"
        id="new_password"
        placeholder="Enter your password."
      />
      <ErrorMessage class="form-validate-error" name="new_password" />
    </div>
    <!-- 確認新密碼 -->
    <div class="mb-3">
      <label for="new_password_confirm" class="form-label">確認新密碼</label>
      <vee-field
        type="password"
        name="new_password_confirm"
        class="form-control"
        id="new_password_confirm"
        placeholder="Enter your password."
      />
      <ErrorMessage class="form-validate-error" name="new_password_confirm" />
    </div>
    <button type="submit" class="btn btn-primary">更改密碼 Submit</button>
    <button
      class="mx-5 btn btn-secondary"
      v-if="passwordForm === true"
      @click.prevent="toggleChangePasswordForm"
    >
      關閉表單
    </button>
  </vee-form>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";
import Paginate from "vuejs-paginate-next";
import useAuthStore from "@/stores/auth";
import { createToaster } from "@meforma/vue-toaster";
import dayjs from "dayjs";

const auth = useAuthStore();
const router = useRouter();
const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 5000,
});
// 資料驗證的 schema
const schema = reactive({
  password: "required",
  new_password: "required",
  new_password_confirm: "required",
});
// 利用 passwordForm 的值搭配 v-if 顯示或隱藏變更密碼表單
let passwordForm = ref(false);
/*
宣告出勤記錄表的各項屬性。
count 記錄總筆數、data 後端傳來的記錄、page 欲檢視的頁碼、page_current 當前頁碼、page_sum 頁面總數、option 檢索條件。
*/
const punchTable = reactive({
  count: null,
  data: null,
  page: null,
  page_current: null,
  page_sum: null,
  option: "all",
});
// 使用者可以查閱自己的打卡記錄。option 透過 punchesOption() 傳遞。
function getMyPunches(option) {
  showPunchTableOnly();
  punchTable.page_current = punchTable.page;
  fetch(
    `${import.meta.env.VITE_BASE_URL}/api/punches/${
      auth.user.code
    }/my_punches?` +
      new URLSearchParams({
        page: punchTable.page_current,
        option: punchTable.option,
      }),
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => res.json())
    .then((res) => {
      // 將資料庫儲存的時間轉換為易讀格式
      res.data.forEach((element) => {
        element.createdAt = dayjs(element.createdAt).format("HH:mm:ss");
        element.updatedAt = dayjs(element.updatedAt).format("HH:mm:ss");
      });
      toasterInfo.show(res.message);
      punchTable.count = res.count;
      punchTable.data = res.data;
      punchTable.page = punchTable.page_current;
      punchTable.page_sum = Math.ceil(punchTable.count / 10);
    })
    .catch((err) => {
      console.error(err);
    });
}
function closePunchTable() {
  punchTable.data = null;
  punchTable.option = "all";
}
// 使用者可以更改登入密碼
function changPassword(values) {
  fetch(`${import.meta.env.VITE_BASE_URL}/api/employees/password`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
      Authorization: `Bearer ${auth.token}`,
    },
    body: `password=${values.password}&newPassword=${values.new_password}&newPasswordConfirm=${values.new_password_confirm}`,
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      // 若更改密碼成功，就將使用者登出系統。否則提示錯誤訊息。
      if (res.message === "更改密碼成功") {
        auth.signOut("更改密碼成功。請用新密碼登入系統。");
        router.push("/");
      } else {
        toasterInfo.show(res.message);
      }
    })
    .catch((err) => {
      console.error(err);
    });
}
// 顯示或關閉更改密碼表單
function toggleChangePasswordForm() {
  passwordForm.value = !passwordForm.value;
  showChangePasswordFormOnly();
}
// 傳遞查閱打卡記錄的條件
function punchesOption() {
  punchTable.option = event.target.value;
  getMyPunches(punchTable.option);
}
// 更改密碼申請表開啟時，關閉其他已開啟的表單。在 toggleChangePasswordForm 函式當中調用此函式。
function showChangePasswordFormOnly() {
  if (punchTable.data !== null) {
    punchTable.data = null;
  }
}
// 檢閱打卡記錄時，關閉其他已開啟的表單。在 getMyPunches 函式當中調用此函式。
function showPunchTableOnly() {
  if (passwordForm.value) {
    passwordForm.value = false;
  }
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
