<template>
  <h1>人資專區</h1>
  <div class="tools">
    <button class="btn btn-primary mb-3 mx-2" @click.prevent="getPunches">
      查閱打卡記錄
    </button>
    <button class="btn btn-primary mb-3 mx-2" @click.prevent="getEmployees">
      查閱員工名單
    </button>
  </div>
  <!-- 出勤記錄表 -->
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
            <td>{{ punch.state }}</td>
            <td>
              <button
                class="btn btn-success"
                @click.prevent="changeState(punch.id, punch.state)"
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
    <div class="container" v-if="this.punchTable.data !== null">
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
    <div class="employee-table" v-if="this.employeeTable.data !== null">
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
            <th scope="col">密碼錯誤次數歸零</th>
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
                @click.prevent="
                  resetCount(
                    employee.code,
                    employee.fullName,
                    employee.typoCount
                  )
                "
              >
                歸零
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Pagination -->
    <div class="container" v-if="this.employeeTable.data !== null">
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
</template>

<script>
import Paginate from "vuejs-paginate-next";
import { mapStores } from "pinia";
import useAuthStore from "../stores/auth";
import { createToaster } from "@meforma/vue-toaster";
import dayjs from "dayjs";

const toasterError = createToaster({
  type: "error",
  position: "top",
  duration: 2000,
});
const toasterInfo = createToaster({
  type: "info",
  position: "top",
  duration: 6000,
});

export default {
  name: "PunchTable",
  components: {
    Paginate,
  },
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useAuthStore),
  },
  props: [],
  data() {
    return {
      punchTable: {
        count: null,
        data: null,
        page: null,
        page_current: null,
        page_sum: null,
        option: "all",
      },
      employeeTable: {
        count: null,
        data: null,
        page: 1,
        page_current: null,
        page_sum: null,
      },
    };
  },
  methods: {
    // 管理員可檢視員工一覽表
    getEmployees() {
      this.employeeTable.page_current = this.employeeTable.page;
      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/employees?` +
          new URLSearchParams({
            page: this.employeeTable.page_current,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => res.json())
        .then((res) => {
          toasterInfo.show(res.message);
          this.employeeTable.count = res.count;
          this.employeeTable.data = res.data;
          this.employeeTable.page = this.employeeTable.page_current;
          this.employeeTable.page_sum = Math.ceil(
            this.employeeTable.count / 10
          );
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 管理員可檢視打卡記錄。option 由函式 punchesOption() 傳遞
    getPunches(option) {
      this.punchTable.page_current = this.punchTable.page;
      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/punches?` +
          new URLSearchParams({
            page: this.punchTable.page_current,
            option: this.punchTable.option,
          }),
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
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
    // 管理員可將員工的缺勤狀態改為到勤
    changeState(punchId, punchState) {
      if (
        !window.confirm(
          `確定要將打卡編號 ${punchId} 的狀態改為到勤嗎？變更後將無法在此平台恢復原狀！`
        )
      ) {
        return null;
      }
      if (punchState === "出勤時數已達標準") {
        toasterError.show("變更狀態失敗。該筆記錄本來就是到勤。");
        return null;
      }
      fetch(`${import.meta.env.VITE_BASE_URL}/api/punches/${punchId}/state`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
          "Content-Type": "application/x-www-form-urlencoded; charset=utf-8",
        },
        body: `punch_id=${punchId}`,
      })
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          toasterInfo.show(res.message);
          this.getPunches();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    // 管理員可將員工的密碼錯誤次數歸零
    resetCount(code, fullName, count) {
      if (
        !window.confirm(
          `確定要將員工編號 ${code} ${fullName}的密碼錯誤次數歸零嗎？送出請求後將無法在此平台恢復原狀！`
        )
      ) {
        return null;
      }
      if (count <= 4) {
        toasterError.show("請求失敗。當密碼錯誤次數超過四次才可發出請求。");
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
            Authorization: `Bearer ${this.authStore.token}`,
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          toasterInfo.show(res.message);
          this.getEmployees();
        })
        .catch((err) => {
          console.error(err);
        });
    },
    closeEmployeeTable() {
      this.employeeTable.data = null;
    },
    closePunchTable() {
      this.punchTable.data = null;
      this.punchTable.option = "all";
    },
    // 傳遞查閱打卡記錄的條件
    punchesOption() {
      this.punchTable.option = event.target.value;
      this.getPunches(this.punchTable.option);
    },
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
