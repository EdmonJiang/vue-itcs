<template>
  <div class="wrapper container-fluid">
    <div class="container">
      <h1>AC Staff Information Query</h1><br><br>
      <form class="form-horizontal" id="site-form" @submit.prevent="GetEmps">
        <div class="row">

          <div class="col-sm-6 col-sm-offset-3">
            <input class="form-control" id="qword" type="text" name="v" v-model.trim="query" :disabled="searching" :placeholder="sTitle" required>
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
                <input type="radio" name="k" id="AdMail" value="AdMail" @click="SetPlaceHolder" checked title="firstname.lastname or firstname.lastname@xx.atlascopco.com" :checked="empOpt === 'AdMail'">Email</label>
              <label class="radio-inline">
                <input type="radio" name="k" id="OperationalManagerAdMail" value="OperationalManagerAdMail" @click="SetPlaceHolder" title="Search team member's by manager's email address" :checked="empOpt === 'OperationalManagerAdMail'">Manager's email</label>
              <label class="radio-inline">
                  <input type="radio" name="k" id="LocalJobTitle" value="LocalJobTitle" @click="SetPlaceHolder" title="Search employees by local job title" :checked="empOpt === 'LocalJobTitle'">Local Job Title</label>
              <label class="radio-inline">
                <input type="radio" name="k" id="CostCenter" value="CostCenter" @click="SetPlaceHolder" title="Search employees by Cost Center" :checked="empOpt === 'CostCenter'">Cost Center</label>
              <label class="radio-inline">
                <input type="radio" name="k" id="Department" value="Department" @click="SetPlaceHolder" title="Search employees by department name" :checked="empOpt === 'Department'">Department</label>
            </div>
          </div>
        </div>

      </form>
    </div>
    <div id="site-body">
      <table class="table table-striped table-hover table-condensed">
        <colgroup>
          <col width="20%">
        </colgroup>
        <tbody>
          <tr>
            <th>Email Address</th>
            <th>City</th>
            <th>Division</th>
            <th>Local Job Title</th>
            <th>Department</th>
            <th>Manager</th>
            <th>Cost Center</th>
            <th>FAM Code legal</th>
            <th>Company FAM Code</th>
            <th>Company Name</th>
          </tr>
          <tr v-for="emp in emps" :key="emp">
            <td>
              <span v-text="emp.AdMail"></span>
              <a class="tips tips-n icon-jabber" v-show="emp.AdMail" :href="'im:' + emp.AdMail" aria-label="Contact by jabber"></a></td>
            <td v-text="emp.LocationCity"></td>
            <td v-text="emp.Division"></td>
            <td v-text="emp.LocalJobTitle"></td>
            <td v-text="emp.Department"></td>
            <td v-text="emp.OperationalManager.split('/')[0]"></td>
            <td v-text="emp.CostCenter"></td>
            <td v-text="emp.FamCodeLegalUnit"></td>
            <td v-text="emp.CompanyFamCode"></td>
            <td v-text="emp.CompanyName"></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'staff',
    data() {
      return {
        emps: [],
        query: '',
        empOpt: 'AdMail',
        sTitle: 'firstname.lastname or firstname.lastname@xx.atlascopco.com',
        searching: false,
        errMsg: {
          class: '',
          text: ''
        }
      }
    },
    methods: {
      GetEmps() {
        if(this.query == '') {
          this.errMsg.class = 'text-danger'
          this.errMsg.text = 'Please input your query.'
          return
        }

        this.errMsg.text = 'Searching...'
        this.searching = true
        var q = $('#site-form').serialize()
        $.getJSON('http://itcs.apac.group.atlascopco.com/api/staff?' + q)
        .done((data) => {
          if(data.error){
            this.errMsg.class = 'text-danger'
            this.errMsg.text = 'Query error!'
          }else{
            this.emps = data || []
            this.errMsg.class = 'text-success'
            this.errMsg.text = 'Found records: ' + this.emps.length
          }
        })
        .fail(() => {
          this.errMsg.class = 'text-danger'
          this.errMsg.text = 'Failed to connect server, please try later!'
        })
        .always(() => {
          this.searching = false
        })
      },
      SetPlaceHolder(e) {
        this.sTitle = e.target.title
        this.empOpt = e.target.value
      }
    },
    created() {
      if (this.$store.state.emps !== undefined) {
        this.query = this.$store.empq
        this.empOpt = this.$store.empOpt
        this.emps = JSON.parse(JSON.stringify(this.$store.state.emps))
      }
    },
    beforeDestroy() {
      this.$store.empq = this.query
      this.$store.empOpt = this.empOpt
      this.$store.state.emps = JSON.parse(JSON.stringify(this.emps))
    },
    mounted () {
      $('#qword').focus()
      this.sTitle = $('input[name=k]:checked').attr('title')
    }
  }

</script>

<style>

</style>