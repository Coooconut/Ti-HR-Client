<template>
  <h1>人資專區</h1>
  <div class="tools">
    <button class="btn btn-primary mb-3" @click.prevent="getPunches">
      查閱打卡記錄
    </button>
  </div>
  <!-- 出勤記錄表 -->
  <div class="punch-table" v-if="this.data !== null">
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
      <option selected>請選擇檢索條件（預設檢索所有記錄）</option>
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
        <tr v-for="(punch, index) in data" :key="punch.id">
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
  <div class="container" v-if="this.data !== null">
    <paginate
      v-model="page"
      :page-count="page_sum"
      :page-range="20"
      :click-handler="getPunches"
      :prev-text="'上一頁'"
      :next-text="'下一頁'"
      :container-class="'pagination'"
    ></paginate>
  </div>
</template>

<script>
import Paginate from "vuejs-paginate-next";
import { mapStores } from "pinia";
import useAuthStore from "../stores/auth";
import useFormStore from "../stores/form";
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
  duration: 2000,
});

export default {
  name: "PunchTable",
  components: {
    Paginate,
  },
  computed: {
    // mapStores 需搭配展開運算子，引數代入 store。
    ...mapStores(useAuthStore),
    ...mapStores(useFormStore),
  },
  props: [],
  data() {
    return {
      count: null,
      data: null,
      page: null,
      page_current: null,
      page_sum: null,
      option: "all",
    };
  },
  methods: {
    getPunches(option) {
      this.page_current = this.page;
      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/punches?` +
          new URLSearchParams({
            page: this.page_current,
            option: this.option,
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
          console.log(res.data);
          res.data.forEach((element) => {
            console.log(element.updatedAt);
            element.updatedAt = dayjs(element.updatedAt)
              .subtract(12, "h")
              .format("hh:mm:ss");
            element.createdAt = dayjs(element.createdAt)
              .subtract(12, "h")
              .format("hh:mm:ss");
          });
          this.response = res;
          toasterInfo.show(res.message);
          this.count = res.count;
          this.data = res.data;
          this.page = this.page_current;
          this.page_sum = Math.ceil(this.count / 10);
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
    closePunchTable() {
      this.page = null;
    },
    punchesOption() {
      this.option = event.target.value;
      this.getPunches(this.option);
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
