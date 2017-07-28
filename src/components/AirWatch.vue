<template>
  <div class="container" style="margin-top:79px">
    <span class="h1">AirWatch Catalog&nbsp;</span>
    <a href="https://ds556.awmdm.com/MyDevice/Login?ReturnUrl=%2fMyDevice%2fLanding%2f" target="_blank">Self-Service Portal</a>
    <div class="pull-right">
      <button class="btn btn-primary" type="button" @click="Search" :disabled="searching">Search</button>&nbsp;&nbsp;
      <button class="btn btn-primary" type="button" @click="Clear">Clear Filters</button></div>
    <div v-show="searching" style="position:relative;width:10vmin;margin:0 auto">
      <div class="loader-circle"></div>
      <div class="cover"></div>
    </div>
    <div class="info-box">
      <table class="table table-bordered table-striped table-hover table-condensed">
        <colgroup>
          <col>
          <col width="15%">
          <col width="15%">
          <col width="15%">
          <col>
          <col width="13%">
        </colgroup>
        <thead>
          <tr class="label-primary aw-title">
            <th class="sort-title" @click="Sort('eml')">
              Email&nbsp;
              <span v-show="q.sort === 'eml'">⇧</span>
              <span v-show="q.sort === 'emld'">⇩</span>
            </th>
            <th class="sort-title" @click="Sort('cn')">
              Country
              <span v-show="q.sort === 'cn'">⇧</span>
              <span v-show="q.sort === 'cnd'">⇩</span>
            </th>
            <th class="sort-title" @click="Sort('co')">
              Company FAM Code
              <span v-show="q.sort === 'co'">⇧</span>
              <span v-show="q.sort === 'cod'">⇩</span>
            </th>
            <th class="sort-title" @click="Sort('fam')">
              Legal FAM Code
              <span v-show="q.sort === 'fam'">⇧</span>
              <span v-show="q.sort === 'famd'">⇩</span>
            </th>
            <th>Enroll Status</th>
            <th>Devices Count</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><input id="eml" type="text" class="form-control" v-model="q.eml" @keyup.enter="Search" placeholder="'abc' for 'xxabcxx', '^abc' starts with 'abc'"></td>
            <td><input type="text" class="form-control" v-model="q.cn" @keyup.enter="Search"></td>
            <td><input type="text" class="form-control" v-model="q.co" @keyup.enter="Search"></td>
            <td><input type="text" class="form-control" v-model="q.fam" @keyup.enter="Search"></td>
            <td>
              <select class="form-control" v-model="q.ebl">
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </td>
            <td><input type="text" class="form-control" v-model="q.no" placeholder="'1', '[1-2]'" @keyup.enter="Search"></td>
          </tr>

          <tr v-for="user in users" :key="user">
            <td>
              <a data-toggle="modal" data-target=".table-modal"  href="#" v-text="user.eml" @click="GetUserDetails(user.eml)"></a>
            </td>
            <td v-text="user.cn"></td>
            <td v-text="user.co"></td>
            <td v-text="user.fam"></td>
            <td v-text="user.ebl"></td>
            <td>
              <router-link :to="'/devices?email=' + user.eml" v-if="!!user.no">
                <span class="label label-success tips tips-n" v-text="user.no" aria-label="Open device details"></span>
              </router-link>
              <span class="label label-default" v-else>0</span>
            </td>
          </tr>
          
        </tbody>
      </table>

      <paginate
        ref="pager"
        :page-count="pagecount"
        :initialPage="initPage"
        :page-range="3"
        :margin-pages="2"
        :forcePage="curPage"
        :click-handler="GetPageData"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'">
      </paginate>

      <span class="pull-right" style="line-height: 34px"><strong>total: {{ total }}</strong></span>

    </div>
    <modal :title="title" :modalClass="'modal-md'">
      <table id="tblbody" slot="tablebody" class="table table-striped table-hover table-condensed"></table>
    </modal>
  </div>
</template>

