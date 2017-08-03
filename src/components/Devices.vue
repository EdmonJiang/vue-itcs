<template>
    <div id="site-body" class="wrapper container">
        <h1>Device Details - {{ $route.query.email }} <router-link class="btn btn-primary" to="/airwatch">&#x21e6; Back</router-link></h1>
        <h2 :class="errMsg.class">{{ errMsg.text }}</h2>
        <div v-show="searching" style="position:relative;width:10vmin;margin:0 auto">
            <div class="loader-circle"></div>
            <div class="cover"></div>
        </div>
        <div id="accordion" role="tablist" aria-multiselectable="true" class="panel-group">
            <div class="panel panel-default" v-for="(device, index) in devices" :key="index">
                <div class="panel-heading" role="tab" :id="'heading' + index">
                    <h4 class="panel-title">
                        <a data-toggle='collapse' data-parent='#accordion' :href="'#device' + index" :aria-controls="'device' + index">
                            {{ device.Model }} &nbsp;
                            <span class="triangle"></span>
                        </a>
                    </h4>
                </div>
                <div :id="'device' + index" role='tabpanel' class="collapse panel-collapse" :class="{ in: index === 0}" :aria-labelledby="'device' + index">
                    <div class="panel-body">
                        <table class="table table-striped table-hover table-condensed">
                            <tbody>
                                <tr>
                                    <th>Group ID</th>
                                    <th>Country</th>
                                    <th>Legal AD</th>
                                    <th>Legal Staff</th>
                                    <th>Company</th>
                                    <th>UserName</th>
                                    <th>PhoneNumber</th>
                                    <th>Email Address</th>
                                </tr>
                                <tr>
                                    <td v-text="device.LocationGroupName"></td>
                                    <td v-text="device.Country"></td>
                                    <td v-text="device.LEGAL_AD"></td>
                                    <td v-text="device.Staff_Legal"></td>
                                    <td v-text="device.Company"></td>
                                    <td v-text="device.UserIdent"></td>
                                    <td v-text="device.PhoneNumber"></td>
                                    <td v-text="device.UserEmailAddress"></td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table table-striped table-hover table-condensed">
                            <tbody>
                                <tr>
                                    <th>Platform</th>
                                    <th>Model</th>
                                    <th>Device Frendly Name</th>
                                    <th>IMEI</th>
                                    <th>Mac Address</th>
                                    <th>Ownership</th>
                                    <th>Enroll Status</th>
                                    <th>Compliance</th>
                                </tr>
                                <tr>
                                    <td v-text="device.Platform"></td>
                                    <td v-text="device.Model"></td>
                                    <td v-text="device.DeviceFriendlyName"></td>
                                    <td v-text="device.Imei"></td>
                                    <td v-text="device.MacAddress"></td>
                                    <td v-text="device.Ownership"></td>
                                    <td v-text="device.EnrollmentStatus"></td>
                                    <td v-text="device.ComplianceStatus"></td>
                                </tr>
                            </tbody>
                        </table>
                        <table class="table table-striped table-hover table-condensed">
                            <colgroup>
                                <col width="20%">
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>Last Scanned</th>
                                    <td v-text="new Date(+device.LastScanned.match(/\d+/)[0]).toISOString()"></td>
                                </tr>
                                <tr>
                                    <th>Last Seen</th>
                                    <td v-text="device.LastSeen"></td>
                                </tr>
                                <tr>
                                    <th>Last Enrolled On</th>
                                    <td v-text="device.LastEnrolledOn"></td>
                                </tr>
                                <tr>
                                    <th>Last Compliance Check On</th>
                                    <td v-text="device.LastComplianceCheckOn"></td>
                                </tr>
                                <tr>
                                    <th>Last Compromised Check On</th>
                                    <td v-text="device.LastCompromisedCheckOn"></td>
                                </tr>
                                <tr>
                                    <th>Policies</th>
                                    <td v-text="device.Policies"></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'devices',
    data() {
        return {
            devices: [],
            errMsg: {
                class: '',
                text: ''
            }
        }
    },
    methods: {
    },
    created() {
        this.searching = true
        var q = encodeURIComponent(this.$route.query.email)
        $.getJSON('http://itcs.apac.group.atlascopco.com/api/airwatch/devices?eml='+ q)
        .done((data) =>{
            this.devices = data
        })
        .fail(() => {
            this.errMsg.class = 'text-danger'
            this.errMsg.text = 'Failed to get data.'
        })
        .always(() => {
          this.searching = false
        })
    }
}
</script>

<style>
.triangle{
    display: inline-block;
    width: 0;
    height: 0;
    margin-left: 2px;
    vertical-align: middle;
    border-top: 9px dashed;
    border-top: 4px solid\9;
    border-right: 6px solid transparent;
    border-left: 6px solid transparent;
    }
</style>