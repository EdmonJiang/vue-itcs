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
      <table v-for="(pkg, i) in pkgs" class="table table-hover table-striped" :key="pkg">
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
            <th>UNC</th><td>
              <span :id="'unc' + i" v-text="pkg.UNC"></span>
              <button v-if="pkg.UNC" class="tips tips-e" @blur="ResetTip($event)" :data-clipboard-target="'#unc' + i" aria-label="Copy to clipboard" type="button"><span class="icon-clippy"></span></button>
              </td>
          </tr>
          <tr>
            <th>URL</th><td>
                <a class="tips tips-multi tips-ne" v-text="pkg.URL" :href="pkg.URL" target="_blank" aria-label="Replace the server name with your local altiris server to get faster download speed.">
                </a></td>
          </tr>
        </tbody>
      </table>
      </transition-group>
    </div>
  </div>

</template>

<script>
  import Clipboard from 'clipboard'
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
            var clipboard = new Clipboard('.tips')
            clipboard.on('success', function(e) {
              e.trigger.attributes['aria-label'].value = 'Copied!'
              e.clearSelection();
            });
            clipboard.on('error', function(e) {
              e.trigger.attributes['aria-label'].value = 'Press Ctrl+C to copy'
            })
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
      },
      ResetTip(e) {
        e.currentTarget.attributes['aria-label'].value = 'Copy to clipboard'
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
</style>
