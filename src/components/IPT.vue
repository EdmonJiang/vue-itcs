<template>
  <div class="wrapper container-fluid">
    <div class="container">
      <h1>IPT Information Query
        <a class="h5" href="https://10.86.140.101/ucmuser/main" target="_blank" style="color:#337ab7;white-space: nowrap">&#9743;Self-Care Portal</a>  
      </h1><br><br>
      <form class="form-horizontal" id="site-form" @submit.prevent="GetIPTInfo">
        <div class="row">

          <div class="col-sm-6 col-sm-offset-3">
            <input class="form-control" id="qword" type="text" name="eml" v-model.trim="query" :disabled="searching" placeholder="firstname.lastname or firstname.lastname@xx.atlascopco.com" required>
            <span class="loader-circle input-spinner hidden" id="spinner"></span>
          </div>

          <div class="col-sm-3">
            <h5 :class="errMsg.class">{{ errMsg.text }}</h5>
          </div>
        </div>
      </form>
      <div class="panel">&nbsp;</div>
    </div>

    <transition name="fade">
      <div style="overflow: auto;" v-html="iptdata" v-if="t" kew="1"></div>
      <div style="overflow: auto;" v-html="iptdata" v-else key="0"></div>
    </transition>
  </div>

</template>

<script>
export default {
  name: 'ipt',
  data() {
      return {
        iptdata: '',
        query: '',
        searching: false,
        t: true,
        errMsg: {
          class: '',
          text: ''
        }
      }
    },
    methods: {
      GetIPTInfo() {
        if(this.query == '') {
          this.errMsg.class = 'text-danger'
          this.errMsg.text = 'Please input your query.'
          return
        }

        this.errMsg.text = 'Searching...'
        this.searching = true
        var q = $('#site-form').serialize()
        $.get('http://itcs.apac.group.atlascopco.com/api/ipt?' + q)
        .done((data) => {
            this.iptdata = data
            this.t = !this.t
            var tr = data.match(/<tr.*?(?=>)(.|\n)*?<\/tr>/g);
            this.errMsg.class = 'text-success'
            this.errMsg.text = 'Found records: ' + (tr ? tr.length : 0)
        })
        .fail((data) => {
          this.errMsg.class = 'text-danger'
          this.errMsg.text = 'Failed to connect server, please try later!'
        })
        .always(() => {
          this.searching = false
        })
      }
    },
    created() {
      if (this.$store.state.iptdata !== undefined) {
        this.query = this.$store.iptq
        this.iptdata = JSON.parse(JSON.stringify(this.$store.state.iptdata))
      }
    },
    beforeDestroy() {
      this.$store.iptq = this.query
      this.$store.state.iptdata = JSON.parse(JSON.stringify(this.iptdata))
    },
    mounted () {
      $('#qword').focus()
    }
}
</script>

<style>

</style>
