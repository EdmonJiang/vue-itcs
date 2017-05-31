<template>

  <div class="wrapper container">
    <h1>Global Site Infomation Query</h1><br><br>
    <form class="form-horizontal" id="site-form" @submit.prevent="GetSiteInfo">
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
              <input type="radio" name="k" id="SiteID" value="site" @click="SetPlaceHolder" title="Please enter a SiteID, like chn049, CHN056" checked>
              SiteID</label>
            <label class="radio-inline">
              <input type="radio" name="k" id="SiteCity" value="city" @click="SetPlaceHolder" title="Please enter a city name, like nanjing, wilrijk">
              SiteCity
            </label>
              <label class="radio-inline">
                <input type="radio" name="k" id="IP" value="ip" @click="SetPlaceHolder" title="Please enter an ip address">
                IP</label>
          </div>
        </div>
      </div>

    </form>

    <div id="site-body" class="row container">
      <transition-group name="move-fade">
      <table v-for="site in sites" class="table table-hover table-striped" :key="site">
        <colgroup>
          <col width="20%"></col>
        </colgroup>
        <tbody>
          <tr>
            <th>SiteID</th><td v-text="site.SiteID"></td>
          </tr>
          <tr>
            <th>SiteCity</th><td v-text="site.SiteCity"></td>
          </tr>
          <tr>
            <th>SiteCountry</th><td v-text="site.SiteCountry"></td>
          </tr>
          <tr>
            <th>SiteRegion</th><td v-text="site.SiteRegion"></td>
          </tr>
          <tr>
            <th>MainContactMail</th><td v-text="site.MainContactMail"></td>
          </tr>
          <tr>
            <th>SiteAddress</th><td v-text="site.SiteAddress"></td>
          </tr>
          <tr>
            <th>SiteName</th><td v-text="site.SiteName"></td>
          </tr>
          <tr>
            <th>Subnets</th><td v-text="site.Subnets.toString()"></td>
          </tr>
        </tbody>
      </table>
      </transition-group>
    </div>
  </div>

</template>

<script>
  import $ from 'jquery'
  export default {
    name: 'Home',
    data () {
      return {
        sites: [],
        query: '',
        sTitle: 'Please enter a SiteID, like chn049, CHN056',
        searching: false,
        errMsg: {
          class: '',
          text: ''
        }
      }
    },
    methods: {
      GetSiteInfo () {
        if(this.query == '') {
          this.errMsg.class = 'text-danger'
          this.errMsg.text = 'Please input your query.'
          return
        }

        this.errMsg.text = 'Searching...'
        this.searching = true
        var q = $('#site-form').serialize()
        $.getJSON('http://itcs.apac.group.atlascopco.com/api/site?' + q)
        .done((data) => {
          if(data.error){
            this.errMsg.class = 'text-danger'
            this.errMsg.text = 'Query error!'
          }else{
            this.sites = [].concat(data)
            this.errMsg.class = 'text-success'
            this.errMsg.text = 'Found records: ' + this.sites.length
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
        this.sTitle = e.target.title;
      }
    },
    mounted () {
      $('#qword').focus()
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
