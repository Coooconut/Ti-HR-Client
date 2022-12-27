// 從 vee-validate 引用 component ，並設定別名，避免和 HTML 混淆。
import { Form as VeeForm, Field as VeeField } from "vee-validate";

export default {
  // 引數 app 表示將插件安在指定的 .vue 檔案
  install(app) {
    app.component("VeeForm", VeeForm);
    app.component("VeeField", VeeField);
  },
};
