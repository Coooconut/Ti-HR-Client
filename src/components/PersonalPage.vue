<template>
  <div id="tools">
    <button class="btn btn-primary mb-3 mx-2" @click.prevent="getMyPunches">
      我的打卡記錄
    </button>
    <button
      class="btn btn-primary mb-3 mx-2"
      @click.prevent="openChangePasswordForm"
    >
      更改密碼
    </button>
  </div>
  <!-- 個人打卡記錄表單 -->
  <div id="punch-table">
    <div class="punch-table" v-if="this.punchTable.data !== null">
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
            <td>{{ punch.state }}</td>
            <td>{{ punch.createdAt }}</td>
            <td>{{ punch.updatedAt }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div class="container" v-if="this.punchTable.data !== null">
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
    v-if="passwordForm === 'open'"
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
      v-if="passwordForm === 'open'"
      @click.prevent="closeChangePasswordForm"
    >
      關閉表單
    </button>
  </vee-form>
</template>

<script>
import Paginate from "vuejs-paginate-next";
import { mapState, mapStores } from "pinia";
import useFormStore from "@/stores/form";
import useAuthStore from "@/stores/auth";
import { createToaster } from "@meforma/vue-toaster";
import dayjs from "dayjs";

const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 5000,
});

export default {
  name: "PersonalPage",
  components: {
    Paginate,
  },
  props: ["response", "token"],
  data() {
    return {
      // 資料驗證的 schema
      schema: {
        password: "required",
        new_password: "required",
        new_password_confirm: "required",
      },
      auth: useAuthStore(),
      passwordForm: "close",
      punchTable: {
        count: null,
        data: null,
        page: null,
        page_current: null,
        page_sum: null,
        option: "all",
      },
    };
  },
  emits: ["emit-change-password"],
  methods: {
    // 使用者可以更改登入密碼
    changPassword(values) {
      fetch(`${import.meta.env.VITE_BASE_URL}/api/employees/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
          Authorization: `Bearer ${this.auth.token}`,
        },
        body: `password=${values.password}&newPassword=${values.new_password}&newPasswordConfirm=${values.new_password_confirm}`,
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          toasterInfo.show(res.message);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 使用者可以查閱自己的打卡記錄
    getMyPunches(option) {
      this.punchTable.page_current = this.punchTable.page;
      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/punches/${
          this.auth.user.code
        }/my_punches?` +
          new URLSearchParams({
            page: this.punchTable.page_current,
            option: this.punchTable.option,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.auth.token}`,
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
          this.punchTable.count = res.count;
          this.punchTable.data = res.data;
          this.punchTable.page = this.punchTable.page_current;
          this.punchTable.page_sum = Math.ceil(this.punchTable.count / 10);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    closePunchTable() {
      this.punchTable.data = null;
      this.punchTable.option = "all";
    },
    closeChangePasswordForm() {
      this.passwordForm = "close";
    },
    openChangePasswordForm() {
      this.passwordForm = "open";
    },
    // 傳遞查閱打卡記錄的條件
    punchesOption() {
      this.punchTable.option = event.target.value;
      this.getMyPunches(this.punchTable.option);
    },
  },
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useFormStore),
    // 代入 store 以及 getters，如此兩者可在任意元件中使用
    ...mapState(useFormStore, ["hiddenClassChangePasswordForm"]),
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
