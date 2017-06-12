<template>
<div id="app">
  <!-- Static navbar -->
  <nav class="navbar navbar-default navbar-fixed-top" style="box-shadow: 0 1px 16px #e0dada;">
    <div class="container">
      <div class="navbar-header">
        <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
          <span class="sr-only">Toggle NAV</span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
          <span class="icon-bar"></span>
        </button>
        <router-link id="brand-logo" class="navbar-brand" to="/site"><div class="icon-ac_small"></div></router-link>
      </div>
      <div id="navbar" class="navbar-collapse collapse">
        <ul id="site-menu" class="nav navbar-nav">
          <li><router-link to='/site'>Site Info</router-link></li>
          <li><router-link to='/staff'>Staff Info</router-link></li>
          <li><router-link to='/ad'>AD User</router-link></li>
          <li><router-link to='/altiris'>Altiris PC</router-link></li>
          <li><router-link to='/ipt'>IPT Info</router-link></li>
          <li><router-link to='/airwatch'>AirWatch</router-link></li>
          <li><router-link to='/warranty'>Warranty</router-link></li>
          <li><router-link to='/package'>Package</router-link></li>
        </ul>
        <ul id="currentUser" class="nav navbar-nav navbar-right">
          <li><a>{{ user }}</a></li>
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
  name: 'app',
  props: {
    user: String
  }
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
    padding-top: 60px;
    padding-bottom: 60px;
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
  background-image: url('/Content/css/sprite1.png');
  background-position: 0px 0px;
  width: 72px;
  height: 34px;
}
.icon-jabber {
  display: inline-block;
  background-image: url('/Content/css/sprite1.png');
  background-position: -32px -34px;
  margin-bottom: -4px;
  width: 16px;
  height: 16px;
}
.icon-mail_send {
  display: inline-block;
  background-image: url('/Content/css/sprite1.png');
  background-position: -48px -34px;
  margin-bottom: -4px;
  width: 16px;
  height: 16px;
}

.icon-download {
  display: inline-block;
  background-image: url('/Content/css/sprite1.png');
  background-position: -16px -34px;
  margin-bottom: -2px;
  width: 16px;
  height: 16px;
}
.icon-clippy{
  display: inline-block;
  background-image: url('/Content/css/sprite1.png');
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
/*旋转*/
@keyframes spin {
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
}

/* 过渡动画效果 */
.up-enter-active {
  transition: all .5s ease;
}
.up-enter, .up-leave-active {
  transform: translateY(20px);
  opacity: 0;
}

.fade-enter-active {
  transition: all .5s ease;
}
.fade-enter, .fade-leave-active {
  opacity: 0
}

.move-fade-enter-active {
  transition: all .5s ease;
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
/*缩放*/
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

@media (min-width: 992px) {
  #currentUser {
    display: block;
  }
}

@media (min-width: 768px) and (max-width: 991px) {
  #currentUser {
    display: none;
  }
  #navbar {width: 820px;}
}

/*tooltip style tips-s tips-multi*/
.tips {
    position: relative
}

.tips::after {
    position: absolute;
    z-index: 1000000;
    display: none;
    padding: 5px 8px;
    font: normal normal 14px/1.2 -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
    -webkit-font-smoothing: subpixel-antialiased;
    color: #fff;
    /*text-align: center;*/
    text-decoration: none;
    text-shadow: none;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: break-word;
    white-space: pre;
    pointer-events: none;
    content: attr(aria-label);
    background: rgba(27,31,35,0.8);
    border-radius: 3px;
    opacity: 0;
}

.tips::before {
    position: absolute;
    z-index: 1000001;
    display: none;
    width: 0;
    height: 0;
    color: rgba(27,31,35,0.8);
    pointer-events: none;
    content: "";
    border: 5px solid transparent;
    opacity: 0
}
/*透明度*/
@-webkit-keyframes tooltip-appear {
    from {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

@keyframes tooltip-appear {
    from {
        opacity: 0
    }

    to {
        opacity: 1
    }
}

.tips:hover::before,.tips:hover::after,.tips:active::before,.tips:active::after,.tips:focus::before,.tips:focus::after {
    display: inline-block;
    text-decoration: none;
    -webkit-animation-name: tooltip-appear;
    animation-name: tooltip-appear;
    -webkit-animation-duration: 0.1s;
    animation-duration: 0.1s;
    -webkit-animation-fill-mode: forwards;
    animation-fill-mode: forwards;
    -webkit-animation-timing-function: ease-in;
    animation-timing-function: ease-in;
    -webkit-animation-delay: 0.4s;
    animation-delay: 0.4s
}

.tips-no-delay:hover::before,.tips-no-delay:hover::after,.tips-no-delay:active::before,.tips-no-delay:active::after,.tips-no-delay:focus::before,.tips-no-delay:focus::after {
    opacity: 1;
    -webkit-animation: none;
    animation: none
}

.tips-multi:hover::after,.tips-multi:active::after,.tips-multi:focus::after {
    display: table-cell
}

.tips-s::after,.tips-se::after,.tips-sw::after {
    top: 100%;
    right: 50%;
    margin-top: 5px
}

.tips-s::before,.tips-se::before,.tips-sw::before {
    top: auto;
    right: 50%;
    bottom: -5px;
    margin-right: -5px;
    border-bottom-color: rgba(27,31,35,0.8)
}

.tips-se::after {
    right: auto;
    left: 50%;
    margin-left: -15px
}

.tips-sw::after {
    margin-right: -15px
}

.tips-n::after,.tips-ne::after,.tips-nw::after {
    right: 50%;
    bottom: 100%;
    margin-bottom: 5px
}

.tips-n::before,.tips-ne::before,.tips-nw::before {
    top: -5px;
    right: 50%;
    bottom: auto;
    margin-right: -5px;
    border-top-color: rgba(27,31,35,0.8)
}

.tips-ne::after {
    right: auto;
    left: 50%;
    margin-left: -15px
}

.tips-nw::after {
    margin-right: -15px
}

.tips-s::after,.tips-n::after {
    -webkit-transform: translateX(50%);
    transform: translateX(50%)
}

.tips-w::after {
    right: 100%;
    bottom: 50%;
    margin-right: 5px;
    -webkit-transform: translateY(50%);
    transform: translateY(50%)
}

.tips-w::before {
    top: 50%;
    bottom: 50%;
    left: -5px;
    margin-top: -5px;
    border-left-color: rgba(27,31,35,0.8)
}

.tips-e::after {
    bottom: 50%;
    left: 100%;
    margin-left: 5px;
    -webkit-transform: translateY(50%);
    transform: translateY(50%)
}

.tips-e::before {
    top: 50%;
    right: -5px;
    bottom: 50%;
    margin-top: -5px;
    border-right-color: rgba(27,31,35,0.8)
}

.tips-multi::after {
    width: -webkit-max-content;
    width: -moz-max-content;
    width: max-content;
    max-width: 250px;
    word-wrap: break-word;
    white-space: pre-line;
    border-collapse: separate
}

.tips-multi.tips-s::after,.tips-multi.tips-n::after {
    right: auto;
    left: 50%;
    -webkit-transform: translateX(-50%);
    transform: translateX(-50%)
}

.tips-multi.tips-w::after,.tips-multi.tips-e::after {
    right: 100%
}

@media screen and (min-width: 0\0) {
    .tips-multi::after {
        width:250px
    }
}

.tips-sticky::before,.tips-sticky::after {
    display: inline-block
}

.tips-sticky.tips-multi::after {
    display: table-cell
}
</style>
