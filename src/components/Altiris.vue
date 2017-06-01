<template>
  <div class="wrapper container-fluid">
    <div class="container">
    <h1>Altiris PC Information Query</h1><br><br>
    <form class="form-horizontal" id="site-form" @submit.prevent="Search">
      <div class="row">

        <div class="col-sm-6 col-sm-offset-3">
          <input class="form-control" id="qword" type="text" name="v" v-model="query" :disabled="searching" :placeholder="sTitle" required>
          <span class="loader-circle input-spinner hidden" id="spinner"></span>
        </div>

        <div class="col-sm-3">
          <h5 :class="errMsg.class">{{ errMsg.text }}</h5>
        </div>

      </div>

      <div class="row">
        <div class="col-sm-10 col-sm-offset-1">
          <div class="panel">
            <label class="radio-inline">
              <input type="radio" name="k" id="pcname" value="pcname" @click="SetPlaceHolder" title="^abcd' starts with 'abcd', 'abcd$' ends with 'abcd'" :checked="pcOpt === 'pcname'">
              Computer Name</label>
            <label class="radio-inline">
              <input type="radio" name="k" id="aduser" value="aduser" @click="SetPlaceHolder" title="Enter a windows logon name, '^abcd' starts with 'abcd', 'abcd$' ends with 'abcd'" :checked="pcOpt === 'aduser'">
              Windows Logon Name
            </label>
          </div>
        </div>
      </div>

    </form>
    </div>
    <div id="site-body">
      <table class="table table-striped table-hover table-condensed">
        <tbody>
          <tr>
            <th>PC Name</th>
            <th>Primary User</th>
            <th>PC Domain</th>
            <th>OS Name</th>
            <th>Computer Model</th>
            <th>Serial Number</th>
            <th>TPM Activated</th>
            <th>Encryption</th>
            <th>IP Address</th>
            <th>Last Connected</th>
          </tr>
          <tr v-for="pc in pcs">
            <td>
              <a data-toggle="modal" data-target=".table-modal" data-backdrop="static" href="#" v-text="pc.pc" @click="GetSWDetails(pc.pc,pc.domain,pc.user)"></a>
            </td>
            <td>
              <a data-toggle="modal" data-target=".table-modal" data-backdrop="static" href="#" v-text="pc.user" @click="GetUserDetails(pc.user)"></a>
            </td>
            <td v-text="pc.domain"></td>
            <td v-text="pc.os"></td>
            <td v-text="pc.model"></td>
            <td>
              <a data-toggle="modal" data-target=".table-modal" data-backdrop="static" href="#" v-text="pc.sn" @click="GetSNDetails(pc.sn)"></a>
            </td>
            <td v-text="pc.tpm"></td>
            <td v-text="pc.encry"></td>
            <td v-text="pc.ip"></td>
            <td v-text="new Date(+pc.log.match(/\d+/)[0]).toLocaleString()"></td>
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
        :click-handler="GetPCList"
        :prev-text="'Prev'"
        :next-text="'Next'"
        :container-class="'pagination'"
        :page-class="'page-item'">
      </paginate>

    </div>
    <modal :title="title" :modalClass="'modal-lg'">
      <div  slot="tablebody">
        <p>
          <strong>Filter:&nbsp;</strong>
          <input id="txtFilter" type="text" v-model="kword" @keyup="Filter"/>
        </p>
        <table id="tblbody" class="table table-striped table-hover table-condensed"></table>
      </div>
    </modal>
  </div>
</template>

