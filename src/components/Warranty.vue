<template>
  <div class="wrapper container-fluid">
    <div class="container">
        <h1>DELL Warranty Information Query</h1><br><br>
        <form
          class="clearfix form-horizontal" id="site-form" @submit.prevent="GetDellInfo">
          <div class="row">
            <div class="col-sm-6 col-sm-offset-3 search-box">
              <input class="form-control" id="qword" type="text" name="sn" v-model="query" :disabled="searching" @input="ConvertDellSN" placeholder="Single or Multiple DELL service tags, Tag1,Tag2... separated by ','" required>
            </div>
            <div class="col-sm-3">
              <h5 :class="errMsg.class">{{ errMsg.text }}</h5>
            </div>
          </div>
          </form>
          <div class="panel">&nbsp;</div>
          <div id="site-body">
          <transition-group name="up">
          <div v-for="asset in assetbody" :key="asset">
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
                  <tr v-for="entitle in asset.AssetEntitlementData" :key="entitle">
                    <td v-text="entitle.ServiceLevelDescription"></td>
                    <td v-text="entitle.StartDate.replace('T',' ')"></td>
                    <td v-text="entitle.EndDate.replace('T',' ')"></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          </transition-group>
        
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
      ConvertDellSN(){
        var strSN = this.query.replace(/[^A-Za-z0-9,]/g, "")
        this.query = strSN
        var ArrSN = strSN.split(",")
        var ArrTag = ArrSN.map((item, index)=>{
          return this.Tag_to_ESC(item)
        })
        this.errMsg.text = 'Express Tag: ' + ArrTag.join(',')
      },
      Tag_to_ESC(DellSN)
      {
        var i,WDashes,tmp,tmpn;

        tmp = "";
        tmpn = 0;
        tmpn = this.BN2N(DellSN,36);
      
        tmp = tmpn.toString();
        WDashes = "";
        for(i=0;i<tmp.length;i++) {
            WDashes += tmp.charAt(i);
            // if(i && ((i+1) < tmp.length) && !((i+1)%3) ) {
            //     WDashes += "-";
            // }
        }
        return(WDashes);
      },
      BN2N(InN, Base) {
        var toKs, i, j, tmp, m, numb, vDec, dsz;
        var digs = new Array();
        toKs = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

        tmp = InN.toUpperCase();
        j = tmp.length - 1;
        for (i = 0; i < tmp.length; i++) {
            digs[i] = tmp.substr(i, 1);
        }
        digs.reverse();
        numb = 0;
        dsz = digs.length;
        for (i = 0; i < dsz; i++) {
            if (!i) {
                m = 1;
            } else {
                m = Math.pow(Base, i);
            }
            vDec = toKs.indexOf(digs[i]);
            numb += (m * vDec);
        }
        return ( numb) ;
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

<style>

</style>
