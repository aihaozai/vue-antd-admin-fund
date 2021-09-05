<template>
    <div style="width: 100%" v-if="options.length>0">
    <div   v-for="(item,index) in options " :key="index" style="width:100%; display: flex">
        <div style="float: left;display: flex; width: 100%" >
            <a-col style="width: 100%">
                <a-checkbox-group  style="width:100%;height: 100%;">
                    <a-row  style="width: 100%;height: 100%;display: flex">
                        <a-col :span="24" style="padding: 5px;width: 100%;border-style: solid;border-width: 1px;border-color: #8080801f;">
                            <div style="margin-left: 8px;">
                                <a-checkbox  @change="onChange" :value="item.value" >{{item.label}}</a-checkbox>
                            </div>
                            <div style="margin-top: 10px; margin-left: 8px;" v-if="item.authority.length>0">
                                <a-checkbox style="margin-left: 0px;" v-for="(v,i) in item.authority " :key="i"  @change="change" :value="v.value" >{{v.label}}</a-checkbox>
                            </div>
                        </a-col>
                    </a-row>
                </a-checkbox-group>
            </a-col>
        </div>
        <authority-view :options="item.children" v-if="item.children.length"/>
    </div>
    </div>
</template>

<script>
// import {request, METHOD} from '@/utils/request'
// import {info} from '@/utils/notificationUtil'
import _ from 'lodash';

let menuList =  [],authorityList = [];
export default {
    name: 'AuthorityView',
    i18n: require('./i18n'),
    props: {
        options: {
            type: Array ,
            default: null
        },
    },
    data () {
        return {
        }
    },
    created() {
        menuList =  [],authorityList = [];
    },
    methods: {
        onChange(e) {
            if(e.target.checked){
                menuList.push(e.target.value)
            }else{
                _.remove(menuList,(o)=>{return o === e.target.value});
            }

        },
        change(e) {
            if(e.target.checked){
                authorityList.push(e.target.value)
            }else{
                _.remove(authorityList,(o)=>{return o === e.target.value});
            }
        },
        getData(){
            return {'authorityList': authorityList, 'menuList': menuList};
        }
    }
}
</script>

<style lang="less" scoped>
    @import "index";
</style>
