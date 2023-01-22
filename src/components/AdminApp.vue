<template>
  <h1>人資專區</h1>
  <div class="tools">
    <button class="btn btn-primary mb-3 mx-2" @click.prevent="getPunches">
      查閱打卡記錄
    </button>
    <button class="btn btn-primary mb-3 mx-2" @click.prevent="getEmployees">
      查閱員工名單
    </button>
    <button
      class="btn btn-primary mb-3 mx-2"
      @click.prevent="togglePostEmployeeForm"
    >
      新增員工帳號
    </button>
  </div>
  <!-- 出勤記錄表 -->
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
            <th scope="col">變更狀態</th>
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
            <td>
              <button
                class="btn btn-success"
                v-if="punch.state !== '出勤時數已達標準'"
                @click.prevent="changeState(punch.id)"
              >
                改為到勤
              </button>
            </td>
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
        :click-handler="getPunches"
        :prev-text="'上一頁'"
        :next-text="'下一頁'"
        :container-class="'pagination'"
      ></paginate>
    </div>
  </div>
  <!-- 員工一覽表 -->
  <div id="employee-table">
    <div class="employee-table" v-if="employeeTable.data !== null">
      <button
        class="mx-5 btn btn-secondary position-absolute end-0"
        @click.prevent="closeEmployeeTable"
      >
        關閉表單
      </button>
      <h3>員工一覽表</h3>
      <table class="table table-striped">
        <thead>
          <tr>
            <th scope="col">員工編號</th>
            <th scope="col">身份</th>
            <th scope="col">姓名</th>
            <th scope="col">密碼錯誤次數</th>
            <th scope="col">
              密碼錯誤次數歸零（僅可將錯誤次數五次以上者歸零）
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(employee, index) in employeeTable.data"
            :key="employee.code"
          >
            <td>{{ employee.code }}</td>
            <td>{{ employee.identity }}</td>
            <td>{{ employee.fullName }}</td>
            <td>{{ employee.typoCount }}</td>
            <td>
              <button
                class="btn btn-success"
                v-if="employee.typoCount > 4"
                @click.prevent="resetCount(employee.code, employee.fullName)"
              >
                歸零
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div class="container" v-if="employeeTable.data !== null">
      <paginate
        v-model="employeeTable.page"
        :page-count="employeeTable.page_sum"
        :page-range="20"
        :click-handler="getEmployees"
        :prev-text="'上一頁'"
        :next-text="'下一頁'"
        :container-class="'pagination'"
      ></paginate>
    </div>
  </div>
  <!-- 新增員工帳號表單 -->
  <vee-form
    v-if="form.isOpenPostEmployeeForm === true"
    v-bind:validation-schema="schema"
    v-on:submit="postEmployee"
  >
    <!-- 員工編號 -->
    <h3 class="mt-5 mb-2">新增員工帳號</h3>
    <div class="mb-3">
      <label for="employee_code" class="form-label">員工編號</label>
      <vee-field
        type="text"
        name="code"
        class="form-control"
        id="code"
        placeholder="輸入員工編號：TYYYNNNN"
      />
      <ErrorMessage class="form-validate-error" name="code" />
    </div>
    <!-- 姓名 -->
    <div class="mb-3">
      <label for="fullName" class="form-label">員工姓名</label>
      <vee-field
        type="text"
        name="fullName"
        class="form-control"
        id="fullName"
        placeholder="輸入員工姓名"
      />
      <ErrorMessage class="form-validate-error" name="fullName" />
    </div>
    <!-- 身份 -->
    <div class="mb-3">
      <label for="identity" class="form-label">身份</label>
      <vee-field as="select" name="identity" class="form-select" id="identity">
        <option value="employee">一般員工</option>
        <option value="admin">管理者</option>
      </vee-field>
      <ErrorMessage class="form-validate-error" name="identity" />
    </div>
    <div class="buttons">
      <button type="submit" class="btn btn-primary mb-3">
        填妥送出 Submit
      </button>
      <button
        class="btn btn-secondary mx-3 mb-3"
        @click.prevent="togglePostEmployeeForm"
      >
        關閉表單
      </button>
    </div>
  </vee-form>
  <!-- WebSocket -->
  <web-socket />
</template>

