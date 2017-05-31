<template>
  <div class="wrapper container">
    <h1>AD User Information Query</h1><br><br>
    <form class="form-horizontal" id="site-form" @submit.prevent="GetUser">
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
              <input type="radio" name="k" id="upn" value="upn" @click="SetPlaceHolder" title="firstname.lastname or firstname.lastname@xx.atlascopco.com" :checked="userOpt === 'upn'">
              Email Address</label>
            <label class="radio-inline">
              <input type="radio" name="k" id="gad" value="gad" @click="SetPlaceHolder" title="Please enter a windows logon account" :checked="userOpt === 'gad'">
              Windows Logon Name
            </label>
          </div>
        </div>
      </div>

    </form>
    <transition name="move-fade">
    <div id="site-body" v-show="user.sAMAccountName">
        <ul class="nav nav-tabs" style="border-bottom: 0">
          <li class="active"><a class="optionsTab" href="#tab1" data-toggle="tab" aria-expanded="true">Account</a></li>
          <li><a class="optionsTab" href="#tab2" data-toggle="tab" aria-expanded="false">Organization</a></li>
          <li><a class="optionsTab" href="#tab3" data-toggle="tab" aria-expanded="false">MemberOf</a></li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane active" id="tab1">
            <table class="table table-striped table-hover">
              <tbody>
                <tr>
                  <th>sAMAccountName</th>
                  <td v-text="user.sAMAccountName"></td>
                </tr>
                <tr>
                  <th>cn</th>
                  <td v-text="user.cn"></td>
                </tr>
                <tr>
                  <th>name</th>
                  <td v-text="user.name"></td>
                </tr>
                <tr>
                  <th>displayName</th>
                  <td v-text="user.displayName"></td>
                </tr>
                <tr>
                  <th>description</th>
                  <td v-text="user.discription"></td>
                </tr>
                <tr>
                  <th>mail</th>
                  <td v-text="user.mail"></td>
                </tr>
                <tr>
                  <th>userPrincipalName</th>
                  <td>
                    <span v-text="user.userPrincipalName"></span>
                    <span v-show="user.userPrincipalName">
                      <a class="icon-jabber" :href="'im:' + user.userPrincipalName"></a>&nbsp;
                      <a class="icon-mail_send" :href="'mailto:' + user.userPrincipalName"></a>
                    </span></td>
                </tr>
                <tr>
                  <th>telephoneNumber</th>
                  <td v-text="user.telephoneNumber"></td>
                </tr>
                <tr>
                  <th>accountStatus</th>
                  <td v-text="user.accountStatus"></td>
                </tr>
                <tr>
                  <th>dn</th>
                  <td v-text="user.dn"></td>
                </tr>
                <tr>
                  <th>whenCreated</th>
                  <td v-text="user.whenCreated"></td>
                </tr>
                <tr>
                  <th>whenChanged</th>
                  <td v-text="user.whenChanged"></td>
                </tr>
                <tr>
                  <th>lastLogged</th>
                  <td v-text="user.lastLogged"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tab-pane" id="tab2">
            <table class="table table-striped table-hover">
              <tbody>
                <tr>
                  <th>title</th>
                  <td v-text="user.title"></td>
                </tr>
                <tr>
                  <th>manager</th>
                  <td v-text="user.manager"></td>
                </tr>
                <tr>
                  <th>department</th>
                  <td v-text="user.department"></td>
                </tr>
                <tr>
                  <th>company</th>
                  <td v-text="user.company"></td>
                </tr>
                <tr>
                  <th>location</th>
                  <td v-text="user.location"></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="tab-pane" id="tab3">
            <table class="table table-striped table-hover">
              <tbody>
                <tr>
                  <td><strong>Filter:&nbsp;</strong><input type="text" v-model="fword">&nbsp;
                    <button @click="user.memberOf.reverse()">⇅</button>
                    <span>(Below is the list of all nested groups the user belongs to)</span>
                  </td>
                </tr>
                <tr v-for="group in filterGroup">
                  <td v-text="group"></td>
                </tr>              
              </tbody>
            </table>
          </div>
        </div>
    </div>
    </transition>
  </div>
</template>

<script>
  export default {
    name: 'ad',
    data() {
      return {
        user: {
          memberOf: []
        },
        k: 'upn',
        query: '',
        userOpt: 'upn',
        sTitle: 'firstname.lastname or firstname.lastname@xx.atlascopco.com',
        searching: false,
        fword: '',
        errMsg: {
          class: '',
          text: ''
        }
      }
    },
    computed: {
      filterGroup() {
        return this.user.memberOf.filter((g) => {
          return g.toUpperCase().indexOf(this.fword.toUpperCase()) > -1
        })
      }
    },
    methods: {
      GetUser() {
        if(this.query == '') {
          this.errMsg.class = 'text-danger'
          this.errMsg.text = 'Please input your query.'
          return
        }

        this.errMsg.text = 'Searching...'
        this.searching = true
        var q = $('#site-form').serialize()
        $.getJSON('http://itcs.apac.group.atlascopco.com/api/user?' + q)
        .done((data) => {
          if(data.error){
            this.errMsg.class = 'text-danger'
            this.errMsg.text = 'Query error!'
          }else if($.isEmptyObject(data)){
            this.errMsg.class = 'text-danger'
            this.errMsg.text = 'Nothing found for "' + this.query + '"'
          }else{
            this.user = data
            data.memberOf.sort()
            this.errMsg.class = 'text-success'
            this.errMsg.text = 'User found for "' + this.query + '"'
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
        this.userOpt = e.target.value
      }
    },
    created() {
      if (this.$store.state.user !== undefined) {
        this.query = this.$store.userq
        this.userOpt = this.$store.userOpt
        this.user = JSON.parse(JSON.stringify(this.$store.state.user))
      }
    },
    beforeDestroy() {
      this.$store.userq = this.query
      this.$store.userOpt = this.userOpt
      this.$store.state.user = JSON.parse(JSON.stringify(this.user))
    },
    mounted () {
      $('#qword').focus()
      this.sTitle = $('input[name=k]:checked').attr('title')
    }
  }

</script>

<style>

</style>