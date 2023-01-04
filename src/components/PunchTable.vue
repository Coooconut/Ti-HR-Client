<template>
  <h1>人資專區</h1>
  <div class="tools">
    <button class="btn btn-primary mb-3" @click="getPunches">
      查閱打卡記錄
    </button>
  </div>
  <!-- 出勤記錄表 -->
  <div class="punch-table">
    <h3>出勤記錄表</h3>
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
  <div class="container">
    <paginate
      v-model="page"
      :page-count="page_sum"
      :page-range="20"
      :click-handler="getPunches"
      :prev-text="'Prev'"
      :next-text="'Next'"
      :container-class="'pagination'"
    ></paginate>
  </div>
</template>

<script>
import Paginate from "vuejs-paginate-next";
import { mapStores } from "pinia";
import useAuthStore from "../stores/auth";
import { createToaster } from "@meforma/vue-toaster";

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
  },
  props: [],
  data() {
    return {
      count: null,
      data: null,
      page: null,
      page_current: 1,
      page_sum: null,
    };
  },
  methods: {
    getPunches() {
      this.page_current = this.page;
      fetch(
        `${import.meta.env.VITE_BASE_URL}/api/punches?` +
          new URLSearchParams({
            page: this.page_current,
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
          this.response = res;
          toasterInfo.show(res.message);
          this.count = res.count;
          this.data = res.data;
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
  },
};
</script>

<style>
.container {
  display: flex;
  justify-content: center;
}
</style>
