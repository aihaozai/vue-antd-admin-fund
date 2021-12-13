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

<script>
import { Chart } from '@antv/g2';
import {mapState} from 'vuex'
import {request, METHOD} from '@/utils/request'

export default {
  name: 'FundChart',
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
    request( process.env.VUE_APP_API_BASE_URL_FUND + '/fundReal/getFundRealData', METHOD.GET).then(res => {
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
              tickCount: 6
            },
            'gszzl': {
              tickCount: 6,
              ticks: data[obj]['yaxis']
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
          chart.line().position('gztime*gszzl').color("l(90) 0:#ff0000 0.5:#7ec2f3 1:#ff0000").tooltip('gztime*gszzl', (a, b) => {
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
