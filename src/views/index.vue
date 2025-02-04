<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <template #header><Cpu style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">CPU</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf"><div class="cell">属性</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">值</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">核心数</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.cpu">{{ server.cpu.cpuNum }}</div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">用户使用率</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.cpu">{{ server.cpu.used }}%</div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">系统使用率</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.cpu">{{ server.cpu.sys }}%</div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">当前空闲率</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.cpu">{{ server.cpu.free }}%</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header><Tickets style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">内存</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <table cellspacing="0" style="width: 100%;">
              <thead>
                <tr>
                  <th class="el-table__cell is-leaf"><div class="cell">属性</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">内存</div></th>
                  <th class="el-table__cell is-leaf"><div class="cell">JVM</div></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">总内存</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.mem">{{ server.mem.total }}G</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ server.jvm.total }}M</div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">已用内存</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.mem">{{ server.mem.used}}G</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ server.jvm.used}}M</div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">剩余内存</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.mem">{{ server.mem.free }}G</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm">{{ server.jvm.free }}M</div></td>
                </tr>
                <tr>
                  <td class="el-table__cell is-leaf"><div class="cell">使用率</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.mem" :class="{'text-danger': server.mem.usage > 80}">{{ server.mem.usage }}%</div></td>
                  <td class="el-table__cell is-leaf"><div class="cell" v-if="server.jvm" :class="{'text-danger': server.jvm.usage > 80}">{{ server.jvm.usage }}%</div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="card-box">
        <el-card>
          <template #header><PieChart style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">命令统计</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="commandstats" style="height: 420px" />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="card-box">
        <el-card>
          <template #header><Odometer style="width: 1em; height: 1em; vertical-align: middle;" /> <span style="vertical-align: middle;">内存信息</span></template>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="usedmemory" style="height: 420px" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { getServer } from '@api/monitor/server'
import { getCache } from '@api/monitor/cache';
import * as echarts from 'echarts';

const server = ref([]);
const cache = ref([]);
const { proxy } = getCurrentInstance();
const commandstats = ref(null);
const usedmemory = ref(null);

function getList() {
  proxy.$modal.loading("正在加载服务监控数据，请稍候！");
  getServer().then(response => {
    server.value = response.data;
    proxy.$modal.closeLoading();
  });
  getCache().then(response => {
    proxy.$modal.closeLoading();
    cache.value = response.data;
    const commandstatsIntance = echarts.init(commandstats.value, "macarons");
    commandstatsIntance.setOption({
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      series: [
        {
          name: "命令",
          type: "pie",
          roseType: "radius",
          radius: [15, 95],
          center: ["50%", "38%"],
          data: response.data.commandStats,
          animationEasing: "cubicInOut",
          animationDuration: 1000
        }
      ]
    });
    const usedmemoryInstance = echarts.init(usedmemory.value, "macarons");
    usedmemoryInstance.setOption({
      tooltip: {
        formatter: "{b} <br/>{a} : " + cache.value.info.used_memory_human
      },
      series: [
        {
          name: "峰值",
          type: "gauge",
          min: 0,
          max: 1000,
          detail: {
            formatter: cache.value.info.used_memory_human
          },
          data: [
            {
              value: parseFloat(cache.value.info.used_memory_human),
              name: "内存消耗"
            }
          ]
        }
      ]
    })
    window.addEventListener("resize", () => {
      commandstatsIntance.resize();
      usedmemoryInstance.resize();
    });
  })
}

getList();
</script>