<script>
  import paginate from './Paginate'
  import modal from './Modal'
  export default {
    name: 'AirWatch',
    data () {
      return {
        searching: false,
        q: {
          eml: '',
          cn: '',
          co: '',
          fam: '',
          ebl: 'True',
          no: '',
          p: 1,
          sort: 'eml'
        },
        pagecount: 0,
        total: 0,
        curPage: undefined,
        initPage: 0,
        title: "User Details - ",
        users: []
      }
    },
    methods: {
      Sort (s) {
        if(this.q.sort.slice(0,2) === s.slice(0,2)){
          if(this.q.sort === s){
            this.q.sort += 'd'
          } else {
            this.q.sort = s
          }
        } else{
          this.q.sort = s
        }

        this.LoadData()
      },
      Search() {
        this.q.p = 1
        this.curPage = 0
        this.LoadData()
      },
      Clear() {
        this.q.eml = ''
        this.q.cn = ''
        this.q.co = ''
        this.q.fam = ''
        this.q.ebl = 'True'
        this.q.no = ''
      },
      GetUserDetails(eml) {
        this.title = 'User Details - ' + eml
        $("#txtFilter").val("")
        $("#tblbody").html('<tr><th class="text-primary">Loading... Please wait</th></tr>')
        
        $.getJSON('http://itcs.apac.group.atlascopco.com/api/airwatch/user?eml=' + eml)
        .done((data) => {
          if(data.error){
            $("#tblbody").html('<tr><th class="text-danger">Failed to get data.</th></tr>')
          }else{
            data.EnrolledDevicesCount = data.EnrolledDevicesCount === "" ? 0 : data.EnrolledDevicesCount
            data.LastScanned = new Date(data.LastScanned.match(/\d+/)[0]).toLocaleString()
            if($.isPlainObject(data)){
              var tbody = ""
              $.each(data, function (k, v) {
                  tbody += "<tr><th>" + k + "</th><td>" + v + "</td>></tr>"
              })
              $("#tblbody").html(tbody);
              setTimeout(function() {
                $("#txtFilter").focus()
              }, 500)
            }else{
              $("#tblbody").html('<tr><th class="text-danger">Failed to get data.</th></tr>')
            }
          }
        })
        .fail(() => {
          $("#tblbody").html('<tr><th class="text-danger">Failed to get data.</th></tr>')
        })
      },
      LoadData() {
        this.searching = true
        $.getJSON('http://itcs.apac.group.atlascopco.com/api/airwatch/invoice', this.q)
       .done((data) =>{
          this.users = data.items || []
          this.total = data.total
          this.pagecount = Math.ceil(this.total / 10)
        })
        .fail(() => {
          this.users = [{ cn: "Failed to load data..." }]
        })
        .always(() => {
          this.searching = false
          this.curPage = undefined
        })
      },
      GetPageData (pageNum){
        this.q.p = pageNum
        this.storePage = pageNum
        this.LoadData()
      }
    },
    created() {
      if (this.$store.state.users === undefined) {
        this.LoadData()
      }else{
        this.users = JSON.parse(JSON.stringify(this.$store.state.users))
        this.pagecount = this.$store.pagecount
        this.total = this.$store.total
        this.initPage = this.$store.initPage
        this.q.eml = this.$store.eml
        this.q.cn = this.$store.cn
        this.q.co = this.$store.co
        this.q.fam = this.$store.fam
        this.q.ebl = this.$store.ebl
        this.q.no = this.$store.no
      }
    },
    beforeDestroy() {
      this.$store.state.users = JSON.parse(JSON.stringify(this.users))
      this.$store.pagecount = this.pagecount
      this.$store.total = this.total
      this.$store.initPage = this.$refs.pager.selected
      this.$store.eml = this.q.eml
      this.$store.cn = this.q.cn
      this.$store.co = this.q.co
      this.$store.fam = this.q.fam
      this.$store.ebl = this.q.ebl
      this.$store.no = this.q.no
    },
    mounted () {
      $('#eml').focus()
    },
    components: {
      paginate,
      modal
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.pagination {
    margin: 0;
}

.cover {
    position: fixed;
    padding: 0;
    margin: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,.5);
}

.info-box {
  margin-top: 15px;
}

.info-box tr td:nth-child(n+3) {
  text-align: center;
}

.aw-title {
  color: #fff;
}

.info-box .sort-title {
    cursor: pointer;
}
</style>
