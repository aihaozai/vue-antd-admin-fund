<template>
  <a-form-model
      ref="ruleForm"
      :model="form"
      :rules="rules"
      :layout="'vertical'"
  >
      <a-form-model-item ref="name" :label="$t('name')" prop="name">
          <a-input
                  v-model="form.name"
                  @blur="() => {$refs.name.onFieldBlur();}"
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
      <a-form-model-item ref="path" :label="$t('path')" prop="path">
              <a-input
                      v-model="form.path"
                      @blur="() => {$refs.path.onFieldBlur();}"
                      allow-clear
              />
      </a-form-model-item>
      <a-form-model-item ref="component" :label="$t('component')" prop="component">
          <a-input
                  v-model="form.component"
                  @blur="() => {$refs.component.onFieldBlur();}"
                  allow-clear
          />
      </a-form-model-item>
      <a-form-model-item ref="icon" :label="$t('icon')" prop="icon">
          <a-input
                  v-model="form.icon"
                  @blur="() => {$refs.icon.onFieldBlur();}"
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
                name: '',
                pid: '',
                pName: '',
                path: '',
                component: '',
                icon: '',
                sort: '',
          },
          rules: {
              name: [
              { required: true, message: this.$i18n.t('nameMsg'), trigger: 'blur' },
              { max: 16, message: this.$i18n.t('lengthMsg16'), trigger: 'blur' },
              ],
              pid: [{ required: true, message: this.$i18n.t('parentMenuMsg'), trigger: 'change' }],
              pName: [{ required: true, message: this.$i18n.t('parentMenuMsg'), trigger: 'change' }],
              path: [{ max: 10, message: this.$i18n.t('lengthMsg10'), trigger: 'blur' }],
              component: [{ max: 60, message: this.$i18n.t('lengthMsg60'), trigger: 'blur' }],
              icon: [{ max: 15, message: this.$i18n.t('lengthMsg15'), trigger: 'blur' }],
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
