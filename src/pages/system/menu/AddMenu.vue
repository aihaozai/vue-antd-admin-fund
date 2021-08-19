<template>
  <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :layout="'vertical'"
  >
      <a-form-model-item ref="menuName" :label="$t('menuName')" prop="menuName">
          <a-input
                  v-model="form.menuName"
                  @blur="() => {$refs.menuName.onFieldBlur();}"
                  allow-clear
          />
      </a-form-model-item>
      <a-form-model-item ref="pid" :label="$t('parentMenu')" prop="pid">
          <a-select
              :placeholder="$t('parentMenuMsg')"
              v-model="form.pid"
              style="width: 100%"
              @change="handleChange"
              allow-clear
           >
            <a-select-option v-for="item in filteredOptions" :key="item.code" :value="item.code">
              {{ item.label }}
            </a-select-option>
          </a-select>
      </a-form-model-item>
      <a-form-model-item ref="menuUrl" :label="$t('menuUrl')" prop="menuUrl">
              <a-input
                      v-model="form.menuUrl"
                      @blur="() => {$refs.menuUrl.onFieldBlur();}"
                      allow-clear
              />
      </a-form-model-item>
      <a-form-model-item ref="menuIcon" :label="$t('menuIcon')" prop="menuIcon">
          <a-input
                  v-model="form.menuIcon"
                  @blur="() => {$refs.menuIcon.onFieldBlur();}"
                  allow-clear
          />
      </a-form-model-item>
      <a-form-model-item ref="sort" :label="$t('sort')" prop="sort">
          <a-input
                  v-model="form.sort"
                  @blur="() => {$refs.sort.onFieldBlur();}"
                  allow-clear type="number"
          />
      </a-form-model-item>
  </a-form-model>
</template>

<script>
const OPTIONS = [{'code':'0','label':'根目录'}];
export default {
  name: 'AddMenu',
  components: {},
  i18n: require('./i18n'),
  data() {
    return {
      form: {
        id: '',
        menuName: '',
        pid: '',
        menuUrl: '',
        menuIcon: '',
        sort: '',
      },
      rules: {
        menuName: [
          { required: true, message: this.$i18n.t('menuNameMsg'), trigger: 'blur' },
          { min: 2, max: 16, message: this.$i18n.t('menuLengthMsg'), trigger: 'blur' },
        ],
        pid: [{ required: true, message: this.$i18n.t('parentMenuMsg'), trigger: 'change' }],
      },
    };
  },
  methods: {
    onSubmit(callback) {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
            callback(this.form);
        } else {
            callback(false);
        }
      });
    },
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    handleChange(selectedItems) {
        console.log(selectedItems)
    },
  },
  computed: {
    filteredOptions() {
        console.log(this.form.pid)
        return OPTIONS.filter(o => !o.code==this.form.pid);
    },
  },
}
</script>
