<template>

  <div class="wrapper container">
    <h1>Altiris Package Source Query
      <a class="h5" target="_blank" style="color: rgb(51, 122, 183); white-space: nowrap;" href="http://sdhelp.nasa.group.atlascopco.com/display/IS/Symantec+Management+Platform++Infrastructure+Server+List">&#9745;Altiris Server List</a></h1><br><br>
    <form class="form-horizontal" id="site-form" @submit.prevent="GetPkgList">
      <div class="row">

        <div class="col-sm-6 col-sm-offset-3">
          <input class="form-control" id="qword" type="text" v-model.trim="query" :disabled="searching" placeholder="Enter a package name, e.g. image, driver, jabber, chrome" required>
          <span class="loader-circle input-spinner hidden" id="spinner"></span>
        </div>

        <div class="col-sm-3">
          <h5 :class="errMsg.class">{{ errMsg.text }}</h5>
        </div>

      </div>

    </form>
    <div class="panel">&nbsp;</div>
    <div id="site-body" class="row container">
      <transition-group name="move-fade">
      <table v-for="pkg in pkgs" class="table table-hover table-striped" :key="pkg">
        <colgroup>
          <col width="10%"></col>
        </colgroup>
        <tbody>
          <tr class="info">
            <th>Name</th><td v-text="pkg.Name"></td>
          </tr>
          <tr>
            <th>Size</th><td v-text="(pkg.Size/1048576).toFixed(2) + 'M'"></td>
          </tr>
          <tr>
            <th>PkgId</th><td v-text="pkg.PackageId"></td>
          </tr>
          <tr>
            <th>UNC</th><td v-text="pkg.UNC"></td>
          </tr>
          <tr>
            <th>URL</th><td>
                <a class="tips" :href="pkg.URL" target="_blank">{{ pkg.URL }}
                <span>Replace the server name with your local altiris server will get faster download speed.</span>
                </a></td>
          </tr>
        </tbody>
      </table>
      </transition-group>
    </div>
  </div>

</template>

<script>
  export default {
    name: 'PkgList',
    data () {
      return {
        pkgs: [],
        query: '',
        searching: false,
        errMsg: {
          class: '',
          text: ''
        }
      }
    },
    methods: {
      GetPkgList () {
        if(this.query == '') {
          this.errMsg.class = 'text-danger'
          this.errMsg.text = 'Please input your query.'
          return
        }

        this.errMsg.text = 'Searching...'
        this.searching = true
        $.getJSON('http://itcs.apac.group.atlascopco.com/api/altiris/pkglist?pkg=' + this.query)
        .done((data) => {
          if(data.error){
            this.errMsg.class = 'text-danger'
            this.errMsg.text = 'Query error!'
          }else{
            this.pkgs = [].concat(data)
            this.errMsg.class = 'text-success'
            this.errMsg.text = 'Found records: ' + this.pkgs.length
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
      if (this.$store.state.pkgs !== undefined) {
        this.query = this.$store.pkgq
        this.pkgs = JSON.parse(JSON.stringify(this.$store.state.pkgs))
      }
    },
    beforeDestroy() {
      this.$store.pkgq = this.query
      this.$store.state.pkgs = JSON.parse(JSON.stringify(this.pkgs))
    },
    mounted () {
      $('#qword').focus()
      this.sTitle = $('input[name=k]:checked').attr('title')
    }
  }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
a.tips {
  position: relative;
  display: inline;
}
a.tips span {
  position: absolute;
  width:305px;
  padding: 7px;
  color: #FFFFFF;
  background: #000000;
  height: 60px;
  line-height: 20px;
  visibility: hidden;
  border-radius: 6px;
}
a.tips span:after {
  content: '';
  position: absolute;
  top: 100%;
  left: 20%;
  margin-left: -8px;
  width: 0; height: 0;
  border-top: 8px solid #000000;
  border-right: 8px solid transparent;
  border-left: 8px solid transparent;
}
a:hover.tips span {
  visibility: visible;
  opacity: 0.8;
  bottom: 50px;
  left: 20%;
  z-index: 999;
}
</style>
