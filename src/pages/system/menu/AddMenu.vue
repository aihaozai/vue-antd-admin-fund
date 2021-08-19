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
      <a-form-model-item ref="pName" :label="$t('parentMenu')" prop="pName">
          <a-select
              :placeholder="$t('parentMenuMsg')"
              v-model="form.pName"
              style="width: 100%"
              @change="handleChange"
              allow-clear
           >
              <a-icon slot="suffixIcon" type="smile" />
            <a-select-option v-for="item in OPTIONS" :key="item.code" :value="item.code" :title="item.label">
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
import {request, METHOD} from '@/utils/request'
export default {
  name: 'AddMenu',
  components: {},
  i18n: require('./i18n'),
  data() {
      return {
          OPTIONS: [{'code':'0','label':'根目录'}],
          form: {
                id: '',
                menuName: '',
                pid: '',
                pName: '',
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
              pName: [{ required: true, message: this.$i18n.t('parentMenuMsg'), trigger: 'change' }],
          },
      };
  },
  created() {
      request(process.env.VUE_APP_API_BASE_URL_AUTH + '/menu/select', METHOD.GET).then(res => {
          if(res.data.data){
              this.OPTIONS = this.OPTIONS.concat(res.data.data);
              console.log(this.OPTIONS)
          }
      })
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
          this.form.pid = selectedItems
      },
  },
  computed: {
      // filteredOptions() {
      //     return this.OPTIONS.filter(o => !o.code==this.form.pid);
      // },
  },
}
</script>
