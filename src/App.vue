<template>
<div id="app">
  <!-- Static navbar -->
  <nav class="navbar navbar-default navbar-fixed-top" style="box-shadow: 0 1px 16px #e0dada;">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">Toggle navigation</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link id="brand-logo" class="navbar-brand" to="/site"><div class="icon-ac_small"></div></router-link>
      </div>
      <div id="navbar" class="navbar-collapse collapse">
        <ul id="site-menu" class="nav navbar-nav">
          <li class=""><router-link to='/site'>Site Info</router-link></li>
          <li class=""><router-link to='/staff'>Staff Info</router-link></li>
          <li class=""><router-link to='/ad'>AD User</router-link></li>
          <li class=""><router-link to='/altiris'>Altiris PC</router-link></li>
          <li class=""><router-link to='/ipt'>IPT Info</router-link></li>
          <li class=""><router-link to='/airwatch'>AirWatch</router-link></li>
          <li class=""><router-link to='/warranty'>Warranty</router-link></li>
        </ul>
      </div><!--/.nav-collapse -->
    </div>
  </nav>
    
  <router-view>Loading View</router-view>
  <div style="position:fixed;left:10px;bottom:5px">Powered by IT Services, Naning, China&nbsp;© 2017-2018 Edmon Jiang</div>
</div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style>
body{
    box-sizing: border-box;
    overflow-y: scroll;
}
/*导航栏背景色*/
#app > .navbar-default {
    background-color: #fff;
}
#site-menu a {
    color: #0b9ccd;
}

#site-menu .router-link-active {
    background-color: #eee;
}
/*导航菜单滑动渐变效果*/
#site-menu li:hover {
  background-color: #ebebec;
  transition: background-color 0.4s ease-out;
}

.wrapper{
    padding: 60px 0;
    overflow: hidden;
    text-align: center;
}
/*表格内容左对齐*/
#site-body td{
  word-break: break-all;
  text-align: left;
}

/* 雪碧图 Logo */
.icon-ac_small {
  display: inline-block;
  background-image: url('/Content/css/sprite.png');
  background-position: 0px 0px;
  width: 72px;
  height: 34px;
}
.icon-jabber {
  display: inline-block;
  background-image: url('/Content/css/sprite.png');
  background-position: -16px -34px;
  margin-bottom: -4px;
  width: 16px;
  height: 16px;
}
.icon-mail_send {
  display: inline-block;
  background-image: url('/Content/css/sprite.png');
  background-position: -32px -34px;
  margin-bottom: -4px;
  width: 16px;
  height: 16px;
}

.icon-download {
  display: inline-block;
  background-image: url('/Content/css/sprite.png');
  background-position: 0px -34px;
  margin-bottom: -2px;
  width: 16px;
  height: 16px;
}

#brand-logo {
  padding-top: 8px;
}

/* 加载中旋转动画 */
.loader-circle {
    position: absolute;
    border: 16px solid #d3d3d3;
    border-top: 16px solid #337ab7;
    border-bottom: 16px solid #337ab7;
    border-radius: 50%;
    top: 80px;
    width: 90px;
    height: 90px;
    animation: spin 2s linear infinite;
}

.input-spinner{
    top: 50%;
    right: 1.55em;
    margin-top: -10.5px;
    width: 21px;
    height: 21px;
    box-sizing: border-box;
    border-width: 0.2em;
}

@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* 过渡动画效果 */
/*.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-active {
  transform: translateX(10px);
  opacity: 0;
}*/

.fade-enter-active, .fade-leave-active {
  transition: opacity .5s
}
.fade-enter, .fade-leave-active {
  opacity: 0
}

/*.move-fade-leave-active {
  transition: all .1s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}*/
.move-fade-enter-active {
  transition: all .3s ease;
}
.move-fade-enter, .move-fade-leave-active
{
  transform: translateX(30px);
  opacity: 0;
}

/* 页面加载动画 */
#load-msg{
    position: absolute;
    top: 70px;
    width: 150px;
    left: -35px;
    color: #1282a9;
}

.spinner {
  width: 60px;
  height: 60px;

  position: relative;
  margin: 100px auto;
}

.double-bounce1, .double-bounce2 {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #0b9ccd;
  opacity: 0.6;
  position: absolute;
  top: 0;
  left: 0;
  
  -webkit-animation: sk-bounce 2.0s infinite ease-in-out;
  animation: sk-bounce 2.0s infinite ease-in-out;
}

.double-bounce2 {
  -webkit-animation-delay: -1.0s;
  animation-delay: -1.0s;
}

@-webkit-keyframes sk-bounce {
  0%, 100% { -webkit-transform: scale(0.0) }
  50% { -webkit-transform: scale(1.0) }
}

@keyframes sk-bounce {
  0%, 100% { 
    transform: scale(0.0);
    -webkit-transform: scale(0.0);
  } 50% { 
    transform: scale(1.0);
    -webkit-transform: scale(1.0);
  }
}
</style>
