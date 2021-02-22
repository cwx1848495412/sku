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

      <button style="margin-top: 20px" @click="generatorChooseNameValue">生成SKU选项卡</button>
      <h1>{{ showData }}</h1>
      <table border="1" style="margin: 50px 0px 500px 50px" width="820px">
        <tr v-for="(item,index) in chooseNameValueList" :key="index">
          <td>{{ item.specName }}</td>
          <td>
            <label v-for="(valItem,i) in item.specValue" :key="i">
              <input type="button"
                     :value="valItem.name"
                     :class="{ greyChecked:valItem.greyChecked, active:valItem.isActive }"
                     @click="changeSelectedStatus(index,i)"
              >
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
      notic: 'Not Selected',
      dbAttrList: [],
      // 规格列表
      attrList: [
        // {
        //   specName: "颜色",
        //   specValue: ["红", "黄", "蓝"]
        // },
        // {
        //   specName: "尺码",
        //   specValue: ["小", "中", "大"]
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
      // 选择页面用到的规格名和值数组 用于页面样式的调整
      chooseNameValueList: [
        // {
        //   specName: "颜色",
        //   isActive: false,
        //   specValue: [
        //     {
        //       name: "红色",
        //       isActive: false,
        //       greyChecked: false,
        //     }
        //   ],
        // }
      ],
      allKeySet: {
        // '红':1,
        // '小':1,
      },
      selectedNodes: [
        // {
        // 选中层级索引
        //   nodeIndex:specNameIndex,
        //   nodeName: specValueName
        // }
      ],
      showData: ''
    }
  },
  mounted() {
    this.showData = this.notic
    // this.generatorTestData()
    // this.generatorSkuList()
  },
  methods: {
    // 生成测试数据
    generatorTestData() {
      this.dbAttrList = [
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
        }
      ]
      this.generatorChooseNameValue()
    },

    // =============生成SKU笛卡尔积的部分=============
    // 生成SKU列表
    generatorSkuList() {
      this.columnList = []
      this.tableList = []
      for (let i = 0; i < this.attrList.length; i++) {
        this.tableList = this.addColumn(this.tableList, this.attrList[i].specName, this.attrList[i].specValue)
      }
    },
    // 添加列
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
    // 添加规格名
    addSpecName() {
      this.dbAttrList.push({
        specName: this.$refs.specName.value,
        specValue: []
      })
      // let specName = this.$refs.specName.value
      // this.radioSeleckedKeys = {...this.radioSeleckedKeys, [specName]: ''}
      this.$refs.specName.value = ''
    },
    // 添加规格值
    addSpecValue(speValArr, index) {
      speValArr.push(this.$refs.specValue[index].value)
      this.$refs.specValue[index].value = ''
    },
    // 修改选中属性，生成拼装输入框数据
    changeAttrList(event, name, val) {
      let checked = event.target.checked
      if (checked) {
        this.addAttrList(name, val)
      } else {
        this.removeAttrList(name, val)
      }
      this.generatorSkuList()
    },
    // 添加选中数据
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
    // 移除选中数据
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


    // =============生成SKU选项卡的部分=============
    // 生成SKU选项卡的规格名-规格值信息
    generatorChooseNameValue() {
      this.chooseNameValueList = []
      for (let i = 0; i < this.dbAttrList.length; i++) {
        let newData = {
          specName: this.dbAttrList[i].specName,
          isActive: false,
          specValue: []
        }

        for (let j = 0; j < this.dbAttrList[i].specValue.length; j++) {
          newData.specValue.push({
            name: this.dbAttrList[i].specValue[j],
            greyChecked: false,
            isActive: false
          })
        }

        this.chooseNameValueList.push(newData)
      }

      // 生成所有键名集合
      this.generatorAllKeySet()
      // 初始化灰选
      this.initGreyChecked()
    },
    // 生成组合键的所有子集
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

      for (const key in keySet) {
        let keyArr = key.split('-')
        let allSet = this.all(keyArr)
        for (let i = 1; i < allSet.length; i++) {
          let keyName = allSet[i].join('-')
          this.allKeySet[keyName] = this.allKeySet[keyName] === undefined ? keySet[key] : this.allKeySet[keyName] + keySet[key]
        }
      }
    },
    // 修改SKU选项卡的选中状态
    changeSelectedStatus(nameIndex, valIndex) {
      let currentSpecValueList = this.chooseNameValueList[nameIndex].specValue;
      // 处理选中样式
      this.handlerCheckedStyle(currentSpecValueList, valIndex)
      // 找出选中节点
      this.handlerSelectedNodes()

      // 如果没有任何节点选中 恢复默认样式
      if (this.selectedNodes.length === 0) {
        this.handlerDefaultStyle()
        return
      }

      // 开始处理交互样式

      // 待测试节点
      let waitCheckNode = [];
      for (let i = 0; i < this.chooseNameValueList.length; i++) {
        for (let j = 0; j < this.chooseNameValueList[i].specValue.length; j++) {
          // 我现在点的这个，之外的其他元素 全部扔进去 测试
          if (this.chooseNameValueList[nameIndex].specValue[valIndex].name != this.chooseNameValueList[i].specValue[j].name) {
            waitCheckNode.push({
              waitNameIndex: i, waitValIndex: j,
            });
          }
        }
      }

      console.log('waitCheckNode', waitCheckNode)

      for (let i = 0; i < waitCheckNode.length; i++) {
        let testAttrNames = [];
        // 当前行选中元素
        let currentRowSelected = "";
        for (let k = 0; k < this.chooseNameValueList[waitCheckNode[i].waitNameIndex].specValue.length; k++) {
          if (this.chooseNameValueList[waitCheckNode[i].waitNameIndex].specValue[k].isActive == true) {
            currentRowSelected = this.chooseNameValueList[waitCheckNode[i].waitNameIndex].specValue[k].name;
          }
        }

        if (currentRowSelected != "") {
          for (let j = 0; j < this.selectedNodes.length; j++) {
            (this.selectedNodes[j].nodeName != currentRowSelected) && testAttrNames.push(this.selectedNodes[j]);
          }
        } else {
          testAttrNames = [...this.selectedNodes]
        }

        // testAttrNames = testAttrNames.concat(this.chooseNameValueList[waitCheckNode[i].waitNameIndex].specValue[waitCheckNode[i].waitValIndex].name)
        let tempVar = {
          nodeIndex: waitCheckNode[i].waitNameIndex,
          nodeName: this.chooseNameValueList[waitCheckNode[i].waitNameIndex].specValue[waitCheckNode[i].waitValIndex].name
        }
        testAttrNames = [...testAttrNames, tempVar]

        testAttrNames.sort(this.compare('nodeIndex'))

        let tempData = []
        for (let x = 0; x < testAttrNames.length; x++) {
          tempData.push(testAttrNames[x].nodeName)
        }
        if (!this.allKeySet[tempData.join('-')]) {
          this.chooseNameValueList[waitCheckNode[i].waitNameIndex].specValue[waitCheckNode[i].waitValIndex].greyChecked = true;
          this.chooseNameValueList[waitCheckNode[i].waitNameIndex].specValue[waitCheckNode[i].waitValIndex].isActive = false;
        } else {
          this.chooseNameValueList[waitCheckNode[i].waitNameIndex].specValue[waitCheckNode[i].waitValIndex].greyChecked = false;
        }

      }
    },
    // 处理SKU选项卡的选中样式
    handlerCheckedStyle(currentSpecValueList, valIndex) {
      if (currentSpecValueList[valIndex].greyChecked === true) return

      if (currentSpecValueList[valIndex].isActive === true) {
        currentSpecValueList[valIndex].isActive = false
        return
      }

      // 取消其他按钮选中
      currentSpecValueList.forEach((item) => {
        item.isActive = false
      })

      // 设置本节点选中
      currentSpecValueList[valIndex].isActive = true;
    },
    // 生成SKU选项卡的选中集合
    handlerSelectedNodes() {
      this.selectedNodes = []
      for (let i = 0; i < this.chooseNameValueList.length; i++) {
        for (let j = 0; j < this.chooseNameValueList[i].specValue.length; j++) {
          if (this.chooseNameValueList[i].specValue[j].isActive === true) {
            this.selectedNodes.push({
              nodeIndex: i,
              nodeName: this.chooseNameValueList[i].specValue[j].name
            });
          }
        }
      }
      console.log(this.selectedNodes)
    },
    // 撤销至SKU选项卡的默认样式
    handlerDefaultStyle() {
      for (let i = 0; i < this.chooseNameValueList.length; i++) {
        for (let j = 0; j < this.chooseNameValueList[i].specValue.length; j++) {
          if (this.allKeySet[this.chooseNameValueList[i].specValue[j].name]) {
            this.chooseNameValueList[i].specValue[j].greyChecked = false;
          } else {
            this.chooseNameValueList[i].specValue[j].greyChecked = true;
            this.chooseNameValueList[i].specValue[j].isActive = false;
          }
        }
      }
      this.showData = this.notic
    },
    // 初始化SKU选项卡的无库存置灰
    initGreyChecked() {
      for (let i = 0; i < this.chooseNameValueList.length; i++) {
        for (let j = 0; j < this.chooseNameValueList[i].specValue.length; j++) {
          if (this.allKeySet[this.chooseNameValueList[i].specValue[j].name] == null) {
            this.chooseNameValueList[i].specValue[j].greyChecked = true;
          }
        }
      }
    },
    // 生成组合键所有子集的工具类
    all(arr) {
      // 借鉴大佬代码
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
    // 比较器工具类
    compare(property) {
      return function (a, b) {
        return a[property] - b[property];
      }
    },
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

.greyChecked {
  background: #999999;
  color: white;
}

.active {
  background: red;
  color: white;
}
</style>
