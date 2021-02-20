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
          <td><input v-model.number="item.stock" type="number"/></td>
          <td>{{ item.price }}</td>
          <td>{{ item.salesVolume }}</td>
        </tr>
      </table>

      <button style="margin-top: 20px" @click="generatorAllKeySet">生成generatorAllKeySet</button>
      <table border="1" style="margin-top: 50px" width="820px">
        <tr v-for="(item,index) in attrList" :key="index">
          <td>{{ item.specName }}</td>
          <td>
            <label v-for="(valItem,i) in item.specValue" :key="i">
              <input type="radio"
                     v-model="radioSeleckedKeys[item.specName]"
                     :name="item.specName"
                     :disabled="isDisable()"
                     :value="valItem"
                     @click="changeGrey()"
              >{{ valItem }}
              <!--              $event,item.specName,valItem-->
            </label>
          </td>
        </tr>
      </table>
    </center>
  </div>
</template>

<script>
export default {
  name: 'App',
  components: {},
  data() {
    return {
      dbAttrList: [],
      // 规格列表
      attrList: [
        {
          specName: "颜色",
          specValue: ["红", "黄", "蓝"]
        },
        {
          specName: "尺码",
          specValue: ["小", "中", "大"]
        },
        {
          specName: "品牌",
          specValue: ["苹果", "小米", "华为"]
        },
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
      allKeySet: {
        // '红':1,
        // '小':1,
      },
      radioSeleckedKeys: {}
    }
  },
  mounted() {
    this.generatorSkuList()
    // console.log(JSON.parse(JSON.stringify(this.tableList)))
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
            stock: 0,
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

      let specName = this.$refs.specName.value
      this.radioSeleckedKeys = {...this.radioSeleckedKeys, [specName]: ''}

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
    },
    generatorAllKeySet() {
      this.allKeySet = {}
      let keySet = {
        // '红-小': 1,
      }
      for (var i = 0; i < this.tableList.length; i++) {
        if (this.tableList[i].stock <= 0) continue
        let len = this.tableList[i].tdList.length
        let keyArr = []
        for (let j = len - 1; j >= 0; j--) {
          keyArr.push(this.tableList[i].tdList[j].value)
        }
        keySet[keyArr.join('-')] = this.tableList[i].stock
      }
      console.log(keySet)

      for (const key in keySet) {
        let keyArr = key.split('-')
        let allSet = this.all(keyArr)
        console.log(allSet)
        for (let i = 1; i < allSet.length; i++) {
          let keyName = allSet[i].join('-')
          this.allKeySet[keyName] = this.allKeySet[keyName] === undefined ? keySet[key] : this.allKeySet[keyName] + keySet[key]
        }
      }

      console.log(this.allKeySet)

    },
    all(arr) { // 借鉴大佬代码
      let result = [];
      for (let i = 0; i < (1 << arr.length); i++) { // 数组的长度为二进制的位数
        let test = [];
        for (let j = 0; j < arr.length; j++) { // 遍历二进制的值
          if (i & (1 << j)) { // 值为0、1、2、4、8、16, 其中0为空集
            test.push(arr[j]); // i与二进制数进行按位与运算，不为0就说明是数组的一个值
          }
        }
        result.push(test);
      }
      return result;
    },
    isDisable() {
      return false;
    },
    changeGrey() {
      // event, name, val
      // console.log(event.target.checked, name, val)
      // this.radioSeleckedKeys[name] = val
      // console.log(Object.keys(this.radioSeleckedKeys),this.radioSeleckedKeys[name])


      console.log(typeof this.radioSeleckedKeys)
      // console.log(this.radioSeleckedKeys.length)
      // for (let i = 0; i < this.radioSeleckedKeys.length; i++) {
      //   console.log('--'+this.radioSeleckedKeys[i])
      // }
      /*console.log(JSON.parse(JSON.stringify(this.radioSeleckedKeys)))*/
    }
  }
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