<script>
import paginate from './Paginate'
import modal from './Modal'
export default {
  name: 'altiris',
  data () {
    return {
        pcs: [],
        query: '',
        pcOpt: 'pcname',
        sTitle: "Enter a computer name, '^abcd' starts with 'abcd', 'abcd$' ends with 'abcd'",
        searching: false,
        pagecount: 0,
        total: 0,
        curPage: undefined,
        initPage: 0,
        title: 'Details',
        kword: '',
        qword: '',
        errMsg: {
          class: '',
          text: ''
        }
    }
  },
  methods: {
      Search() {
        this.curPage = 0
        this.GetPCList(1)
      },
      GetPCList(pageNum) {
        if(this.query == '') {
          this.errMsg.class = 'text-danger'
          this.errMsg.text = 'Please input your query.'
          return
        }

        this.errMsg.text = 'Searching...'
        this.searching = true
        var q = $('#site-form').serialize()

        $.getJSON('http://itcs.apac.group.atlascopco.com/api/altiris?p=' + pageNum + '&' + q)
        .done((data) => {
          if(data.error){
            this.errMsg.class = 'text-danger'
            this.errMsg.text = 'Query error!'
          }else{
            this.pcs = data.items || []
            this.total = data.total
            this.pagecount = Math.ceil(this.total / 10)
            this.errMsg.class = 'text-success'
            this.errMsg.text = 'Found records: ' + data.total
          }
        })
        .fail(() => {
          this.errMsg.class = 'text-danger'
          this.errMsg.text = 'Failed to connect server, please try later!'
        })
        .always(() => {
          this.searching = false
          this.curPage = undefined
        })
      },
      GetSNDetails(sn) {

        this.title = 'Warranty Information - ' + sn
        this.kword = ''
        $("#tblbody").html('<tr><th class="text-primary">Loading... Please wait</th></tr>')

        $.getJSON('http://itcs.apac.group.atlascopco.com/api/warranty/dell?sn=' + sn)
        .done((data) => {
          if(data.error){
            $("#tblbody").html('<tr><th class="text-danger">Failed to get data.</th></tr>')
          }else{
            var details = data.AssetWarrantyResponse[0] ? data.AssetWarrantyResponse[0].AssetEntitlementData : []
            this.json2table("tblbody", details, ["ServiceLevelDescription", "StartDate", "EndDate"])
            $("#txtFilter").focus()
          }
        })
        .fail(() => {
          $("#tblbody").html('<tr><th class="text-danger">Failed to get data.</th></tr>')
        })
      },
      GetSWDetails(pc, domain, user) {

        this.title = 'Installed Software List - ' + pc
        this.kword = ''
        $("#tblbody").html('<tr><th class="text-primary">Loading... Please wait</th></tr>')

        $.getJSON('http://itcs.apac.group.atlascopco.com/api/altiris/softlist/' + pc + '?domain=' + domain + '&user=' + user)
        .done((data) => {
          if(data.error){
            $("#tblbody").html('<tr><th class="text-danger">Failed to get data.</th></tr>')
          }else{
            var details = data
            this.json2table("tblbody", details, ["SW Name", "Version", "Publisher","Installed Date"])
            $("#txtFilter").focus()
          }
        })
        .fail(() => {
          $("#tblbody").html('<tr><th class="text-danger">Failed to get data.</th></tr>')
        })
      },
      GetUserDetails(gad) {

        this.title = 'AD User Information - ' + gad
        this.kword = ''
        $("#tblbody").html('<tr><th class="text-primary">Loading... Please wait</th></tr>')

        $.getJSON('http://itcs.apac.group.atlascopco.com/api/user?grou=no&k=gad&v=' + gad)
        .done((data) => {
          if(data.error){
            $("#tblbody").html('<tr><th class="text-danger">Failed to get data.</th></tr>')
          }else{
            var details = data
            this.json2table("tblbody", details, ['sAMAccountName', 'cn', 'description', 'mail', 'userPrincipalName', 'telephoneNumber', 'title', 'manager', 'department', 'company', 'location', 'accountStatus', 'whenCreated', 'whenChanged', 'lastLogged'])
            setTimeout(function() {
              $("#txtFilter").focus()
            }, 500)
          }
        })
        .fail(() => {
          $("#tblbody").html('<tr><th class="text-danger">Failed to get data.</th></tr>')
        })
      },
      json2table(tableId, data, fields, callback){

        var divTable = document.getElementById(tableId);

            if(!divTable){return;}
            divTable.innerHTML = ""

            if($.isPlainObject(data)){
                var tbody = ""
                $.each(fields, function (index, item) {
                    tbody += "<tr><th>" + item + "</th><td>" + data[item] + "</td>></tr>"
                })
                divTable.innerHTML = tbody;

            } else if(Array.isArray(data) && data.length>0){
                
                var tbl_head = document.createElement('thead');
                var tbl_body = document.createElement('tbody');
                var tbl_row = tbl_head.insertRow();
                
                fields.forEach(function(v){
                    tbl_row.appendChild(document.createElement('th')).appendChild(document.createTextNode(v));
                })

                tbl_head.appendChild(tbl_row);
                // create tbody
                $.each(data, function(key, v){
                    var tbl_row = tbl_body.insertRow();
                    
                    fields.forEach(function(title){
                        tbl_row.insertCell().appendChild(document.createTextNode(v[title]));
                    })
                })
                
                if(callback){
                    callback(tbl_body);
                }
                
                divTable.appendChild(tbl_head);
                divTable.appendChild(tbl_body);
            } else {
                divTable.innerHTML = data
            }                         
            
      },
      SetPlaceHolder(e) {
        this.sTitle = e.target.title
        this.pcOpt = e.target.value
      },
      Filter() {
          var keyword = this.kword
          if( keyword != ""){
          var reg = new RegExp(keyword, 'i');
          $('#tblbody tr').hide().filter(function(){return $(this).text().match(reg)}).show();
          }else{
          $('#tblbody tr').show();
          }
      }
    },
    created() {
      if (this.$store.state.pcs !== undefined) {
        this.query = this.$store.pcq
        this.pcOpt = this.$store.pcOpt
        this.pcs = JSON.parse(JSON.stringify(this.$store.state.pcs))
        this.pagecount = this.$store.pagecount
        this.total = this.$store.total
        this.initPage = this.$store.initPage
      }
    },
    beforeDestroy() {
      this.$store.pcq = this.query
      this.$store.pcOpt = this.pcOpt
      this.$store.state.pcs = JSON.parse(JSON.stringify(this.pcs))
      this.$store.pagecount = this.pagecount
      this.$store.total = this.total
      this.$store.initPage = this.$refs.pager.selected
    },
    mounted () {
      $('#qword').focus()
      this.sTitle = $('input[name=k]:checked').attr('title')
    },
    components: {
      paginate,
      modal
    }
}
</script>

<style>

</style>
