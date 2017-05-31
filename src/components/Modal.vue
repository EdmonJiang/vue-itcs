<template>
<div id="tbl-modal" tabindex="-1" role="dialog" aria-labelledby="symModalLabel" aria-hidden="true" class="modal fade table-modal">
  <div class="modal-dialog" :class="modalClass">
    <div class="modal-content">
      <div class="modal-header">
        <button type="button" data-dismiss="modal" class="close"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 id="symModalLabel" class="modal-title">{{ title }}</h4>
      </div>
      <div class="modal-body">
         <!--<p>
            <strong>Filter:&nbsp;</strong>
            <input id="txtFilter" type="text" v-model="kword" ref="inputFilter" @keyup="Filter"/>
         </p>-->
        <!--<div v-html="body"></div>-->
        <slot name="tablebody">
        </slot>
      </div>
      <div class="modal-footer">
        <button type="button" data-dismiss="modal" class="btn btn-default">Close</button>
      </div>
    </div>
  </div>
</div>
</template>

<script>
export default {
    name: 'modal',
    props: {
        title: {
            type: String,
            default: 'Details'
        },
         modalClass: {
             type: String,
             default: 'modal-lg'
         }
    },
    data() {
        return {
        }
    }
}
</script>

<style>
#tbl-modal {
    text-align: left;
}
</style>