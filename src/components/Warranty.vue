<template>
  <div class="wrapper container-fluid">
    <div class="container">
        <h1>DELL Warranty Information Query</h1><br><br>
        <form
          class="clearfix form-horizontal" id="site-form" @submit.prevent="GetDellInfo">
          <div class="row">
            <div class="col-sm-6 col-sm-offset-3 search-box">
              <div class="input-group"><input class="form-control" id="qword" type="text" name="sn" v-model.trim="query" :disabled="searching" placeholder="Single or Multiple DELL service tags, Tag1,Tag2... separated by ','" required>
                <div class="input-group-btn"><button class="btn btn-default dropdown-toggle" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"><span class="caret"></span><span class="sr-only">Toggle Dropdown</span></button>
                  <ul class="dropdown-menu dropdown-menu-right">
                    <li><a href="javascript:void(0)" @click="GetExpressCode">Find Express Service Code</a></li>
                    </ul>
                </div>
              </div>
            </div>
            <div class="col-sm-3">
              <h5 :class="errMsg.class">{{ errMsg.text }}</h5>
            </div>
          </div>
          </form>
          <div class="panel">&nbsp;</div>
          <transition name="slide-fade">
          <div id="site-body">
          <div v-for="asset in assetbody">
            <div class="info-box" id="assetheader" v-show="asset.AssetHeaderData">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>Service Tag</th>
                    <th>Ship Date</th>
                    <th>Country Code</th>
                    <th>Description</th>
                    <th>Drivers</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td v-text="asset.AssetHeaderData.ServiceTag"></td>
                    <td v-text="asset.AssetHeaderData.ShipDate.replace('T',' ')"></td>
                    <td v-text="asset.AssetHeaderData.CountryLookupCode"></td>
                    <td v-text="asset.AssetHeaderData.MachineDescription"></td>
                    <td>
                      <a :href="driverlink + asset.AssetHeaderData.ServiceTag + '/drivers/advanced'" target="_blank">
                        <span class="icon-download"></span>
                        Download
                      </a>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="info-box" id="assetdata" v-show="asset.AssetEntitlementData">
              <table class="table table-bordered table-striped table-hover">
                <thead>
                  <tr>
                    <th>Service</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="entitle in asset.AssetEntitlementData">
                    <td v-text="entitle.ServiceLevelDescription"></td>
                    <td v-text="entitle.StartDate.replace('T',' ')"></td>
                    <td v-text="entitle.EndDate.replace('T',' ')"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          </div>
          </transition>
      </div>
    </div>
  </div>
</template>

<script>
  import modal from './Modal'
  export default {
    name: 'warranty',
    data() {
      return {
        assetbody: [],
        driverlink: 'http://www.dell.com/support/home/us/en/19/product-support/servicetag/',
        query: '',
        query2: '',
        searching: false,
        errMsg: {
          class: '',
          text: ''
        },
        errMsg2: {
          class: '',
          text: ''
        }
      }
    },
    methods: {
      Validate() {
        if (this.query == '') {
            this.errMsg.class = 'text-danger'
            this.errMsg.text = 'Please input your query.'
            return false
        } else if (this.query.split(',').every((item)=>{return /^[0-9a-zA-Z]{7}$/.test(item) === true}) === false) {
            this.errMsg.class = "text-danger";
            this.errMsg.text = "The service tag is invalid.";
            return false
        }
        return true
      },
      GetDellInfo() {
        if (this.Validate() === false) {
            return
        }

        this.errMsg.text = 'Searching...'
        this.searching = true
        var q = $('#site-form').serialize()
        $.getJSON('http://itcs.apac.group.atlascopco.com/api/warranty/dell?' + q)
        .done((data) => {
          if(data.error){
            this.errMsg.class = 'text-danger'
            this.errMsg.text = 'Query error!'
          }else{
            this.assetbody = [].concat(data.AssetWarrantyResponse)
            this.errMsg.class = 'text-success'
            this.errMsg.text = 'Found records: ' + this.assetbody.length
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
      GetExpressCode() {
        if (this.Validate() === false) {
          return
        }
        
        if(/^[0-9a-zA-Z]{7},/.test(this.query) === true){
          this.errMsg.class = "text-danger";
          this.errMsg.text = "Only one SN for query express tag.";
          return
        }else if(/^[0-9a-zA-Z]{7}$/.test(this.query) === false){
          this.errMsg.class = "text-danger";
          this.errMsg.text = "The service tag is invalid.";
          return
        }

        this.errMsg.text = 'Searching...'
        this.searching = true
        var q = $('#site-form').serialize()
        $.getJSON('http://itcs.apac.group.atlascopco.com/api/warranty/express?' + q)
        .done((data) => {
          if(data.error){
            this.errMsg.class = 'text-danger'
            this.errMsg.text = 'Query error!'
          }else{
            this.errMsg.class = 'text-success'
            this.errMsg.text = 'Express Tag: ' + data.ExpressServiceTag
          }
        })
        .fail(() => {
          this.errMsg.class = 'text-danger'
          this.errMsg.text = 'Failed to connect server, please try later!'
        })
        .always(() => {
          this.searching = false
        })
      }
    },
    created() {
      if (this.$store.state.assetbody !== undefined) {
        this.query = this.$store.snq
        this.assetbody = JSON.parse(JSON.stringify(this.$store.state.assetbody))
      }
    },
    beforeDestroy() {
      this.$store.snq = this.query
      this.$store.state.assetbody = JSON.parse(JSON.stringify(this.assetbody))
    },
    mounted () {
      $('#qword').focus()
      if(new Date().getTimezoneOffset() === -480){
        this.driverlink = 'http://www.dell.com/support/home/cn/zh/19/product-support/servicetag/'
      }
    }
  }

</script>

<style scoped>
.result_left {
    margin-left: 50px;
    float: left;
    width: 300px;
}
.result_right {
    margin-left: 50px;
    float: left;
    width: 700px;
}
</style>
