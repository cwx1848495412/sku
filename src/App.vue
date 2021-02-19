<template>
  <div class="main">
    <center style="margin-top: 50px">
      添加规格名:<input ref="specName" value=""/>
      <button @click="addSpecName">添加规格名</button>
      <br/>

      <table border="1" style="margin-top: 50px" width="820px">
        <tr>
          <td>规格名</td>
          <td>规格值</td>
          <td>操作</td>
        </tr>
        <tr v-for="(item,index) in dbAttrList" :key="index">
          <td>{{ item.specName }}</td>
          <td>
            <label v-for="(valItem,i) in item.specValue" :key="i">
              <input type="checkbox" @click="changeAttrList($event,item.specName,valItem)">{{ valItem }}
            </label>
          </td>
          <td>
            <input ref="specValue" value=""/>
            <button @click="addSpecValue(item.specValue,index)">添加规格值</button>
          </td>
        </tr>
      </table>
    </center>

    <table border="1" style="margin-top: 50px">
      <tr>
        <td>序号</td>
        <td v-for="(item,index) in columnList" :key="index">{{ item }}</td>
        <td>库存</td>
        <td>价格</td>
        <td>销量</td>
      </tr>

      <tr v-for="(item,index) in tableList" :key="index+'/'">
        <td>{{ index + 1 }}</td>
        <td :key="i+'?'"
            v-for="(detailBodyInfo,i) in item.tdList"
            :rowspan="detailBodyInfo.rowSpan"
            v-show="detailBodyInfo.rowSpanShow"
        >
          {{ detailBodyInfo.value }}
        </td>
        <td>{{ item.stock }}</td>
        <td>{{ item.price }}</td>
        <td>{{ item.salesVolume }}</td>
      </tr>
    </table>

  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  mounted() {
    // this.generatorSkuList()
  },
  data() {
    return {
      dbAttrList: [],
      // 规格列表
      attrList: [
        // {
        //   specName: "颜色",
        //   specValue: ["红色", "黄色", "蓝色"]
        // },
        // {
        //   specName: "尺码",
        //   specValue: ["小码", "中码", "大码"]
        // },
        // {
        //   specName: "品牌",
        //   specValue: ["苹果", "小米", "华为"]
        // },
        // {
        //   specName: "口味",
        //   specValue: ["焦糖", "牛奶"]
        // },
        // {
        //   specName: "温度",
        //   specValue: ["常温", "冰镇", "热饮"]
        // },
      ],
      // 表头展示列
      columnList: [],
      // sku表格结构
      tableList: [
        // 定义数据结构-想办法进行拼装
        // {
        //   tdList: [
        //     {name: '颜色', value: '红色', rowSpan: 1, rowSpanShow: true},
        //   ],
        //   stock: 100,
        //   price: 200,
        //   salesVolume: 500
        // },
      ],
    }
  },
  methods: {
    generatorSkuList() {
      this.columnList = []
      this.tableList = []
      for (let i = 0; i < this.attrList.length; i++) {
        this.tableList = this.addColumn(this.tableList, this.attrList[i].specName, this.attrList[i].specValue)
      }
    },
    addColumn(dataList, specName, specValue) {
      this.columnList = [specName, ...this.columnList]
      let newDataList = []
      for (let i = 0; i < specValue.length; i++) {
        if (dataList.length === 0) {
          newDataList.push({
            tdList: [{name: specName, value: specValue[i], rowSpan: 1, rowSpanShow: true}],
            stock: 100,
            price: 200,
            salesVolume: 300
          })
          continue
        }
        for (let j = 0; j < dataList.length; j++) {
          newDataList.push({
            tdList: [{
              name: specName,
              value: specValue[i],
              rowSpan: dataList.length,
              rowSpanShow: j === 0 ? true : false
            }, ...dataList[j].tdList],
            stock: dataList[j].stock,
            price: dataList[j].price,
            salesVolume: dataList[j].salesVolume
          })
        }
      }
      return newDataList
    },
    addSpecName() {
      this.dbAttrList.push({
        specName: this.$refs.specName.value,
        specValue: []
      })
      this.$refs.specName.value = ''
    },
    addSpecValue(speValArr, index) {
      speValArr.push(this.$refs.specValue[index].value)
      this.$refs.specValue[index].value = ''
    },
    changeAttrList(event, name, val) {
      let checked = event.target.checked
      if (checked) {
        this.addAttrList(name, val)
      } else {
        this.removeAttrList(name, val)
      }
      this.generatorSkuList()
    },
    addAttrList(name, val) {
      for (let i = 0; i < this.attrList.length; i++) {
        if (this.attrList[i].specName === name) {
          this.attrList[i].specValue.push(val)
          return
        }
      }
      this.attrList.push({
        specName: name,
        specValue: [val]
      })
    },
    removeAttrList(name, val) {
      for (let i = 0; i < this.attrList.length; i++) {
        if (this.attrList[i].specName === name) {
          this.attrList[i].specValue.splice(this.attrList[i].specValue.indexOf(val), 1)
          if (this.attrList[i].specValue.length === 0) {
            this.attrList.splice(i, 1)
          }
          return
        }
      }
    }
  }



  // ============================================================第一轮================================
  // ============================================================第二轮================================
  // {
  //   tdList: [
  //     {name: '颜色', value: '红色'},
  //     {name: '尺码', value: '小'},
  //   ],
  //   stock: 100,
  //   price: 200,
  //   salesVolume: 500
  // },
  // {
  //   tdList: [
  //     {name: '颜色', value: '红色'},
  //     {name: '尺码', value: '大'},
  //   ],
  //   stock: 100,
  //   price: 200,
  //   salesVolume: 500
  // },

}
</script>

<style scoped>
.main table {
  margin: auto;
  text-align: center;
}

td {
  width: 100px;
}
</style>
