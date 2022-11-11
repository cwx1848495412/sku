<template>
  <div>
    <label v-for="(valItem,index) in commoditySpecs" :key="index">
      <label>{{ valItem.title }}</label>
      <span class="btn" v-for="(val,i) in valItem.list" :key="i"
            :class="{
              option: optionSpecs.indexOf(val) > -1,
              active: specsS.indexOf(val) > -1
            }"
            @click="handleClick(optionSpecs.indexOf(val) > -1, val, index)"
      >
        {{ val }}
      </span>
      <br>
    </label>
  </div>
</template>

<script>
export default {
  name: 'AdjoinSku',
  components: {},
  data() {
    return {
      vertex: [],
      quantity: 0,
      // 一维数组
      adjoinArray: [],
      optionSpecs: [],
      specsS: [],
      data: [
        {id: '1', specs: ['紫色', '套餐一', '64G']},
        {id: '2', specs: ['紫色', '套餐一', '128G']},
        {id: '3', specs: ['紫色', '套餐二', '128G']},
        {id: '4', specs: ['黑色', '套餐三', '256G']},
      ],

      commoditySpecs: [
        {title: '颜色', list: ['红色', '紫色', '白色', '黑色']},
        {title: '套餐', list: ['套餐一', '套餐二', '套餐三', '套餐四']},
        {title: '内存', list: ['64G', '128G', '256G']}
      ]

    }
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.vertex = this.commoditySpecs.reduce((total, current) => [
        ...total,
        ...current.list,
      ], []);

      this.quantity = this.vertex.length;
      this.adjoinArray = Array.from({length: this.quantity * this.quantity});


      // 单规格矩阵创建
      this.initCommodity();
      // 同类顶点创建
      this.initSimilar();

      this.optionSpecs = this.querySpecsOptions(null);

    },
    getVertexRow(id) {
      const index = this.vertex.indexOf(id);
      const col = [];
      this.vertex.forEach((item, pIndex) => {
        col.push(this.adjoinArray[index + this.quantity * pIndex]);
      });
      return col;
    },

    getAdjoinVertexs(id) {
      return this.getVertexRow(id).map((item, index) => (item ? this.vertex[index] : '')).filter(Boolean);
    },

    setAdjoinVertexs(id, sides) {
      const pIndex = this.vertex.indexOf(id);
      sides.forEach((item) => {
        const index = this.vertex.indexOf(item);
        this.adjoinArray[pIndex * this.quantity + index] = 1;
      });
    },

    getRowTotal(params) {
      params = params.map(id => this.getVertexRow(id));
      console.log("getRowToatl", params);
      const adjoinNames = [];
      this.vertex.forEach((item, index) => {
        const rowtotal = params.map(value => value[index]).reduce((total, current) => {
          total += current || 0;
          return total;
        }, 0);
        adjoinNames.push(rowtotal);
      });
      console.log("adjoinNames", adjoinNames);
      return adjoinNames;
    },

    // 交集
    getUnions(params) {
      const row = this.getRowTotal(params);
      // [0, 5, 0, 3, 4, 3, 3, 0, 3, 4, 3]
      return row.map((item, index) => item >= params.length && this.vertex[index]).filter(Boolean);
    },

    // 并集
    getCollection(params) {
      params = this.getRowTotal(params);
      const filter = params.map((item, index) => item && this.vertex[index]).filter(Boolean);
      return filter;
    },

    initCommodity() {
      this.data.forEach((item) => {
        this.applyCommodity(item.specs);
      });
    },

    initSimilar() {
      // 获得所有可选项
      const specsOption = this.getCollection(this.vertex);
      console.log("specsOption", specsOption);
      this.commoditySpecs.forEach((item) => {
        const params = [];
        item.list.forEach((value) => {
          if (specsOption.indexOf(value) > -1) params.push(value);
        });
        // 同级点位创建
        this.applyCommodity(params);
      });


      this.logLine()
      console.log("initSimilar");
      for (let i = 0; i < this.adjoinArray.length; i += 11) {
        let str = "";
        for (let j = i; j - i < 11; j++) {
          str += this.adjoinArray[j] || 0;
        }
        console.log(str);
      }
      this.logLine()
    },

    applyCommodity(params) {
      params.forEach((param) => {
        this.setAdjoinVertexs(param, params);
      });
    },
    querySpecsOptions(params) {
      if (params == null) {
        return this.getCollection(this.vertex);
      }

      const filterArr = params.filter(Boolean);

      if (filterArr.length === 0) {
        return this.getCollection(this.vertex);
      }

      return this.getUnions(filterArr);
    },
    handleClick(bool, text, index) {
      if (this.specsS[index] !== text && !bool) return;
      this.specsS[index] = this.specsS[index] === text ? '' : text;
      this.optionSpecs = this.querySpecsOptions(this.specsS);
    },
    logLine() {
      console.log("================")
    }
  }
}
</script>

<style scoped>
.btn {
  display: inline-block;
  margin-left: 10px;
  margin-bottom: 10px;
  background: gray;
  cursor: pointer;
  user-select: none;
}

.active {
  background: red !important;
}

.option {
  background: greenyellow;
}
</style>