<script setup>
import { reactive } from "vue";
import Paginate from "vuejs-paginate-next";
import useAuthStore from "../stores/auth";
import useFormStore from "../stores/form";
import { createToaster } from "@meforma/vue-toaster";
import dayjs from "dayjs";
import WebSocket from "@/components/WebSocket.vue";

const auth = useAuthStore();
const form = useFormStore();
const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 6000,
});
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
// 宣告員工名單的各項屬性。屬性定義參見 punchTable。
const employeeTable = reactive({
  count: null,
  data: null,
  page: 1,
  page_current: null,
  page_sum: null,
});
// 資料驗證的 schema
const schema = reactive({
  code: {
    required: true,
    // 員工編號必須符合 T1234567（T 加七個數字）的格式。
    regex: /^T\d{7}$/,
  },
  fullName: {
    required: true,
  },
  identity: {
    required: true,
  },
});
// 管理員可新增員工記錄。第二個引數是套件 vee-validate 的功能，可以在表單送出資料後清除欄位內的資料，且不觸發資料驗證，因此不會出現必填欄位未填的警告。
function postEmployee(values, { resetForm }) {
  fetch(`${import.meta.env.VITE_BASE_URL}/api/employees`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
    body: `code=${values.code}&fullName=${values.fullName}&identity=${values.identity}`,
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      toasterInfo.show(res.message);
      // 套件 vee-validate 的功能，清除表單中的資料。
      resetForm();
    })
    .catch((err) => {
      console.error(err);
    });
}
// 管理員可檢視員工一覽表
function getEmployees() {
  employeeTable.page_current = employeeTable.page;
  fetch(
    `${import.meta.env.VITE_BASE_URL}/api/employees?` +
      new URLSearchParams({
        page: employeeTable.page_current,
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
      toasterInfo.show(res.message);
      employeeTable.count = res.count;
      employeeTable.data = res.data;
      employeeTable.page = employeeTable.page_current;
      employeeTable.page_sum = Math.ceil(employeeTable.count / 10);
    })
    .catch((err) => {
      console.error(err);
    });
}
// 管理員可檢視打卡記錄。option 由函式 punchesOption() 傳遞
function getPunches(option) {
  punchTable.page_current = punchTable.page;
  fetch(
    `${import.meta.env.VITE_BASE_URL}/api/punches?` +
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
// 管理員可將員工的缺勤狀態改為到勤
function changeState(punchId) {
  if (
    !window.confirm(
      `確定要將打卡編號 ${punchId} 的狀態改為到勤嗎？變更後將無法在此平台恢復原狀！`
    )
  ) {
    return null;
  }
  fetch(`${import.meta.env.VITE_BASE_URL}/api/punches/${punchId}/state`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${auth.token}`,
      "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
    },
    body: `punch_id=${punchId}`,
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      toasterInfo.show(res.message);
      // 變更狀態後，刷新頁面。
      getPunches();
    })
    .catch((err) => {
      console.error(err);
    });
}
// 管理員可將員工的密碼錯誤次數歸零
function resetCount(code, fullName) {
  if (
    !window.confirm(
      `確定要將員工編號 ${code} ${fullName}的密碼錯誤次數歸零嗎？送出請求後將無法在此平台恢復原狀！`
    )
  ) {
    return null;
  }
  fetch(
    `${import.meta.env.VITE_BASE_URL}/api/employees/typo_count?` +
      new URLSearchParams({
        code,
      }),
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${auth.token}`,
        "Content-Type": "application/json",
      },
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      toasterInfo.show(res.message);
      // 密碼錯誤次數歸零後，刷新頁面。
      getEmployees();
    })
    .catch((err) => {
      console.error(err);
    });
}
// 關閉員工名單
function closeEmployeeTable() {
  employeeTable.data = null;
}
// 關閉出勤表單
function closePunchTable() {
  punchTable.data = null;
  punchTable.option = "all";
}
// 傳遞查閱打卡記錄的條件
function punchesOption() {
  punchTable.option = event.target.value;
  getPunches(punchTable.option);
}
// 開關新增員工帳號的表單
function togglePostEmployeeForm() {
  form.isOpenPostEmployeeForm = !form.isOpenPostEmployeeForm;
}
</script>

<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
