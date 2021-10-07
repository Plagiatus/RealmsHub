<template>
	<div id="realm-subscription" class="gray-block" :class="{loading: loading}">
		<h2>Subscription</h2>
		<table v-if="!loading">
			<tbody>
				<tr>
					<td>Subscribed since</td>
					<td class="rightbound semi-bold">{{since}}</td>
				</tr>
				<tr>
					<td>Time left</td>
					<td class="rightbound semi-bold">{{timeLeft}}</td>
				</tr>
				<tr>
					<td>Subscription type</td>
					<td class="rightbound semi-bold">{{status}}</td>
				</tr>

			</tbody>
		</table>


	</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import request from "../components/request-mixin";

export default defineComponent({
	mixins: [request],
	props: ["realm", "worldId"],
	data() {
		return {
			loading: true,
			subscription: {startDate: -1, daysLeft: -1, subscriptionType: ""}
		}
	},
	computed: {
		since(){
			let d = new Date(this.subscription.startDate);
			return d.toLocaleDateString();
		},
		timeLeft(){
			if(this.subscription.daysLeft < 1) {
				return "Expired.";	
			}
			let d = new Date(Date.now() + this.subscription.daysLeft * 24 * 60 * 60 * 1000);
			let now = new Date();

			let diffDays = d.getUTCDate() - now.getUTCDate();
			let diffMonths = d.getUTCMonth() - now.getUTCMonth();
			let diffYears = d.getUTCFullYear() - now.getUTCFullYear();

			if(diffMonths < 0 && diffYears > 0) {
				diffMonths = 12 + diffMonths;
				diffYears -= 1;
			}
			if(diffDays < 0 && diffMonths > 0) {
				diffDays = new Date(now.getUTCFullYear(), now.getUTCMonth() + 1, 0).getDate() + diffDays;
				diffMonths -= 1;
			}
			let duration = "";
			if(diffYears > 0){
				duration += diffYears + " year" + (diffYears > 1 ? "s": "") + ", ";
			}
			if(diffMonths > 0 || diffYears > 0){
				duration += diffMonths + " month" + (diffMonths != 1 ? "s": "") + ", ";
			}
			if(diffMonths > 0 || diffYears > 0 || diffDays > 0){
				duration += diffDays + " day" + (diffMonths != 1 ? "s": "");
			}
			return duration;
		},
		status() {
			if(this.subscription.subscriptionType == "RECURRING") {
				return "Recurring";	
			}
			if(this.subscription.subscriptionType == "NORMAL") {
				return "Non-recurring";	
			}
			return "None";
		}
	},
	async mounted() {
		let result = await this.sendRequest("/worlds/subscriptions", "POST", {worldId: this.worldId});
		if(!result) return;
		this.subscription = JSON.parse(result);
		this.loading = false;
		// let result2 = await this.sendRequest("/buy", "POST");
		// console.log(result2);	
		// if(!result2) return;
	}
})
</script>