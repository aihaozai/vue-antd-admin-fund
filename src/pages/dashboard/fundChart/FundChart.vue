<template>
  <page-layout :avatar="currUser.avatar">
<!--    <div slot="headerContent">-->
<!--      <div class="title">{{welcome.timeFix[lang]}}，{{currUser.name}}，{{welcome.message[lang]}}</div>-->
<!--      <div>{{currUser.position[lang]}}</div>-->
<!--    </div>-->
<!--    <template slot="extra">-->
<!--      <head-info class="split-right" :title="$t('project')" content="56"/>-->
<!--      <head-info class="split-right" :title="$t('ranking')" content="8/24"/>-->
<!--      <head-info class="split-right" :title="$t('visit')" content="2,223"/>-->
<!--    </template>-->
    <template>
      <a-row style="margin: 0 -12px">
        <a-col style="padding: 0 12px" >
          <a-card class="project-list fund-list-max-height beauty-scroll" :loading="loading" style="margin-bottom: 24px;" :bordered="false"  :body-style="{padding: 0}">
            <a slot="extra">{{$t('progress')}}</a>
            <div class="block">
              <div class="centered">
                <div v-for="(item,index) in fundData" :key="index" :id="item['fundCode']" class="fundChart">
                  <div class="fundChartName">{{item['fundName']}}（{{item['fundCode']}}）</div>
                </div>
              </div>
            </div>
          </a-card>
        </a-col>

      </a-row>
    </template>
  </page-layout>
</template>

<script>
import PageLayout from '@/layouts/PageLayout'
import { Chart } from '@antv/g2';
import {mapState} from 'vuex'
import {request, METHOD} from '@/utils/request'

export default {
  name: 'FundChart',
  components: {PageLayout},
  i18n: require('./i18n'),
  data () {
    return {
      fundData: [

      ],
      loading: true,
    }
  },
  computed: {
    ...mapState('account', {currUser: 'user'}),
    ...mapState('setting', ['lang'])
  },
  created() {

  },
  mounted () {
    const __this = this;
    request('http://localhost:7003/fund/fundReal/getFundRealData', METHOD.GET).then(res => {
      this.loading = false
      const data = res.data.data;
      for (const obj in data) {
        __this.fundData.push({'fundCode': data[obj]['fundCode'], 'fundName': data[obj]['fundName']})
      }
      this.$nextTick(function () {
        for (const obj in data) {
          const chart = new Chart({
            container: data[obj]['fundCode'],
            autoFit: true,
            height: 500,
            width: 600,
            padding: [20, 20, 95, 80]
          });

          chart.data(data[obj]['fundRealList']);
          chart.scale({
            'gztime': {
              tickCount: 10
            },
            'gszzl': {
              tickCount: 10
            }
          });
          chart.axis('gztime', {
            tickLine: null,
            label: {
              autoRotate: false,
              autoHide: false, // 取消自动隐藏label
              formatter (text) {
                // 字符太长添加省略号
                return `${text.slice(10, text.length)}`;
              }
            }
          });
          // 配置自定义tooltip
          chart.tooltip({
            showContent: true,
            showTitle: true,
            containerTpl: '<div class="g2-tooltip"><div class="g2-tooltip-title"></div><div class="g2-tooltip-list"></div></div>',
            itemTpl: '<div class="g2-tooltip-item">' +
                    '<div class="g2-tooltip-marker"></div>' +
                    '<div class="g2-tooltip-name" style="margin-bottom: 15px">估算涨跌百分比：{b}</div>' +
                    '<div class="g2-tooltip-value"></div>' +
                    '</div>'
          });
          chart.line().position('gztime*gszzl').tooltip('gztime*gszzl', (a, b) => {
            return {a, b}
          });
          chart.render();
        }
      })
    })
  }
}
</script>

<style lang="less">
@import "index";
</style>
